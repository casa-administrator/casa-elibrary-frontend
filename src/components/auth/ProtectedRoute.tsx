import type { ReactNode } from "react";

import { useAuth } from "../../contexts/AuthContext";

const CASA_ADMIN_URL =
  import.meta.env.VITE_CASA_CORE_URL ?? "http://admin.casa.local";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    window.location.replace(`${CASA_ADMIN_URL.replace(/\/$/, "")}/dashboard`);

    return <div>Redirecting to CASA Administration...</div>;
  }

  return children;
}
