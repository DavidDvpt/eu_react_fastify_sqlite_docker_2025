type UserRoleType = "USER" | "ADMIN" | null;

type AuthMe = {
  id: string;
  pseudo: string;
  role: UserRoleType;
  isActive: boolean;
  inGameUsername?: string | null;
};

type AuthType = {
  isLoggued: boolean;
  role: UserRoleType;
  user: ApiState<AuthMe, ThunkSerializedError>;
};
