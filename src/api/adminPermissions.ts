import {
  apiRequest,
} from "./client";


export interface UserCategoryPermission {
  id?: string;

  user_id: string;

  category_id: string;

  can_view: boolean;

  can_download: boolean;

  category_name?: string | null;

  created_at?: string | null;

  updated_at?: string | null;
}


export interface UserPermissionListResponse {
  items: UserCategoryPermission[];

  total?: number;
}


export interface UserAccessCategory {
  category_id: string;

  category_name: string;

  can_view: boolean;

  can_download: boolean;
}


export interface UserAccessResponse {
  user_id: string;

  items: UserAccessCategory[];
}


export interface UpdatePermissionPayload {
  can_view: boolean;

  can_download: boolean;
}


export function getUserPermissions(
  userId: string,
) {
  return apiRequest<UserPermissionListResponse>(
    `/admin/users/${userId}/permissions`,
  );
}


export function getUserAccess(
  userId: string,
) {
  return apiRequest<UserAccessResponse>(
    `/admin/users/${userId}/access`,
  );
}


export function updateUserPermission(
  userId: string,
  categoryId: string,
  payload: UpdatePermissionPayload,
) {
  return apiRequest<UserCategoryPermission>(
    `/admin/users/${userId}/permissions/${categoryId}`,
    {
      method: "PUT",

      body:
        JSON.stringify(
          payload,
        ),
    },
  );
}


export function deleteUserPermission(
  userId: string,
  categoryId: string,
) {
  return apiRequest<void>(
    `/admin/users/${userId}/permissions/${categoryId}`,
    {
      method: "DELETE",
    },
  );
}