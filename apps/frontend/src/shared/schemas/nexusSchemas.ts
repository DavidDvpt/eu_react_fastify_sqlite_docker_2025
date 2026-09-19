import z from "zod";

export const nexusRequestTypeSchema = z.enum([
  "Materials",
  "Finders",
  "Excavators",
  "Refiners",
]);

export type NexusRequestTypeEnum = z.infer<typeof nexusRequestTypeSchema>;
