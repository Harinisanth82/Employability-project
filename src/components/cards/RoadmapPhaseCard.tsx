import React from "react";
import { RoadmapPhase } from "../../types/index.js";
import { Card } from "../ui/Card.js";
import { Badge } from "../ui/Badge.js";
import { CheckCircle2, Circle, Lock, Clock, Code, BookOpen, Layers } from "lucide-react";

export const RoadmapPhaseCard: React.FC<{
  phase: RoadmapPhase;
  onToggleTask: (phaseId: string, taskId: string, taskType: "learning" | "practice" | "project") => void;
}> = ({ phase, onToggleTask }) => {
  const isPhaseDone =
    phase.learningTasks.every((t) => t.completed) &&
    phase.practiceTasks.every((t) => t.completed) &&
    phase.project.completed;

  return (
    <Card
      id={`roadmap-phase-${phase.id}`}
      variant={isPhaseDone ? "highlight" : "default"}
      className={`relative overflow-hidden transition-all ${
        !phase.isUnlocked ? "opacity-70 bg-slate-50 dark:bg-slate-900/40" : ""
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-md bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold uppercase tracking-wider">
              Phase {phase.phaseNumber}
            </span>
            {isPhaseDone ? (
              <Badge variant="success" size="sm">
                Completed
              </Badge>
            ) : !phase.isUnlocked ? (
              <Badge variant="neutral" size="sm">
                <Lock className="w-3 h-3 mr-1" /> Locked
              </Badge>
            ) : (
              <Badge variant="primary" size="sm">
                In Progress
              </Badge>
            )}
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {phase.title}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed max-w-2xl">
            {phase.description}
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl shrink-0 self-start">
          <Clock className="w-3.5 h-3.5 text-sky-600" />
          <span>{phase.estimatedEffort}</span>
        </div>
      </div>

      {/* Skills targeted */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {phase.skills.map((skill, sIdx) => (
          <span
            key={sIdx}
            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* 2-Column Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        {/* Learning Tasks */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-sky-600" /> Learning Objectives
          </h4>
          <div className="space-y-2">
            {phase.learningTasks.map((task) => (
              <div
                key={task.id}
                id={`task-learning-${task.id}`}
                onClick={() => phase.isUnlocked && onToggleTask(phase.id, task.id, "learning")}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                  task.completed
                    ? "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-100"
                    : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                } ${!phase.isUnlocked ? "pointer-events-none opacity-60" : ""}`}
              >
                {task.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600 mt-0.5 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold ${task.completed ? "line-through opacity-80" : "text-slate-800 dark:text-slate-200"}`}>
                    {task.title}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{task.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Practice Tasks */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Code className="w-3.5 h-3.5 text-indigo-600" /> Hands-On Practice
          </h4>
          <div className="space-y-2">
            {phase.practiceTasks.map((task) => (
              <div
                key={task.id}
                id={`task-practice-${task.id}`}
                onClick={() => phase.isUnlocked && onToggleTask(phase.id, task.id, "practice")}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                  task.completed
                    ? "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-100"
                    : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                } ${!phase.isUnlocked ? "pointer-events-none opacity-60" : ""}`}
              >
                {task.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600 mt-0.5 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold ${task.completed ? "line-through opacity-80" : "text-slate-800 dark:text-slate-200"}`}>
                    {task.title}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{task.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Capstone Project Deliverable */}
      {phase.project && (
        <div
          id={`project-${phase.id}`}
          onClick={() => phase.isUnlocked && onToggleTask(phase.id, "project", "project")}
          className={`mt-4 p-4 rounded-xl border transition-all cursor-pointer select-none ${
            phase.project.completed
              ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800"
              : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300"
          } ${!phase.isUnlocked ? "pointer-events-none opacity-60" : ""}`}
        >
          <div className="flex items-start gap-3">
            {phase.project.completed ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
            ) : (
              <Layers className="w-5 h-5 text-sky-600 mt-0.5 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">
                  Phase Capstone Project
                </span>
                <Badge variant={phase.project.completed ? "success" : "neutral"} size="sm">
                  {phase.project.completed ? "Delivered" : "Pending Build"}
                </Badge>
              </div>
              <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">{phase.project.title}</h5>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                {phase.project.description}
              </p>

              {phase.project.deliverables && (
                <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px]">
                  {phase.project.deliverables.map((del, dIdx) => (
                    <span key={dIdx} className="text-slate-500 dark:text-slate-400">
                      • {del}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
