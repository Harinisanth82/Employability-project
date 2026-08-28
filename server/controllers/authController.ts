import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { db } from "../db/database.js";
import { hashPassword, comparePassword, generateToken } from "../utils/jwtUtils.js";
import { sendSuccess, sendError } from "../utils/responseUtils.js";

export async function register(req: AuthenticatedRequest, res: Response) {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return sendError(res, "Full name is required (minimum 2 characters).", 400, "VALIDATION_ERROR");
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return sendError(res, "Please provide a valid email address.", 400, "VALIDATION_ERROR");
    }

    if (!password || password.length < 8) {
      return sendError(res, "Password must be at least 8 characters long.", 400, "VALIDATION_ERROR");
    }

    if (password !== confirmPassword) {
      return sendError(res, "Passwords do not match.", 400, "VALIDATION_ERROR");
    }

    const existing = db.findUserByEmail(email);
    if (existing) {
      return sendError(res, "An account with this email address already exists.", 409, "EMAIL_EXISTS");
    }

    const passwordHash = await hashPassword(password);
    const userId = "usr_" + Math.random().toString(36).substring(2, 10);
    const now = new Date().toISOString();

    const newUser = db.insertUser({
      id: userId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      isOnboarded: false,
      createdAt: now,
      updatedAt: now,
    });

    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
    });

    return sendSuccess(
      res,
      {
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          isOnboarded: newUser.isOnboarded,
        },
      },
      "Account registered successfully",
      201
    );
  } catch (err: any) {
    return sendError(res, "Failed to register account.", 500, "SERVER_ERROR", err.message);
  }
}

export async function login(req: AuthenticatedRequest, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, "Email and password are required.", 400, "VALIDATION_ERROR");
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      return sendError(res, "Invalid email or password.", 401, "INVALID_CREDENTIALS");
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return sendError(res, "Invalid email or password.", 401, "INVALID_CREDENTIALS");
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    const profile = db.getProfileByUserId(user.id);

    return sendSuccess(
      res,
      {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isOnboarded: user.isOnboarded,
          targetCareerId: user.targetCareerId || profile?.currentDirection || "software-developer",
        },
      },
      "Logged in successfully"
    );
  } catch (err: any) {
    return sendError(res, "Failed to log in.", 500, "SERVER_ERROR", err.message);
  }
}

export async function getMe(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return sendError(res, "Unauthorized", 401, "UNAUTHORIZED");
    }

    const user = db.findUserById(req.user.userId);
    if (!user) {
      return sendError(res, "User not found", 404, "USER_NOT_FOUND");
    }

    const profile = db.getProfileByUserId(user.id);

    return sendSuccess(res, {
      id: user.id,
      name: user.name,
      email: user.email,
      isOnboarded: user.isOnboarded,
      targetCareerId: user.targetCareerId || (profile ? profile.currentDirection : "software-developer"),
    });
  } catch (err: any) {
    return sendError(res, "Failed to retrieve user profile.", 500, "SERVER_ERROR", err.message);
  }
}

export async function changePassword(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword || newPassword.length < 8) {
      return sendError(res, "New password must be at least 8 characters.", 400, "VALIDATION_ERROR");
    }

    const user = db.findUserById(req.user.userId);
    if (!user) return sendError(res, "User not found", 404);

    const isMatch = await comparePassword(currentPassword, user.passwordHash);
    if (!isMatch) {
      return sendError(res, "Current password does not match.", 400, "INVALID_PASSWORD");
    }

    const newHash = await hashPassword(newPassword);
    db.updateUser(user.id, { passwordHash: newHash });

    return sendSuccess(res, null, "Password updated successfully.");
  } catch (err: any) {
    return sendError(res, "Failed to update password.", 500, "SERVER_ERROR", err.message);
  }
}

export async function deleteAccount(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    db.deleteUser(req.user.userId);
    return sendSuccess(res, null, "Account and all associated records deleted permanently.");
  } catch (err: any) {
    return sendError(res, "Failed to delete account.", 500, "SERVER_ERROR", err.message);
  }
}
