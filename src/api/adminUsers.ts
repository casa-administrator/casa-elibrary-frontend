import {
  apiRequest,
} from "./client";


export interface AdminUser {
  id: string;

  full_name: string;

  email: string;

  role:
    | "admin"
    | "user";

  is_active: boolean;

  department_id?:
    | string
    | null;

  department_name?:
    | string
    | null;

  department_type?:
    | string
    | null;

  created_at?:
    | string
    | null;

  updated_at?:
    | string
    | null;
}


export interface AdminUserListResponse {
  items: AdminUser[];

  total: number;

  page?: number;

  per_page?: number;

  pages?: number;
}


export function getAdminUsers() {
  return apiRequest<AdminUserListResponse>(
    "/admin/users",
  );
}


export function activateUser(
  userId: string,
) {
  return apiRequest<AdminUser>(
    `/admin/users/${userId}/activate`,
    {
      method: "POST",
    },
  );
}


export function deactivateUser(
  userId: string,
) {
  return apiRequest<AdminUser>(
    `/admin/users/${userId}/deactivate`,
    {
      method: "POST",
    },
  );
}

export interface CreateAdminUserPayload {
  full_name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  department_id?: string | null;
}

export interface UpdateAdminUserPayload {
  full_name?: string;
  email?: string;
  role?: "admin" | "user";
  department_id?: string | null;
}

export interface ResetPasswordPayload {
  new_password: string;
}

export function createAdminUser(
  payload: CreateAdminUserPayload,
) {
  return apiRequest<AdminUser>(
    "/admin/users",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export function updateAdminUser(
  userId: string,
  payload: UpdateAdminUserPayload,
) {
  return apiRequest<AdminUser>(
    `/admin/users/${userId}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
}

export function resetAdminUserPassword(
  userId: string,
  payload: ResetPasswordPayload,
) {
  return apiRequest<void>(
    `/admin/users/${userId}/reset-password`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export async function deleteAdminUser(
  userId: string,
): Promise<void> {
  await apiRequest(
    `/admin/users/${userId}`,
    {
      method: "DELETE",
    },
  );
}