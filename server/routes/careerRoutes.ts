import { Router } from "express";
import { getAllCareers, getCareerById, compareCareerWithProfile, getRecommendations, recalculateRecommendations, getSkillGapAnalysis } from "../controllers/careerController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/catalog", getAllCareers);
router.get("/catalog/:id", getCareerById);

router.use(authMiddleware);

router.get("/recommendations", getRecommendations);
router.post("/recommendations/recalculate", recalculateRecommendations);
router.get("/gap-analysis", getSkillGapAnalysis);
router.get("/catalog/:id/compare", compareCareerWithProfile);

export default router;
