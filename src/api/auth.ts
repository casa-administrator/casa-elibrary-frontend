import {
  apiRequest,
} from "./client";


export interface CurrentUser {
  id: string;

  full_name: string;
  email: string;

  role: string;

  department_id:
    | string
    | null;

  is_active: boolean;

  last_login_at:
    | string
    | null;
}


export interface LoginResponse {
  status:
    "authenticated";

  message: string;
}


export interface LogoutResponse {
  status:
    "logged_out";

  message: string;
}


export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  return apiRequest<
    LoginResponse
  >(
    "/auth/login",
    {
      method: "POST",

      body: JSON.stringify({
        email,
        password,
      }),

      skipAuthRedirect:
        true,
    },
  );
}


export async function getMe():
  Promise<CurrentUser> {
  return apiRequest<
    CurrentUser
  >(
    "/auth/me",
    {
      method: "GET",

      skipAuthRedirect:
        true,
    },
  );
}


export async function logout():
  Promise<LogoutResponse> {
  return apiRequest<
    LogoutResponse
  >(
    "/auth/logout",
    {
      method: "POST",
    },
  );
}