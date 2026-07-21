import { useState } from "react";
import { useProducts, useVariants } from "../../hooks/useProducts";
import { updateVariantStock } from "../../lib/adminVariants";

const LOW_STOCK_THRESHOLD = 3;

export default function AdminInventory() {
  const products = useProducts();
  const [expanded, setExpanded] = useState(null);

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest text-brass-light">
        Step 48
      </p>
      <h1 className="mt-3 font-display text-3xl text-bone">Inventory</h1>
      <p className="mt-4 text-sm text-bone-dim">
        Stock is tracked per color/size combination. Expand a product to edit counts.
      </p>

      <div className="mt-8 flex flex-col gap-2">
        {products.map((p) => (
          <div key={p.id} className="border border-bone-dim/20">
            <button
              onClick={() => setExpanded(expanded === p.id ? null : p.id)}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="text-sm text-bone">{p.name}</span>
              <span className="font-mono text-xs uppercase tracking-widest text-bone-dim/60">
                {expanded === p.id ? "Hide" : "Manage Stock"}
              </span>
            </button>
            {expanded === p.id && <VariantGrid product={p} />}
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <p className="mt-8 font-mono text-xs text-bone-dim">No products yet.</p>
      )}
    </div>
  );
}

function VariantGrid({ product }) {
  const variants = useVariants(product.id);
  const [saving, setSaving] = useState(null);
  const [drafts, setDrafts] = useState({});

  const knownColors = new Set(product.colors || []);
  const knownSizes = new Set(product.sizes || []);

  async function handleSave(variant) {
    const raw = drafts[variant.id];
    const stock = raw === undefined ? variant.stock : parseInt(raw, 10);
    if (Number.isNaN(stock) || stock < 0) return;

    setSaving(variant.id);
    await updateVariantStock(variant.id, product.id, stock);
    setSaving(null);
    setDrafts((d) => {
      const next = { ...d };
      delete next[variant.id];
      return next;
    });
  }

  if (variants.length === 0) {
    return (
      <p className="border-t border-bone-dim/10 px-4 py-4 font-mono text-xs text-bone-dim">
        No variant rows yet — edit and re-save the product to generate them
        from its colors/sizes.
      </p>
    );
  }

  return (
    <table className="w-full border-t border-bone-dim/10 text-left text-sm">
      <thead>
        <tr className="font-mono text-xs uppercase tracking-widest text-bone-dim/60">
          <th className="px-4 py-2">Color</th>
          <th className="px-4 py-2">Size</th>
          <th className="px-4 py-2">Stock</th>
          <th className="px-4 py-2"></th>
          <th className="px-4 py-2"></th>
        </tr>
      </thead>
      <tbody>
        {variants.map((v) => {
          const orphaned = !knownColors.has(v.color) || !knownSizes.has(v.size);
          const draft = drafts[v.id];
          const displayValue = draft !== undefined ? draft : v.stock;

          return (
            <tr key={v.id} className="border-t border-bone-dim/10 text-bone-dim">
              <td className="px-4 py-2">{v.color}</td>
              <td className="px-4 py-2">{v.size}</td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  min={0}
                  value={displayValue}
                  onChange={(e) =>
                    setDrafts((d) => ({ ...d, [v.id]: e.target.value }))
                  }
                  className="w-20 border border-bone-dim/30 bg-transparent px-2 py-1 font-mono text-xs text-bone outline-none focus:border-brass"
                />
              </td>
              <td className="px-4 py-2 font-mono text-xs uppercase tracking-widest">
                {v.stock === 0 ? (
                  <span className="text-clay">Out of stock</span>
                ) : v.stock <= LOW_STOCK_THRESHOLD ? (
                  <span className="text-brass-light">Low stock</span>
                ) : null}
                {orphaned && <span className="ml-2 text-bone-dim/50">(orphaned)</span>}
              </td>
              <td className="px-4 py-2 text-right">
                <button
                  onClick={() => handleSave(v)}
                  disabled={draft === undefined || saving === v.id}
                  className="font-mono text-xs uppercase tracking-widest text-brass-light hover:text-brass disabled:opacity-40"
                >
                  {saving === v.id ? "Saving..." : "Save"}
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}