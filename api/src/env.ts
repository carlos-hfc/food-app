import { z } from "zod"

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string(),
  DATABASE_URL: z.string().url(),
})

export const env = envSchema.parse(process.env)
