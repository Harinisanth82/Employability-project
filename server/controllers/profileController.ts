import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { db } from "../db/database.js";
import { analyzeCareerProfile, generateRoadmap, recommendCareers, generateCareerInsights } from "../services/geminiService.js";
import { sendSuccess, sendError } from "../utils/responseUtils.js";
import { CareerProfileDoc } from "../db/models.js";

export async function getProfile(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const profile = db.getProfileByUserId(req.user.userId);
    if (!profile) {
      return sendError(res, "Profile has not been created yet.", 404, "PROFILE_NOT_FOUND");
    }
    return sendSuccess(res, profile);
  } catch (err: any) {
    return sendError(res, "Failed to load profile.", 500, "SERVER_ERROR", err.message);
  }
}

export async function submitOnboarding(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const userId = req.user.userId;

    const {
      education,
      technicalSkills = [],
      softSkills = [],
      interests = [],
      experience = { projects: [], internships: [], certifications: [], hackathons: [], achievements: [] },
      careerGoals = { preferredAreas: [], desiredRole: "Software Developer", shortTermGoal: "", longTermGoal: "" },
      workPreferences = { workStyle: "Flexible", focus: "Balanced", domain: "Product Development", orgType: "High-Growth Startup", location: "Hybrid" }
    } = req.body;

    if (!education || !education.degree || !education.department) {
      return sendError(res, "Education details (degree, department) are required.", 400, "VALIDATION_ERROR");
    }

    // Run AI analysis
    const partialProfile = {
      userId,
      education,
      technicalSkills,
      softSkills,
      interests,
      experience,
      careerGoals,
      workPreferences,
    };

    const aiMetrics = await analyzeCareerProfile(partialProfile);

    const now = new Date().toISOString();
    const profileDoc: CareerProfileDoc = {
      id: "prof_" + Math.random().toString(36).substring(2, 10),
      userId,
      education,
      technicalSkills,
      softSkills,
      interests,
      experience,
      careerGoals,
      workPreferences,
      readinessScore: aiMetrics.readinessScore || 72,
      readinessBreakdown: aiMetrics.readinessBreakdown || {
        technicalSkills: 75,
        projects: 70,
        communication: 75,
        problemSolving: 72,
        certifications: 60,
        interviewReadiness: 65,
      },
      currentDirection: aiMetrics.currentDirection || careerGoals.desiredRole || "Software Developer",
      matchPercentage: aiMetrics.matchPercentage || 85,
      directionExplanation: aiMetrics.directionExplanation || "Strong alignment with core engineering and problem solving.",
      biggestOpportunity: aiMetrics.biggestOpportunity || "Strengthen Backend Development and API Testing",
      nextBestAction: aiMetrics.nextBestAction || "Complete one Node.js REST API project with authentication",
      createdAt: now,
      updatedAt: now,
    };

    db.upsertProfile(profileDoc);
    db.updateUser(userId, { isOnboarded: true, targetCareerId: profileDoc.currentDirection });

    // Seed initial career recommendations
    const catalog = db.getCareers();
    const recs = await recommendCareers(profileDoc, null, catalog);
    db.upsertRecommendation({
      id: "rec_" + Math.random().toString(36).substring(2, 10),
      userId,
      recommendations: recs,
      generatedAt: now,
    });

    // Seed initial roadmap
    const targetCareer = db.getCareerById(profileDoc.currentDirection) || catalog[0];
    const roadmapPhases = await generateRoadmap(profileDoc, targetCareer);
    db.upsertRoadmap({
      id: "rdm_" + Math.random().toString(36).substring(2, 10),
      userId,
      targetCareerId: targetCareer.id,
      targetCareerTitle: targetCareer.title,
      phases: roadmapPhases,
      overallProgress: 15,
      generatedAt: now,
      updatedAt: now,
    });

    // Initial timeline event
    db.addTimelineEvent({
      id: "ev_" + Math.random().toString(36).substring(2, 10),
      userId,
      type: "skill",
      title: "Career Profile Created",
      description: `Completed career profile setup with target focus in ${targetCareer.title}.`,
      timestamp: now,
    });

    // Generate initial insights
    const initialInsights = await generateCareerInsights(profileDoc, roadmapPhases, [], []);
    db.upsertInsights(userId, initialInsights);

    return sendSuccess(res, profileDoc, "Career profile created successfully.", 201);
  } catch (err: any) {
    return sendError(res, "Failed to submit onboarding profile.", 500, "SERVER_ERROR", err.message);
  }
}

