import { Router } from "express";
import { getProfile, submitOnboarding, updateProfile, setTargetCareer } from "../controllers/profileController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getProfile);
router.post("/onboarding", submitOnboarding);
router.put("/", updateProfile);
router.post("/target-career", setTargetCareer);

export default router;
