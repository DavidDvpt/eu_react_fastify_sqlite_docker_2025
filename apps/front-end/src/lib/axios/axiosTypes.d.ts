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
