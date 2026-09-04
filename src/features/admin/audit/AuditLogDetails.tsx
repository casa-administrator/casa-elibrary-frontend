import { useTranslation } from "react-i18next";

import type { AuditLog } from "../../../api/adminAuditLogs";

interface AuditLogDetailsProps {
  log: AuditLog;
}

export default function AuditLogDetails({ log }: AuditLogDetailsProps) {
  const { t } = useTranslation();

  const details = log.details ?? {};

  return (
    <div className="audit-details">
      <div className="audit-details__row">
        <strong>{t("auditLogs.action")}</strong>

        <span>{log.action}</span>
      </div>

      <div className="audit-details__row">
        <strong>{t("auditLogs.user")}</strong>

        <span>
          {log.actor_name ?? log.actor_email ?? t("auditLogs.system")}
        </span>
      </div>

      <div className="audit-details__row">
        <strong>{t("auditLogs.targetType")}</strong>

        <span>{log.target_type ?? "—"}</span>
      </div>

      <div className="audit-details__row">
        <strong>{t("auditLogs.targetId")}</strong>

        <span>{log.target_id ?? "—"}</span>
      </div>

      <div className="audit-details__row">
        <strong>{t("auditLogs.ipAddress")}</strong>

        <span>{log.ip_address ?? "—"}</span>
      </div>

      <div className="audit-details__row">
        <strong>{t("auditLogs.userAgent")}</strong>

        <span>{log.user_agent ?? "—"}</span>
      </div>

      <div className="audit-details__metadata">
        <strong>{t("auditLogs.metadata")}</strong>

        <pre>{JSON.stringify(details, null, 2)}</pre>
      </div>
    </div>
  );
}
