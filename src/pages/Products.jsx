import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useProducts, useCategories } from "../hooks/useProducts";

export default function Products() {
  const products = useProducts();
  const categories = useCategories();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = searchParams.get("category");
  const activeLine = searchParams.get("line");

  const filtered = products.filter(
    (p) =>
      (!activeCategory || p.category === activeCategory) &&
      (!activeLine || p.line === activeLine)
  );

  function selectCategory(category) {
    if (!category) {
      searchParams.delete("category");
    } else {
      searchParams.set("category", category);
    }
    setSearchParams(searchParams);
  }

  function selectLine(line) {
    if (!line) {
      searchParams.delete("line");
    } else {
      searchParams.set("line", line);
    }
    setSearchParams(searchParams);
  }

  const heading = activeLine
    ? activeLine.charAt(0).toUpperCase() + activeLine.slice(1)
    : activeCategory
    ? activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)
    : "All Products";

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <header className="mb-12">
        <p className="font-mono text-xs uppercase tracking-widest text-bone-dim/60">
          Loafwear
        </p>
        <h1 className="mt-2 font-display text-4xl text-bone">{heading}</h1>
      </header>

      <div className="mb-4 flex flex-wrap gap-3">
        <FilterPill
          label="All"
          active={!activeCategory}
          onClick={() => selectCategory(null)}
        />
        {categories.map((category) => (
          <FilterPill
            key={category}
            label={category}
            active={activeCategory === category}
            onClick={() => selectCategory(category)}
          />
        ))}
      </div>

      <div className="mb-10 flex flex-wrap gap-3">
        <FilterPill
          label="Molten"
          active={activeLine === "molten"}
          onClick={() => selectLine(activeLine === "molten" ? null : "molten")}
        />
        <FilterPill
          label="Cryo"
          active={activeLine === "cryo"}
          onClick={() => selectLine(activeLine === "cryo" ? null : "cryo")}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          category={activeLine || activeCategory}
          onClear={() => {
            selectCategory(null);
            selectLine(null);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`border px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${
        active
          ? "border-brass bg-brass text-ink"
          : "border-bone-dim/30 text-bone-dim hover:border-bone-dim hover:text-bone"
      }`}
    >
      {label}
    </button>
  );
}

function EmptyState({ category, onClear }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <p className="font-display text-xl text-bone">
        Nothing in {category} right now.
      </p>
      <p className="text-sm text-bone-dim">
        Check back soon, or browse everything we currently have.
      </p>
      <button
        onClick={onClear}
        className="mt-2 font-mono text-xs uppercase tracking-widest text-brass-light hover:text-brass"
      >
        View All Products
      </button>
    </div>
  );
}