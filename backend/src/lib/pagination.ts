export type PaginationParams = {
  page: number;
  pageSize: number;
  skip: number;
  take: number;
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export const parsePagination = (query: Record<string, string | undefined>): PaginationParams => {
  const page = clamp(Number(query.page ?? 1), 1, 1000000);
  const pageSize = clamp(Number(query.pageSize ?? 20), 1, 200);
  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
    take: pageSize
  };
};
