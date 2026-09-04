import { type FormEvent, useState } from "react";

import { useTranslation } from "react-i18next";

import { Navigate } from "react-router-dom";

import { ApiError } from "../api/client";

import { useAuth } from "../contexts/AuthContext";

import AuthLayout from "../components/layout/AuthLayout";

import Button from "../components/ui/Button";

import Input from "../components/ui/Input";

import "../features/auth/auth.css";

export default function LoginPage() {
  const { t } = useTranslation();

  const { user, login } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  if (user) {
    return <Navigate to="/library" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(email, password);

      window.location.href = "/library";
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          setError(t("auth.invalidCredentials"));
        } else if (error.status === 429) {
          setError(t("auth.accountLocked"));
        } else {
          setError(error.message || t("auth.loginFailed"));
        }
      } else {
        setError(t("auth.loginFailed"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <form className="auth-form" onSubmit={handleSubmit}>
        <header
          className="
            auth-form__header
          "
        >
          <div
            className="
              auth-form__eyebrow
            "
          >
            CASA Management System
          </div>

          <h2>{t("auth.welcomeBack")}</h2>

          <p>{t("auth.signInDescription")}</p>
        </header>

        <Input
          name="email"
          type="email"
          label={t("auth.email")}
          placeholder={t("auth.emailPlaceholder")}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />

        <Input
          name="password"
          type="password"
          label={t("auth.password")}
          placeholder={t("auth.passwordPlaceholder")}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="
            current-password
          "
          required
        />

        {error && (
          <div
            className="
              auth-form__error
            "
            role="alert"
          >
            {error}
          </div>
        )}

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? t("auth.signingIn") : t("auth.signIn")}
        </Button>
      </form>
    </AuthLayout>
  );
}
