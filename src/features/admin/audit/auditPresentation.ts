export function normalizeAuditAction(
  action: string,
) {
  return action
    .trim()
    .toLowerCase()
    .replace(/[-\s]+/g, "_");
}


export function auditTranslationKey(
  action: string,
): string | null {
  const normalized =
    normalizeAuditAction(
      action,
    );


  const map:
    Record<
      string,
      string
    > = {
      login_success:
        "auditActions.loginSuccess",

      login_failed:
        "auditActions.loginFailed",

      logout:
        "auditActions.logout",

      otp_sent:
        "auditActions.otpSent",

      otp_verified:
        "auditActions.otpVerified",

      otp_failed:
        "auditActions.otpFailed",

      user_created:
        "auditActions.userCreated",

      user_updated:
        "auditActions.userUpdated",

      user_activated:
        "auditActions.userActivated",

      user_deactivated:
        "auditActions.userDeactivated",

      user_deleted:
        "auditActions.userDeleted",

      password_reset:
        "auditActions.passwordReset",

      permission_granted:
        "auditActions.permissionGranted",

      permission_updated:
        "auditActions.permissionUpdated",

      permission_revoked:
        "auditActions.permissionRevoked",

      drive_sync_started:
        "auditActions.driveSyncStarted",

      drive_sync_completed:
        "auditActions.driveSyncCompleted",

      drive_sync_failed:
        "auditActions.driveSyncFailed",

      document_view:
        "auditActions.documentView",

      document_download:
        "auditActions.documentDownload",

      document_access_denied:
        "auditActions.documentAccessDenied",
    };


  return (
    map[normalized] ??
    null
  );
}


export function auditActionClass(
  action: string,
) {
  const normalized =
    normalizeAuditAction(
      action,
    );


  if (
    normalized.includes(
      "failed",
    ) ||
    normalized.includes(
      "denied",
    ) ||
    normalized.includes(
      "deleted",
    )
  ) {
    return "audit-action--danger";
  }


  if (
    normalized.includes(
      "download",
    ) ||
    normalized.includes(
      "view",
    )
  ) {
    return "audit-action--info";
  }


  if (
    normalized.includes(
      "sync",
    )
  ) {
    return "audit-action--sync";
  }


  return "audit-action--success";
}