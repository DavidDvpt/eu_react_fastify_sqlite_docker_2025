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

type AuthMe = {
  id: string;
  pseudo: string;
  role: UserRoleType;
  isActive: boolean;
};
interface User extends AuthMe {
  id: string;
  firstname?: string | null;
  lastname?: string | null;
  pseudo: string;
  email: string;
  role: UserRoleType;
  createdAt: string;
  updatedAt?: string | null;
  isActive: boolean;
}

type AuthType = {
  isLoggued: boolean;
  role: UserRoleType;
  user: ApiState<AuthMe, import("@reduxjs/toolkit").SerializedError>;
};
