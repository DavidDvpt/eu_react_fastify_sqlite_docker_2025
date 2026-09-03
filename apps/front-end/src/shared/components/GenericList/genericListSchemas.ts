import z from "zod";

export const genericListViewModeSchema = z.enum(["list", "card"]);
