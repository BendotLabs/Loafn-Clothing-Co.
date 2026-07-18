import { NavLink, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

// Sub-links shown under "Products" in both nav variants.
const productSubLinks = [
  { to: "/products", label: "All" },
  { to: "/products/collections", label: "Collections" },
  { to: "/products?category=shells", label: "Shells" },
  { to: "/products?category=tops", label: "Tops" },
  { to: "/products?category=bottoms", label: "Bottoms" },
  { to: "/products?category=accessories", label: "Accessories" },
];

// Off-canvas menu (desktop) includes Home since the centered logo no longer
// sits inline with the other links.
const offCanvasLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

// Mobile dropdown keeps the original set — the logo itself is the Home link.
const mobileLinks = [
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false); // desktop off-canvas menu
  const [mobileOpen, setMobileOpen] = useState(false); // mobile dropdown
  const [desktopProductsOpen, setDesktopProductsOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const { totalItems, toggleCart } = useCart();
  const { user } = useAuth();

  const linkClass = ({ isActive }) =>
    `text-2xl tracking-wide transition-colors ${
      isActive ? "text-bone" : "text-bone-dim hover:text-bone"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `text-sm tracking-wide transition-colors ${
      isActive ? "text-bone" : "text-bone-dim hover:text-bone"
    }`;

  // Close the desktop menu on Escape, and lock scroll while it's open.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      {/* ── Desktop nav (lg and up) ── */}
      <header className="z-40 hidden lg:block">
        <div className="relative mx-auto flex w-full max-w-[1600px] items-center justify-between px-16 py-10">
          {/* Hamburger — fades out in place when the menu opens */}
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className={`flex h-14 w-14 flex-col items-center justify-center gap-[10px] transition-opacity duration-300 ${
              open ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
          >
            <span className="block h-[3px] w-10 rounded bg-bone" />
            <span className="block h-[3px] w-10 rounded bg-bone" />
            <span className="block h-[3px] w-10 rounded bg-bone" />
          </button>

          {/* Logo, centered */}
          <NavLink
            to="/"
            className="absolute left-1/2 -translate-x-1/2 font-display text-4xl tracking-tight text-bone"
          >
            Loafn'
          </NavLink>

          <div className="flex items-center gap-6">
            <NavLink
              to={user ? "/account" : "/login"}
              className="font-mono text-base uppercase tracking-widest text-bone-dim transition-colors hover:text-bone"
            >
              {user ? "Account" : "Sign In"}
            </NavLink>

            {/* Cart */}
            <button
              onClick={toggleCart}
              aria-label="Open cart"
              className="font-mono text-base uppercase tracking-widest text-bone-dim transition-colors hover:text-bone"
            >
              Cart ({totalItems})
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop for desktop off-canvas menu */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 hidden bg-ink/70 transition-opacity duration-300 lg:block ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Desktop off-canvas menu */}
      <nav
        aria-hidden={!open}
        className={`fixed left-0 top-0 z-50 hidden h-full w-96 max-w-[80vw] flex-col bg-ink-soft px-12 py-12 shadow-xl transition-transform duration-300 ease-out lg:flex ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button — fades in at the top right of the panel */}
        <button
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          className={`absolute right-8 top-8 flex h-14 w-14 items-center justify-center transition-opacity duration-300 ${
            open ? "opacity-100 delay-150" : "opacity-0"
          }`}
        >
          <span className="absolute h-[3px] w-8 rotate-45 rounded bg-bone" />
          <span className="absolute h-[3px] w-8 -rotate-45 rounded bg-bone" />
        </button>

        <div className="flex flex-1 flex-col justify-center gap-10 overflow-y-auto">
          <NavLink
            to="/"
            onClick={() => setOpen(false)}
            className={linkClass}
            end
          >
            Home
          </NavLink>

          {/* Products — expandable */}
          <div>
            <div className="flex items-center gap-3">
              <NavLink
                to="/products"
                onClick={() => setOpen(false)}
                className={linkClass}
              >
                Products
              </NavLink>
              <button
                onClick={() => setDesktopProductsOpen((v) => !v)}
                aria-label="Toggle products submenu"
                aria-expanded={desktopProductsOpen}
                className="text-bone-dim transition-transform hover:text-bone"
              >
                <span
                  className={`inline-block transition-transform duration-200 ${
                    desktopProductsOpen ? "rotate-180" : ""
                  }`}
                >
                  ▾
                </span>
              </button>
            </div>

            {desktopProductsOpen && (
              <div className="mt-4 flex flex-col gap-3 border-l border-bone-dim/20 pl-5">
                {productSubLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="font-mono text-sm uppercase tracking-widest text-bone-dim transition-colors hover:text-bone"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {offCanvasLinks
            .filter((link) => link.to !== "/")
            .map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={linkClass}
              >
                {link.label}
              </NavLink>
            ))}
        </div>

        <NavLink
          to="/"
          onClick={() => setOpen(false)}
          className="self-center font-display text-2xl text-bone"
        >
          Loafn'
        </NavLink>
      </nav>

      {/* ── Mobile nav (below lg) ── */}
      <header className="z-40 border-b border-bone-dim/10 bg-ink/90 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <NavLink to="/" className="font-display text-2xl tracking-tight text-bone">
            Loafn'
          </NavLink>

          <button
            className="text-bone"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className="mb-1.5 block h-px w-6 bg-current" />
            <span className="block h-px w-6 bg-current" />
          </button>
        </div>

        {mobileOpen && (
          <nav className="flex flex-col gap-4 border-t border-bone-dim/10 px-6 py-6">
            {/* Products — expandable */}
            <div>
              <div className="flex items-center justify-between">
                <NavLink
                  to="/products"
                  onClick={() => setMobileOpen(false)}
                  className={mobileLinkClass}
                >
                  Products
                </NavLink>
                <button
                  onClick={() => setMobileProductsOpen((v) => !v)}
                  aria-label="Toggle products submenu"
                  aria-expanded={mobileProductsOpen}
                  className="text-bone-dim hover:text-bone"
                >
                  <span
                    className={`inline-block transition-transform duration-200 ${
                      mobileProductsOpen ? "rotate-180" : ""
                    }`}
                  >
                    ▾
                  </span>
                </button>
              </div>

              {mobileProductsOpen && (
                <div className="mt-3 flex flex-col gap-3 border-l border-bone-dim/20 pl-4">
                  {productSubLinks.map((link) => (
                    <Link
                      key={link.label}
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className="font-mono text-xs uppercase tracking-widest text-bone-dim transition-colors hover:text-bone"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {mobileLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={mobileLinkClass}
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to={user ? "/account" : "/login"}
              onClick={() => setMobileOpen(false)}
              className={mobileLinkClass}
            >
              {user ? "Account" : "Sign In"}
            </NavLink>
            <button
            onClick={toggleCart}
            className="text-left font-mono text-xs uppercase tracking-widest text-bone-dim">
              Cart ({totalItems})
            </button>
            <button
            onClick={toggleCart}
            className="text-left font-mono text-xs uppercase tracking-widest text-bone-dim">
              Cart ({totalItems})
            </button>
          </nav>
        )}
      </header>
    </>
  );
}