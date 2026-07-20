import { useState } from "react";

const CATEGORIES = ["shells", "tops", "bottoms", "accessories"];

// Shared by both create and edit. `product` is null for create, or an
// existing product object for edit — slug is locked on edit since it's
// used in URLs and (soon) order line items, so changing it after the
// fact could break existing links.
export default function ProductForm({ product, onSubmit, onCancel, submitting }) {
  const isEdit = Boolean(product);

  const [form, setForm] = useState({
    slug: product?.slug || "",
    name: product?.name || "",
    price: product?.price ?? "",
    category: product?.category || CATEGORIES[0],
    line: product?.line || "",
    image: product?.image || "",
    description: product?.description || "",
    colors: product?.colors?.join(", ") || "",
    sizes: product?.sizes?.join(", ") || "",
    isNew: product?.isNew || false,
  });
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.slug || !form.name || !form.price || !form.category) {
      setError("Slug, name, price, and category are required.");
      return;
    }

    onSubmit({
      slug: form.slug.trim(),
      name: form.name.trim(),
      price: parseFloat(form.price),
      category: form.category,
      line: form.line.trim(),
      image: form.image.trim(),
      description: form.description.trim(),
      colors: form.colors.split(",").map((c) => c.trim()).filter(Boolean),
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      isNew: form.isNew,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 border border-bone-dim/20 bg-ink p-6"
    >
      <h2 className="font-display text-xl text-bone">
        {isEdit ? `Edit ${product.name}` : "Add Product"}
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Slug" value={form.slug} disabled={isEdit}
          onChange={(v) => update("slug", v)} />
        <Field label="Name" value={form.name} onChange={(v) => update("name", v)} />
        <Field label="Price" type="number" value={form.price}
          onChange={(v) => update("price", v)} />
        <div>
          <label className="font-mono text-xs uppercase tracking-widest text-bone-dim/60">
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            className="mt-2 w-full border border-bone-dim/30 bg-transparent px-3 py-2 text-sm text-bone outline-none focus:border-brass"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-ink">
                {c}
              </option>
            ))}
          </select>
        </div>
        <Field label="Line (optional)" value={form.line} onChange={(v) => update("line", v)} />
        <Field label="Image URL" value={form.image} onChange={(v) => update("image", v)} />
        <Field label="Colors (comma-separated)" value={form.colors}
          onChange={(v) => update("colors", v)} />
        <Field label="Sizes (comma-separated)" value={form.sizes}
          onChange={(v) => update("sizes", v)} />
      </div>

      <div>
        <label className="font-mono text-xs uppercase tracking-widest text-bone-dim/60">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          rows={3}
          className="mt-2 w-full border border-bone-dim/30 bg-transparent px-3 py-2 text-sm text-bone outline-none focus:border-brass"
        />
      </div>

      <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-bone-dim">
        <input
          type="checkbox"
          checked={form.isNew}
          onChange={(e) => update("isNew", e.target.checked)}
        />
        Mark as new
      </label>

      {error && <p className="font-mono text-xs text-clay">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="border border-brass px-6 py-2 font-mono text-xs uppercase tracking-widest text-bone transition-colors hover:bg-brass hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border border-bone-dim/30 px-6 py-2 font-mono text-xs uppercase tracking-widest text-bone-dim transition-colors hover:text-bone"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({ label, type = "text", value, onChange, disabled }) {
  return (
    <div>
      <label className="font-mono text-xs uppercase tracking-widest text-bone-dim/60">
        {label}
      </label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full border border-bone-dim/30 bg-transparent px-3 py-2 text-sm text-bone outline-none transition-colors focus:border-brass disabled:opacity-50"
      />
    </div>
  );
}