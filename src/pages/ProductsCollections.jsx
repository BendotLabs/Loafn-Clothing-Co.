import { Link } from "react-router-dom";

export default function ProductsCollections() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-32 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-brass-light">
        Collections
      </p>
      <h1 className="font-display text-3xl text-bone">Coming soon.</h1>
      <p className="text-sm text-bone-dim">
        Seasonal collections — summer, winter, and beyond — will live here.
      </p>
      <Link
        to="/products"
        className="mt-4 border border-brass px-6 py-3 font-mono text-xs uppercase tracking-widest text-bone hover:bg-brass hover:text-ink transition-colors"
      >
        Browse All Products
      </Link>
    </div>
  );
}