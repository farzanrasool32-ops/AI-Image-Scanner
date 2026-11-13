import { Router } from "express";
import { imageUpload } from "../middleware/imageUpload";
import { requireAuth } from "../middleware/requireAuth";
import { chatWithImage } from "../controllers/chat.controller";

const router = Router();

router.post("/chat", requireAuth, imageUpload("image"), chatWithImage);

export default router;
