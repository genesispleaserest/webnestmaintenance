import type { RequestHandler } from "express";
import type { ZodSchema } from "zod";
import { AppError } from "./errors";

type Location = "body" | "query" | "params";

export const validate =
  (schema: ZodSchema, location: Location): RequestHandler =>
  (req, _res, next) => {
    const result = schema.safeParse(req[location]);
    if (!result.success) {
      return next(
        new AppError("VALIDATION_ERROR", "Invalid request", 400, result.error.issues)
      );
    }
    req[location] = result.data;
    return next();
  };
