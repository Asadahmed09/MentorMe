import { Router } from "express";
import {
  createRequest,
  getMyRequestsAsStudent,
  getMyRequestsAsMentor,
  updateRequestStatus,
  submitRating,
} from "../controllers/requestController";
import { authenticate, authorizeRole } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.post("/", authorizeRole("student"), createRequest);
router.get("/student", authorizeRole("student"), getMyRequestsAsStudent);
router.get("/mentor", authorizeRole("mentor"), getMyRequestsAsMentor);
router.put("/:id/status", authorizeRole("mentor"), updateRequestStatus);
router.post("/ratings", authorizeRole("student"), submitRating);

export default router;
