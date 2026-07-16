import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-32 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-brass-light">404</p>
      <h1 className="font-display text-3xl text-bone">Page not found.</h1>
      <p className="text-sm text-bone-dim">
        The page you're looking for doesn't exist, or has moved.
      </p>
      <Link
        to="/"
        className="mt-4 border border-brass px-6 py-3 font-mono text-xs uppercase tracking-widest text-bone hover:bg-brass hover:text-ink transition-colors"
      >
        Back Home
      </Link>
    </div>
  );
}
