import { useTranslation } from "react-i18next";

import "./AppLoadingScreen.css";

interface AppLoadingScreenProps {
  message?: string;
}

export default function AppLoadingScreen({ message }: AppLoadingScreenProps) {
  const { t } = useTranslation();

  return (
    <div className="app-loading" role="status" aria-live="polite">
      <div className="app-loading__card">
        <img src="/casa-logo.png" alt="CASA" className="app-loading__logo" />

        <div className="app-loading__brand">
          <strong>{t("brand.appName")}</strong>

          <span>{t("brand.organization")}</span>
        </div>

        <div className="app-loading__spinner" aria-hidden="true" />

        <p>{message ?? t("common.loading")}</p>
      </div>
    </div>
  );
}
