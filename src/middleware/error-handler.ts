import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { logger } from "../lib/logger";
import { AppError, errorResponse } from "../lib/errors";

export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json(errorResponse("NOT_FOUND", "Route not found"));
};

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.status).json(errorResponse(err.code, err.message, err.details));
    return;
  }

  if (err instanceof ZodError) {
    res
      .status(400)
      .json(errorResponse("VALIDATION_ERROR", "Invalid request", err.issues));
    return;
  }

  const log = req.log ?? logger;
  log.error({ err }, "Unhandled error");
  res
    .status(500)
    .json(errorResponse("INTERNAL_SERVER_ERROR", "Unexpected error"));
};
