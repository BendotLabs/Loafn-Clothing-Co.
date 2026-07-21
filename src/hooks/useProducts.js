import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

// Centralizing access here means every consuming page keeps working
// unchanged even though the data source moved from a static JSON import
// to a Supabase table. Same idea as before, now backed by a real database.

// Simple shared cache so multiple components calling these hooks at the
// same time (e.g. a product grid + a navbar category dropdown) trigger
// one network request, not one per component.
let cachedProducts = null;
let fetchPromise = null;

function fetchProducts() {
  if (cachedProducts) return Promise.resolve(cachedProducts);
  if (!fetchPromise) {
    fetchPromise = supabase
      .from("products")
      .select("*")
      .then(({ data, error }) => {
        if (error) {
          console.error("Failed to fetch products:", error);
          cachedProducts = [];
        } else {
          // Map snake_case DB column back to the camelCase the rest of the
          // app already expects, so no consuming component needs to change.
          cachedProducts = data.map((p) => ({ ...p, isNew: p.is_new }));
        }
        return cachedProducts;
      });
  }
  return fetchPromise;
}

// Call this after any admin create/update/delete so the storefront's
// cached product list doesn't keep serving stale data until a full reload.
export function invalidateProductsCache() {
  cachedProducts = null;
  fetchPromise = null;
}

export function useProducts() {
  const [products, setProducts] = useState(cachedProducts || []);

  useEffect(() => {
    let active = true;
    fetchProducts().then((data) => {
      if (active) setProducts(data);
    });
    return () => {
      active = false;
    };
  }, []);

  return products;
}

export function useProduct(slug) {
  const products = useProducts();
  return products.find((p) => p.slug === slug || String(p.id) === slug);
}

export function useCategories() {
  const products = useProducts();
  return [...new Set(products.map((p) => p.category))];
}

export function useLines() {
  const products = useProducts();
  return [...new Set(products.filter((p) => p.line).map((p) => p.line))];
}

// ---- Variants ----------------------------------------------------------

// Per-product cache, keyed by product id, since AdminInventory and
// Product.jsx only ever need one product's variants at a time.
let variantsCache = {};
let variantsFetchPromises = {};

function fetchVariants(productId) {
  if (variantsCache[productId]) return Promise.resolve(variantsCache[productId]);
  if (!variantsFetchPromises[productId]) {
    variantsFetchPromises[productId] = supabase
      .from("product_variants")
      .select("*")
      .eq("product_id", productId)
      .then(({ data, error }) => {
        if (error) {
          console.error("Failed to fetch variants:", error);
          variantsCache[productId] = [];
        } else {
          variantsCache[productId] = data;
        }
        delete variantsFetchPromises[productId];
        return variantsCache[productId];
      });
  }
  return variantsFetchPromises[productId];
}

// Pass a productId to invalidate just that product; call with no args
// to clear everything (e.g. after a bulk import).
export function invalidateVariantsCache(productId) {
  if (productId) {
    delete variantsCache[productId];
    delete variantsFetchPromises[productId];
  } else {
    variantsCache = {};
    variantsFetchPromises = {};
  }
}

export function useVariants(productId) {
  const [variants, setVariants] = useState(variantsCache[productId] || []);

  useEffect(() => {
    if (!productId) return;
    let active = true;
    fetchVariants(productId).then((data) => {
      if (active) setVariants(data);
    });
    return () => {
      active = false;
    };
  }, [productId]);

  return variants;
}

// ---- Stock totals (for the AdminProducts table) -------------------------

// One query across the whole variants table, grouped client-side into
// { [product_id]: totalStock }. Separate cache from the per-product one
// above — AdminProducts wants every product's total at once, not a
// single product's rows, so reusing fetchVariants() would mean firing
// one request per row in the table instead of one request total.
let stockTotalsCache = null;
let stockTotalsFetchPromise = null;

function fetchStockTotals() {
  if (stockTotalsCache) return Promise.resolve(stockTotalsCache);
  if (!stockTotalsFetchPromise) {
    stockTotalsFetchPromise = supabase
      .from("product_variants")
      .select("product_id, stock")
      .then(({ data, error }) => {
        if (error) {
          console.error("Failed to fetch stock totals:", error);
          stockTotalsCache = {};
        } else {
          stockTotalsCache = data.reduce((totals, row) => {
            totals[row.product_id] = (totals[row.product_id] || 0) + row.stock;
            return totals;
          }, {});
        }
        return stockTotalsCache;
      });
  }
  return stockTotalsFetchPromise;
}

export function invalidateStockTotalsCache() {
  stockTotalsCache = null;
  stockTotalsFetchPromise = null;
}

// Returns { [product_id]: totalStock }. Products with no variant rows
// yet simply won't have a key — treat a missing entry as "unknown", not 0.
export function useStockTotals() {
  const [totals, setTotals] = useState(stockTotalsCache || {});

  useEffect(() => {
    let active = true;
    fetchStockTotals().then((data) => {
      if (active) setTotals(data);
    });
    return () => {
      active = false;
    };
  }, []);

  return totals;
}