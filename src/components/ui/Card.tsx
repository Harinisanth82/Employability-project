import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "subtle" | "bordered" | "highlight" | "glass";
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = "default",
  hoverable = false,
  className = "",
  id,
  ...props
}) => {
  const variantClasses = {
    default: "bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm",
    subtle: "bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80",
    bordered: "bg-transparent border border-slate-300 dark:border-slate-700",
    highlight: "bg-gradient-to-br from-sky-50 to-indigo-50/50 dark:from-sky-950/30 dark:to-indigo-950/20 border border-sky-200/70 dark:border-sky-800/50",
    glass: "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 shadow-sm",
  };

  const hoverClass = hoverable
    ? "transition-all duration-200 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-0.5 cursor-pointer"
    : "";

  return (
    <div
      id={id}
      className={`rounded-2xl p-5 md:p-6 ${variantClasses[variant]} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
