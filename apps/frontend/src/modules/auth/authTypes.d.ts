type UserRoleType = "USER" | "ADMIN" | null;

type AuthMe = {
  id: string;
  pseudo: string;
  role: UserRoleType;
  isActive: boolean;
};

type AuthType = {
  isLoggued: boolean;
  role: UserRoleType;
  user: ApiState<AuthMe, ThunkSerializedError>;
};
