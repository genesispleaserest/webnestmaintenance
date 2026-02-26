import { Router } from "express";
import { publicRoutes } from "./public";
import { authRoutes } from "./auth";
import { leadRoutes } from "./leads";
import { quoteRoutes } from "./quotes";

const router = Router();

router.use("/public", publicRoutes);
router.use("/auth", authRoutes);
router.use("/leads", leadRoutes);
router.use("/quotes", quoteRoutes);

export const apiRouter = router;
