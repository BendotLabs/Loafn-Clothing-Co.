import { supabase } from "./supabaseClient";

// Re-checks every cart item's stock against the database right before
// checkout. Cart state is trusted between add-to-cart and this point —
// it's only here, at the last moment before payment, that we pay for
// a real query. Items with no variant row (pre-migration products) are
// treated as unlimited, same convention as everywhere else in the app.
export async function validateCartStock(items) {
  if (items.length === 0) return { valid: true, adjustments: [] };

  const slugs = [...new Set(items.map((i) => i.slug))];

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, slug")
    .in("slug", slugs);

  if (productsError) {
    // Fail open — a validation query failure shouldn't block checkout
    // entirely, since the alternative (stranding the customer) is worse
    // than occasionally letting an oversold order through.
    console.error("Stock validation failed to fetch products:", productsError);
    return { valid: true, adjustments: [] };
  }

  const slugToId = new Map(products.map((p) => [p.slug, p.id]));
  const productIds = products.map((p) => p.id);

  const { data: variants, error: variantsError } = await supabase
    .from("product_variants")
    .select("product_id, color, size, stock")
    .in("product_id", productIds);

  if (variantsError) {
    console.error("Stock validation failed to fetch variants:", variantsError);
    return { valid: true, adjustments: [] };
  }

  const stockMap = new Map(
    variants.map((v) => [`${v.product_id}__${v.color}__${v.size}`, v.stock])
  );

  const adjustments = [];

  for (const item of items) {
    const productId = slugToId.get(item.slug);
    // Product itself no longer exists — treat as fully unavailable.
    if (!productId) {
      adjustments.push({
        cartItemId: item.cartItemId,
        name: item.name,
        color: item.color,
        size: item.size,
        requestedQty: item.quantity,
        availableQty: 0,
        reason: "removed",
      });
      continue;
    }

    const key = `${productId}__${item.color}__${item.size}`;
    const available = stockMap.has(key) ? stockMap.get(key) : Infinity;

    if (available < item.quantity) {
      adjustments.push({
        cartItemId: item.cartItemId,
        name: item.name,
        color: item.color,
        size: item.size,
        requestedQty: item.quantity,
        availableQty: available,
        reason: available === 0 ? "out_of_stock" : "reduced",
      });
    }
  }

  return { valid: adjustments.length === 0, adjustments };
}