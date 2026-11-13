import { Router } from "express";
import authRoutes from "./auth.routes";
import chatRoutes from "./chat.routes";
import healthRoutes from "./health.routes";
import reportRoutes from "./reports.routes";
import scanRoutes from "./scan.routes";

const router = Router();

router.use(healthRoutes, authRoutes, scanRoutes, chatRoutes, reportRoutes);

export default router;
