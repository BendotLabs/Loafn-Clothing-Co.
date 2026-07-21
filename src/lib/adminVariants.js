import { supabase } from "./supabaseClient";
import { invalidateVariantsCache, invalidateStockTotalsCache } from "../hooks/useProducts";

// Stock truth lives entirely in `product_variants` — one row per
// (product, color, size) combo. `products.colors` / `products.sizes`
// still define which combos *should* exist; `ensureVariants` keeps the
// two in sync whenever a product's option lists change.

export async function getVariants(productId) {
  const { data, error } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", productId)
    .order("color")
    .order("size");
  return { data: data || [], error };
}

// Called after create/update in adminProducts.js. Inserts a stock=0 row
// for any (color, size) combo that doesn't exist yet. Never deletes —
// if a color or size is removed from the product, its variant rows are
// left alone (and flagged "orphaned" in AdminInventory) so an edit can't
// silently wipe out existing stock counts.
export async function ensureVariants(productId, colors, sizes) {
  if (!colors?.length || !sizes?.length) return { error: null };

  const { data: existing, error: fetchError } = await supabase
    .from("product_variants")
    .select("color, size")
    .eq("product_id", productId);

  if (fetchError) return { error: fetchError };

  const existingKeys = new Set(existing.map((v) => `${v.color}__${v.size}`));
  const missing = [];
  for (const color of colors) {
    for (const size of sizes) {
      if (!existingKeys.has(`${color}__${size}`)) {
        missing.push({ product_id: productId, color, size, stock: 0 });
      }
    }
  }

  if (missing.length === 0) return { error: null };

  const { error } = await supabase.from("product_variants").insert(missing);
  if (!error) {
    invalidateVariantsCache(productId);
    invalidateStockTotalsCache();
  }
  return { error };
}

export async function updateVariantStock(variantId, productId, stock) {
  const { data, error } = await supabase
    .from("product_variants")
    .update({ stock, updated_at: new Date().toISOString() })
    .eq("id", variantId)
    .select()
    .single();

  if (!error) {
    invalidateVariantsCache(productId);
    invalidateStockTotalsCache();
  }
  return { data, error };
}

export async function deleteVariant(variantId, productId) {
  const { error } = await supabase
    .from("product_variants")
    .delete()
    .eq("id", variantId);
  if (!error) {
    invalidateVariantsCache(productId);
    invalidateStockTotalsCache();
  }
  return { error };
}