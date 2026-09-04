import { useEffect, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { getAdminUsers } from "../../api/adminUsers";

import type { AdminUser } from "../../api/adminUsers";

import { getAdminCategories } from "../../api/adminCategories";

import type { AdminCategory } from "../../api/adminCategories";

import {
  deleteUserPermission,
  getUserPermissions,
  updateUserPermission,
} from "../../api/adminPermissions";

import type { UserCategoryPermission } from "../../api/adminPermissions";

import AppLayout from "../../components/layout/AppLayout";

import "./AdminPermissionsPage.css";

export default function AdminPermissionsPage() {
  const { t } = useTranslation();

  const [users, setUsers] = useState<AdminUser[]>([]);

  const [categories, setCategories] = useState<AdminCategory[]>([]);

  const [selectedUserId, setSelectedUserId] = useState("");

  const [permissions, setPermissions] = useState<UserCategoryPermission[]>([]);

  const [userSearch, setUserSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [permissionsLoading, setPermissionsLoading] = useState(false);

  const [error, setError] = useState("");

  const [savingCategoryId, setSavingCategoryId] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);

      setError("");

      try {
        const [usersResult, categoriesResult] = await Promise.all([
          getAdminUsers(),

          getAdminCategories(),
        ]);

        setUsers(usersResult.items);

        setCategories(
          categoriesResult.items.filter((category) => category.is_active),
        );
      } catch (error) {
        console.error("Permissions initial load error:", error);

        setError(t("adminPermissions.loadFailed"));
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (!selectedUserId) {
      setPermissions([]);

      return;
    }

    const loadPermissions = async () => {
      setPermissionsLoading(true);

      setError("");

      try {
        const result = await getUserPermissions(selectedUserId);

        setPermissions(result.items);
      } catch (error) {
        console.error("User permissions load error:", error);

        setError(t("adminPermissions.loadFailed"));
      } finally {
        setPermissionsLoading(false);
      }
    };

    loadPermissions();
  }, [selectedUserId]);

  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId) ?? null,
    [users, selectedUserId],
  );

  const filteredUsers = useMemo(() => {
    const query = userSearch.trim().toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter((user) =>
      [user.full_name, user.email, user.department_name ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [users, userSearch]);

  const permissionMap = useMemo(() => {
    return new Map(
      permissions.map((permission) => [permission.category_id, permission]),
    );
  }, [permissions]);

  const savePermission = async (
    categoryId: string,
    canView: boolean,
    canDownload: boolean,
  ) => {
    if (!selectedUserId) {
      return;
    }

    setSavingCategoryId(categoryId);

    try {
      if (!canView) {
        await deleteUserPermission(selectedUserId, categoryId);

        setPermissions((current) =>
          current.filter((permission) => permission.category_id !== categoryId),
        );

        return;
      }

      const updated = await updateUserPermission(selectedUserId, categoryId, {
        can_view: canView,

        can_download: canDownload,
      });

      setPermissions((current) => {
        const exists = current.some(
          (permission) => permission.category_id === categoryId,
        );

        if (exists) {
          return current.map((permission) =>
            permission.category_id === categoryId ? updated : permission,
          );
        }

        return [...current, updated];
      });
    } catch (error) {
      console.error("Permission save error:", error);

      window.alert(t("adminPermissions.saveFailed"));
    } finally {
      setSavingCategoryId(null);
    }
  };

  const handleViewChange = (categoryId: string, checked: boolean) => {
    const current = permissionMap.get(categoryId);

    savePermission(
      categoryId,
      checked,

      checked ? (current?.can_download ?? false) : false,
    );
  };

  const handleDownloadChange = (categoryId: string, checked: boolean) => {
    // const current = permissionMap.get(categoryId);

    savePermission(
      categoryId,

      true,

      checked,
    );
  };

  const getAccessLabel = (permission: UserCategoryPermission | undefined) => {
    if (!permission?.can_view) {
      return t("adminPermissions.noAccess");
    }

    if (permission.can_download) {
      return t("adminPermissions.viewDownload");
    }

    return t("adminPermissions.viewOnly");
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="admin-permissions-state">
          {t("adminPermissions.loading")}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <section className="admin-permissions-page">
        <header className="admin-permissions-page__header">
          <div>
            <h1>{t("adminPermissions.title")}</h1>

            <p>{t("adminPermissions.subtitle")}</p>
          </div>
        </header>

        {error && (
          <div className="admin-permissions-state admin-permissions-state--error">
            {error}
          </div>
        )}

        <div className="admin-permissions-layout">
          {/* User selector */}
          <aside className="admin-permissions-users">
            <h2>{t("adminPermissions.selectUser")}</h2>

            <input
              type="search"
              value={userSearch}
              placeholder={t("adminPermissions.searchUser")}
              onChange={(event) => setUserSearch(event.target.value)}
            />

            <div className="admin-permissions-user-list">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  className={[
                    "admin-permissions-user",

                    selectedUserId === user.id
                      ? "admin-permissions-user--active"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => setSelectedUserId(user.id)}
                >
                  <div className="admin-permissions-user__avatar">
                    {user.full_name?.[0]?.toUpperCase() ?? "U"}
                  </div>

                  <div className="admin-permissions-user__info">
                    <strong>{user.full_name}</strong>

                    <span>{user.email}</span>
                  </div>

                  {!user.is_active && (
                    <span className="admin-permissions-user__inactive">
                      {t("adminUsers.inactive")}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </aside>

          {/* Permissions */}
          <div className="admin-permissions-content">
            {!selectedUser && (
              <div className="admin-permissions-empty">
                <h3>{t("adminPermissions.selectUser")}</h3>

                <p>{t("adminPermissions.noUserSelected")}</p>
              </div>
            )}

            {selectedUser && (
              <>
                <div className="admin-permissions-user-header">
                  <div>
                    <h2>{selectedUser.full_name}</h2>

                    <p>{selectedUser.email}</p>
                  </div>

                  <span
                    className={[
                      "admin-permissions-user-status",

                      selectedUser.is_active
                        ? "admin-permissions-user-status--active"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {selectedUser.is_active
                      ? t("adminUsers.active")
                      : t("adminUsers.inactive")}
                  </span>
                </div>

                {selectedUser.role === "admin" && (
                  <div className="admin-permissions-notice">
                    {t("adminPermissions.adminNotice")}
                  </div>
                )}

                {!selectedUser.is_active && (
                  <div className="admin-permissions-warning">
                    {t("adminPermissions.inactiveUser")}
                  </div>
                )}

                {permissionsLoading ? (
                  <div className="admin-permissions-state">
                    {t("adminPermissions.loading")}
                  </div>
                ) : categories.length === 0 ? (
                  <div className="admin-permissions-state">
                    {t("adminPermissions.noCategories")}
                  </div>
                ) : (
                  <div className="admin-permissions-table-wrapper">
                    <table className="admin-permissions-table">
                      <thead>
                        <tr>
                          <th>{t("adminPermissions.category")}</th>

                          <th>{t("adminPermissions.view")}</th>

                          <th>{t("adminPermissions.download")}</th>

                          <th>{t("adminPermissions.access")}</th>
                        </tr>
                      </thead>

                      <tbody>
                        {categories.map((category) => {
                          const permission = permissionMap.get(category.id);

                          const canView =
                            selectedUser.role === "admin"
                              ? true
                              : (permission?.can_view ?? false);

                          const canDownload =
                            selectedUser.role === "admin"
                              ? true
                              : (permission?.can_download ?? false);

                          const saving = savingCategoryId === category.id;

                          return (
                            <tr key={category.id}>
                              <td>
                                <div className="admin-permissions-category">
                                  <strong>{category.name}</strong>

                                  {category.description && (
                                    <span>{category.description}</span>
                                  )}
                                </div>
                              </td>

                              <td>
                                <label className="permission-switch">
                                  <input
                                    type="checkbox"
                                    checked={canView}
                                    disabled={
                                      saving || selectedUser.role === "admin"
                                    }
                                    onChange={(event) =>
                                      handleViewChange(
                                        category.id,
                                        event.target.checked,
                                      )
                                    }
                                  />

                                  <span className="permission-switch__track" />
                                </label>
                              </td>

                              <td>
                                <label className="permission-switch">
                                  <input
                                    type="checkbox"
                                    checked={canDownload}
                                    disabled={
                                      saving || selectedUser.role === "admin"
                                    }
                                    onChange={(event) =>
                                      handleDownloadChange(
                                        category.id,
                                        event.target.checked,
                                      )
                                    }
                                  />

                                  <span className="permission-switch__track" />
                                </label>
                              </td>

                              <td>
                                <span
                                  className={[
                                    "admin-permissions-access",

                                    canDownload
                                      ? "admin-permissions-access--full"
                                      : canView
                                        ? "admin-permissions-access--view"
                                        : "",
                                  ]
                                    .filter(Boolean)
                                    .join(" ")}
                                >
                                  {selectedUser.role === "admin"
                                    ? t("adminPermissions.viewDownload")
                                    : getAccessLabel(permission)}
                                </span>

                                {saving && (
                                  <small className="admin-permissions-saving">
                                    {t("adminPermissions.saving")}
                                  </small>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
