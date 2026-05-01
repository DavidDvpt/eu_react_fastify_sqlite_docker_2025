export type TypeApi = {
  id: string;
  name: string;
  category_id: string;
  category?: {
    id: string;
    name: string;
  };
  is_active: boolean;
  supports_limited?: boolean;
  is_stackable?: boolean;
  user_id?: string | null;
  date_created: string;
  date_updated?: string | null;
};

export type Type = {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  isActive: boolean;
  supportsLimited: boolean;
  isStackable: boolean;
  userId: string;
  createdAt: string;
  updatedAt?: string | null;
};

export interface TypeEnriched extends Type {
  categoryName: string;
}

export type TypeApis = TypeApi[];
export type Types = Type[];
export type TypesEnriched = TypeEnriched[];
