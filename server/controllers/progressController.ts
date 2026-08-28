import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { db } from "../db/database.js";
import { sendSuccess, sendError } from "../utils/responseUtils.js";

export async function getTimeline(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const userId = req.user.userId;
    const typeFilter = req.query.type as string;

    let timeline = db.getTimelineByUserId(userId);
    if (typeFilter && typeFilter !== "all") {
      timeline = timeline.filter(item => item.type === typeFilter);
    }

    return sendSuccess(res, timeline);
  } catch (err: any) {
    return sendError(res, "Failed to load progress timeline.", 500, "SERVER_ERROR", err.message);
  }
}

export async function getEmployabilityReadiness(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const userId = req.user.userId;
    const profile = db.getProfileByUserId(userId);
    if (!profile) return sendError(res, "Profile not found.", 404);

    const roadmap = db.getRoadmapByUserId(userId);
    const evidences = db.getEvidencesByUserId(userId);
    const interviews = db.getInterviewsByUserId(userId);
    const completedInterviews = interviews.filter(i => i.status === "completed");

    // Calculate Evidence Strength
    let evidenceStrengthScore = 40;
    if (evidences.length >= 3) evidenceStrengthScore = 85;
    else if (evidences.length >= 1) evidenceStrengthScore = 65;

    // Interview readiness score
    let interviewReadinessScore = profile.readinessBreakdown.interviewReadiness || 60;
    if (completedInterviews.length > 0) {
      const avgScore = completedInterviews.reduce((acc, curr) => acc + (curr.finalSummary?.overallScore || 70), 0) / completedInterviews.length;
      interviewReadinessScore = Math.round(avgScore);
    }

    // Dynamic next priority
    let nextPriority = "Improve backend API architecture and complete one database-focused project.";
    if (evidences.length === 0) {
      nextPriority = "Add at least one verified GitHub project repository to strengthen your Skill Evidence portfolio.";
    } else if (completedInterviews.length === 0) {
      nextPriority = "Complete your first Technical Mock Interview session to establish an interview readiness baseline.";
    } else if (roadmap && roadmap.overallProgress < 40) {
      nextPriority = "Complete Phase 2 milestone tasks to bridge core database and testing skill gaps.";
    }

    return sendSuccess(res, {
      overallEstimate: profile.readinessScore,
      targetRole: profile.currentDirection,
      directionMatch: profile.matchPercentage,
      metrics: {
        skillReadiness: profile.readinessBreakdown.technicalSkills,
        projectReadiness: profile.readinessBreakdown.projects,
        experienceScore: Math.min(95, 50 + (profile.experience.internships.length * 15) + (profile.experience.certifications.length * 10)),
        communicationScore: profile.readinessBreakdown.communication,
        interviewReadiness: interviewReadinessScore,
        evidenceStrength: evidenceStrengthScore,
      },
      nextPriority,
      evidenceCount: evidences.length,
      interviewsCount: completedInterviews.length,
      roadmapProgress: roadmap?.overallProgress || 0,
    });
  } catch (err: any) {
    return sendError(res, "Failed to load employability readiness.", 500, "SERVER_ERROR", err.message);
  }
}
