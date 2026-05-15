import { z } from "zod";

const envSchema = z.object({
  VITE_API_URL: z.url("VITE_API_URL is required"),
  VITE_IMAGE_BASE_URL: z.string().optional(),
});

const parsedEnv = envSchema.safeParse(import.meta.env);

if (!parsedEnv.success) {
  const errors = parsedEnv.error.issues
    .map((issue) => `${issue.path.join(".") || "env"}: ${issue.message}`)
    .join("\n");
  throw new Error(`Invalid environment variables:\n${errors}`);
}

export const env = parsedEnv.data;
