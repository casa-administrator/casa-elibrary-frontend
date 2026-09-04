import { useTranslation } from "react-i18next";

import type { CurrentUser } from "../../api/auth";

import LanguageSwitcher from "../ui/LanguageSwitcher";

import "./Header.css";

interface HeaderProps {
  user: CurrentUser | null;

  onMenu: () => void;

  // onLogout: () => void;
}

export default function Header({ user, onMenu }: HeaderProps) {
  const { t } = useTranslation();

  const initials =
    user?.full_name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((item) => item[0]?.toUpperCase())
      .join("") || "U";

  return (
    <header className="app-header">
      <div className="app-header__left">
        <button
          type="button"
          className="app-header__menu"
          onClick={onMenu}
          aria-label="Open menu"
        >
          ☰
        </button>

        <div className="app-header__mobile-brand">
          <img src="/casa-logo.png" alt="CASA" />

          <strong>{t("brand.appName")}</strong>
        </div>
      </div>

      <div className="app-header__right">
        <LanguageSwitcher />

        <div className="app-header__profile">
          <div className="app-header__avatar">{initials}</div>

          <div className="app-header__user">
            <strong>{user?.full_name}</strong>

            <span>
              {user?.role === "admin"
                ? t("profile.administrator")
                : t("profile.user")}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
