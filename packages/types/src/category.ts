import z from "zod";
import { categoryFormSchema } from "@eu/zod-schemas";

export type CategoryFormBody = z.infer<typeof categoryFormSchema>;
