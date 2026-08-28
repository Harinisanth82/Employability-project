import React from "react";

export interface ProgressRingProps {
  score: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  colorVariant?: "sky" | "emerald" | "amber" | "indigo";
  id?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  score,
  size = 120,
  strokeWidth = 10,
  label = "Readiness",
  sublabel = "Estimate",
  colorVariant = "sky",
  id,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clampedScore = Math.min(100, Math.max(0, score));
  const offset = circumference - (clampedScore / 100) * circumference;

  const colorMap = {
    sky: "#0284c7",
    emerald: "#10b981",
    amber: "#f59e0b",
    indigo: "#6366f1",
  };

  const strokeColor = colorMap[colorVariant] || "#0284c7";

  return (
    <div id={id} className="relative inline-flex flex-col items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-slate-100 dark:text-slate-800"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          {clampedScore}%
        </span>
        {label && (
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">
            {label}
          </span>
        )}
      </div>
      {sublabel && (
        <span className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
          {sublabel}
        </span>
      )}
    </div>
  );
};
