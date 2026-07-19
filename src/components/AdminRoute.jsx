import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";

// Same shape as ProtectedRoute, but checks profiles.role instead of just
// "is someone logged in." Two loading states matter here: auth itself
// loading, and the role lookup (which only starts once we know who the
// user is) loading.
export default function AdminRoute({ children }) {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    // Wait until AuthContext has fully resolved before making any decision
    // about roleLoading. Reacting to an in-between "user is still null
    // because auth hasn't finished yet" state was what caused roleLoading
    // to flip false prematurely, letting a stale role value slip through
    // before the real fetch below ever completed.
    if (authLoading) return;

    if (!user) {
      setRoleLoading(false);
      return;
    }

    setRoleLoading(true); // reset in case this runs again for a different user
    let active = true;
    supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          console.error("Failed to fetch role:", error);
          setRole(null);
        } else {
          setRole(data.role);
        }
        setRoleLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user, authLoading]);

  if (authLoading || (user && roleLoading)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="font-mono text-xs uppercase tracking-widest text-bone-dim">
          Loading...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role !== "admin") {
    // Not an admin: bounce to the homepage rather than login (they ARE
    // logged in, just not authorized for this route)
    return <Navigate to="/" replace />;
  }

  return children;
}