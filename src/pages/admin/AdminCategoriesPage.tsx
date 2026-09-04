import { useEffect, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import {
  activateAdminCategory,
  deactivateAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  syncAdminCategory,
} from "../../api/adminCategories";

import type { AdminCategory } from "../../api/adminCategories";

import AppLayout from "../../components/layout/AppLayout";

import Modal from "../../components/ui/Modal";

import ConfirmDialog from "../../components/ui/ConfirmDialog";

import { useToast } from "../../contexts/ToastContext";

import AdminCategoryForm from "../../features/admin/categories/AdminCategoryForm";

import { Trash2 } from "lucide-react";

import "./AdminCategoriesPage.css";

export default function AdminCategoriesPage() {
  const { t, i18n } = useTranslation();

  const { showToast } = useToast();

  const [categories, setCategories] = useState<AdminCategory[]>([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [deleteCategory, setDeleteCategory] = useState<AdminCategory | null>(
    null,
  );

  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);

  /*
   * Create / Edit modal state
   */
  const [createOpen, setCreateOpen] = useState(false);

  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(
    null,
  );

  /*
   * Activate / Deactivate state
   */
  const [statusCategory, setStatusCategory] = useState<AdminCategory | null>(
    null,
  );

  const [actionCategoryId, setActionCategoryId] = useState<string | null>(null);

  /*
   * Google Drive Sync state
   */
  const [syncCategory, setSyncCategory] = useState<AdminCategory | null>(null);

  const [syncCategoryId, setSyncCategoryId] = useState<string | null>(null);

  /*
   * Load categories
   */
  const loadCategories = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getAdminCategories();

      setCategories(result.items);
    } catch (error) {
      console.error("Category load error:", error);

      const message = t("adminCategories.loadFailed");

      setError(message);

      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  /*
   * Category search
   */
  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return categories;
    }

    return categories.filter((category) =>
      [
        category.name,

        category.description ?? "",

        category.google_drive_folder_id,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [categories, search]);

  /*
   * Activate / Deactivate
   *
   * Confirmation is now handled by ConfirmDialog.
   */
  const handleStatusChange = async () => {
    if (!statusCategory) {
      return;
    }

    const category = statusCategory;

    setActionCategoryId(category.id);

    try {
      if (category.is_active) {
        await deactivateAdminCategory(category.id);

        showToast(t("adminCategories.deactivateSuccess"), "success");
      } else {
        await activateAdminCategory(category.id);

        showToast(t("adminCategories.activateSuccess"), "success");
      }

      setStatusCategory(null);

      await loadCategories();
    } catch (error) {
      console.error("Category status update error:", error);

      showToast(t("adminCategories.statusFailed"), "error");
    } finally {
      setActionCategoryId(null);
    }
  };

  /*
   * Google Drive Sync
   *
   * Confirmation is now handled by ConfirmDialog.
   */
  const handleSync = async () => {
    if (!syncCategory) {
      return;
    }

    const category = syncCategory;

    setSyncCategoryId(category.id);

    try {
      await syncAdminCategory(category.id);

      showToast(t("adminCategories.syncSuccess"), "success");

      setSyncCategory(null);

      await loadCategories();
    } catch (error) {
      console.error("Category sync error:", error);

      showToast(t("adminCategories.syncFailed"), "error");
    } finally {
      setSyncCategoryId(null);
    }
  };

  /*
   * Last sync date
   */
  const formatSyncDate = (value: string | null | undefined) => {
    if (!value) {
      return t("adminCategories.neverSynced");
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return t("adminCategories.neverSynced");
    }

    return new Intl.DateTimeFormat(
      i18n.resolvedLanguage === "km" ? "km-KH" : "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },
    ).format(date);
  };

  const handleDelete = async () => {
    if (!deleteCategory) {
      return;
    }

    setDeleteCategoryId(deleteCategory.id);

    try {
      await deleteAdminCategory(deleteCategory.id);

      showToast(t("adminCategories.deleteSuccess"), "success");

      setDeleteCategory(null);

      await loadCategories();
    } catch (error) {
      console.error("Category delete error:", error);

      showToast(t("adminCategories.deleteFailed"), "error");
    } finally {
      setDeleteCategoryId(null);
    }
  };

  return (
    <AppLayout>
      <section className="admin-categories-page">
        {/* =================================================
            PAGE HEADER
           ================================================= */}
        <header className="admin-categories-page__header">
          <div>
            <h1>{t("adminCategories.title")}</h1>

            <p>{t("adminCategories.subtitle")}</p>
          </div>

          <button
            type="button"
            className="admin-categories-page__add"
            onClick={() => setCreateOpen(true)}
          >
            + {t("adminCategories.add")}
          </button>
        </header>

        {/* =================================================
            SEARCH
           ================================================= */}
        <div className="admin-categories-toolbar">
          <input
            type="search"
            value={search}
            placeholder={t("adminCategories.searchPlaceholder")}
            onChange={(event) => setSearch(event.target.value)}
          />

          <div className="admin-categories-toolbar__count">
            {filteredCategories.length}
          </div>
        </div>

        {/* =================================================
            LOADING
           ================================================= */}
        {loading && (
          <div className="admin-categories-state">
            {t("adminCategories.loading")}
          </div>
        )}

        {/* =================================================
            ERROR
           ================================================= */}
        {!loading && error && (
          <div className="admin-categories-state admin-categories-state--error">
            {error}
          </div>
        )}

        {/* =================================================
            EMPTY
           ================================================= */}
        {!loading && !error && filteredCategories.length === 0 && (
          <div className="admin-categories-state">
            {t("adminCategories.noItems")}
          </div>
        )}

        {/* =================================================
            CATEGORY TABLE
           ================================================= */}
        {!loading && !error && filteredCategories.length > 0 && (
          <div className="admin-categories-table-wrapper">
            <table className="admin-categories-table">
              <thead>
                <tr>
                  <th>{t("adminCategories.name")}</th>

                  <th>{t("adminCategories.order")}</th>

                  <th>{t("adminCategories.documents")}</th>

                  <th>{t("adminCategories.syncStatus")}</th>

                  <th>{t("adminCategories.status")}</th>

                  <th>{t("adminCategories.actions")}</th>
                </tr>
              </thead>

              <tbody>
                {filteredCategories.map((category) => (
                  <tr key={category.id}>
                    {/* Category */}
                    <td>
                      <div className="admin-category-info">
                        <strong>{category.name}</strong>

                        <span>{category.description ?? "—"}</span>

                        <code>{category.google_drive_folder_id}</code>
                      </div>
                    </td>

                    {/* Order */}
                    <td>{category.order}</td>

                    {/* Documents */}
                    <td>
                      <span className="admin-category-count">
                        {category.document_count ?? 0}
                      </span>
                    </td>

                    {/* Drive Sync */}
                    <td>
                      <div className="admin-category-sync-status">
                        <span className="admin-category-sync-status__connected">
                          {t("adminCategories.connected")}
                        </span>

                        <small>{formatSyncDate(category.last_synced_at)}</small>
                      </div>
                    </td>

                    {/* Status */}
                    <td>
                      <span
                        className={[
                          "admin-category-status",

                          category.is_active
                            ? "admin-category-status--active"
                            : "admin-category-status--inactive",
                        ].join(" ")}
                      >
                        <span className="admin-category-status__dot" />

                        {category.is_active
                          ? t("adminCategories.active")
                          : t("adminCategories.inactive")}
                      </span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="admin-category-actions">
                        {/* Edit */}
                        <button
                          type="button"
                          className="admin-category-actions__edit"
                          onClick={() => setEditingCategory(category)}
                        >
                          {t("adminCategories.edit")}
                        </button>

                        {/* Sync */}
                        <button
                          type="button"
                          className="admin-category-actions__sync"
                          disabled={syncCategoryId === category.id}
                          onClick={() => setSyncCategory(category)}
                        >
                          {syncCategoryId === category.id
                            ? t("adminCategories.syncing")
                            : t("adminCategories.sync")}
                        </button>

                        {/* Activate / Deactivate */}
                        <button
                          type="button"
                          disabled={actionCategoryId === category.id}
                          className={
                            category.is_active
                              ? "admin-category-actions__danger"
                              : "admin-category-actions__activate"
                          }
                          onClick={() => setStatusCategory(category)}
                        >
                          {category.is_active
                            ? t("adminCategories.deactivate")
                            : t("adminCategories.activate")}
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          className="admin-action admin-action--danger"
                          disabled={deleteCategoryId === category.id}
                          onClick={() => setDeleteCategory(category)}
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
              open={deleteCategory !== null}
              title={t("adminCategories.delete")}
              message={t("adminCategories.deleteConfirm")}
              confirmLabel={t("adminCategories.delete")}
              danger
              loading={deleteCategoryId !== null}
              onCancel={() => setDeleteCategory(null)}
              onConfirm={handleDelete}
            />
          </div>
        )}

        {/* =================================================
            CREATE CATEGORY MODAL
           ================================================= */}
        <Modal
          open={createOpen}
          title={t("adminCategoryForm.addTitle")}
          onClose={() => setCreateOpen(false)}
        >
          <AdminCategoryForm
            onCancel={() => setCreateOpen(false)}
            onSuccess={async () => {
              setCreateOpen(false);

              showToast(t("adminCategories.createSuccess"), "success");

              await loadCategories();
            }}
          />
        </Modal>

        {/* =================================================
            EDIT CATEGORY MODAL
           ================================================= */}
        <Modal
          open={editingCategory !== null}
          title={t("adminCategoryForm.editTitle")}
          onClose={() => setEditingCategory(null)}
        >
          {editingCategory && (
            <AdminCategoryForm
              category={editingCategory}
              onCancel={() => setEditingCategory(null)}
              onSuccess={async () => {
                setEditingCategory(null);

                showToast(t("adminCategories.updateSuccess"), "success");

                await loadCategories();
              }}
            />
          )}
        </Modal>

        {/* =================================================
            ACTIVATE / DEACTIVATE CONFIRMATION
           ================================================= */}
        <ConfirmDialog
          open={statusCategory !== null}
          title={
            statusCategory?.is_active
              ? t("adminCategories.deactivate")
              : t("adminCategories.activate")
          }
          message={
            statusCategory?.is_active
              ? t("adminCategories.deactivateConfirm")
              : t("adminCategories.activateConfirm")
          }
          confirmLabel={
            statusCategory?.is_active
              ? t("adminCategories.deactivate")
              : t("adminCategories.activate")
          }
          danger={statusCategory?.is_active ?? false}
          loading={actionCategoryId !== null}
          onCancel={() => setStatusCategory(null)}
          onConfirm={handleStatusChange}
        />

        {/* =================================================
            GOOGLE DRIVE SYNC CONFIRMATION
           ================================================= */}
        <ConfirmDialog
          open={syncCategory !== null}
          title={t("adminCategories.sync")}
          message={t("adminCategories.syncConfirm")}
          confirmLabel={t("adminCategories.sync")}
          loading={syncCategoryId !== null}
          onCancel={() => setSyncCategory(null)}
          onConfirm={handleSync}
        />
      </section>
    </AppLayout>
  );
}
