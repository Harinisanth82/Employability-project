import { Router } from "express";
import { getInsights, refreshInsights, markInsightAsRead } from "../controllers/insightsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getInsights);
router.post("/refresh", refreshInsights);
router.patch("/:id/read", markInsightAsRead);

export default router;
