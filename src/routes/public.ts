import { Router } from "express";
import { z } from "zod";
import { validate } from "../lib/validation";
import { publicController } from "../controllers/public-controller";

const router = Router();

const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().email().trim().max(254),
  company: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(3).max(30).optional(),
  message: z.string().trim().min(1).max(2000)
});

const quoteSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().email().trim().max(254),
  company: z.string().trim().min(1).max(120),
  budgetRange: z.string().trim().min(1).max(100),
  timeline: z.string().trim().min(1).max(100),
  service: z.enum(["DEV", "DESIGN", "SECURITY", "AUTOMATION"]),
  details: z.string().trim().min(1).max(2000)
});

router.post("/contact", validate(contactSchema, "body"), publicController.contact);
router.post("/quote", validate(quoteSchema, "body"), publicController.quote);

export const publicRoutes = router;
