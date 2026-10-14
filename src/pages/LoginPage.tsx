import { useEffect } from "react";

import { Navigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

const CASA_ADMIN_URL =
  import.meta.env.VITE_CASA_CORE_URL ?? "http://admin.casa.local";

export default function LoginPage() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading || user) {
      return;
    }

    window.location.replace(`${CASA_ADMIN_URL.replace(/\/$/, "")}/dashboard`);
  }, [loading, user]);

  if (loading) {
    return <div>CASA</div>;
  }

  if (user) {
    return <Navigate to="/library" replace />;
  }

  return <div>Redirecting to CASA Administration...</div>;
}
