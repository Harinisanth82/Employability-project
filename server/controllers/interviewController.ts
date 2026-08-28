import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { db } from "../db/database.js";
import { generateInterviewQuestions, evaluateInterviewAnswer, generateInterviewSummary } from "../services/geminiService.js";
import { sendSuccess, sendError } from "../utils/responseUtils.js";
import { InterviewDoc } from "../db/models.js";

export async function getInterviews(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const interviews = db.getInterviewsByUserId(req.user.userId);
    return sendSuccess(res, interviews);
  } catch (err: any) {
    return sendError(res, "Failed to load interviews.", 500, "SERVER_ERROR", err.message);
  }
}

export async function getInterviewById(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const { id } = req.params;
    const interview = db.getInterviewById(id, req.user.userId);
    if (!interview) return sendError(res, "Interview session not found.", 404);
    return sendSuccess(res, interview);
  } catch (err: any) {
    return sendError(res, "Failed to retrieve interview session.", 500, "SERVER_ERROR", err.message);
  }
}

export async function startInterview(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const userId = req.user.userId;
    const {
      careerTitle = "Software Developer",
      difficulty = "Entry-Level",
      interviewType = "Technical",
    } = req.body;

    const questions = await generateInterviewQuestions(careerTitle, difficulty, interviewType);

    const now = new Date().toISOString();
    const newInterview: InterviewDoc = {
      id: "int_" + Math.random().toString(36).substring(2, 10),
      userId,
      careerTitle,
      difficulty,
      interviewType,
      status: "in_progress",
      questions,
      answers: [],
      createdAt: now,
    };

    db.insertInterview(newInterview);
    return sendSuccess(res, newInterview, "Mock interview session started.", 201);
  } catch (err: any) {
    return sendError(res, "Failed to start interview session.", 500, "SERVER_ERROR", err.message);
  }
}

export async function answerQuestion(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const userId = req.user.userId;
    const { id } = req.params;
    const { questionId, answerText } = req.body;

    if (!questionId || !answerText || typeof answerText !== "string") {
      return sendError(res, "Question ID and answer text are required.", 400, "VALIDATION_ERROR");
    }

    const interview = db.getInterviewById(id, userId);
    if (!interview) return sendError(res, "Interview not found.", 404);

    const q = interview.questions.find(item => item.id === questionId);
    if (!q) return sendError(res, "Question not found in this interview.", 404);

    // AI Evaluation
    const evaluation = await evaluateInterviewAnswer(
      interview.careerTitle,
      q.question,
      answerText,
      interview.interviewType
    );

    // Upsert answer
    const existingIdx = interview.answers.findIndex(a => a.questionId === questionId);
    if (existingIdx !== -1) {
      interview.answers[existingIdx] = { questionId, answerText, evaluation };
    } else {
      interview.answers.push({ questionId, answerText, evaluation });
    }

    db.updateInterview(id, userId, { answers: interview.answers });

    return sendSuccess(res, { answer: { questionId, answerText, evaluation }, interview }, "Answer evaluated.");
  } catch (err: any) {
    return sendError(res, "Failed to evaluate answer.", 500, "SERVER_ERROR", err.message);
  }
}

export async function finalizeInterview(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const userId = req.user.userId;
    const { id } = req.params;

    const interview = db.getInterviewById(id, userId);
    if (!interview) return sendError(res, "Interview not found.", 404);

    const answersWithEval = interview.answers.map(ans => {
      const q = interview.questions.find(item => item.id === ans.questionId);
      return {
        question: q?.question || "Question",
        answerText: ans.answerText,
        evaluation: ans.evaluation,
      };
    });

    const summary = await generateInterviewSummary(interview.careerTitle, answersWithEval);
    const now = new Date().toISOString();

    const updated = db.updateInterview(id, userId, {
      status: "completed",
      finalSummary: summary,
      completedAt: now,
    });

    // Update profile interview readiness score
    const profile = db.getProfileByUserId(userId);
    if (profile) {
      profile.readinessBreakdown.interviewReadiness = Math.min(95, Math.max(65, summary.overallScore));
      profile.readinessBreakdown.communication = Math.min(95, profile.readinessBreakdown.communication + 3);
      profile.readinessScore = Math.min(95, profile.readinessScore + 4);
      db.upsertProfile(profile);
    }

    db.addTimelineEvent({
      id: "ev_" + Math.random().toString(36).substring(2, 10),
      userId,
      type: "interview",
      title: `Mock Interview Completed: ${interview.careerTitle} (${interview.interviewType})`,
      description: `Scored ${summary.overallScore}%. Evaluated technical depth, clarity, and communication structure.`,
      timestamp: now,
    });

    return sendSuccess(res, updated, "Interview finalized with performance summary.");
  } catch (err: any) {
    return sendError(res, "Failed to finalize interview.", 500, "SERVER_ERROR", err.message);
  }
}
