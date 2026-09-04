import type { ReactNode } from "react";

import { Navigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  console.log("ProtectedRoute:", {
    loading,
    user,
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log("No user - redirecting to login");

    return <Navigate to="/login" replace />;
  }

  console.log("User authenticated - allowing route");

  return children;
}
