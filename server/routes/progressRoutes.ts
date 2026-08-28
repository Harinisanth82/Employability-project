import { Router } from "express";
import { getTimeline, getEmployabilityReadiness } from "../controllers/progressController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/timeline", getTimeline);
router.get("/employability", getEmployabilityReadiness);

export default router;
