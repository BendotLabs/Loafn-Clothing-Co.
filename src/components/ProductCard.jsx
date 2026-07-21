import { Link } from "react-router-dom";
import { useStockTotals } from "../hooks/useProducts";

export default function ProductCard({ product }) {
  const stockTotals = useStockTotals();
  const total = stockTotals[product.id];
  const soldOut = total === 0;

  return (
    <Link
      to={`/product/${product.slug}`}
      className={`group block ${soldOut ? "pointer-events-none" : ""}`}
      // Sold-out products stay visible but not clickable — matches
      // Step 53's intent of not letting a customer get partway into
      // a purchase they can't complete, without hiding the product
      // entirely (still useful context on a listing page).
      aria-disabled={soldOut}
    >
      <div className="relative overflow-hidden rounded-2xl bg-ink-soft aspect-[4/5]">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className={`h-full w-full object-cover transition-transform duration-700 ease-out ${
            soldOut ? "opacity-40 grayscale" : "group-hover:scale-105"
          }`}
        />
        {soldOut ? (
          <span className="absolute left-3 top-3 font-mono text-[10px] uppercase tracking-widest text-bone bg-ink/80 px-2 py-1 rounded-full">
            Sold Out
          </span>
        ) : (
          product.isNew && (
            <span className="absolute left-3 top-3 font-mono text-[10px] uppercase tracking-widest text-ink bg-bone px-2 py-1 rounded-full">
              New
            </span>
          )
        )}
        <div className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/10" />
      </div>

      <div className="mt-4 flex flex-col items-center text-center">
        <h3 className={`font-display text-lg ${soldOut ? "text-bone-dim" : "text-bone"}`}>
          {product.name}
        </h3>
        <span className="mt-1 font-mono text-sm text-brass-light">
          ${product.price}
        </span>
      </div>
    </Link>
  );
}