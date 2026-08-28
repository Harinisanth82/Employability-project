import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../utils/jwtUtils.js";
import { db } from "../db/database.js";
import { sendError } from "../utils/responseUtils.js";

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload & { id: string };
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, "Authentication required. Please log in.", 401, "UNAUTHORIZED");
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyToken(token);

  if (!payload) {
    return sendError(res, "Session has expired or is invalid. Please log in again.", 401, "INVALID_TOKEN");
  }

  const user = db.findUserById(payload.userId);
  if (!user) {
    return sendError(res, "User account not found.", 401, "USER_NOT_FOUND");
  }

  req.user = {
    ...payload,
    id: user.id,
  };

  next();
}
