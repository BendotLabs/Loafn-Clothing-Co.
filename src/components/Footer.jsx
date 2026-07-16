import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="stitch mt-24 px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-display text-xl text-bone">Loafn'</p>
          <p className="mt-2 max-w-xs text-sm text-bone-dim">
            Balance on the factor of impossibility. Move with grace, and let comfort carry your complexity.
          </p>
        </div>

        <div className="flex gap-12 font-mono text-xs uppercase tracking-widest text-bone-dim">
          <div className="flex flex-col gap-2">
            <span className="text-bone-dim/50">Shop</span>
            <Link to="/products" className="hover:text-bone transition-colors">All Products</Link>
            <Link to="/products?category=shells" className="hover:text-bone transition-colors">Shells</Link>
            <Link to="/products?category=tops" className="hover:text-bone transition-colors">Tops</Link>
            <Link to="/products?category=bottoms" className="hover:text-bone transition-colors">Bottoms</Link>
            <Link to="/products?category=accessories" className="hover:text-bone transition-colors">Accessories</Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-bone-dim/50">Studio</span>
            <Link to="/about" className="hover:text-bone transition-colors">About</Link>
            <Link to="/contact" className="hover:text-bone transition-colors">Contact</Link>
          </div>
        </div>
      </div>

      <p className="mx-auto mt-12 max-w-6xl text-[11px] text-bone-dim/50">
        © {new Date().getFullYear()} Loafn'. A portfolio project — not a real store.
      </p>
    </footer>
  );
}