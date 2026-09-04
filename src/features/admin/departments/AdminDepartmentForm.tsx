import { type FormEvent, useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import {
  createAdminDepartment,
  updateAdminDepartment,
} from "../../../api/adminDepartments";

import type {
  AdminDepartment,
  DepartmentType,
} from "../../../api/adminDepartments";

import "./AdminDepartmentForm.css";

interface AdminDepartmentFormProps {
  department?: AdminDepartment | null;

  onSuccess: () => void;

  onCancel: () => void;
}

export default function AdminDepartmentForm({
  department,
  onSuccess,
  onCancel,
}: AdminDepartmentFormProps) {
  const { t } = useTranslation();

  const isEditing = Boolean(department);

  const [name, setName] = useState("");

  const [code, setCode] = useState("");

  const [type, setType] = useState<DepartmentType>("department");

  const [description, setDescription] = useState("");

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (department) {
      setName(department.name ?? "");

      setCode(department.code ?? "");

      setType(department.type);

      setDescription(department.description ?? "");
    } else {
      setName("");
      setCode("");
      setType("department");
      setDescription("");
    }

    setError("");
  }, [department]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError(t("adminDepartmentForm.required"));

      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: name.trim(),

        code: code.trim() ? code.trim().toUpperCase() : null,

        type,

        description: description.trim() ? description.trim() : null,
      };

      if (isEditing && department) {
        await updateAdminDepartment(department.id, payload);
      } else {
        await createAdminDepartment(payload);
      }

      onSuccess();
    } catch (error) {
      console.error("Department save error:", error);

      setError(
        isEditing
          ? t("adminDepartmentForm.updateFailed")
          : t("adminDepartmentForm.createFailed"),
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="admin-department-form" onSubmit={handleSubmit}>
      <div className="admin-department-form__field">
        <label>{t("adminDepartmentForm.name")}</label>

        <input
          type="text"
          value={name}
          placeholder={t("adminDepartmentForm.namePlaceholder")}
          onChange={(event) => setName(event.target.value)}
        />
      </div>

      <div className="admin-department-form__row">
        <div className="admin-department-form__field">
          <label>{t("adminDepartmentForm.code")}</label>

          <input
            type="text"
            value={code}
            placeholder={t("adminDepartmentForm.codePlaceholder")}
            onChange={(event) => setCode(event.target.value)}
          />
        </div>

        <div className="admin-department-form__field">
          <label>{t("adminDepartmentForm.type")}</label>

          <select
            value={type}
            onChange={(event) => setType(event.target.value as DepartmentType)}
          >
            <option value="department">
              {t("adminDepartmentForm.department")}
            </option>

            <option value="laboratory">
              {t("adminDepartmentForm.laboratory")}
            </option>

            <option value="institute">
              {t("adminDepartmentForm.institute")}
            </option>
          </select>
        </div>
      </div>

      <div className="admin-department-form__field">
        <label>{t("adminDepartmentForm.description")}</label>

        <textarea
          value={description}
          rows={4}
          placeholder={t("adminDepartmentForm.descriptionPlaceholder")}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>

      {error && <div className="admin-department-form__error">{error}</div>}

      <div className="admin-department-form__actions">
        <button
          type="button"
          className="admin-department-form__cancel"
          disabled={saving}
          onClick={onCancel}
        >
          {t("adminDepartmentForm.cancel")}
        </button>

        <button
          type="submit"
          className="admin-department-form__submit"
          disabled={saving}
        >
          {saving
            ? "..."
            : isEditing
              ? t("adminDepartmentForm.save")
              : t("adminDepartmentForm.create")}
        </button>
      </div>
    </form>
  );
}
