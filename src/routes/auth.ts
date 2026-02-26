import { Router } from "express";
import { z } from "zod";
import { validate } from "../lib/validation";
import { authController } from "../controllers/auth-controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

const loginSchema = z.object({
  email: z.string().email().trim().max(254),
  password: z.string().min(8).max(100)
});

router.post("/login", validate(loginSchema, "body"), authController.login);
router.post("/logout", requireAuth, authController.logout);
router.get("/me", requireAuth, authController.me);

export const authRoutes = router;
