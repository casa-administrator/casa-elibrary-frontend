import { apiRequest } from "./client";

export interface CasaSsoExchangeResponse {
  status: "authenticated";
  message: string;
  user: unknown;
}

export async function exchangeCasaSsoCode(
  code: string,
): Promise<CasaSsoExchangeResponse> {
  return apiRequest<CasaSsoExchangeResponse>(
    "/auth/casa-sso/exchange",
    {
      method: "POST",
      body: JSON.stringify({
        code,
      }),
      skipAuthRedirect: true,
    },
  );
}