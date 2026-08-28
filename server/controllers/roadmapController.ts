import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { db } from "../db/database.js";
import { generateRoadmap } from "../services/geminiService.js";
import { sendSuccess, sendError } from "../utils/responseUtils.js";
import { RoadmapDoc } from "../db/models.js";

export async function getRoadmap(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const userId = req.user.userId;
    let roadmap = db.getRoadmapByUserId(userId);

    if (!roadmap) {
      const profile = db.getProfileByUserId(userId);
      if (profile) {
        const catalog = db.getCareers();
        const career = db.getCareerById(profile.currentDirection) || catalog[0];
        const phases = await generateRoadmap(profile, career);
        roadmap = db.upsertRoadmap({
          id: "rdm_" + Math.random().toString(36).substring(2, 10),
          userId,
          targetCareerId: career.id,
          targetCareerTitle: career.title,
          phases,
          overallProgress: 15,
          generatedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }

    if (!roadmap) {
      return sendError(res, "Roadmap not available. Please complete onboarding first.", 404, "ROADMAP_NOT_FOUND");
    }

    return sendSuccess(res, roadmap);
  } catch (err: any) {
    return sendError(res, "Failed to load roadmap.", 500, "SERVER_ERROR", err.message);
  }
}

export async function regenerateRoadmap(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const userId = req.user.userId;
    const profile = db.getProfileByUserId(userId);
    if (!profile) return sendError(res, "Profile not found", 404);

    const targetCareerId = (req.body.careerId as string) || profile.currentDirection;
    const career = db.getCareerById(targetCareerId) || db.getCareers()[0];

    const phases = await generateRoadmap(profile, career);
    const roadmapDoc: RoadmapDoc = {
      id: "rdm_" + Math.random().toString(36).substring(2, 10),
      userId,
      targetCareerId: career.id,
      targetCareerTitle: career.title,
      phases,
      overallProgress: 10,
      generatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.upsertRoadmap(roadmapDoc);

    db.addTimelineEvent({
      id: "ev_" + Math.random().toString(36).substring(2, 10),
      userId,
      type: "roadmap",
      title: "Personalized Roadmap Regenerated",
      description: `Updated learning milestones for ${career.title}.`,
      timestamp: new Date().toISOString(),
    });

    return sendSuccess(res, roadmapDoc, "Roadmap regenerated successfully.");
  } catch (err: any) {
    return sendError(res, "Failed to regenerate roadmap.", 500, "SERVER_ERROR", err.message);
  }
}

export async function toggleTask(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const userId = req.user.userId;
    const { phaseId, taskId, taskType } = req.body; // taskType: "learning" | "practice" | "project"

    const roadmap = db.getRoadmapByUserId(userId);
    if (!roadmap) return sendError(res, "Roadmap not found", 404);

    const phase = roadmap.phases.find(p => p.id === phaseId);
    if (!phase) return sendError(res, "Phase not found", 404);

    let updatedItemTitle = "";

    if (taskType === "learning") {
      const task = phase.learningTasks.find(t => t.id === taskId);
      if (task) {
        task.completed = !task.completed;
        updatedItemTitle = task.title;
      }
    } else if (taskType === "practice") {
      const task = phase.practiceTasks.find(t => t.id === taskId);
      if (task) {
        task.completed = !task.completed;
        updatedItemTitle = task.title;
      }
    } else if (taskType === "project") {
      phase.project.completed = !phase.project.completed;
      updatedItemTitle = phase.project.title;
    }

    // Recalculate total tasks completed across all phases
    let totalTasks = 0;
    let completedTasks = 0;
    roadmap.phases.forEach((p, idx) => {
      p.learningTasks.forEach(t => { totalTasks++; if (t.completed) completedTasks++; });
      p.practiceTasks.forEach(t => { totalTasks++; if (t.completed) completedTasks++; });
      totalTasks++;
      if (p.project.completed) completedTasks++;

      // Unlock next phase if current phase is majority done
      const phaseCompleted = (p.learningTasks.every(t => t.completed) && p.practiceTasks.every(t => t.completed)) || p.project.completed;
      if (phaseCompleted && roadmap.phases[idx + 1]) {
        roadmap.phases[idx + 1].isUnlocked = true;
      }
    });

    roadmap.overallProgress = Math.round((completedTasks / Math.max(1, totalTasks)) * 100);
    roadmap.updatedAt = new Date().toISOString();
    db.upsertRoadmap(roadmap);

    // Update profile readiness slightly
    const profile = db.getProfileByUserId(userId);
    if (profile) {
      profile.readinessBreakdown.projects = Math.min(95, profile.readinessBreakdown.projects + 1);
      profile.readinessScore = Math.min(96, Math.max(profile.readinessScore, Math.round(55 + roadmap.overallProgress * 0.4)));
      db.upsertProfile(profile);
    }

    db.addTimelineEvent({
      id: "ev_" + Math.random().toString(36).substring(2, 10),
      userId,
      type: "roadmap",
      title: `Roadmap Progress: ${updatedItemTitle || "Task Completed"}`,
      description: `Overall roadmap completion is now ${roadmap.overallProgress}%.`,
      timestamp: new Date().toISOString(),
    });

    return sendSuccess(res, roadmap, "Task progress updated.");
  } catch (err: any) {
    return sendError(res, "Failed to toggle roadmap task.", 500, "SERVER_ERROR", err.message);
  }
}
