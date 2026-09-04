import { Navigate, Route, Routes } from "react-router-dom";

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

import AccessDeniedPage from "../pages/AccessDeniedPage";

export default function AppRouter() {
  const { loading } = useAuth();

  if (loading) {
    return <AppLoadingScreen />;
  }

  return (
    <Routes>
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
