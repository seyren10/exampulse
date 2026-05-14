import { AxiosError } from "axios";

export type ExampulseError = AxiosError<{
  errors: Record<string, string>;
  message: string;
}>;

export type PaginationLink = {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
};

export type PaginationMeta = {
  current_page: number;
  from: number;
  last_page: number;
  links: PaginationLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
};

export type PaginationLinks = {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
};

export type LaravelPaginateResource<T> = {
  data: T[];
  links: PaginationLinks;
  meta: PaginationMeta;
};

export type Timestamps = {
  created_at: string;
  updated_at: string;
};

export type LaravelQueryParams = {
  page?: number;
  per_page?: number;
};
