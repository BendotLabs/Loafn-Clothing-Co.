import { useState } from "react";
import { useProducts, useStockTotals } from "../../hooks/useProducts";
import { createProduct, updateProduct, deleteProduct } from "../../lib/adminProducts";
import ProductForm from "../../components/admin/ProductForm";

export default function AdminProducts() {
  const products = useProducts(); // same hook the storefront uses — reads are public
  const stockTotals = useStockTotals();
  const [mode, setMode] = useState(null); // null | "create" | product object being edited
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate(values) {
    setSubmitting(true);
    setError("");
    const { error } = await createProduct(values);
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    setMode(null);
  }

  async function handleEdit(values) {
    setSubmitting(true);
    setError("");
    const { error } = await updateProduct(mode.id, values);
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    setMode(null);
  }

  async function handleDelete(product) {
    if (!window.confirm(`Delete "${product.name}"? This can't be undone.`)) return;
    const { error } = await deleteProduct(product.id);
    if (error) setError(error.message);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-brass-light">
            Step 46
          </p>
          <h1 className="mt-3 font-display text-3xl text-bone">Products</h1>
        </div>
        {!mode && (
          <button
            onClick={() => setMode("create")}
            className="border border-brass px-5 py-2 font-mono text-xs uppercase tracking-widest text-bone transition-colors hover:bg-brass hover:text-ink"
          >
            + Add Product
          </button>
        )}
      </div>

      {error && (
        <p className="mt-4 font-mono text-xs text-clay">{error}</p>
      )}

      {mode === "create" && (
        <div className="mt-6">
          <ProductForm
            onSubmit={handleCreate}
            onCancel={() => setMode(null)}
            submitting={submitting}
          />
        </div>
      )}

      {mode && mode !== "create" && (
        <div className="mt-6">
          <ProductForm
            product={mode}
            onSubmit={handleEdit}
            onCancel={() => setMode(null)}
            submitting={submitting}
          />
        </div>
      )}

      {!mode && (
        <table className="mt-8 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-bone-dim/20 font-mono text-xs uppercase tracking-widest text-bone-dim/60">
              <th className="py-3 pr-4">Name</th>
              <th className="py-3 pr-4">Category</th>
              <th className="py-3 pr-4">Price</th>
              <th className="py-3 pr-4">Colors</th>
              <th className="py-3 pr-4">Sizes</th>
              <th className="py-3 pr-4">Total Stock</th>
              <th className="py-3 pr-4"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const total = stockTotals[p.id];
              return (
                <tr key={p.id} className="border-b border-bone-dim/10 text-bone-dim">
                  <td className="py-3 pr-4 text-bone">{p.name}</td>
                  <td className="py-3 pr-4">{p.category}</td>
                  <td className="py-3 pr-4 font-mono">${p.price.toFixed(2)}</td>
                  <td className="py-3 pr-4">{p.colors?.join(", ")}</td>
                  <td className="py-3 pr-4">{p.sizes?.join(", ")}</td>
                  <td className="py-3 pr-4 font-mono">
                    {total === undefined ? (
                      <span className="text-bone-dim/40">—</span>
                    ) : (
                      <span className={total === 0 ? "text-clay" : ""}>
                        Total stock: {total}
                      </span>
                    )}
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <button
                      onClick={() => setMode(p)}
                      className="font-mono text-xs uppercase tracking-widest text-brass-light hover:text-brass"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p)}
                      className="ml-4 font-mono text-xs uppercase tracking-widest text-clay hover:text-clay/70"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {!mode && products.length === 0 && (
        <p className="mt-8 font-mono text-xs text-bone-dim">No products yet.</p>
      )}
    </div>
  );
}