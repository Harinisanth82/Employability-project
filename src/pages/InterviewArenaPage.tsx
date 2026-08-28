import React, { useState, useEffect } from "react";
import { api } from "../services/api.js";
import { useToast } from "../context/ToastContext.js";
import { InterviewSession, InterviewFeedback } from "../types/index.js";
import { Card } from "../components/ui/Card.js";
import { Button } from "../components/ui/Button.js";
import { Badge } from "../components/ui/Badge.js";
import { ProgressBar } from "../components/ui/ProgressBar.js";
import { LoadingState } from "../components/ui/LoadingState.js";
import {
  Bot,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  MessageSquare,
  HelpCircle,
  Lightbulb,
} from "lucide-react";

export const InterviewArenaPage: React.FC<{ onNavigate: (route: string) => void }> = ({ onNavigate }) => {
  const toast = useToast();

  const [activeSession, setActiveSession] = useState<InterviewSession | null>(null);
  const [sessionsHistory, setSessionsHistory] = useState<InterviewSession[]>([]);
  const [careerTitle, setCareerTitle] = useState("Software Developer");
  const [interviewType, setInterviewType] = useState<"technical" | "behavioral" | "mixed">("mixed");
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answerText, setAnswerText] = useState("");
  const [currentFeedback, setCurrentFeedback] = useState<InterviewFeedback | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const history = await api.interview.getHistory();
      setSessionsHistory(history || []);
    } catch (err: any) {
      toast.error("Failed to load interview history: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleStartSession = async () => {
    setIsStarting(true);
    try {
      const session = await api.interview.startSession({
        careerTitle,
        type: interviewType,
        difficulty: "Intermediate",
      });
      setActiveSession(session);
      setCurrentQIndex(0);
      setAnswerText("");
      setCurrentFeedback(null);
      toast.success("Mock interview initialized with realistic Gemini prompts!");
    } catch (err: any) {
      toast.error("Failed to start mock session: " + err.message);
    } finally {
      setIsStarting(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!activeSession) return;
    const q = activeSession.questions[currentQIndex];
    if (!q || !answerText.trim()) {
      toast.error("Please enter your interview response.");
      return;
    }

    setIsSubmittingAnswer(true);
    try {
      const res = await api.interview.submitAnswer(activeSession.id, {
        questionId: q.id,
        answer: answerText,
      });

      setCurrentFeedback(res.feedback);
      // Update local question answer
      const updatedQuestions = [...activeSession.questions];
      updatedQuestions[currentQIndex] = {
        ...updatedQuestions[currentQIndex],
        userAnswer: answerText,
        feedback: res.feedback,
      };
      setActiveSession({
        ...activeSession,
        questions: updatedQuestions,
      });

      toast.success("Answer evaluated across 3 key hiring dimensions!");
    } catch (err: any) {
      toast.error("Failed to evaluate answer: " + err.message);
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  const handleNextQuestion = () => {
    if (!activeSession) return;
    if (currentQIndex < activeSession.questions.length - 1) {
      const nextIdx = currentQIndex + 1;
      setCurrentQIndex(nextIdx);
      const nextQ = activeSession.questions[nextIdx];
      setAnswerText(nextQ?.userAnswer || "");
      setCurrentFeedback(nextQ?.feedback || null);
    }
  };

  const handleFinishSession = async () => {
    if (!activeSession) return;
    try {
      await api.interview.completeSession(activeSession.id);
      toast.success("Interview session concluded and saved to your progress!");
      setActiveSession(null);
      loadHistory();
    } catch (err: any) {
      toast.error("Failed to complete session: " + err.message);
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading AI mock interview simulator..." />;
  }

  // Active Session View
  if (activeSession) {
    const currentQ = activeSession.questions[currentQIndex];
    const totalQuestions = activeSession.questions.length;

    return (
      <div id="active-interview-session" className="max-w-3xl mx-auto py-6 space-y-6">
        {/* Session Header */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Mock Simulation in Progress • Question {currentQIndex + 1} of {totalQuestions}
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {activeSession.careerTitle} ({activeSession.type})
            </h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleFinishSession}
          >
            End Simulation
          </Button>
        </div>

        {/* Question Prompt Card */}
        <Card variant="default" className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="primary" size="sm">
              {currentQ.category}
            </Badge>
            <span className="text-xs font-bold text-slate-400">
              Target Depth: {activeSession.difficulty}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
            {currentQ.questionText}
          </h3>

          {/* Contextual Tip */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <span>
              Tip: Structure your response logically. For technical questions, state trade-offs; for behavioral, use the Situation-Task-Action-Result (STAR) pattern.
            </span>
          </div>

          {/* Answer Text Area */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Your Candidate Response
            </label>
            <textarea
              id="interview-answer-input"
              rows={6}
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Type your structured answer here as you would speak it in a real interview..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500 font-sans leading-relaxed"
            />
          </div>

          {/* Submission / Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-400">
              {answerText.trim() ? `${answerText.trim().split(/\s+/).length} words` : "0 words"}
            </span>

            <div className="flex items-center gap-2">
              <Button
                id="submit-interview-answer-btn"
                variant="primary"
                size="sm"
                onClick={handleSubmitAnswer}
                disabled={!answerText.trim()}
                isLoading={isSubmittingAnswer}
                rightIcon={<Sparkles className="w-3.5 h-3.5" />}
              >
                Evaluate with AI
              </Button>

              {currentQIndex < totalQuestions - 1 ? (
                <Button
                  id="next-interview-q-btn"
                  variant="outline"
                  size="sm"
                  onClick={handleNextQuestion}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Next Question
                </Button>
              ) : (
                <Button
                  id="finish-interview-btn"
                  variant="academic"
                  size="sm"
                  onClick={handleFinishSession}
                >
                  Conclude Session
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* AI Evaluation Report (If Evaluated) */}
        {currentFeedback && (
          <Card variant="highlight" className="p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-sky-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  AI Hiring Panel Evaluation
                </h3>
              </div>
              <Badge
                variant={currentFeedback.score >= 80 ? "success" : currentFeedback.score >= 60 ? "primary" : "warning"}
                size="md"
              >
                Overall Score: {currentFeedback.score}%
              </Badge>
            </div>

            {/* 3 Metric Dimension Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Relevance</span>
                <ProgressBar value={currentFeedback.relevance} colorVariant="sky" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{currentFeedback.relevance}%</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Technical Depth</span>
                <ProgressBar value={currentFeedback.technicalAccuracy} colorVariant="emerald" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{currentFeedback.technicalAccuracy}%</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Clarity & Flow</span>
                <ProgressBar value={currentFeedback.clarity} colorVariant="purple" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{currentFeedback.clarity}%</span>
              </div>
            </div>

            {/* Strengths & Improvements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
                <h4 className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> What You Did Well
                </h4>
                <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                  {currentFeedback.strengths.map((str, sIdx) => (
                    <li key={sIdx} className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-amber-200 dark:border-amber-800/60 space-y-2">
                <h4 className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5" /> How to Strengthen Response
                </h4>
                <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                  {currentFeedback.improvements.map((imp, iIdx) => (
                    <li key={iIdx} className="flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Ideal Sample Answer */}
            {currentFeedback.suggestedIdealResponse && (
              <div className="p-4 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-sky-200 dark:border-sky-800/80 text-xs space-y-1.5">
                <span className="font-bold text-sky-800 dark:text-sky-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                  <Lightbulb className="w-3.5 h-3.5 text-sky-600" /> Model Benchmark Answer
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {currentFeedback.suggestedIdealResponse}
                </p>
              </div>
            )}
          </Card>
        )}
      </div>
    );
  }

  // Dashboard / Setup View
  return (
    <div id="interview-arena-dashboard" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <Bot className="w-3.5 h-3.5" /> AI Hiring Simulation
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Interview Arena
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Practice realistic technical and behavioral interview scenarios evaluated by Gemini AI with actionable multidimensional scoring.
          </p>
        </div>
      </div>

      {/* Start Session Setup Card */}
      <Card variant="highlight" className="p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
            Configure Mock Interview Simulation
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Select your target career track and question distribution to generate an interactive scenario.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Target Role Track
            </label>
            <select
              value={careerTitle}
              onChange={(e) => setCareerTitle(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="Software Developer">Software Developer (General Full-Stack)</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Full-Stack Developer">Full-Stack Developer</option>
              <option value="Data Analyst">Data Analyst</option>
              <option value="Machine Learning Engineer">Machine Learning Engineer</option>
              <option value="Cloud / DevOps Engineer">Cloud / DevOps Engineer</option>
              <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Interview Scenario Type
            </label>
            <select
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value as any)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="mixed">Mixed (Technical Architecture + Behavioral)</option>
              <option value="technical">Technical Depth & System Architecture</option>
              <option value="behavioral">Behavioral & Situation Leadership (STAR)</option>
            </select>
          </div>
        </div>

        <Button
          id="launch-mock-interview-btn"
          variant="academic"
          size="lg"
          className="w-full sm:w-auto"
          onClick={handleStartSession}
          isLoading={isStarting}
          rightIcon={<Play className="w-4 h-4 fill-current" />}
        >
          Generate Questions & Begin Simulation
        </Button>
      </Card>

      {/* Past Interview History */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-slate-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Completed Practice Simulations
          </h3>
        </div>

        {sessionsHistory.length === 0 ? (
          <p className="text-xs text-slate-500">No mock interview sessions recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {sessionsHistory.map((sess) => (
              <Card key={sess.id} variant="default" className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{sess.careerTitle}</span>
                    <Badge variant="neutral" size="sm">{sess.type}</Badge>
                  </div>
                  <p className="text-xs text-slate-500">
                    {new Date(sess.createdAt).toLocaleDateString()} • {sess.questions.length} questions completed
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={sess.overallScore >= 75 ? "success" : "primary"} size="md">
                    Average Score: {sess.overallScore}%
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
