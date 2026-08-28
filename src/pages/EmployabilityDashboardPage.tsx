import React, { useState, useEffect } from "react";
import { api } from "../services/api.js";
import { useToast } from "../context/ToastContext.js";
import { EmployabilityReadiness } from "../types/index.js";
import { Card } from "../components/ui/Card.js";
import { Button } from "../components/ui/Button.js";
import { Badge } from "../components/ui/Badge.js";
import { ProgressRing } from "../components/ui/ProgressRing.js";
import { ProgressBar } from "../components/ui/ProgressBar.js";
import { LoadingState } from "../components/ui/LoadingState.js";
import {
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FileText,
  ShieldCheck,
  Bot,
  MapPin,
} from "lucide-react";

export const EmployabilityDashboardPage: React.FC<{ onNavigate: (route: string) => void }> = ({ onNavigate }) => {
  const toast = useToast();

  const [readiness, setReadiness] = useState<EmployabilityReadiness | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.progress
      .getEmployability()
      .then((data) => setReadiness(data))
      .catch((err) => toast.error("Failed to load employability scorecard: " + err.message))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <LoadingState message="Calculating composite employability readiness scorecard..." />;
  }

  if (!readiness) return null;

  return (
    <div id="employability-readiness-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Holistic Employability Metric
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Employability Readiness Scorecard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Standardized evaluation matrix measuring your real-world hiring preparedness for <strong>{readiness.careerTitle}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            id="readiness-interview-btn"
            variant="outline"
            size="sm"
            onClick={() => onNavigate("/interview")}
            leftIcon={<Bot className="w-3.5 h-3.5 text-rose-600" />}
          >
            Practice Interviews
          </Button>
          <Button
            id="readiness-roadmap-btn"
            variant="academic"
            size="sm"
            onClick={() => onNavigate("/roadmap")}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Open Roadmap
          </Button>
        </div>
      </div>

      {/* Main Score Overview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card variant="highlight" className="lg:col-span-5 flex flex-col items-center justify-center p-6 sm:p-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">
            Composite Employability Readiness
          </span>

          <div className="py-2">
            <ProgressRing
              score={readiness.overallScore}
              size={160}
              strokeWidth={14}
              label={readiness.tier}
              sublabel="Score Index"
              colorVariant={readiness.overallScore > 75 ? "emerald" : "sky"}
            />
          </div>

          <Badge variant="primary" size="md">
            Status: {readiness.tier}
          </Badge>

          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm leading-relaxed">
            Derived from objective verification of technical skills, capstone deliverables, structured psychometrics, and mock interview performance.
          </p>
        </Card>

        {/* Strengths & Bottlenecks */}
        <div className="lg:col-span-7 space-y-6">
          <Card variant="default" className="p-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Validated Core Strengths
            </h3>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {readiness.strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span className="leading-relaxed font-medium">{str}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card variant="default" className="p-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Key Bottlenecks Before Applications
            </h3>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {readiness.bottlenecks.map((bot, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span className="leading-relaxed font-medium">{bot}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      {/* 6-Factor Pillar Breakdown */}
      <Card variant="default" className="p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
            Multi-Factor Pillar Breakdown
          </h3>
          <p className="text-xs text-slate-500">
            Detailed performance across the six primary employability dimensions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <ProgressBar
              label="Technical Competency Index"
              value={readiness.factors.technical}
              showPercentage
              colorVariant="sky"
            />
            <ProgressBar
              label="Project Evidence & Portfolio Quality"
              value={readiness.factors.projects}
              showPercentage
              colorVariant="emerald"
            />
            <ProgressBar
              label="Assessment & Role Alignment"
              value={readiness.factors.assessment}
              showPercentage
              colorVariant="purple"
            />
          </div>

          <div className="space-y-4">
            <ProgressBar
              label="Mock Interview & Communication"
              value={readiness.factors.interview}
              showPercentage
              colorVariant="rose"
            />
            <ProgressBar
              label="Algorithmic & Problem Solving"
              value={readiness.factors.problemSolving}
              showPercentage
              colorVariant="amber"
            />
            <ProgressBar
              label="Soft Skills & Team Collaboration"
              value={readiness.factors.softSkills}
              showPercentage
              colorVariant="sky"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