export async function updateProfile(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const userId = req.user.userId;
    const existing = db.getProfileByUserId(userId);
    if (!existing) {
      return sendError(res, "Profile not found. Please complete onboarding first.", 404, "PROFILE_NOT_FOUND");
    }

    const {
      education,
      technicalSkills,
      softSkills,
      interests,
      experience,
      careerGoals,
      workPreferences,
    } = req.body;

    const updatedPartial: Partial<CareerProfileDoc> = {
      ...existing,
      education: education || existing.education,
      technicalSkills: technicalSkills || existing.technicalSkills,
      softSkills: softSkills || existing.softSkills,
      interests: interests || existing.interests,
      experience: experience || existing.experience,
      careerGoals: careerGoals || existing.careerGoals,
      workPreferences: workPreferences || existing.workPreferences,
    };

    // Re-evaluate metrics
    const aiMetrics = await analyzeCareerProfile(updatedPartial);
    const updatedDoc: CareerProfileDoc = {
      ...existing,
      ...updatedPartial,
      readinessScore: aiMetrics.readinessScore || existing.readinessScore,
      readinessBreakdown: aiMetrics.readinessBreakdown || existing.readinessBreakdown,
      currentDirection: aiMetrics.currentDirection || existing.currentDirection,
      matchPercentage: aiMetrics.matchPercentage || existing.matchPercentage,
      directionExplanation: aiMetrics.directionExplanation || existing.directionExplanation,
      biggestOpportunity: aiMetrics.biggestOpportunity || existing.biggestOpportunity,
      nextBestAction: aiMetrics.nextBestAction || existing.nextBestAction,
      updatedAt: new Date().toISOString(),
    } as CareerProfileDoc;

    db.upsertProfile(updatedDoc);

    db.addTimelineEvent({
      id: "ev_" + Math.random().toString(36).substring(2, 10),
      userId,
      type: "skill",
      title: "Profile Updated",
      description: "Updated technical competencies and career preferences.",
      timestamp: new Date().toISOString(),
    });

    return sendSuccess(res, updatedDoc, "Profile updated successfully.");
  } catch (err: any) {
    return sendError(res, "Failed to update profile.", 500, "SERVER_ERROR", err.message);
  }
}

export async function setTargetCareer(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const userId = req.user.userId;
    const { careerId } = req.body;

    const career = db.getCareerById(careerId);
    if (!career) return sendError(res, "Career not found.", 404);

    const profile = db.getProfileByUserId(userId);
    if (!profile) return sendError(res, "Profile not found", 404);

    profile.currentDirection = career.title;
    db.upsertProfile(profile);
    db.updateUser(userId, { targetCareerId: career.id });

    // Regenerate roadmap for new target career
    const roadmapPhases = await generateRoadmap(profile, career);
    db.upsertRoadmap({
      id: "rdm_" + Math.random().toString(36).substring(2, 10),
      userId,
      targetCareerId: career.id,
      targetCareerTitle: career.title,
      phases: roadmapPhases,
      overallProgress: 10,
      generatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    db.addTimelineEvent({
      id: "ev_" + Math.random().toString(36).substring(2, 10),
      userId,
      type: "roadmap",
      title: `Selected Target Role: ${career.title}`,
      description: `Generated new personalized roadmap aligned with ${career.title} competencies.`,
      timestamp: new Date().toISOString(),
    });

    return sendSuccess(res, { targetCareer: career, profile }, `Active target career set to ${career.title}.`);
  } catch (err: any) {
    return sendError(res, "Failed to set target career.", 500, "SERVER_ERROR", err.message);
  }
}
