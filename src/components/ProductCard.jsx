import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-ink-soft aspect-[4/5]">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {product.isNew && (
          <span className="absolute left-3 top-3 font-mono text-[10px] uppercase tracking-widest text-ink bg-bone px-2 py-1 rounded-full">
            New
          </span>
        )}
        <div className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/10" />
      </div>

      <div className="mt-4 flex flex-col items-center text-center">
        <h3 className="font-display text-lg text-bone">{product.name}</h3>
        <span className="mt-1 font-mono text-sm text-brass-light">
          ${product.price}
        </span>
      </div>
    </Link>
  );
}