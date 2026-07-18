type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
type JsonBody = Record<string, JsonValue>;

type QueryPrimitive = string | number | boolean;
type QueryParams = Record<string, QueryPrimitive | undefined>;

type ApiError = {
  status: number;
  message: string;
  info: string;
};

type BackendErrorBody = {
  message: string;
};

type ApiState<T, E> = {
  status: ApiStatusType;
  result: T | null;
  error: E | null;
};
