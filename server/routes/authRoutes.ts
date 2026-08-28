import { Router } from "express";
import { register, login, getMe, changePassword, deleteAccount } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);
router.post("/change-password", authMiddleware, changePassword);
router.delete("/account", authMiddleware, deleteAccount);

export default router;
