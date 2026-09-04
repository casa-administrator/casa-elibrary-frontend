import { type FormEvent, useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { getAdminAuditLogs } from "../../api/adminAuditLogs";

import type { AuditLog, AuditLogListResponse } from "../../api/adminAuditLogs";

import AppLayout from "../../components/layout/AppLayout";

import Modal from "../../components/ui/Modal";

import AuditLogDetails from "../../features/admin/audit/AuditLogDetails";

import {
  auditActionClass,
  auditTranslationKey,
} from "../../features/admin/audit/auditPresentation";

import "./AdminAuditLogsPage.css";

const ACTION_OPTIONS = [
  "login_success",
  "login_failed",
  "logout",

  "otp_sent",
  "otp_verified",
  "otp_failed",

  "user_created",
  "user_updated",
  "user_activated",
  "user_deactivated",
  "user_deleted",

  "password_reset",

  "permission_granted",
  "permission_updated",
  "permission_revoked",

  "drive_sync_started",
  "drive_sync_completed",
  "drive_sync_failed",

  "document_view",
  "document_download",
  "document_access_denied",
];

export default function AdminAuditLogsPage() {
  const { t, i18n } = useTranslation();

  const [data, setData] = useState<AuditLogListResponse | null>(null);

  const [searchInput, setSearchInput] = useState("");

  const [search, setSearch] = useState("");

  const [action, setAction] = useState("");

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  useEffect(() => {
    const loadLogs = async () => {
      setLoading(true);

      setError("");

      try {
        const result = await getAdminAuditLogs({
          search,

          action,

          page,

          perPage: 25,
        });

        setData(result);
      } catch (error) {
        console.error("Audit log load error:", error);

        setError(t("auditLogs.loadFailed"));
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, [search, action, page]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setPage(1);

    setSearch(searchInput.trim());
  };

  const formatDate = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat(
      i18n.resolvedLanguage === "km" ? "km-KH" : "en-US",
      {
        year: "numeric",

        month: "short",

        day: "numeric",

        hour: "2-digit",

        minute: "2-digit",

        second: "2-digit",
      },
    ).format(date);
  };

  const getActionLabel = (value: string) => {
    const key = auditTranslationKey(value);

    return key ? t(key) : value;
  };

  return (
    <AppLayout>
      <section className="audit-page">
        <header className="audit-page__header">
          <div>
            <h1>{t("auditLogs.title")}</h1>

            <p>{t("auditLogs.subtitle")}</p>
          </div>
        </header>

        <div className="audit-toolbar">
          <form className="audit-toolbar__search" onSubmit={handleSearch}>
            <input
              type="search"
              value={searchInput}
              placeholder={t("auditLogs.searchPlaceholder")}
              onChange={(event) => setSearchInput(event.target.value)}
            />

            <button type="submit">{t("common.search")}</button>
          </form>

          <select
            value={action}
            onChange={(event) => {
              setAction(event.target.value);

              setPage(1);
            }}
          >
            <option value="">{t("auditLogs.allActions")}</option>

            {ACTION_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {getActionLabel(value)}
              </option>
            ))}
          </select>
        </div>

        {loading && <div className="audit-state">{t("auditLogs.loading")}</div>}

        {!loading && error && (
          <div className="audit-state audit-state--error">{error}</div>
        )}

        {!loading && !error && data && data.items.length === 0 && (
          <div className="audit-state">{t("auditLogs.noItems")}</div>
        )}

        {!loading && !error && data && data.items.length > 0 && (
          <>
            <div className="audit-table-wrapper">
              <table className="audit-table">
                <thead>
                  <tr>
                    <th>{t("auditLogs.action")}</th>

                    <th>{t("auditLogs.user")}</th>

                    <th>{t("auditLogs.target")}</th>

                    <th>{t("auditLogs.ipAddress")}</th>

                    <th>{t("auditLogs.dateTime")}</th>

                    <th>{t("auditLogs.details")}</th>
                  </tr>
                </thead>

                <tbody>
                  {data.items.map((log) => (
                    <tr key={log.id}>
                      <td>
                        <span
                          className={[
                            "audit-action",
                            auditActionClass(log.action),
                          ].join(" ")}
                        >
                          {getActionLabel(log.action)}
                        </span>
                      </td>

                      <td>
                        <div className="audit-user">
                          <strong>
                            {log.actor_name ?? t("auditLogs.system")}
                          </strong>

                          {log.actor_email && <span>{log.actor_email}</span>}
                        </div>
                      </td>

                      <td>
                        <div className="audit-target">
                          <strong>
                            {log.target_name ?? log.target_type ?? "—"}
                          </strong>

                          {log.target_id && <span>{log.target_id}</span>}
                        </div>
                      </td>

                      <td>{log.ip_address ?? "—"}</td>

                      <td>{formatDate(log.created_at)}</td>

                      <td>
                        <button
                          type="button"
                          className="audit-details-button"
                          onClick={() => setSelectedLog(log)}
                        >
                          {t("auditLogs.viewDetails")}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="audit-pagination">
              <button
                type="button"
                disabled={data.page <= 1}
                onClick={() => setPage((current) => current - 1)}
              >
                {t("auditLogs.previous")}
              </button>

              <span>
                {t("auditLogs.page")} {data.page} {t("auditLogs.of")}{" "}
                {Math.max(data.pages, 1)}
              </span>

              <button
                type="button"
                disabled={data.page >= data.pages}
                onClick={() => setPage((current) => current + 1)}
              >
                {t("auditLogs.next")}
              </button>
            </div>
          </>
        )}

        <Modal
          open={selectedLog !== null}
          title={t("auditLogs.details")}
          onClose={() => setSelectedLog(null)}
        >
          {selectedLog && <AuditLogDetails log={selectedLog} />}
        </Modal>
      </section>
    </AppLayout>
  );
}
