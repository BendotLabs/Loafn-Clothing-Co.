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