import { Router } from "express";
import {
  getMentors,
  getMentorById,
  applyAsMentor,
  getSubjects,
  getMyMentorStatus,
  getMySubjects,
  addSubject,
} from "../controllers/mentorController";
import { authenticate, authenticateOptional } from "../middleware/auth";

const router = Router();

router.get("/", authenticateOptional, getMentors);
router.get("/subjects", getSubjects);
router.get("/my-status", authenticate, getMyMentorStatus);
router.get("/my-subjects", authenticate, getMySubjects);
router.post("/my-subjects", authenticate, addSubject);
router.get("/:id", getMentorById);
router.post("/apply", authenticate, applyAsMentor);

export default router;
