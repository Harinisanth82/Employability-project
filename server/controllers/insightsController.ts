import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { db } from "../db/database.js";
import { generateCareerInsights } from "../services/geminiService.js";
import { sendSuccess, sendError } from "../utils/responseUtils.js";

export async function getInsights(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const userId = req.user.userId;
    let insights = db.getInsightsByUserId(userId);

    if (insights.length === 0) {
      const profile = db.getProfileByUserId(userId);
      if (profile) {
        const roadmap = db.getRoadmapByUserId(userId);
        const evidences = db.getEvidencesByUserId(userId);
        const interviews = db.getInterviewsByUserId(userId);
        const generated = await generateCareerInsights(profile, roadmap, evidences, interviews);
        insights = db.upsertInsights(userId, generated);
      }
    }

    return sendSuccess(res, insights);
  } catch (err: any) {
    return sendError(res, "Failed to load career insights.", 500, "SERVER_ERROR", err.message);
  }
}

export async function refreshInsights(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const userId = req.user.userId;
    const profile = db.getProfileByUserId(userId);
    if (!profile) return sendError(res, "Profile not found", 404);

    const roadmap = db.getRoadmapByUserId(userId);
    const evidences = db.getEvidencesByUserId(userId);
    const interviews = db.getInterviewsByUserId(userId);
    const generated = await generateCareerInsights(profile, roadmap, evidences, interviews);
    const updated = db.upsertInsights(userId, generated);

    return sendSuccess(res, updated, "Insights refreshed.");
  } catch (err: any) {
    return sendError(res, "Failed to refresh insights.", 500, "SERVER_ERROR", err.message);
  }
}

export async function markInsightAsRead(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const { id } = req.params;
    const item = db.markInsightRead(id, req.user.userId);
    return sendSuccess(res, item);
  } catch (err: any) {
    return sendError(res, "Failed to update insight status.", 500, "SERVER_ERROR", err.message);
  }
}
