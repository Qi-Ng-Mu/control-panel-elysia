import { request } from "./http";

export type LoginPayload = {
  tenantCode?: string;
  username: string;
  password: string;
};

export type TokenResponse = {
  accessToken: string;
  refreshToken: string;
};

export const login = (payload: LoginPayload) =>
  request<TokenResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });

export const refresh = (refreshToken: string) =>
  request<{ accessToken: string }>("/api/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken })
  });

export const logout = (refreshToken: string) =>
  request<boolean>("/api/auth/logout", {
    method: "POST",
    body: JSON.stringify({ refreshToken })
  });

export const me = () => request<unknown>("/api/auth/me");
