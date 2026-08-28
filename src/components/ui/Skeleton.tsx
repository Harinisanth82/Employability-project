import React from "react";

export const Skeleton: React.FC<{ className?: string; id?: string }> = ({ className = "h-4 w-full", id }) => (
  <div id={id} className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-lg ${className}`} />
);

export const EmptyState: React.FC<{
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  id?: string;
}> = ({ icon, title, description, action, id }) => (
  <div id={id} className="flex flex-col items-center justify-center p-8 md:p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
    {icon && <div className="p-3 mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">{icon}</div>}
    <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">{title}</h4>
    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1.5 mb-5 leading-relaxed">{description}</p>
    {action}
  </div>
);

export const LoadingState: React.FC<{ message?: string; id?: string }> = ({ message = "Loading career intelligence data...", id }) => (
  <div id={id} className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-10 h-10 border-3 border-sky-500/20 border-t-sky-600 rounded-full animate-spin mb-4" />
    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{message}</p>
  </div>
);
