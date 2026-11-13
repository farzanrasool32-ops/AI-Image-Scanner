import { Router } from "express";
import { createReport } from "../controllers/reports.controller";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.post("/reports/pdf", requireAuth, createReport);

export default router;
