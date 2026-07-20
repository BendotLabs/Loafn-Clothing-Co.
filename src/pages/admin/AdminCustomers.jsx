import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { fetchAllProfiles, updateProfileRole } from "../../lib/adminCustomers";

export default function AdminCustomers() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const { data, error } = await fetchAllProfiles();
    if (error) setError(error.message);
    else setProfiles(data);
    setLoading(false);
  }

  async function handleRoleChange(profile, newRole) {
    if (profile.id === user.id && newRole !== "admin") {
      const confirmed = window.confirm(
        "This removes your own admin access. You'll be redirected out of the dashboard immediately. Continue?"
      );
      if (!confirmed) return;
    }

    setSavingId(profile.id);
    const { error } = await updateProfileRole(profile.id, newRole);
    setSavingId(null);

    if (error) {
      setError(error.message);
      return;
    }

    setProfiles((prev) =>
      prev.map((p) => (p.id === profile.id ? { ...p, role: newRole } : p))
    );
  }

  if (loading) {
    return <p className="font-mono text-xs text-bone-dim">Loading customers...</p>;
  }

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest text-brass-light">
        Step 49
      </p>
      <h1 className="mt-3 font-display text-3xl text-bone">Customers</h1>

      {error && <p className="mt-4 font-mono text-xs text-clay">{error}</p>}

      <table className="mt-8 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-bone-dim/20 font-mono text-xs uppercase tracking-widest text-bone-dim/60">
            <th className="py-3 pr-4">Email</th>
            <th className="py-3 pr-4">Joined</th>
            <th className="py-3 pr-4">Role</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((p) => (
            <tr key={p.id} className="border-b border-bone-dim/10 text-bone-dim">
              <td className="py-3 pr-4 text-bone">
                {p.email}
                {p.id === user.id && (
                  <span className="ml-2 font-mono text-xs text-brass-light">(you)</span>
                )}
              </td>
              <td className="py-3 pr-4">
                {new Date(p.created_at).toLocaleDateString()}
              </td>
              <td className="py-3 pr-4">
                <select
                  value={p.role}
                  disabled={savingId === p.id}
                  onChange={(e) => handleRoleChange(p, e.target.value)}
                  className="border border-bone-dim/30 bg-transparent px-2 py-1 font-mono text-xs uppercase tracking-widest text-bone outline-none focus:border-brass disabled:opacity-50"
                >
                  <option value="customer" className="bg-ink">customer</option>
                  <option value="admin" className="bg-ink">admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {profiles.length === 0 && (
        <p className="mt-8 font-mono text-xs text-bone-dim">No customers yet.</p>
      )}
    </div>
  );
}