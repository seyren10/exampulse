import { AxiosError } from "axios";

export type ExampulseError = AxiosError<{
  errors: Record<string, string>;
  message: string;
}>;
