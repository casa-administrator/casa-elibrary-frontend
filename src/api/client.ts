export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "http://localhost:8000/api/v1";


export class ApiError extends Error {
  status: number;

  data: unknown;

  constructor(
    message: string,
    status: number,
    data?: unknown,
  ) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}


interface ApiRequestOptions
  extends RequestInit {
  skipAuthRedirect?: boolean;
}


export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const {
    skipAuthRedirect = false,
    ...fetchOptions
  } = options;


  const headers =
    new Headers(
      fetchOptions.headers,
    );


  if (
    fetchOptions.body &&
    !(fetchOptions.body instanceof FormData)
  ) {
    headers.set(
      "Content-Type",
      "application/json",
    );
  }


  const response =
    await fetch(
      `${API_BASE_URL}${path}`,
      {
        ...fetchOptions,

        headers,

        credentials:
          "include",
      },
    );


  const contentType =
    response.headers.get(
      "content-type",
    );


  let data: unknown =
    null;


  if (
    contentType?.includes(
      "application/json",
    )
  ) {
    try {
      data =
        await response.json();
    } catch {
      data = null;
    }
  } else {
    try {
      const text =
        await response.text();

      data =
        text || null;
    } catch {
      data = null;
    }
  }


  if (!response.ok) {
    if (
      response.status === 401 &&
      !skipAuthRedirect
    ) {
      sessionStorage.removeItem(
        "casa_otp_challenge_id",
      );

      sessionStorage.removeItem(
        "casa_login_email",
      );


      if (
        window.location.pathname !==
          "/login" &&
        window.location.pathname !==
          "/verify-otp"
      ) {
        window.location.href =
          "/login";
      }
    }


    let message =
      `Request failed with status ${response.status}`;


    if (
      data &&
      typeof data ===
        "object"
    ) {
      const record =
        data as Record<
          string,
          unknown
        >;


      if (
        typeof record.detail ===
        "string"
      ) {
        message =
          record.detail;
      } else if (
        typeof record.message ===
        "string"
      ) {
        message =
          record.message;
      }
    }


    throw new ApiError(
      message,
      response.status,
      data,
    );
  }


  if (
    response.status === 204
  ) {
    return undefined as T;
  }


  return data as T;
}