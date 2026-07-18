import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ForgotPassword() {
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const { error } = await sendPasswordReset(email);

    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-brass-light">
          Check your email
        </p>
        <h1 className="mt-3 font-display text-3xl text-bone">Reset link sent.</h1>
        <p className="mt-4 text-sm text-bone-dim">
          If an account exists for {email}, a password reset link is on its way.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-6 py-24">
      <p className="font-mono text-xs uppercase tracking-widest text-brass-light">
        Account
      </p>
      <h1 className="mt-3 font-display text-4xl text-bone">Reset your password.</h1>
      <p className="mt-4 text-sm text-bone-dim">
        Enter your email and we'll send you a link to reset it.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-5">
        <div>
          <label className="font-mono text-xs uppercase tracking-widest text-bone-dim/60">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full border border-bone-dim/30 bg-transparent px-4 py-3 text-sm text-bone outline-none transition-colors focus:border-brass"
          />
        </div>

        {error && <p className="font-mono text-xs text-clay">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 border border-brass px-7 py-3 font-mono text-xs uppercase tracking-widest text-bone transition-colors hover:bg-brass hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <Link to="/login" className="mt-6 inline-block text-sm text-bone-dim hover:text-bone">
        &larr; Back to Sign In
      </Link>
    </div>
  );
}