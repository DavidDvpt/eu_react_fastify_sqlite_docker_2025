import { z } from "zod";
import { categoryFormSchema, categorySortKey } from "@eu/zod-schemas";
import type { UserDto } from "./user.js";

export type CategoryFormInputBody = z.input<typeof categoryFormSchema>;
export type CategoryFormOutputBody = z.output<typeof categoryFormSchema>;

export type CategorySortKey = z.infer<typeof categorySortKey>;
export type CategoryDto = {
  id: string;
  name: string;
  isActive: boolean;
  userId: string;
  createdAt?: string;
  updatedAt?: string;

  user?: UserDto;
};
