import { supabase } from "./supabaseClient";
import { invalidateProductsCache } from "../hooks/useProducts";
import { ensureVariants } from "./adminVariants";

export async function createProduct(product) {
  const { data, error } = await supabase
    .from("products")
    .insert({
      slug: product.slug,
      name: product.name,
      price: product.price,
      category: product.category,
      line: product.line || null,
      image: product.image || null,
      description: product.description || null,
      colors: product.colors,
      sizes: product.sizes,
      is_new: product.isNew,
    })
    .select()
    .single();

  if (!error) {
    invalidateProductsCache();
    await ensureVariants(data.id, product.colors, product.sizes);
  }
  return { data, error };
}

export async function updateProduct(id, product) {
  const { data, error } = await supabase
    .from("products")
    .update({
      name: product.name,
      price: product.price,
      category: product.category,
      line: product.line || null,
      image: product.image || null,
      description: product.description || null,
      colors: product.colors,
      sizes: product.sizes,
      is_new: product.isNew,
    })
    .eq("id", id)
    .select()
    .single();

  if (!error) {
    invalidateProductsCache();
    await ensureVariants(id, product.colors, product.sizes);
  }
  return { data, error };
}

export async function deleteProduct(id) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (!error) invalidateProductsCache();
  return { error };
}