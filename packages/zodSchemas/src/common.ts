import { z } from "zod";

export const sortOrderEnum = z.enum(["asc", "desc"]);

export const booleanSchema = z
  .union([z.boolean(), z.enum(["true", "false"])])
  .transform((value) => value === true || value === "true");

export const dateSortSchema = z.enum(["createdAt", "updatedAt"]);

// export const nameSortSchema = dateSortSchema.extend(["name"]);

export const idSchema = z.object({ id: z.string() });
