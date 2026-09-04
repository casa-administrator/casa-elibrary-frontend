import { useEffect, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { Trash2 } from "lucide-react";

import {
  activateAdminDepartment,
  deactivateAdminDepartment,
  deleteAdminDepartment,
  getAdminDepartments,
} from "../../api/adminDepartments";

import type { AdminDepartment } from "../../api/adminDepartments";

import AppLayout from "../../components/layout/AppLayout";

import Modal from "../../components/ui/Modal";

import ConfirmDialog from "../../components/ui/ConfirmDialog";

import { useToast } from "../../contexts/ToastContext";

import AdminDepartmentForm from "../../features/admin/departments/AdminDepartmentForm";

import "./AdminDepartmentsPage.css";

export default function AdminDepartmentsPage() {
  const { t } = useTranslation();

  const { showToast } = useToast();

  const [departments, setDepartments] = useState<AdminDepartment[]>([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [createOpen, setCreateOpen] = useState(false);

  const [editingDepartment, setEditingDepartment] =
    useState<AdminDepartment | null>(null);

  const [statusDepartment, setStatusDepartment] =
    useState<AdminDepartment | null>(null);

  const [deleteDepartment, setDeleteDepartment] =
    useState<AdminDepartment | null>(null);

  const [actionDepartmentId, setActionDepartmentId] = useState<string | null>(
    null,
  );

  const [deleteDepartmentId, setDeleteDepartmentId] = useState<string | null>(
    null,
  );

  const loadDepartments = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getAdminDepartments();

      setDepartments(result.items);
    } catch (error) {
      console.error("Department load error:", error);

      const message = t("adminDepartments.loadFailed");

      setError(message);

      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const filteredDepartments = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return departments;
    }

    return departments.filter((department) => {
      const searchable = [
        department.name,
        department.code ?? "",
        department.type,
        department.description ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [departments, search]);

  const handleStatusChange = async () => {
    if (!statusDepartment) {
      return;
    }

    const department = statusDepartment;

    setActionDepartmentId(department.id);

    try {
      if (department.is_active) {
        await deactivateAdminDepartment(department.id);

        showToast(t("adminDepartments.deactivateSuccess"), "success");
      } else {
        await activateAdminDepartment(department.id);

        showToast(t("adminDepartments.activateSuccess"), "success");
      }

      setStatusDepartment(null);

      await loadDepartments();
    } catch (error) {
      console.error("Department status error:", error);

      showToast(t("adminDepartments.statusFailed"), "error");
    } finally {
      setActionDepartmentId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteDepartment) {
      return;
    }

    setDeleteDepartmentId(deleteDepartment.id);

    try {
      await deleteAdminDepartment(deleteDepartment.id);

      showToast(t("adminDepartments.deleteSuccess"), "success");

      setDeleteDepartment(null);

      await loadDepartments();
    } catch (error) {
      console.error("Department delete error:", error);

      showToast(t("adminDepartments.deleteFailed"), "error");
    } finally {
      setDeleteDepartmentId(null);
    }
  };

  return (
    <AppLayout>
      <section className="admin-departments-page">
        <header className="admin-departments-page__header">
          <div>
            <h1>{t("adminDepartments.title")}</h1>

            <p>{t("adminDepartments.subtitle")}</p>
          </div>

          <button
            type="button"
            className="admin-departments-page__add"
            onClick={() => setCreateOpen(true)}
          >
            + {t("adminDepartments.add")}
          </button>
        </header>

        <div className="admin-departments-toolbar">
          <input
            type="search"
            value={search}
            placeholder={t("adminDepartments.searchPlaceholder")}
            onChange={(event) => setSearch(event.target.value)}
          />

          <div className="admin-departments-toolbar__count">
            {filteredDepartments.length}
          </div>
        </div>

        {loading && (
          <div className="admin-departments-state">
            {t("adminDepartments.loading")}
          </div>
        )}

        {!loading && error && (
          <div className="admin-departments-state admin-departments-state--error">
            {error}
          </div>
        )}

        {!loading && !error && filteredDepartments.length === 0 && (
          <div className="admin-departments-state">
            {t("adminDepartments.noItems")}
          </div>
        )}

        {!loading && !error && filteredDepartments.length > 0 && (
          <div className="admin-departments-table-wrapper">
            <table className="admin-departments-table">
              <thead>
                <tr>
                  <th>{t("adminDepartments.name")}</th>

                  <th>{t("adminDepartments.code")}</th>

                  <th>{t("adminDepartments.type")}</th>

                  <th>{t("adminDepartments.description")}</th>

                  <th>{t("adminDepartments.status")}</th>

                  <th>{t("adminDepartments.actions")}</th>
                </tr>
              </thead>

              <tbody>
                {filteredDepartments.map((department) => (
                  <tr key={department.id}>
                    <td>
                      <strong className="admin-department-name">
                        {department.name}
                      </strong>
                    </td>

                    <td>{department.code ?? "—"}</td>

                    <td>
                      <span
                        className={[
                          "admin-department-type",

                          department.type === "laboratory"
                            ? "admin-department-type--laboratory"
                            : "",

                          department.type === "institute"
                            ? "admin-department-type--institute"
                            : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        {department.type === "laboratory"
                          ? t("adminDepartments.laboratory")
                          : department.type === "institute"
                            ? t("adminDepartments.institute")
                            : t("adminDepartments.department")}
                      </span>
                    </td>

                    <td>
                      <div className="admin-department-description">
                        {department.description ?? "—"}
                      </div>
                    </td>

                    <td>
                      <span
                        className={[
                          "admin-department-status",

                          department.is_active
                            ? "admin-department-status--active"
                            : "admin-department-status--inactive",
                        ].join(" ")}
                      >
                        <span className="admin-department-status__dot" />

                        {department.is_active
                          ? t("adminDepartments.active")
                          : t("adminDepartments.inactive")}
                      </span>
                    </td>

                    <td>
                      <div className="admin-department-actions">
                        <button
                          type="button"
                          className="admin-department-actions__edit"
                          onClick={() => setEditingDepartment(department)}
                        >
                          {t("adminDepartments.edit")}
                        </button>

                        <button
                          type="button"
                          disabled={actionDepartmentId === department.id}
                          className={
                            department.is_active
                              ? "admin-department-actions__danger"
                              : "admin-department-actions__activate"
                          }
                          onClick={() => setStatusDepartment(department)}
                        >
                          {department.is_active
                            ? t("adminDepartments.deactivate")
                            : t("adminDepartments.activate")}
                        </button>

                        <button
                          type="button"
                          className="admin-action admin-action--danger"
                          disabled={deleteDepartmentId === department.id}
                          onClick={() => setDeleteDepartment(department)}
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
          </div>
        )}

        <Modal
          open={createOpen}
          title={t("adminDepartmentForm.addTitle")}
          onClose={() => setCreateOpen(false)}
        >
          <AdminDepartmentForm
            onCancel={() => setCreateOpen(false)}
            onSuccess={async () => {
              setCreateOpen(false);

              await loadDepartments();
            }}
          />
        </Modal>

        <Modal
          open={editingDepartment !== null}
          title={t("adminDepartmentForm.editTitle")}
          onClose={() => setEditingDepartment(null)}
        >
          {editingDepartment && (
            <AdminDepartmentForm
              department={editingDepartment}
              onCancel={() => setEditingDepartment(null)}
              onSuccess={async () => {
                setEditingDepartment(null);

                await loadDepartments();
              }}
            />
          )}
        </Modal>

        <ConfirmDialog
          open={statusDepartment !== null}
          title={
            statusDepartment?.is_active
              ? t("adminDepartments.deactivate")
              : t("adminDepartments.activate")
          }
          message={
            statusDepartment?.is_active
              ? t("adminDepartments.deactivateConfirm")
              : t("adminDepartments.activateConfirm")
          }
          confirmLabel={
            statusDepartment?.is_active
              ? t("adminDepartments.deactivate")
              : t("adminDepartments.activate")
          }
          danger={statusDepartment?.is_active ?? false}
          loading={actionDepartmentId !== null}
          onCancel={() => setStatusDepartment(null)}
          onConfirm={handleStatusChange}
        />

        <ConfirmDialog
          open={deleteDepartment !== null}
          title={t("adminDepartments.delete")}
          message={t("adminDepartments.deleteConfirm")}
          confirmLabel={t("adminDepartments.delete")}
          danger
          loading={deleteDepartmentId !== null}
          onCancel={() => setDeleteDepartment(null)}
          onConfirm={handleDelete}
        />
      </section>
    </AppLayout>
  );
}
