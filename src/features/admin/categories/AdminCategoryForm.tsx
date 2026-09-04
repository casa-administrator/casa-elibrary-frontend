import { type FormEvent, useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import {
  createAdminCategory,
  updateAdminCategory,
} from "../../../api/adminCategories";

import type { AdminCategory } from "../../../api/adminCategories";

import "./AdminCategoryForm.css";

interface AdminCategoryFormProps {
  category?: AdminCategory | null;

  onSuccess: () => void;

  onCancel: () => void;
}

export default function AdminCategoryForm({
  category,
  onSuccess,
  onCancel,
}: AdminCategoryFormProps) {
  const { t } = useTranslation();

  const isEditing = Boolean(category);

  const [name, setName] = useState("");

  const [description, setDescription] = useState("");

  const [folderId, setFolderId] = useState("");

  const [order, setOrder] = useState("0");

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (category) {
      setName(category.name ?? "");

      setDescription(category.description ?? "");

      setFolderId(category.google_drive_folder_id ?? "");

      setOrder(String(category.order ?? 0));
    } else {
      setName("");
      setDescription("");
      setFolderId("");
      setOrder("0");
    }

    setError("");
  }, [category]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!name.trim() || !folderId.trim()) {
      setError(t("adminCategoryForm.required"));

      return;
    }

    const parsedOrder = Number(order);

    if (!Number.isInteger(parsedOrder) || parsedOrder < 0) {
      setError(t("adminCategoryForm.invalidOrder"));

      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: name.trim(),

        description: description.trim() ? description.trim() : null,

        order: parsedOrder,

        google_drive_folder_id: folderId.trim(),
      };

      if (isEditing && category) {
        await updateAdminCategory(category.id, payload);
      } else {
        await createAdminCategory(payload);
      }

      onSuccess();
    } catch (error) {
      console.error("Category save error:", error);

      setError(
        isEditing
          ? t("adminCategoryForm.updateFailed")
          : t("adminCategoryForm.createFailed"),
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="admin-category-form" onSubmit={handleSubmit}>
      <div className="admin-category-form__field">
        <label>{t("adminCategoryForm.name")}</label>

        <input
          type="text"
          value={name}
          placeholder={t("adminCategoryForm.namePlaceholder")}
          onChange={(event) => setName(event.target.value)}
        />
      </div>

      <div className="admin-category-form__field">
        <label>{t("adminCategoryForm.folderId")}</label>

        <input
          type="text"
          value={folderId}
          placeholder={t("adminCategoryForm.folderIdPlaceholder")}
          onChange={(event) => setFolderId(event.target.value)}
        />

        <small>Google Drive folder ID only, not the full URL.</small>
      </div>

      <div className="admin-category-form__field">
        <label>{t("adminCategoryForm.order")}</label>

        <input
          type="number"
          min="0"
          step="1"
          value={order}
          onChange={(event) => setOrder(event.target.value)}
        />
      </div>

      <div className="admin-category-form__field">
        <label>{t("adminCategoryForm.description")}</label>

        <textarea
          rows={4}
          value={description}
          placeholder={t("adminCategoryForm.descriptionPlaceholder")}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>

      {error && <div className="admin-category-form__error">{error}</div>}

      <div className="admin-category-form__actions">
        <button
          type="button"
          className="admin-category-form__cancel"
          onClick={onCancel}
          disabled={saving}
        >
          {t("adminCategoryForm.cancel")}
        </button>

        <button
          type="submit"
          className="admin-category-form__submit"
          disabled={saving}
        >
          {saving
            ? "..."
            : isEditing
              ? t("adminCategoryForm.save")
              : t("adminCategoryForm.create")}
        </button>
      </div>
    </form>
  );
}
