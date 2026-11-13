import { Router } from "express";
import {
  getCurrentUser,
  logIn,
  logOut,
  signUp,
} from "../controllers/auth.controller";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.post("/auth/signup", signUp);
router.post("/auth/login", logIn);
router.post("/auth/logout", logOut);
router.get("/auth/me", requireAuth, getCurrentUser);

export default router;
