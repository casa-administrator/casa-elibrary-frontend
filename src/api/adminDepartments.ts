import {
  apiRequest,
} from "./client";


export type DepartmentType =
  | "department"
  | "laboratory"
  | "institute";


export interface AdminDepartment {
  id: string;

  name: string;

  code?: string | null;

  type: DepartmentType;

  description?: string | null;

  is_active: boolean;

  created_at?: string | null;

  updated_at?: string | null;
}


export interface AdminDepartmentListResponse {
  items: AdminDepartment[];

  total: number;

  page?: number;

  per_page?: number;

  pages?: number;
}


export interface CreateDepartmentPayload {
  name: string;

  code?: string | null;

  type: DepartmentType;

  description?: string | null;
}


export interface UpdateDepartmentPayload {
  name?: string;

  code?: string | null;

  type?: DepartmentType;

  description?: string | null;
}


export function getAdminDepartments() {
  return apiRequest<AdminDepartmentListResponse>(
    "/admin/departments",
  );
}


export function createAdminDepartment(
  payload: CreateDepartmentPayload,
) {
  return apiRequest<AdminDepartment>(
    "/admin/departments",
    {
      method: "POST",

      body:
        JSON.stringify(
          payload,
        ),
    },
  );
}


export function updateAdminDepartment(
  departmentId: string,
  payload: UpdateDepartmentPayload,
) {
  return apiRequest<AdminDepartment>(
    `/admin/departments/${departmentId}`,
    {
      method: "PATCH",

      body:
        JSON.stringify(
          payload,
        ),
    },
  );
}


export function activateAdminDepartment(
  departmentId: string,
) {
  return apiRequest<AdminDepartment>(
    `/admin/departments/${departmentId}/activate`,
    {
      method: "POST",
    },
  );
}


export function deactivateAdminDepartment(
  departmentId: string,
) {
  return apiRequest<AdminDepartment>(
    `/admin/departments/${departmentId}/deactivate`,
    {
      method: "POST",
    },
  );
}

export async function deleteAdminDepartment(
  departmentId: string,
): Promise<void> {
  await apiRequest(
    `/admin/departments/${departmentId}`,
    {
      method: "DELETE",
    },
  );
}