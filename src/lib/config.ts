import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z
    .string()
    .min(1)
    .default("postgresql://postgres:postgres@localhost:5432/webnest?schema=public"),
  SESSION_SECRET: z.string().min(1).default("change-me"),
  SESSION_TTL_HOURS: z.coerce.number().int().positive().default(24),
  SESSION_COOKIE_NAME: z.string().min(1).default("webnest.sid"),
  FRONTEND_ORIGIN: z.string().url().default("http://localhost:3000"),
  LOG_LEVEL: z.string().min(1).default("info"),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(15 * 60 * 1000),
  RATE_LIMIT_GENERAL_MAX: z.coerce.number().int().positive().default(100),
  RATE_LIMIT_PUBLIC_MAX: z.coerce.number().int().positive().default(20),
  BODY_LIMIT: z.string().min(1).default("100kb"),
  MAINTENANCE_MODE: z
    .preprocess(
      (value) => (typeof value === "string" ? value.trim() : value),
      z.enum(["true", "false"])
    )
    .default("false"),
  MAINTENANCE_MESSAGE: z.string().min(1).default("WebNest is currently under maintenance.")
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment variables");
}

const sessionTtlMs = parsed.data.SESSION_TTL_HOURS * 60 * 60 * 1000;

export const config = {
  nodeEnv: parsed.data.NODE_ENV,
  port: parsed.data.PORT,
  databaseUrl: parsed.data.DATABASE_URL,
  sessionSecret: parsed.data.SESSION_SECRET,
  sessionTtlHours: parsed.data.SESSION_TTL_HOURS,
  sessionCookieName: parsed.data.SESSION_COOKIE_NAME,
  frontendOrigin: parsed.data.FRONTEND_ORIGIN,
  logLevel: parsed.data.LOG_LEVEL,
  rateLimitWindowMs: parsed.data.RATE_LIMIT_WINDOW_MS,
  rateLimitGeneralMax: parsed.data.RATE_LIMIT_GENERAL_MAX,
  rateLimitPublicMax: parsed.data.RATE_LIMIT_PUBLIC_MAX,
  bodyLimit: parsed.data.BODY_LIMIT,
  maintenanceMode: parsed.data.MAINTENANCE_MODE === "true",
  maintenanceMessage: parsed.data.MAINTENANCE_MESSAGE,
  sessionTtlMs,
  sessionCleanupMs: Math.min(sessionTtlMs, 15 * 60 * 1000)
};
