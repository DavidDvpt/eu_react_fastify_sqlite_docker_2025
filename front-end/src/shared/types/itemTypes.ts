import type { ItemInventory } from "@/pages/inventoryPage/inventory/stockTypes";

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
  supportsLimited?: boolean;
  isStackable?: boolean;
  typeId: string;
  categoryId?: string;
  categoryName?: string;
  typeName?: string;
  isActive: boolean;
  userId?: string | null;
  createdAt: string;
  updatedAt?: string | null;
};
export interface ItemDetailProps {
  item: ItemInventory | null;
  onBack?: () => void;
  onBuy?: () => void;
  onSell?: () => void;
  variant?: "transaction" | "stock" | "manage"; // Nouvelle prop pour la variante
}

export type ItemApis = ItemApi[];
export type Items = Item[];
