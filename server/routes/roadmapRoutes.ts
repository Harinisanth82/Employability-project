import { Router } from "express";
import { getRoadmap, regenerateRoadmap, toggleTask } from "../controllers/roadmapController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getRoadmap);
router.post("/generate", regenerateRoadmap);
router.patch("/task", toggleTask);

export default router;
