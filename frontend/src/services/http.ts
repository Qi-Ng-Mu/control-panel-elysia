export type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export async function request<T>(path: string, init?: RequestInit): Promise<ApiResponse<T>> {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {})
    }
  });


  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return (await response.json()) as ApiResponse<T>;
}
