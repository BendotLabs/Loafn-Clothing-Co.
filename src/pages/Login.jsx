import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const { error } = await signIn(email, password);

    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    navigate(redirectTo, { replace: true });
  }

  return (
    <div className="mx-auto max-w-md px-6 py-24">
      <p className="font-mono text-xs uppercase tracking-widest text-brass-light">
        Account
      </p>
      <h1 className="mt-3 font-display text-4xl text-bone">Welcome back.</h1>

      <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-5">
        <Field label="Email" type="email" value={email} onChange={setEmail} />
        <Field label="Password" type="password" value={password} onChange={setPassword} />

        {error && <p className="font-mono text-xs text-clay">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 border border-brass px-7 py-3 font-mono text-xs uppercase tracking-widest text-bone transition-colors hover:bg-brass hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <div className="mt-6 flex flex-col gap-2 text-sm">
        <Link to="/forgot-password" className="text-bone-dim hover:text-bone">
          Forgot your password?
        </Link>
        <p className="text-bone-dim">
          Don't have an account?{" "}
          <Link to="/register" className="text-brass-light hover:text-brass">
            Create one
          </Link>
        </p>
      </div>
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