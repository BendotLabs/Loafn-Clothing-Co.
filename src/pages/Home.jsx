import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../hooks/useProducts";

export default function Home() {
  const products = useProducts();
  const shells = products.filter((p) => p.category === "shells").slice(0, 3);
  const accessories = products
    .filter((p) => p.category === "accessories")
    .slice(0, 3);

  const moltenImages = [
      products.find((p) => p.slug === "meld-bottoms")?.image,
      products.find((p) => p.slug === "drift-shell")?.image,
      products.find((p) => p.slug === "breathe-tshirt")?.image,
    ];
    const cryoImages = [
      products.find((p) => p.slug === "mallow-shell")?.image,
      products.find((p) => p.slug === "slack-bottoms")?.image,
      products.find((p) => p.slug === "slump-crewneck")?.image,
    ];

  return (
    <div>
      {/* Hero */}
      <section className="grain relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-brass-light">
          Loafn' &mdash; Est. Small Batch
        </p>
        <h1 className="mt-6 max-w-3xl font-display text-5xl leading-tight text-bone md:text-7xl">
          Permission to slow down? Granted.
        </h1>
        <p className="mt-6 max-w-md text-balance text-base text-bone-dim md:text-lg">
          Casual styles and comfortwear made for complimenting your rhythm. Lovin', Loungin', Loafn'.
        </p>
        <Link
          to="/products"
          className="mt-10 inline-flex items-center gap-3 border border-brass px-7 py-3 font-mono text-xs uppercase tracking-widest text-bone transition-colors hover:bg-brass hover:text-ink"
        >
          Shop Loafwear
        </Link>
      </section>

      {/* Molten / Cryo */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl text-bone">How do you Loaf?</h2>
        </div>

        <div className="flex flex-col gap-6">
          <LineBanner
            to="/products?line=molten"
            label="Molten"
            tagline="Let it breathe."
            images={moltenImages}
          />
          <LineBanner
            to="/products?line=cryo"
            label="Cryo"
            tagline="Chamber your warmth."
            images={cryoImages}
          />
        </div>
      </section>

      {/* Shells */}
      <section className="stitch mx-auto max-w-6xl px-6 py-24">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl text-bone">Signature Shells</h2>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {shells.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/products?category=shells"
            className="inline-block font-mono text-xs uppercase tracking-widest text-bone-dim transition-colors hover:text-bone"
          >
            All Shells &rarr;
          </Link>
        </div>
      </section>

      {/* Accessories */}
      <section className="stitch mx-auto max-w-6xl px-6 py-24">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl text-bone">Butter the toast</h2>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {accessories.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/products?category=accessories"
            className="inline-block font-mono text-xs uppercase tracking-widest text-bone-dim transition-colors hover:text-bone"
          >
            All Accessories &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}

function LineBanner({ to, label, tagline, images }) {
  return (
    <Link
      to={to}
      className="group relative flex h-64 items-center justify-center overflow-hidden rounded-2xl bg-ink-soft md:h-80"
    >
      {/* Three images, side by side */}
      <div className="absolute inset-0 flex">
        {images.map((img, i) => (
          <div key={i} className="relative h-1/1 w-1/3 overflow-hidden">
            <img
              src={img}
              alt={`${label} ${i + 1}`}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/20" />

      <div className="relative z-10 flex flex-col items-center p-8 text-center">
        {/* Small ink card behind the label + tagline for legibility */}
        <div className="rounded-lg bg-ink/85 px-6 py-4">
          <h3
            className={`text-3xl md:text-4xl ${
              label === "Molten"
                ? "font-rubik-wet text-[#ff6b35]"
                : label === "Cryo"
                ? "font-iceberg text-[#87ceeb]"
                : "font-display text-bone"
            }`}
          >
            {label}
          </h3>
          <p className="mt-2 max-w-sm text-sm text-bone-dim">{tagline}</p>
        </div>
      </div>
    </Link>
  );
}