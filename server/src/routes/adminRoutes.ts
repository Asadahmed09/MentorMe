import { Router } from "express";
import {
  getPendingMentors,
  approveMentor,
  rejectMentor,
  getStats,
} from "../controllers/adminController";
import { authenticate, authorizeRole } from "../middleware/auth";

const router = Router();

router.use(authenticate, authorizeRole("admin"));

router.get("/stats", getStats);
router.get("/mentors/pending", getPendingMentors);
router.put("/mentors/:id/approve", approveMentor);
router.put("/mentors/:id/reject", rejectMentor);

export default router;
