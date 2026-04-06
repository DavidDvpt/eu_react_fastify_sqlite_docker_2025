type TypeApi = {
  id: string;
  name: string;
  category_id: string;
  category?: {
    id: string;
    name: string;
  };
  is_active: boolean;
  user_id?: string | null;
  date_created: string;
  date_updated?: string | null;
};

type Type = {
  id: string;
  name: string;
  categoryId: string;
  categoryName?: string;
  isActive: boolean;
  userId?: string | null;
  createdAt: string;
  updatedAt?: string | null;
};

type TypeApis = TypeApi[];
type Types = Type[];

export type { Type, TypeApi, TypeApis, Types };
