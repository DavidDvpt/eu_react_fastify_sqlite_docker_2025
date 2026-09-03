import { z } from 'zod';

export type WikiItemRow = {
  id: number;
  item_id: number;
  item_name: string;
  image_id: number | null;
  item_type: string | null;
  item_class: string | null;
  created_at: Date;
  updated_at: Date | null;
};

export type ImageListItem = {
  id: number;
  itemId: number;
  itemName: string;
  imageId: number | null;
  itemType: string | null;
  itemClass: string | null;
  createdAt: Date;
  updatedAt: Date | null;
};
