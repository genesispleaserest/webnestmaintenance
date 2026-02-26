import { Router } from "express";
import { z } from "zod";
import { Role } from "@prisma/client";
import { validate } from "../lib/validation";
import { requireAuth, requireRole } from "../middleware/auth";
import { leadsController } from "../controllers/leads-controller";

const router = Router();

const emptyToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  q: z.preprocess(emptyToUndefined, z.string().trim().min(1).max(200).optional()),
  status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"]).optional()
});

const idSchema = z.object({
  id: z.string().cuid()
});

const createLeadSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().email().trim().max(254),
  company: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(3).max(30).optional(),
  source: z.string().trim().min(1).max(100),
  message: z.string().trim().min(1).max(2000),
  status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"]).optional()
});

const updateLeadSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    email: z.string().email().trim().max(254).optional(),
    company: z.string().trim().min(1).max(120).optional(),
    phone: z.string().trim().min(3).max(30).nullable().optional(),
    source: z.string().trim().min(1).max(100).optional(),
    message: z.string().trim().min(1).max(2000).optional(),
    status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"]).optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "No fields to update"
  });

const leadNoteSchema = z.object({
  body: z.string().trim().min(1).max(1000)
});

router.get("/", requireAuth, validate(listQuerySchema, "query"), leadsController.list);
router.post(
  "/",
  requireAuth,
  requireRole([Role.ADMIN]),
  validate(createLeadSchema, "body"),
  leadsController.create
);
router.get("/:id", requireAuth, validate(idSchema, "params"), leadsController.getById);
router.patch(
  "/:id",
  requireAuth,
  validate(idSchema, "params"),
  validate(updateLeadSchema, "body"),
  leadsController.update
);
router.post(
  "/:id/notes",
  requireAuth,
  validate(idSchema, "params"),
  validate(leadNoteSchema, "body"),
  leadsController.addNote
);

export const leadRoutes = router;
