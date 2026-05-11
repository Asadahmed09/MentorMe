import { Router } from "express";
import {
  register,
  login,
  adminLogin,
  getMe,
} from "../controllers/authController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/admin-login", adminLogin);
router.get("/me", authenticate, getMe);

export default router;
