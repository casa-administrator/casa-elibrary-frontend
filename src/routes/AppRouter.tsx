import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import AdminRoute from "../components/auth/AdminRoute";

import AppLoadingScreen from "../components/feedback/AppLoadingScreen";

import LoginPage from "../pages/LoginPage";
import LibraryPage from "../pages/LibraryPage";
import CategoryDocumentsPage from "../pages/CategoryDocumentsPage";

import AdminUsersPage from "../pages/admin/AdminUsersPage";
import AdminDepartmentsPage from "../pages/admin/AdminDepartmentsPage";
import AdminCategoriesPage from "../pages/admin/AdminCategoriesPage";
import AdminPermissionsPage from "../pages/admin/AdminPermissionsPage";
import AdminAuditLogsPage from "../pages/admin/AdminAuditLogsPage";

import SsoCallbackPage from "../pages/SsoCallbackPage";
import AccessDeniedPage from "../pages/AccessDeniedPage";

export default function AppRouter() {
  const { loading } = useAuth();

  const location = useLocation();

  const isSsoCallback = location.pathname === "/sso/callback";

  /*
   * Keep the normal E-Library loading screen
   * for the application.
   *
   * But never cover the CASA SSO callback,
   * because that page has its own transition UI.
   */
  if (loading && !isSsoCallback) {
    return <AppLoadingScreen />;
  }

  return (
    <Routes>
      <Route path="/sso/callback" element={<SsoCallbackPage />} />

      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/library"
        element={
          <ProtectedRoute>
            <LibraryPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/library/:categoryId"
        element={
          <ProtectedRoute>
            <CategoryDocumentsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminUsersPage />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/departments"
        element={
          <AdminRoute>
            <AdminDepartmentsPage />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/categories"
        element={
          <AdminRoute>
            <AdminCategoriesPage />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/permissions"
        element={
          <AdminRoute>
            <AdminPermissionsPage />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/audit-logs"
        element={
          <AdminRoute>
            <AdminAuditLogsPage />
          </AdminRoute>
        }
      />

      <Route path="/access-denied" element={<AccessDeniedPage />} />

      <Route path="/" element={<Navigate to="/library" replace />} />

      <Route path="*" element={<Navigate to="/library" replace />} />
    </Routes>
  );
}
