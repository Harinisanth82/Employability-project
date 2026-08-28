import { Router } from "express";
import { getInterviews, getInterviewById, startInterview, answerQuestion, finalizeInterview } from "../controllers/interviewController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getInterviews);
router.post("/start", startInterview);
router.get("/:id", getInterviewById);
router.post("/:id/answer", answerQuestion);
router.post("/:id/finalize", finalizeInterview);

export default router;
