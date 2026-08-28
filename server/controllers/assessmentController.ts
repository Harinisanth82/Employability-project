import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { db } from "../db/database.js";
import { ASSESSMENT_QUESTIONS } from "../db/seedData.js";
import { recommendCareers } from "../services/geminiService.js";
import { sendSuccess, sendError } from "../utils/responseUtils.js";
import { AssessmentDoc } from "../db/models.js";

export async function getAssessmentQuestions(req: AuthenticatedRequest, res: Response) {
  try {
    return sendSuccess(res, {
      totalQuestions: ASSESSMENT_QUESTIONS.length,
      questions: ASSESSMENT_QUESTIONS,
    });
  } catch (err: any) {
    return sendError(res, "Failed to load assessment questions.", 500, "SERVER_ERROR", err.message);
  }
}

export async function getCurrentAssessment(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const assessment = db.getAssessmentByUserId(req.user.userId);
    return sendSuccess(res, assessment || {
      isCompleted: false,
      currentQuestionIndex: 0,
      answers: [],
      categoryScores: {},
    });
  } catch (err: any) {
    return sendError(res, "Failed to load assessment progress.", 500, "SERVER_ERROR", err.message);
  }
}

export async function saveProgress(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const userId = req.user.userId;
    const { currentQuestionIndex, answers = [], categoryScores = {} } = req.body;

    const existing = db.getAssessmentByUserId(userId);
    const doc: AssessmentDoc = {
      id: existing?.id || "ass_" + Math.random().toString(36).substring(2, 10),
      userId,
      currentQuestionIndex: typeof currentQuestionIndex === "number" ? currentQuestionIndex : 0,
      isCompleted: false,
      answers,
      categoryScores,
      startedAt: existing?.startedAt || new Date().toISOString(),
    };

    db.upsertAssessment(doc);
    return sendSuccess(res, doc, "Assessment progress autosaved.");
  } catch (err: any) {
    return sendError(res, "Failed to save assessment progress.", 500, "SERVER_ERROR", err.message);
  }
}

export async function submitAssessment(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const userId = req.user.userId;
    const { answers = [] } = req.body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return sendError(res, "Assessment answers are required.", 400, "VALIDATION_ERROR");
    }

    // Compute category scores & archetype
    const categoryTotals: Record<string, { total: number; count: number }> = {};
    const careerWeights: Record<string, number> = {};

    answers.forEach((ans: any) => {
      const cat = ans.category || "General";
      if (!categoryTotals[cat]) categoryTotals[cat] = { total: 0, count: 0 };
      categoryTotals[cat].total += ans.score || 70;
      categoryTotals[cat].count += 1;

      // Find matching question weights
      const q = ASSESSMENT_QUESTIONS.find(item => item.id === ans.questionId);
      if (q) {
        const opt = q.options.find(o => o.text === ans.selectedOption);
        if (opt && (opt as any).weight) {
          for (const [cId, wt] of Object.entries((opt as any).weight as Record<string, number>)) {
            careerWeights[cId] = (careerWeights[cId] || 0) + wt;
          }
        }
      }
    });

    const categoryScores: Record<string, number> = {};
    for (const [cat, data] of Object.entries(categoryTotals)) {
      categoryScores[cat] = Math.round(data.total / Math.max(1, data.count));
    }

    // Determine top archetype
    let dominantArchetype = "Practical Full-Stack Builder";
    if ((categoryScores["Problem Solving"] || 0) > 85 && (categoryScores["Skills"] || 0) > 80) {
      dominantArchetype = "Algorithmic Systems Architect";
    } else if ((categoryScores["Interests"] || 0) > 85) {
      dominantArchetype = "Analytical Data & Intelligence Explorer";
    }

    const now = new Date().toISOString();
    const assessmentDoc: AssessmentDoc = {
      id: "ass_" + Math.random().toString(36).substring(2, 10),
      userId,
      currentQuestionIndex: ASSESSMENT_QUESTIONS.length - 1,
      isCompleted: true,
      answers,
      categoryScores,
      aiAnalysis: {
        summary: `Assessment reveals a strong affinity for structured systems thinking with high interest in hands-on building.`,
        dominantArchetype,
        keyStrengths: [
          "High analytical resilience when deconstructing complex technical obstacles",
          "Balanced approach between system reliability and rapid product prototyping",
          "Structured debugging instincts"
        ],
        growthAreas: [
          "Deepen test automation and end-to-end continuous deployment routines",
          "Quantify trade-offs in distributed data consistency"
        ],
        recommendedCareerFocus: Object.keys(careerWeights).slice(0, 3),
      },
      startedAt: now,
      completedAt: now,
    };

    db.upsertAssessment(assessmentDoc);

    // Update career recommendations with new assessment signals
    const profile = db.getProfileByUserId(userId);
    if (profile) {
      const catalog = db.getCareers();
      const updatedRecs = await recommendCareers(profile, assessmentDoc, catalog);
      db.upsertRecommendation({
        id: "rec_" + Math.random().toString(36).substring(2, 10),
        userId,
        recommendations: updatedRecs,
        generatedAt: now,
      });

      // Boost readiness
      profile.readinessBreakdown.problemSolving = Math.min(95, profile.readinessBreakdown.problemSolving + 5);
      profile.readinessScore = Math.min(95, profile.readinessScore + 4);
      db.upsertProfile(profile);
    }

    db.addTimelineEvent({
      id: "ev_" + Math.random().toString(36).substring(2, 10),
      userId,
      type: "assessment",
      title: "Career Assessment Completed",
      description: `Evaluated 15 multidimensional factors. Dominant Archetype: ${dominantArchetype}.`,
      timestamp: now,
    });

    return sendSuccess(res, assessmentDoc, "Career assessment submitted and analyzed successfully.");
  } catch (err: any) {
    return sendError(res, "Failed to submit assessment.", 500, "SERVER_ERROR", err.message);
  }
}
