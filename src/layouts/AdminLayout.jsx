import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/admin", label: "Overview", end: true },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/inventory", label: "Inventory" },
  { to: "/admin/customers", label: "Customers" },
];

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-ink">
      <aside className="w-56 shrink-0 border-r border-bone-dim/10 px-6 py-10">
        <p className="font-display text-xl text-bone">Loafn' Admin</p>

        <nav className="mt-10 flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded px-3 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${
                  isActive
                    ? "bg-brass/10 text-brass-light"
                    : "text-bone-dim hover:text-bone"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <NavLink
          to="/"
          className="mt-10 block font-mono text-xs uppercase tracking-widest text-bone-dim/60 hover:text-bone-dim"
        >
          ← Back to store
        </NavLink>
      </aside>

      <main className="flex-1 px-10 py-10">
        <Outlet />
      </main>
    </div>
  );
}