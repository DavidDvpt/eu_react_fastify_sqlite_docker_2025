type ItemApi = {
  id: string;
  name: string;
  image_url_id: string;
  value: number | string;
  is_limited: boolean;
  is_stackable?: boolean;
  item_type_id: string;
  item_type?: {
    id: string;
    name: string;
  };
  is_active: boolean;
  user_id?: string | null;
  date_created: string;
  date_updated?: string | null;
};

type Item = {
  id: string;
  name: string;
  imageUrlId: string;
  value: number;
  isLimited: boolean;
  isStackable?: boolean;
  itemTypeId: string;
  itemTypeName?: string;
  isActive: boolean;
  userId?: string | null;
  createdAt: string;
  updatedAt?: string | null;
};

type ItemApis = ItemApi[];
type Items = Item[];

export type { Item, ItemApi, ItemApis, Items };
