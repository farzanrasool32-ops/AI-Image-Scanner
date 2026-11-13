import { Router } from "express";
import { imageUpload } from "../middleware/imageUpload";
import { requireAuth } from "../middleware/requireAuth";
import { scanImage } from "../controllers/scan.controller";

const router = Router();

router.post("/scan", requireAuth, imageUpload("image"), scanImage);

export default router;
