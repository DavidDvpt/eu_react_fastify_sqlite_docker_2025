type JsonPrimitive = string | number | boolean;
type JsonBody = Record<string, JsonPrimitive>;

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
