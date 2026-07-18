import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ResetPassword() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

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
    const { error } = await updatePassword(password);
    setSubmitting(false);

    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
    setTimeout(() => navigate("/account", { replace: true }), 1500);
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-bone">Password updated.</h1>
        <p className="mt-4 text-sm text-bone-dim">Redirecting you to your account...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-6 py-24">
      <p className="font-mono text-xs uppercase tracking-widest text-brass-light">
        Account
      </p>
      <h1 className="mt-3 font-display text-4xl text-bone">Set a new password.</h1>

      <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-5">
        <div>
          <label className="font-mono text-xs uppercase tracking-widest text-bone-dim/60">
            New Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full border border-bone-dim/30 bg-transparent px-4 py-3 text-sm text-bone outline-none transition-colors focus:border-brass"
          />
        </div>
        <div>
          <label className="font-mono text-xs uppercase tracking-widest text-bone-dim/60">
            Confirm New Password
          </label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-2 w-full border border-bone-dim/30 bg-transparent px-4 py-3 text-sm text-bone outline-none transition-colors focus:border-brass"
          />
        </div>

        {error && <p className="font-mono text-xs text-clay">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 border border-brass px-7 py-3 font-mono text-xs uppercase tracking-widest text-bone transition-colors hover:bg-brass hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}