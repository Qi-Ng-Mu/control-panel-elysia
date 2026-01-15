export type ApiResponse<T> = {
  code: number;
  message: string;
  data: T | null;
};

export const ok = <T>(data: T, message = "ok"): ApiResponse<T> => ({
  code: 0,
  message,
  data
});

export const fail = (message: string, code = 1): ApiResponse<null> => ({
  code,
  message,
  data: null
});
