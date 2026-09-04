import { useTranslation } from "react-i18next";

import { useNavigate } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";

export default function AccessDeniedPage() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  return (
    <AppLayout>
      <div
        style={{
          maxWidth: "560px",
          margin: "60px auto",
          padding: "32px",
          textAlign: "center",
        }}
      >
        <h1>{t("errors.accessDenied")}</h1>

        <p>{t("errors.accessDeniedDescription")}</p>

        <button type="button" onClick={() => navigate("/library")}>
          {t("errors.backToLibrary")}
        </button>
      </div>
    </AppLayout>
  );
}
