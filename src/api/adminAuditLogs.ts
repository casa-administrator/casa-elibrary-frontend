import {
  apiRequest,
} from "./client";


export interface AuditLog {
  id: string;

  action: string;

  actor_user_id?: string | null;
  actor_name?: string | null;
  actor_email?: string | null;

  target_type?: string | null;
  target_id?: string | null;
  target_name?: string | null;

  ip_address?: string | null;
  user_agent?: string | null;

  details?: Record<string, unknown> | null;

  created_at: string;
}


export interface AuditLogListResponse {
  items: AuditLog[];

  total: number;

  page: number;

  per_page: number;

  pages: number;
}


export interface GetAuditLogsOptions {
  search?: string;

  action?: string;

  userId?: string;

  page?: number;

  perPage?: number;
}


export function getAdminAuditLogs(
  options:
    GetAuditLogsOptions = {},
) {
  const params =
    new URLSearchParams();


  if (
    options.search
  ) {
    params.set(
      "search",
      options.search,
    );
  }


  if (
    options.action
  ) {
    params.set(
      "action",
      options.action,
    );
  }


  if (
    options.userId
  ) {
    params.set(
      "user_id",
      options.userId,
    );
  }


  params.set(
    "page",
    String(
      options.page ?? 1,
    ),
  );


  params.set(
    "per_page",
    String(
      options.perPage ?? 25,
    ),
  );


  return apiRequest<AuditLogListResponse>(
    `/admin/audit-logs?${params.toString()}`,
  );
}