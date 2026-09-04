import { type FormEvent, useEffect, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { createAdminUser, updateAdminUser } from "../../../api/adminUsers";

import type { AdminUser } from "../../../api/adminUsers";

import { getAdminDepartments } from "../../../api/adminDepartments";

import type { AdminDepartment } from "../../../api/adminDepartments";

import "./AdminUserForm.css";

interface AdminUserFormProps {
  user?: AdminUser | null;

  onSuccess: () => void;

  onCancel: () => void;
}

export default function AdminUserForm({
  user,
  onSuccess,
  onCancel,
}: AdminUserFormProps) {
  const { t } = useTranslation();

  const isEditing = Boolean(user);

  const [fullName, setFullName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [role, setRole] = useState<"admin" | "user">("user");

  const [departmentId, setDepartmentId] = useState("");

  const [departments, setDepartments] = useState<AdminDepartment[]>([]);

  const [departmentsLoading, setDepartmentsLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFullName(user.full_name ?? "");

      setEmail(user.email ?? "");

      setRole(user.role);

      setDepartmentId(user.department_id ?? "");
    } else {
      setFullName("");
      setEmail("");
      setPassword("");
      setRole("user");
      setDepartmentId("");
    }

    setError("");
  }, [user]);

  useEffect(() => {
    const loadDepartments = async () => {
      setDepartmentsLoading(true);

      try {
        const result = await getAdminDepartments();

        setDepartments(result.items);
      } catch (error) {
        console.error("Unable to load departments:", error);
      } finally {
        setDepartmentsLoading(false);
      }
    };

    loadDepartments();
  }, []);

  const activeDepartments = useMemo(() => {
    return departments.filter(
      (department) => department.is_active || department.id === departmentId,
    );
  }, [departments, departmentId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!fullName.trim() || !email.trim()) {
      setError(t("adminUserForm.required"));

      return;
    }

    if (!email.includes("@")) {
      setError(t("adminUserForm.invalidEmail"));

      return;
    }

    if (!isEditing && password.length < 8) {
      setError(t("adminUserForm.passwordMinimum"));

      return;
    }

    setSaving(true);

    try {
      if (isEditing && user) {
        await updateAdminUser(user.id, {
          full_name: fullName.trim(),

          email: email.trim(),

          role,

          department_id: departmentId || null,
        });
      } else {
        await createAdminUser({
          full_name: fullName.trim(),

          email: email.trim(),

          password,

          role,

          department_id: departmentId || null,
        });
      }

      onSuccess();
    } catch (error) {
      console.error("User save error:", error);

      setError(
        isEditing
          ? t("adminUserForm.updateFailed")
          : t("adminUserForm.createFailed"),
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="admin-user-form" onSubmit={handleSubmit}>
      {/* Full name */}
      <div className="admin-user-form__field">
        <label>{t("adminUserForm.fullName")}</label>

        <input
          type="text"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
        />
      </div>

      {/* Email */}
      <div className="admin-user-form__field">
        <label>{t("adminUserForm.email")}</label>

        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      {/* Password only for create */}
      {!isEditing && (
        <div className="admin-user-form__field">
          <label>{t("adminUserForm.password")}</label>

          <input
            type="password"
            value={password}
            autoComplete="new-password"
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
      )}

      {/* Role */}
      <div className="admin-user-form__field">
        <label>{t("adminUserForm.role")}</label>

        <select
          value={role}
          onChange={(event) => setRole(event.target.value as "admin" | "user")}
        >
          <option value="user">{t("adminUsers.user")}</option>

          <option value="admin">{t("adminUsers.admin")}</option>
        </select>
      </div>

      {/* Department / Laboratory / Institute */}
      <div className="admin-user-form__field">
        <label>{t("adminUserForm.department")}</label>

        <select
          value={departmentId}
          disabled={departmentsLoading}
          onChange={(event) => setDepartmentId(event.target.value)}
        >
          <option value="">{t("adminUserForm.noDepartment")}</option>

          {activeDepartments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}

              {" — "}

              {department.type === "department"
                ? t("adminDepartments.department")
                : department.type === "laboratory"
                  ? t("adminDepartments.laboratory")
                  : t("adminDepartments.institute")}

              {department.code ? ` (${department.code})` : ""}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="admin-user-form__error">{error}</div>}

      <div className="admin-user-form__actions">
        <button
          type="button"
          className="admin-user-form__cancel"
          onClick={onCancel}
          disabled={saving}
        >
          {t("adminUserForm.cancel")}
        </button>

        <button
          type="submit"
          className="admin-user-form__submit"
          disabled={saving || departmentsLoading}
        >
          {saving
            ? "..."
            : isEditing
              ? t("adminUserForm.save")
              : t("adminUserForm.create")}
        </button>
      </div>
    </form>
  );
}
