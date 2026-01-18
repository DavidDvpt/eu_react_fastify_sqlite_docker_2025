type UserRoleType = "USER" | "ADMIN" | null;

type UserApi = {
  id: string;
  firstname?: string | null;
  lastname?: string | null;
  pseudo: string;
  email: string;
  role: UserRoleType;
  date_created: string;
  date_updated?: string | null;
  is_active: boolean;
};

type User = {
  id: string;
  firstname?: string | null;
  lastname?: string | null;
  pseudo: string;
  email: string;
  role: UserRoleType;
  createdAt: string;
  updatedAt?: string | null;
  isActive: boolean;
};

type AuthType = {
  isLoggued: boolean;
  role: UserRoleType;
  user: ApiState<User, import("@reduxjs/toolkit").SerializedError>;
};
