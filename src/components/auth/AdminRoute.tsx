import type { ReactNode } from "react";

import { Navigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

const CASA_ADMIN_URL =
  import.meta.env.VITE_CASA_CORE_URL ?? "http://admin.casa.local";

interface AdminRouteProps {
  children: ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    window.location.replace(`${CASA_ADMIN_URL.replace(/\/$/, "")}/dashboard`);

    return <div>Redirecting to CASA Administration...</div>;
  }

  if (user.role !== "admin") {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
}
