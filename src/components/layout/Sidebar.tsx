import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { CurrentUser } from "../../api/auth";
import "./Sidebar.css";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  FileStack,
  History,
  KeyRound,
  Users,
  X,
} from "lucide-react";

interface SidebarProps {
  user: CurrentUser | null;
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function Sidebar({
  user,
  open,
  onClose,
  onLogout,
}: SidebarProps) {
  const { t } = useTranslation();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "sidebar__link sidebar__link--active" : "sidebar__link";

  return (
    <>
      <aside
        className={["sidebar", open ? "sidebar--open" : ""]
          .filter(Boolean)
          .join(" ")}
      >
        {/* Brand */}
        <div className="sidebar__brand">
          <img src="/casa-logo.png" alt="CASA" className="sidebar__logo" />

          <div className="sidebar__brand-text">
            <strong>{t("brand.appName")}</strong>

            <span>{t("brand.organizationShort")}</span>
          </div>

          <button
            type="button"
            className="sidebar__close"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Main navigation */}
        <nav className="sidebar__nav">
          <div className="sidebar__section">
            <NavLink
              to="/library"
              end
              className={navLinkClass}
              onClick={onClose}
            >
              <BookOpen size={18} strokeWidth={1.8} />

              <span>{t("navigation.library")}</span>
            </NavLink>
          </div>

          {/* Admin navigation */}
          {user?.role === "admin" && (
            <div className="sidebar__section">
              <div className="sidebar__section-title">
                {t("navigation.administration")}
              </div>

              <NavLink
                to="/admin/users"
                className={navLinkClass}
                onClick={onClose}
              >
                <Users size={18} strokeWidth={1.8} />

                <span>{t("navigation.users")}</span>
              </NavLink>

              <NavLink
                to="/admin/departments"
                className={navLinkClass}
                onClick={onClose}
              >
                <Building2 size={18} strokeWidth={1.8} />

                <span>{t("navigation.departments")}</span>
              </NavLink>

              <NavLink
                to="/admin/categories"
                className={navLinkClass}
                onClick={onClose}
              >
                <FileStack size={18} strokeWidth={1.8} />

                <span>{t("navigation.categories")}</span>
              </NavLink>

              <NavLink
                to="/admin/permissions"
                className={navLinkClass}
                onClick={onClose}
              >
                <KeyRound size={18} strokeWidth={1.8} />

                <span>{t("navigation.permissions")}</span>
              </NavLink>

              <NavLink
                to="/admin/audit-logs"
                className={navLinkClass}
                onClick={onClose}
              >
                <History size={18} strokeWidth={1.8} />

                <span>{t("navigation.auditLogs")}</span>
              </NavLink>
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="sidebar__footer">
          {user && (
            <div className="sidebar__user">
              <div className="sidebar__user-avatar">
                {user.full_name?.[0]?.toUpperCase() ?? "U"}
              </div>

              <div className="sidebar__user-info">
                <strong title={user.full_name}>{user.full_name}</strong>

                <span title={user.email}>{user.email}</span>
              </div>
            </div>
          )}

          <button type="button" className="sidebar__logout" onClick={onLogout}>
            <ArrowLeft size={18} strokeWidth={1.8} />
          </button>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {open && (
        <button
          type="button"
          className="sidebar__backdrop"
          onClick={onClose}
          aria-label="Close menu"
        />
      )}
    </>
  );
}
