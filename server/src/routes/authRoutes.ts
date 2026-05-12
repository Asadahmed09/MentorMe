import { Router } from "express";
import {
  register,
  login,
  adminLogin,
  getMe,
  updateMe,
} from "../controllers/authController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/admin-login", adminLogin);
router.get("/me", authenticate, getMe);
router.put("/me", authenticate, updateMe);

export default router;
