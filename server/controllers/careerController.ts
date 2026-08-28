import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { db } from "../db/database.js";
import { recommendCareers, analyzeSkillGap } from "../services/geminiService.js";
import { sendSuccess, sendError } from "../utils/responseUtils.js";

export async function getAllCareers(req: AuthenticatedRequest, res: Response) {
  try {
    const careers = db.getCareers();
    return sendSuccess(res, careers);
  } catch (err: any) {
    return sendError(res, "Failed to retrieve careers.", 500, "SERVER_ERROR", err.message);
  }
}

export async function getCareerById(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const career = db.getCareerById(id);
    if (!career) {
      return sendError(res, "Career not found.", 404, "CAREER_NOT_FOUND");
    }
    return sendSuccess(res, career);
  } catch (err: any) {
    return sendError(res, "Failed to retrieve career.", 500, "SERVER_ERROR", err.message);
  }
}

export async function compareCareerWithProfile(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const { id } = req.params;
    const career = db.getCareerById(id);
    if (!career) return sendError(res, "Career not found", 404);

    const profile = db.getProfileByUserId(req.user.userId);
    if (!profile) return sendError(res, "Profile not found", 404);

    let gapAnalysis = db.getCachedSkillGap(req.user.userId, career.id, profile.updatedAt);
    if (!gapAnalysis) {
      gapAnalysis = await analyzeSkillGap(profile, career);
      db.setCachedSkillGap(req.user.userId, career.id, gapAnalysis, profile.updatedAt);
    }

    return sendSuccess(res, {
      career,
      profileSkills: profile.technicalSkills || [],
      gapAnalysis,
      readinessScore: profile.readinessScore,
    });
  } catch (err: any) {
    return sendError(res, "Failed to compare career with profile.", 500, "SERVER_ERROR", err.message);
  }
}

export async function getRecommendations(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const userId = req.user.userId;
    let recsDoc = db.getRecommendationByUserId(userId);

    if (!recsDoc || !recsDoc.recommendations || recsDoc.recommendations.length === 0) {
      const profile = db.getProfileByUserId(userId);
      if (profile) {
        const assessment = db.getAssessmentByUserId(userId);
        const catalog = db.getCareers();
        const generated = await recommendCareers(profile, assessment, catalog);
        recsDoc = db.upsertRecommendation({
          id: "rec_" + Math.random().toString(36).substring(2, 10),
          userId,
          recommendations: generated,
          generatedAt: new Date().toISOString(),
        });
      }
    }

    return sendSuccess(res, recsDoc?.recommendations || []);
  } catch (err: any) {
    return sendError(res, "Failed to retrieve recommendations.", 500, "SERVER_ERROR", err.message);
  }
}

export async function recalculateRecommendations(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const userId = req.user.userId;
    const profile = db.getProfileByUserId(userId);
    if (!profile) return sendError(res, "Profile not found", 404);

    const assessment = db.getAssessmentByUserId(userId);
    const catalog = db.getCareers();
    const generated = await recommendCareers(profile, assessment, catalog);

    const updated = db.upsertRecommendation({
      id: "rec_" + Math.random().toString(36).substring(2, 10),
      userId,
      recommendations: generated,
      generatedAt: new Date().toISOString(),
    });

    return sendSuccess(res, updated.recommendations, "Career recommendations recalculated.");
  } catch (err: any) {
    return sendError(res, "Failed to recalculate recommendations.", 500, "SERVER_ERROR", err.message);
  }
}

export async function getSkillGapAnalysis(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const userId = req.user.userId;
    const profile = db.getProfileByUserId(userId);
    if (!profile) return sendError(res, "Profile not found. Please complete onboarding.", 404);

    const targetRoleQuery = (req.query.role as string) || profile.currentDirection || "Software Developer";
    const catalog = db.getCareers();
    let career = catalog.find(c => c.title.toLowerCase() === targetRoleQuery.toLowerCase() || c.id === targetRoleQuery || c.slug === targetRoleQuery);
    if (!career) career = catalog[0];

    const isFresh = req.query.fresh === "true";
    let gapResult = isFresh ? null : db.getCachedSkillGap(userId, career.id, profile.updatedAt);
    if (!gapResult) {
      gapResult = await analyzeSkillGap(profile, career);
      db.setCachedSkillGap(userId, career.id, gapResult, profile.updatedAt);
    }
    return sendSuccess(res, gapResult);
  } catch (err: any) {
    return sendError(res, "Failed to analyze skill gaps.", 500, "SERVER_ERROR", err.message);
  }
}
