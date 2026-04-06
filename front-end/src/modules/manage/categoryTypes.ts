type CategoryApi = {
  id: string;
  name: string;
  is_active: boolean;
  user_id?: string | null;
  date_created: string;
  date_updated?: string | null;
};

type Category = {
  id: string;
  name: string;
  isActive: boolean;
  userId?: string | null;
  createdAt: string;
  updatedAt?: string | null;
};

type CategoryApis = CategoryApi[];
type Categories = Category[];

export type { Category, CategoryApi, Categories, CategoryApis };
