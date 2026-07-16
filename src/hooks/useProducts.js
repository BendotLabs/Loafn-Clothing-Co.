import products from "../data/products.json";

// Centralizing access here means Phase 3+ (filtering, search, sort) only
// ever has to change this file, not every page that reads product data.

export function useProducts() {
  return products;
}

export function useProduct(slug) {
  return products.find((p) => p.slug === slug || String(p.id) === slug);
}

export function useCategories() {
  return [...new Set(products.map((p) => p.category))];
}

export function useLines() {
  return [...new Set(products.filter((p) => p.line).map((p) => p.line))];
}