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
