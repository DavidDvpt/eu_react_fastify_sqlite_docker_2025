import { z } from "zod";
import { typeFormSchema, typeSortSchema } from "@eu/zod-schemas";
import type { UserDto } from "./user.js";
import type { CategoryDto } from "./category.js";

export type TypeFormIntputBody = z.input<typeof typeFormSchema>;
export type TypeFormOutputBody = z.output<typeof typeFormSchema>;

export type TypeSortKey = z.infer<typeof typeSortSchema>;

export type TypeDto = {
  id: string;
  name: string;
  isActive: boolean;
  userId: string;
  categoryId: string;
  createdAt?: string;
  updatedAt?: string;

  user?: UserDto;
  category?: CategoryDto;
};
