import type { RequestHandler } from "express";
import { Role } from "@prisma/client";
import { AppError } from "../lib/errors";

export const requireAuth: RequestHandler = (req, _res, next) => {
  if (!req.session.userId) {
    return next(new AppError("UNAUTHORIZED", "Authentication required", 401));
  }
  return next();
};

export const requireRole =
  (roles: Role[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.session.role || !roles.includes(req.session.role)) {
      return next(new AppError("FORBIDDEN", "Insufficient permissions", 403));
    }
    return next();
  };
