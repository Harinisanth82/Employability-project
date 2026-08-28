import { Router } from "express";
import { getEvidences, addEvidence, deleteEvidence } from "../controllers/evidenceController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getEvidences);
router.post("/", addEvidence);
router.delete("/:id", deleteEvidence);

export default router;
