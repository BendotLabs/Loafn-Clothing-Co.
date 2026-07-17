import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useProduct } from "../hooks/useProducts";
import { useCart } from "../context/CartContext";

export default function Product() {
  const { slug } = useParams();
  const product = useProduct(slug);

  if (!product) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-32 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-brass-light">
          404
        </p>
        <h1 className="font-display text-3xl text-bone">
          We couldn't find that piece.
        </h1>
        <p className="text-sm text-bone-dim">
          It may have sold out of the archive, or the link may be off.
        </p>
        <Link
          to="/products"
          className="mt-4 border border-brass px-6 py-3 font-mono text-xs uppercase tracking-widest text-bone hover:bg-brass hover:text-ink transition-colors"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  return <ProductDetail product={product} />;
}

function ProductDetail({ product }) {
  const [size, setSize] = useState(null);
  const [color, setColor] = useState(product.colors[0]);
  const { addToCart } = useCart();

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
      <div className="aspect-[4/5] overflow-hidden bg-ink-soft">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-col">
        {product.isNew && (
          <span className="mb-4 self-start font-mono text-[10px] uppercase tracking-widest text-ink bg-bone px-2 py-1">
            New
          </span>
        )}
        <p className="font-mono text-xs uppercase tracking-widest text-bone-dim/60">
          {product.category}
        </p>
        <h1 className="mt-2 font-display text-4xl text-bone">{product.name}</h1>
        <p className="mt-4 font-mono text-xl text-brass-light">${product.price}</p>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-bone-dim">
          {product.description}
        </p>

        {/* Color selector */}
        <div className="mt-10">
          <p className="font-mono text-xs uppercase tracking-widest text-bone-dim/60">
            Color &mdash; {color}
          </p>
          <div className="mt-3 flex gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`border px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${
                  color === c
                    ? "border-brass bg-brass text-ink"
                    : "border-bone-dim/30 text-bone-dim hover:border-bone-dim hover:text-bone"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Size selector */}
        <div className="mt-6">
          <p className="font-mono text-xs uppercase tracking-widest text-bone-dim/60">
            Size {size ? `— ${size}` : ""}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`h-11 min-w-11 border px-3 font-mono text-xs uppercase tracking-widest transition-colors ${
                  size === s
                    ? "border-brass bg-brass text-ink"
                    : "border-bone-dim/30 text-bone-dim hover:border-bone-dim hover:text-bone"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Add to cart — UI only for now, see Phase 5 in the roadmap */}
        <button
          disabled={!size}
          onClick={() => addToCart(product, { color, size, quantity: 1 })}
          className="mt-10 w-full border border-brass py-4 font-mono text-xs uppercase tracking-widest text-bone transition-colors hover:bg-brass hover:text-ink disabled:cursor-not-allowed disabled:border-bone-dim/20 disabled:text-bone-dim/40 disabled:hover:bg-transparent md:w-auto md:px-10"
        >
          {size ? "Add to Cart" : "Select a Size"}
        </button>
      </div>
    </div>
  );
}
