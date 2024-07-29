export type PaginationParams = {
  take?: number;
  skip?: number;
};

export type PaginatedResponse<T> = {
  data: T;
  count: number;
};
