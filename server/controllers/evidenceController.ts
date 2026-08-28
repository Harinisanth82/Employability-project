import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { db } from "../db/database.js";
import { sendSuccess, sendError } from "../utils/responseUtils.js";
import { SkillEvidenceDoc } from "../db/models.js";

export async function getEvidences(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const evidences = db.getEvidencesByUserId(req.user.userId);
    return sendSuccess(res, evidences);
  } catch (err: any) {
    return sendError(res, "Failed to load skill evidence records.", 500, "SERVER_ERROR", err.message);
  }
}

export async function addEvidence(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const userId = req.user.userId;
    const { skillName, evidenceType, title, url, description, strength = "Moderate" } = req.body;

    if (!skillName || !evidenceType || !title) {
      return sendError(res, "Skill name, evidence type, and title are required.", 400, "VALIDATION_ERROR");
    }

    let verifiedStatus: "Demonstrated Through Project" | "Evidence Added" | "Verified Assessment" = "Evidence Added";
    if (evidenceType === "github" || evidenceType === "portfolio" || evidenceType === "internship") {
      verifiedStatus = "Demonstrated Through Project";
    } else if (evidenceType === "assessment" || evidenceType === "certification") {
      verifiedStatus = "Verified Assessment";
    }

    const now = new Date().toISOString();
    const newDoc: SkillEvidenceDoc = {
      id: "evi_" + Math.random().toString(36).substring(2, 10),
      userId,
      skillName,
      evidenceType,
      title,
      url,
      description: description || "",
      verifiedStatus,
      strength,
      createdAt: now,
    };

    db.insertEvidence(newDoc);

    // Boost profile evidence/projects score
    const profile = db.getProfileByUserId(userId);
    if (profile) {
      profile.readinessBreakdown.projects = Math.min(96, profile.readinessBreakdown.projects + 4);
      profile.readinessBreakdown.technicalSkills = Math.min(95, profile.readinessBreakdown.technicalSkills + 2);
      profile.readinessScore = Math.min(95, profile.readinessScore + 3);
      db.upsertProfile(profile);
    }

    db.addTimelineEvent({
      id: "ev_" + Math.random().toString(36).substring(2, 10),
      userId,
      type: "evidence",
      title: `Skill Evidence Added: ${skillName}`,
      description: `Linked ${title} (${verifiedStatus}) with ${strength} verification strength.`,
      timestamp: now,
    });

    return sendSuccess(res, newDoc, "Skill evidence recorded successfully.", 201);
  } catch (err: any) {
    return sendError(res, "Failed to record skill evidence.", 500, "SERVER_ERROR", err.message);
  }
}

export async function deleteEvidence(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const { id } = req.params;
    const deleted = db.deleteEvidence(id, req.user.userId);
    if (!deleted) {
      return sendError(res, "Evidence record not found.", 404);
    }
    return sendSuccess(res, null, "Evidence record deleted.");
  } catch (err: any) {
    return sendError(res, "Failed to delete evidence record.", 500, "SERVER_ERROR", err.message);
  }
}
