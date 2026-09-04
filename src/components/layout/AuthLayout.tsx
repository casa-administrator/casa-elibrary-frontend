import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import LanguageSwitcher from "../ui/LanguageSwitcher";

import "./AuthLayout.css";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { t } = useTranslation();

  return (
    <main className="auth-layout">
      <section className="auth-layout__brand-panel">
        <div className="auth-layout__brand">
          <img src="/casa-logo.png" alt="CASA" className="auth-layout__logo" />

          <div>
            <h1>{t("brand.appName")}</h1>

            <p>{t("brand.organization")}</p>
          </div>
        </div>

        <div className="auth-layout__decoration" aria-hidden="true" />
      </section>

      <section className="auth-layout__content">
        <div className="auth-layout__language">
          <LanguageSwitcher />
        </div>

        <div className="auth-layout__card">{children}</div>

        {/* <footer className="auth-layout__footer">© 2026 CASA</footer> */}
        <footer className="auth-layout__footer">{t("footer.copyright")}</footer>
      </section>
    </main>
  );
}
