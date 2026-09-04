import type { ReactNode } from "react";

import { Navigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

interface AdminRouteProps {
  children: ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
}
