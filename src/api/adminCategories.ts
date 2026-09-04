import {
  apiRequest,
} from "./client";


export interface AdminCategory {
  id: string;

  name: string;

  description?: string | null;

  order: number;

  google_drive_folder_id: string;

  is_active: boolean;

  document_count?: number;

  last_synced_at?: string | null;

  created_at?: string | null;

  updated_at?: string | null;
}


export interface AdminCategoryListResponse {
  items: AdminCategory[];

  total: number;

  page?: number;

  per_page?: number;

  pages?: number;
}


export interface CreateCategoryPayload {
  name: string;

  description?: string | null;

  order: number;

  google_drive_folder_id: string;
}


export interface UpdateCategoryPayload {
  name?: string;

  description?: string | null;

  order?: number;

  google_drive_folder_id?: string;
}


export interface SyncCategoryResponse {
  category_id?: string;

  status?: string;

  created?: number;

  updated?: number;

  deactivated?: number;

  total?: number;

  message?: string;
}


export function getAdminCategories() {
  return apiRequest<AdminCategoryListResponse>(
    "/admin/categories",
  );
}


export function createAdminCategory(
  payload: CreateCategoryPayload,
) {
  return apiRequest<AdminCategory>(
    "/admin/categories",
    {
      method: "POST",

      body:
        JSON.stringify(
          payload,
        ),
    },
  );
}


export function updateAdminCategory(
  categoryId: string,
  payload: UpdateCategoryPayload,
) {
  return apiRequest<AdminCategory>(
    `/admin/categories/${categoryId}`,
    {
      method: "PATCH",

      body:
        JSON.stringify(
          payload,
        ),
    },
  );
}


export function activateAdminCategory(
  categoryId: string,
) {
  return apiRequest<AdminCategory>(
    `/admin/categories/${categoryId}/activate`,
    {
      method: "POST",
    },
  );
}


export function deactivateAdminCategory(
  categoryId: string,
) {
  return apiRequest<AdminCategory>(
    `/admin/categories/${categoryId}/deactivate`,
    {
      method: "POST",
    },
  );
}


export function syncAdminCategory(
  categoryId: string,
) {
  return apiRequest<SyncCategoryResponse>(
    `/admin/categories/${categoryId}/sync`,
    {
      method: "POST",
    },
  );
}

export async function deleteAdminCategory(
  categoryId: string,
): Promise<void> {
  await apiRequest(
    `/admin/categories/${categoryId}`,
    {
      method: "DELETE",
    },
  );
}