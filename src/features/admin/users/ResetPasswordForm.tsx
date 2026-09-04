import { type FormEvent, useState } from "react";

import { useTranslation } from "react-i18next";

import { resetAdminUserPassword } from "../../../api/adminUsers";

import type { AdminUser } from "../../../api/adminUsers";

import "./AdminUserForm.css";

interface ResetPasswordFormProps {
  user: AdminUser;

  onSuccess: () => void;
  onCancel: () => void;
}

export default function ResetPasswordForm({
  user,
  onSuccess,
  onCancel,
}: ResetPasswordFormProps) {
  const { t } = useTranslation();

  const [password, setPassword] = useState("");

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (password.length < 8) {
      setError(t("adminUserForm.passwordMinimum"));

      return;
    }

    setSaving(true);

    try {
      await resetAdminUserPassword(user.id, {
        new_password: password,
      });

      onSuccess();
    } catch (error) {
      console.error("Password reset error:", error);

      setError(t("adminUserForm.resetFailed"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="admin-user-form" onSubmit={handleSubmit}>
      <p>{t("adminUserForm.resetPasswordDescription")}</p>

      <div className="admin-user-form__field">
        <label>{t("adminUserForm.newPassword")}</label>

        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
        />
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
          disabled={saving}
        >
          {saving ? "..." : t("adminUserForm.reset")}
        </button>
      </div>
    </form>
  );
}
