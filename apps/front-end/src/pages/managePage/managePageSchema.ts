import z from "zod";

import { genericFilterSchema } from "@/shared/components/GenericFilter/genericFilterSchema";

export const managePageQuerySchema = genericFilterSchema;

export type ManagePageQuery = z.infer<typeof managePageQuerySchema>;
