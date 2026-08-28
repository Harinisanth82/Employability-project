import React, { useState, useEffect } from "react";
import { api } from "../services/api.js";
import { useToast } from "../context/ToastContext.js";
import { AssessmentQuestion, Assessment, AssessmentAnswer } from "../types/index.js";
import { Card } from "../components/ui/Card.js";
import { Button } from "../components/ui/Button.js";
import { Badge } from "../components/ui/Badge.js";
import { ProgressBar } from "../components/ui/ProgressBar.js";
import { LoadingState } from "../components/ui/LoadingState.js";
import {
  ClipboardCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Award,
  RefreshCw,
  Target,
  Layers,
} from "lucide-react";

export const CareerAssessmentPage: React.FC<{ onNavigate: (route: string) => void }> = ({ onNavigate }) => {
  const toast = useToast();

  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionText, setSelectedOptionText] = useState<string>("");
  const [answers, setAnswers] = useState<AssessmentAnswer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedResult, setCompletedResult] = useState<Assessment | null>(null);

  useEffect(() => {
    loadQuestionsAndAssessment();
  }, []);

  const loadQuestionsAndAssessment = async () => {
    setIsLoading(true);
    try {
      const [qData, aData] = await Promise.all([
        api.assessment.getQuestions(),
        api.assessment.getCurrent(),
      ]);

      const qList: AssessmentQuestion[] = qData.questions || [];
      setQuestions(qList);
      setCurrentAssessment(aData);

      if (aData && aData.isCompleted) {
        setCompletedResult(aData);
      } else if (aData && aData.answers) {
        setAnswers(aData.answers);
        const idx = Math.min(qList.length - 1, aData.currentQuestionIndex || 0);
        setCurrentIndex(idx);

        const currentQ = qList[idx];
        if (currentQ) {
          const pastAns = aData.answers.find((a: any) => a.questionId === currentQ.id);
          if (pastAns) {
            setSelectedOptionText(pastAns.selectedOption as string);
          }
        }
      }
    } catch (err: any) {
      toast.error("Failed to load assessment: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (option: { text: string; score: number }) => {
    setSelectedOptionText(option.text);

    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const newAnswer: AssessmentAnswer = {
      questionId: currentQ.id,
      category: currentQ.category,
      questionText: currentQ.questionText,
      selectedOption: option.text,
      score: option.score,
    };

    const updatedAnswers = answers.filter((a) => a.questionId !== currentQ.id);
    updatedAnswers.push(newAnswer);
    setAnswers(updatedAnswers);

    // Autosave progress
    api.assessment.saveProgress({
      currentQuestionIndex: currentIndex,
      answers: updatedAnswers,
    }).catch(() => {});
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      const nextQ = questions[nextIdx];
      const pastAns = answers.find((a) => a.questionId === nextQ.id);
      setSelectedOptionText(pastAns ? (pastAns.selectedOption as string) : "");
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      const prevQ = questions[prevIdx];
      const pastAns = answers.find((a) => a.questionId === prevQ.id);
      setSelectedOptionText(pastAns ? (pastAns.selectedOption as string) : "");
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await api.assessment.submit({ answers });
      setCompletedResult(res);
      toast.success("Assessment evaluated by AI! Archetype and career weights recalculated.");
    } catch (err: any) {
      toast.error("Failed to submit assessment: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetake = () => {
    setCompletedResult(null);
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedOptionText("");
  };

  if (isLoading) {
    return <LoadingState message="Loading career assessment questions..." />;
  }

  // Completed Results View
  if (completedResult && completedResult.aiAnalysis) {
    const analysis = completedResult.aiAnalysis;
    return (
      <div id="assessment-result" className="max-w-3xl mx-auto py-6 space-y-6">
        <Card variant="highlight" className="p-6 sm:p-8 space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Award className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">
              Assessment Completed
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Dominant Archetype: {analysis.dominantArchetype}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
              {analysis.summary}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-4">
            <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Core Strengths
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {analysis.keyStrengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-amber-200 dark:border-amber-800/60 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <Target className="w-4 h-4" /> Growth Areas
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {analysis.growthAreas.map((area, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-sky-200/60 dark:border-sky-800/60">
            <Button
              id="assessment-view-discovery-btn"
              variant="primary"
              size="md"
              onClick={() => onNavigate("/discovery")}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Explore Matched Career Paths
            </Button>
            <Button
              id="assessment-retake-btn"
              variant="outline"
              size="md"
              onClick={handleRetake}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Retake Assessment
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  const progressPct = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div id="assessment-container" className="max-w-3xl mx-auto py-6 space-y-6">
      {/* Header with Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
          <span className="uppercase tracking-wider">
            Question {currentIndex + 1} of {questions.length} • {currentQ.category}
          </span>
          <span>{progressPct}% Completed</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-sky-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <Card variant="default" className="p-6 sm:p-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="primary" size="sm">
              {currentQ.category}
            </Badge>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-snug">
            {currentQ.questionText}
          </h2>
        </div>

        {/* Options Selection */}
        <div className="space-y-3 pt-2">
          {currentQ.options.map((option, oIdx) => {
            const isSelected = selectedOptionText === option.text;
            return (
              <button
                key={oIdx}
                id={`q-opt-${currentIndex}-${oIdx}`}
                type="button"
                onClick={() => handleSelectOption(option)}
                className={`w-full p-4 rounded-xl text-left border transition-all flex items-start justify-between gap-3 text-xs sm:text-sm font-medium ${
                  isSelected
                    ? "bg-sky-50 dark:bg-sky-950/80 border-sky-500 text-sky-950 dark:text-sky-100 shadow-sm"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 ${
                    isSelected ? "border-sky-600 bg-sky-600 text-white" : "border-slate-300 dark:border-slate-700 text-slate-400"
                  }`}>
                    {String.fromCharCode(65 + oIdx)}
                  </span>
                  <span>{option.text}</span>
                </div>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />}
              </button>
            );
          })}
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
          <Button
            id="q-prev-btn"
            variant="outline"
            size="md"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Previous
          </Button>

          {currentIndex < questions.length - 1 ? (
            <Button
              id="q-next-btn"
              variant="primary"
              size="md"
              onClick={handleNext}
              disabled={!selectedOptionText}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Next Question
            </Button>
          ) : (
            <Button
              id="q-submit-btn"
              variant="academic"
              size="md"
              onClick={handleSubmit}
              disabled={!selectedOptionText}
              isLoading={isSubmitting}
              rightIcon={<Sparkles className="w-4 h-4 text-sky-400" />}
            >
              Submit & Analyze
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
