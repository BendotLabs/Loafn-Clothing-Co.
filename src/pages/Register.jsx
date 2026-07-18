import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmSent, setConfirmSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitting(true);
    const { data, error } = await signUp(email, password);
    setSubmitting(false);

    if (error) {
      setError(error.message);
      return;
    }

    // If email confirmation is enabled in Supabase, there's no session yet —
    // show a "check your email" state instead of redirecting.
    if (!data.session) {
      setConfirmSent(true);
      return;
    }

    navigate("/account", { replace: true });
  }

  if (confirmSent) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-brass-light">
          Almost there
        </p>
        <h1 className="mt-3 font-display text-3xl text-bone">Check your email.</h1>
        <p className="mt-4 text-sm text-bone-dim">
          We sent a confirmation link to {email}. Click it to activate your account.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-6 py-24">
      <p className="font-mono text-xs uppercase tracking-widest text-brass-light">
        Account
      </p>
      <h1 className="mt-3 font-display text-4xl text-bone">Create an account.</h1>

      <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-5">
        <Field label="Email" type="email" value={email} onChange={setEmail} />
        <Field label="Password" type="password" value={password} onChange={setPassword} />
        <Field
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
        />

        {error && <p className="font-mono text-xs text-clay">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 border border-brass px-7 py-3 font-mono text-xs uppercase tracking-widest text-bone transition-colors hover:bg-brass hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-sm text-bone-dim">
        Already have an account?{" "}
        <Link to="/login" className="text-brass-light hover:text-brass">
          Sign in
        </Link>
      </p>
    </div>
  );
}

function Field({ label, type, value, onChange }) {
  return (
    <div>
      <label className="font-mono text-xs uppercase tracking-widest text-bone-dim/60">
        {label}
      </label>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full border border-bone-dim/30 bg-transparent px-4 py-3 text-sm text-bone outline-none transition-colors focus:border-brass"
      />
    </div>
  );
}