import { Router } from "express";
import { getAssessmentQuestions, getCurrentAssessment, saveProgress, submitAssessment } from "../controllers/assessmentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/questions", getAssessmentQuestions);
router.get("/current", getCurrentAssessment);
router.post("/save-progress", saveProgress);
router.post("/submit", submitAssessment);

export default router;
