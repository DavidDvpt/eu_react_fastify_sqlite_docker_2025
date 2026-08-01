import { z } from "zod";

export const sortOrderEnum = z.enum(["asc", "desc"]);
