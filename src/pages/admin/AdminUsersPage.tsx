import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  activateUser,
  deactivateUser,
  deleteAdminUser,
  getAdminUsers,
} from "../../api/adminUsers";
import type { AdminUser } from "../../api/adminUsers";
import AppLayout from "../../components/layout/AppLayout";
import "./AdminUsersPage.css";
import Modal from "../../components/ui/Modal";
import AdminUserForm from "../../features/admin/users/AdminUserForm";
import ResetPasswordForm from "../../features/admin/users/ResetPasswordForm";
import { useToast } from "../../contexts/ToastContext";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { Trash2 } from "lucide-react";

export default function AdminUsersPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionUserId, setActionUserId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [resetUser, setResetUser] = useState<AdminUser | null>(null);
  const { showToast } = useToast();
  const [statusUser, setStatusUser] = useState<AdminUser | null>(null);
  const [deleteUser, setDeleteUser] = useState<AdminUser | null>(null);

  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getAdminUsers();

      setUsers(response.items);
    } catch (error) {
      console.error("Admin users load error:", error);

      setError(t("adminUsers.loadFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter((user) => {
      const searchable = [
        user.full_name,
        user.email,
        user.department_name ?? "",
        user.role,
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [users, search]);

  const handleStatusChange = async () => {
    if (!statusUser) {
      return;
    }

    setActionUserId(statusUser.id);

    try {
      if (statusUser.is_active) {
        await deactivateUser(statusUser.id);
      } else {
        await activateUser(statusUser.id);
      }

      showToast(
        statusUser.is_active
          ? t("adminUsers.deactivatedSuccess")
          : t("adminUsers.activatedSuccess"),
        "success",
      );

      setStatusUser(null);

      await loadUsers();
    } catch (error) {
      console.error("User status update error:", error);

      showToast(t("adminUsers.statusFailed"), "error");
    } finally {
      setActionUserId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteUser) {
      return;
    }

    setDeleteUserId(deleteUser.id);

    try {
      await deleteAdminUser(deleteUser.id);

      showToast(t("adminUsers.deleteSuccess"), "success");

      setDeleteUser(null);

      await loadUsers();
    } catch (error) {
      console.error("User delete error:", error);

      showToast(t("adminUsers.deleteFailed"), "error");
    } finally {
      setDeleteUserId(null);
    }
  };

  return (
    <AppLayout>
      <section className="admin-users-page">
        <header className="admin-users-page__header">
          <div>
            <h1>{t("adminUsers.title")}</h1>

            <p>{t("adminUsers.subtitle")}</p>
          </div>

          <button
            type="button"
            className="admin-users-page__add"
            onClick={() => setCreateOpen(true)}
          >
            + {t("adminUsers.addUser")}
          </button>
        </header>

        <div className="admin-users-toolbar">
          <input
            type="search"
            value={search}
            placeholder={t("adminUsers.searchPlaceholder")}
            onChange={(event) => setSearch(event.target.value)}
          />

          <div className="admin-users-toolbar__count">
            {filteredUsers.length} {t("navigation.users")}
          </div>
        </div>

        {loading && (
          <div className="admin-users-state">{t("adminUsers.loading")}</div>
        )}

        {!loading && error && (
          <div className="admin-users-state admin-users-state--error">
            {error}
          </div>
        )}

        {!loading && !error && filteredUsers.length === 0 && (
          <div className="admin-users-state">{t("adminUsers.noUsers")}</div>
        )}

        {!loading && !error && filteredUsers.length > 0 && (
          <div className="admin-users-table-wrapper">
            <table className="admin-users-table">
              <thead>
                <tr>
                  <th>{t("adminUsers.name")}</th>

                  <th>{t("adminUsers.department")}</th>

                  <th>{t("adminUsers.role")}</th>

                  <th>{t("adminUsers.status")}</th>

                  <th>{t("adminUsers.actions")}</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="admin-user-identity">
                        <div className="admin-user-avatar">
                          {user.full_name?.[0]?.toUpperCase() ?? "U"}
                        </div>

                        <div>
                          <strong>{user.full_name}</strong>

                          <span>{user.email}</span>
                        </div>
                      </div>
                    </td>

                    <td>{user.department_name ?? "—"}</td>

                    <td>
                      <span
                        className={[
                          "admin-user-role",
                          user.role === "admin" ? "admin-user-role--admin" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        {user.role === "admin"
                          ? t("adminUsers.admin")
                          : t("adminUsers.user")}
                      </span>
                    </td>

                    <td>
                      <span
                        className={[
                          "admin-user-status",
                          user.is_active
                            ? "admin-user-status--active"
                            : "admin-user-status--inactive",
                        ].join(" ")}
                      >
                        <span className="admin-user-status__dot" />

                        {user.is_active
                          ? t("adminUsers.active")
                          : t("adminUsers.inactive")}
                      </span>
                    </td>

                    <td>
                      <div className="admin-user-actions">
                        <button
                          type="button"
                          className="admin-user-actions__secondary"
                          onClick={() => setEditingUser(user)}
                        >
                          {t("adminUsers.edit")}
                        </button>

                        <button
                          type="button"
                          className="admin-user-actions__secondary"
                          onClick={() => setResetUser(user)}
                        >
                          {t("adminUsers.resetPassword")}
                        </button>

                        <button
                          type="button"
                          className={
                            user.is_active
                              ? "admin-user-actions__danger"
                              : "admin-user-actions__activate"
                          }
                          disabled={actionUserId === user.id}
                          onClick={() => setStatusUser(user)}
                        >
                          {user.is_active
                            ? t("adminUsers.deactivate")
                            : t("adminUsers.activate")}
                        </button>

                        <button
                          type="button"
                          className="admin-action admin-action--danger"
                          disabled={deleteUserId === user.id}
                          onClick={() => setDeleteUser(user)}
                          aria-label={t("common.delete")}
                          title={t("common.delete")}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ConfirmDialog
              open={statusUser !== null}
              title={
                statusUser?.is_active
                  ? t("adminUsers.deactivate")
                  : t("adminUsers.activate")
              }
              message={
                statusUser?.is_active
                  ? t("adminUsers.deactivateConfirm")
                  : t("adminUsers.activateConfirm")
              }
              confirmLabel={
                statusUser?.is_active
                  ? t("adminUsers.deactivate")
                  : t("adminUsers.activate")
              }
              danger={statusUser?.is_active ?? false}
              loading={actionUserId !== null}
              onCancel={() => setStatusUser(null)}
              onConfirm={handleStatusChange}
            />

            <ConfirmDialog
              open={deleteUser !== null}
              title={t("adminUsers.delete")}
              message={t("adminUsers.deleteConfirm")}
              confirmLabel={t("adminUsers.delete")}
              danger
              loading={deleteUserId !== null}
              onCancel={() => setDeleteUser(null)}
              onConfirm={handleDelete}
            />
          </div>
        )}
      </section>
      <Modal
        open={createOpen}
        title={t("adminUserForm.addTitle")}
        onClose={() => setCreateOpen(false)}
      >
        <AdminUserForm
          onCancel={() => setCreateOpen(false)}
          onSuccess={async () => {
            setCreateOpen(false);

            await loadUsers();
          }}
        />
      </Modal>

      <Modal
        open={editingUser !== null}
        title={t("adminUserForm.editTitle")}
        onClose={() => setEditingUser(null)}
      >
        {editingUser && (
          <AdminUserForm
            user={editingUser}
            onCancel={() => setEditingUser(null)}
            onSuccess={async () => {
              setEditingUser(null);

              await loadUsers();
            }}
          />
        )}
      </Modal>

      <Modal
        open={resetUser !== null}
        title={t("adminUserForm.resetPasswordTitle")}
        onClose={() => setResetUser(null)}
      >
        {resetUser && (
          <ResetPasswordForm
            user={resetUser}
            onCancel={() => setResetUser(null)}
            onSuccess={() => {
              setResetUser(null);
            }}
          />
        )}
      </Modal>
    </AppLayout>
  );
}
