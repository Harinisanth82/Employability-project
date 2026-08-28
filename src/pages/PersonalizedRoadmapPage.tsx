import React, { useState, useEffect } from "react";
import { api } from "../services/api.js";
import { useToast } from "../context/ToastContext.js";
import { CareerRoadmap } from "../types/index.js";
import { Card } from "../components/ui/Card.js";
import { Button } from "../components/ui/Button.js";
import { Badge } from "../components/ui/Badge.js";
import { ProgressBar } from "../components/ui/ProgressBar.js";
import { RoadmapPhaseCard } from "../components/cards/RoadmapPhaseCard.js";
import { LoadingState } from "../components/ui/LoadingState.js";
import { MapPin, RefreshCw, Sparkles, CheckCircle2, Clock, Layers, Award } from "lucide-react";

export const PersonalizedRoadmapPage: React.FC<{ onNavigate: (route: string) => void }> = ({ onNavigate }) => {
  const toast = useToast();

  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const loadRoadmap = async () => {
    setIsLoading(true);
    try {
      const data = await api.roadmap.get();
      setRoadmap(data);
    } catch (err: any) {
      toast.error("Failed to load career roadmap: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRoadmap();
  }, []);

  const handleToggleTask = async (
    phaseId: string,
    taskId: string,
    taskType: "learning" | "practice" | "project"
  ) => {
    if (!roadmap) return;
    try {
      const updated = await api.roadmap.toggleTask(phaseId, taskId, taskType);
      setRoadmap(updated);
      toast.success("Progress milestone updated!");
    } catch (err: any) {
      toast.error("Failed to update task: " + err.message);
    }
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const updated = await api.roadmap.regenerate();
      setRoadmap(updated);
      toast.success("Custom 5-phase career curriculum regenerated with Gemini AI!");
    } catch (err: any) {
      toast.error("Failed to regenerate roadmap.");
    } finally {
      setIsRegenerating(false);
    }
  };

  if (isLoading) {
    return <LoadingState message="Synthesizing personalized 5-phase career curriculum..." />;
  }

  if (!roadmap) return null;

  return (
    <div id="personalized-roadmap-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Structured Career Progression
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Personalized 5-Phase Roadmap
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Curated sequence of milestones moving from foundational principles to full capstone engineering for <strong>{roadmap.careerTitle}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            id="roadmap-evidence-btn"
            variant="outline"
            size="sm"
            onClick={() => onNavigate("/evidence")}
            leftIcon={<Award className="w-3.5 h-3.5 text-purple-600" />}
          >
            Proof of Skills
          </Button>
          <Button
            id="roadmap-recalc-btn"
            variant="outline"
            size="sm"
            onClick={handleRegenerate}
            isLoading={isRegenerating}
            leftIcon={<RefreshCw className="w-3.5 h-3.5 text-sky-600" />}
          >
            Regenerate AI Plan
          </Button>
        </div>
      </div>

      {/* Overview Card with Progress Ring / Bar */}
      <Card variant="highlight" className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="primary" size="sm">
                Target Role
              </Badge>
              <Badge variant="success" size="sm">
                Estimated {roadmap.totalEstimatedDuration}
              </Badge>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
              {roadmap.careerTitle}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Curriculum Progress
              </span>
              <p className="text-2xl font-black text-sky-600 dark:text-sky-400">
                {roadmap.overallProgress}%
              </p>
            </div>
          </div>
        </div>

        <ProgressBar
          label="Overall Milestones Completed"
          value={roadmap.overallProgress}
          showPercentage
          colorVariant="sky"
        />
      </Card>

      {/* 5 Phase Cards */}
      <div className="space-y-6">
        {roadmap.phases.map((phase) => (
          <RoadmapPhaseCard
            key={phase.id}
            phase={phase}
            onToggleTask={handleToggleTask}
          />
        ))}
      </div>
    </div>
  );
};
