import { Router } from "express";
import { z } from "zod";
import { Role } from "@prisma/client";
import { validate } from "../lib/validation";
import { requireAuth, requireRole } from "../middleware/auth";
import { quotesController } from "../controllers/quotes-controller";

const router = Router();

const emptyToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  q: z.preprocess(emptyToUndefined, z.string().trim().min(1).max(200).optional()),
  status: z.enum(["NEW", "SENT", "ACCEPTED", "DECLINED"]).optional()
});

const idSchema = z.object({
  id: z.string().cuid()
});

const createQuoteSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().email().trim().max(254),
  company: z.string().trim().min(1).max(120),
  budgetRange: z.string().trim().min(1).max(100),
  timeline: z.string().trim().min(1).max(100),
  service: z.enum(["DEV", "DESIGN", "SECURITY", "AUTOMATION"]),
  details: z.string().trim().min(1).max(2000),
  status: z.enum(["NEW", "SENT", "ACCEPTED", "DECLINED"]).optional()
});

const updateQuoteSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    email: z.string().email().trim().max(254).optional(),
    company: z.string().trim().min(1).max(120).optional(),
    budgetRange: z.string().trim().min(1).max(100).optional(),
    timeline: z.string().trim().min(1).max(100).optional(),
    service: z.enum(["DEV", "DESIGN", "SECURITY", "AUTOMATION"]).optional(),
    details: z.string().trim().min(1).max(2000).optional(),
    status: z.enum(["NEW", "SENT", "ACCEPTED", "DECLINED"]).optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "No fields to update"
  });

router.get("/", requireAuth, validate(listQuerySchema, "query"), quotesController.list);
router.post(
  "/",
  requireAuth,
  requireRole([Role.ADMIN]),
  validate(createQuoteSchema, "body"),
  quotesController.create
);
router.get("/:id", requireAuth, validate(idSchema, "params"), quotesController.getById);
router.patch(
  "/:id",
  requireAuth,
  validate(idSchema, "params"),
  validate(updateQuoteSchema, "body"),
  quotesController.update
);

export const quoteRoutes = router;
