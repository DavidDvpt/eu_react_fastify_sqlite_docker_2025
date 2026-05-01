export type ItemApi = {
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

export type Item = {
  id: string;
  name: string;
  imageUrlId: string;
  value: number;
  isLimited: boolean;
  isStackable?: boolean;
  typeId: string;
  categoryId: string;
  categoryName: string;
  typeName?: string;
  isActive: boolean;
  userId?: string | null;
  createdAt: string;
  updatedAt?: string | null;
};
export interface ItemDetailProps {
  item: (Item & { quantity: number }) | null;
  onBack?: () => void;
  onBuy?: () => void;
  onSell?: () => void;
  variant?: "trade" | "stock" | "manage"; // Nouvelle prop pour la variante
}

export type ItemApis = ItemApi[];
export type Items = Item[];
