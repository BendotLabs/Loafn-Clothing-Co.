/* Reintroduce a pre-checkout step later (e.g. capturing an account-linked
shipping address before handoff). */

import { useState } from "react";

const initialForm = {
  fullName: "",
  email: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  zip: "",
  country: "United States",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ZIP_RE = /^\d{5}(-\d{4})?$/;

function validate(form) {
  const errors = {};
  if (!form.fullName.trim()) errors.fullName = "Full name is required.";
  if (!form.email.trim()) errors.email = "Email is required.";
  else if (!EMAIL_RE.test(form.email)) errors.email = "Enter a valid email address.";
  if (!form.address1.trim()) errors.address1 = "Address is required.";
  if (!form.city.trim()) errors.city = "City is required.";
  if (!form.state.trim()) errors.state = "State is required.";
  if (!form.zip.trim()) errors.zip = "ZIP code is required.";
  else if (!ZIP_RE.test(form.zip.trim())) errors.zip = "Enter a valid ZIP code.";
  return errors;
}

export default function ShippingForm({ onSubmit, submitting }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate({ ...form }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validate(form);
    setErrors(newErrors);
    setTouched(
      Object.keys(initialForm).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );
    if (Object.keys(newErrors).length === 0) {
      onSubmit(form);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <h2 className="font-display text-xl text-bone">Shipping Information</h2>

      <Field
        label="Full Name"
        name="fullName"
        value={form.fullName}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.fullName && errors.fullName}
      />
      <Field
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.email && errors.email}
      />
      <Field
        label="Address"
        name="address1"
        value={form.address1}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.address1 && errors.address1}
      />
      <Field
        label="Apt, Suite, etc. (optional)"
        name="address2"
        value={form.address2}
        onChange={handleChange}
      />

      <div className="grid grid-cols-2 gap-4">
        <Field
          label="City"
          name="city"
          value={form.city}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.city && errors.city}
        />
        <Field
          label="State"
          name="state"
          value={form.state}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.state && errors.state}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field
          label="ZIP Code"
          name="zip"
          value={form.zip}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.zip && errors.zip}
        />
        <Field
          label="Country"
          name="country"
          value={form.country}
          onChange={handleChange}
        />
      </div>

      {/* Payment collection arrives with Stripe in a later phase — this is a mock submit */}
      <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-bone-dim/40">
        Payment processing not yet connected &mdash; placing this order won't charge a card.
      </p>

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 w-full border border-brass py-4 font-mono text-xs uppercase tracking-widest text-bone transition-colors hover:bg-brass hover:text-ink disabled:cursor-not-allowed disabled:opacity-50 md:w-auto md:px-10"
      >
        {submitting ? "Placing Order..." : "Place Order"}
      </button>
    </form>
  );
}

function Field({ label, name, type = "text", value, onChange, onBlur, error }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="font-mono text-xs uppercase tracking-widest text-bone-dim/60"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`mt-2 w-full border bg-transparent px-4 py-3 text-sm text-bone outline-none transition-colors focus:border-brass ${
          error ? "border-clay" : "border-bone-dim/30"
        }`}
      />
      {error && <p className="mt-1 font-mono text-[11px] text-clay">{error}</p>}
    </div>
  );
}