import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.js";
import { useToast } from "../context/ToastContext.js";
import { api } from "../services/api.js";
import { CareerProfile, CareerInsight, ProgressTimelineItem, EmployabilityReadiness } from "../types/index.js";
import { Card } from "../components/ui/Card.js";
import { Button } from "../components/ui/Button.js";
import { Badge } from "../components/ui/Badge.js";
import { ProgressRing } from "../components/ui/ProgressRing.js";
import { ProgressBar } from "../components/ui/ProgressBar.js";
import { InsightCard } from "../components/cards/InsightCard.js";
import { LoadingState } from "../components/ui/LoadingState.js";
import {
  Compass,
  ArrowRight,
  Sparkles,
  Target,
  BarChart3,
  MapPin,
  Bot,
  Award,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";

export const DashboardPage: React.FC<{ onNavigate: (route: string) => void }> = ({ onNavigate }) => {
  const { user } = useAuth();
  const toast = useToast();

  const [profile, setProfile] = useState<CareerProfile | null>(null);
  const [insights, setInsights] = useState<CareerInsight[]>([]);
  const [timeline, setTimeline] = useState<ProgressTimelineItem[]>([]);
  const [employability, setEmployability] = useState<EmployabilityReadiness | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [isRefreshingInsights, setIsRefreshingInsights] = useState(false);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch core profile, timeline, employability metrics fast
      const [profData, timeData, empData] = await Promise.all([
        api.profile.get().catch(() => null),
        api.progress.getTimeline().catch(() => []),
        api.progress.getEmployability().catch(() => null),
      ]);

      if (!profData && user && !user.isOnboarded) {
        onNavigate("/onboarding");
        return;
      }

      setProfile(profData);
      setTimeline((timeData || []).slice(0, 5));
      setEmployability(empData);
      setIsLoading(false);

      // 2. Fetch insights asynchronously without blocking dashboard UI
      setIsLoadingInsights(true);
      api.insights.getAll()
        .then((insData) => {
          setInsights(insData || []);
        })
        .catch(() => {})
        .finally(() => {
          setIsLoadingInsights(false);
        });
    } catch (err: any) {
      toast.error("Failed to load dashboard data: " + err.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleRefreshInsights = async () => {
    setIsRefreshingInsights(true);
    try {
      const updated = await api.insights.refresh();
      setInsights(updated);
      toast.success("AI insights updated with latest activity.");
    } catch (err: any) {
      toast.error("Failed to refresh insights.");
    } finally {
      setIsRefreshingInsights(false);
    }
  };

  if (isLoading) {
    return <LoadingState message="Aggregating career readiness metrics..." />;
  }

  if (!profile) {
    return (
      <div className="text-center py-16 space-y-4">
        <h3 className="text-lg font-bold">No profile found</h3>
        <p className="text-xs text-slate-500">Please complete onboarding to generate your career framework.</p>
        <Button onClick={() => onNavigate("/onboarding")}>Complete Onboarding</Button>
      </div>
    );
  }

  return (
    <div id="dashboard-page" className="space-y-6">
      {/* Top Banner: Greeting & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Welcome, {user?.name || "Student"}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tracking your progress toward becoming a verified <strong>{profile.currentDirection}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            id="dash-explore-careers-btn"
            variant="outline"
            size="sm"
            onClick={() => onNavigate("/discovery")}
            leftIcon={<Compass className="w-3.5 h-3.5 text-sky-600" />}
          >
            Career Tracks
          </Button>
          <Button
            id="dash-view-roadmap-btn"
            variant="academic"
            size="sm"
            onClick={() => onNavigate("/roadmap")}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Open Roadmap
          </Button>
        </div>
      </div>

      {/* Row 1: Readiness Score Gauge + Current Direction + Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Readiness Score Card (4 cols) */}
        <Card variant="default" className="lg:col-span-4 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-full flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Career Readiness Score
            </span>
            <Badge variant="primary" size="sm">
              Estimated
            </Badge>
          </div>

          <div className="py-2">
            <ProgressRing
              score={profile.readinessScore}
              size={140}
              strokeWidth={12}
              label="Employability"
              sublabel="Composite Score"
              colorVariant={profile.readinessScore > 75 ? "emerald" : "sky"}
            />
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
            Composite evaluation based on technical skills, project evidence, assessment alignment, and interview readiness.
          </p>

          <Button
            id="dash-employability-btn"
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => onNavigate("/employability")}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Detailed Scorecard
          </Button>
        </Card>

        {/* Current Career Direction & Match (5 cols) */}
        <Card variant="highlight" className="lg:col-span-5 flex flex-col justify-between p-6">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" /> Target Career Direction
              </span>
              <Badge variant="success" size="md">
                {profile.matchPercentage}% Alignment
              </Badge>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {profile.currentDirection}
            </h3>

            <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">
              {profile.directionExplanation}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-sky-200/60 dark:border-sky-800/60 flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Explore alternative paths?</span>
            <button
              onClick={() => onNavigate("/discovery")}
              className="text-sky-700 dark:text-sky-300 font-bold hover:underline"
            >
              Compare 8+ Tracks →
            </button>
          </div>
        </Card>

        {/* Opportunity & Next Action (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <Card variant="subtle" className="p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              <Lightbulb className="w-3.5 h-3.5" /> Biggest Opportunity
            </div>
            <p className="text-xs text-slate-800 dark:text-slate-200 font-semibold leading-relaxed">
              {profile.biggestOpportunity}
            </p>
            <button
              onClick={() => onNavigate("/skills")}
              className="text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 mt-1"
            >
              View Skill Gap Breakdown →
            </button>
          </Card>

          <Card variant="default" className="p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">
              <Sparkles className="w-3.5 h-3.5" /> Next Best Action
            </div>
            <p className="text-xs text-slate-800 dark:text-slate-200 font-semibold leading-relaxed">
              {profile.nextBestAction}
            </p>
            <Button
              size="sm"
              variant="primary"
              className="w-full mt-2 text-xs"
              onClick={() => onNavigate("/roadmap")}
            >
              Execute Action
            </Button>
          </Card>
        </div>
      </div>

      {/* Row 2: Readiness Breakdown Bars & Quick Feature Anchors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Readiness Breakdown (7 cols) */}
        <Card variant="default" className="lg:col-span-7 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Multi-Factor Readiness Breakdown
              </h3>
              <p className="text-xs text-slate-500">Benchmark status across fundamental hiring dimensions</p>
            </div>
            <button
              onClick={() => onNavigate("/skills")}
              className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
            >
              All Skills →
            </button>
          </div>

          <div className="space-y-3 pt-2">
            <ProgressBar
              label="Technical Skills"
              value={profile.readinessBreakdown.technicalSkills}
              showPercentage
              colorVariant="sky"
            />
            <ProgressBar
              label="Demonstrated Projects"
              value={profile.readinessBreakdown.projects}
              showPercentage
              colorVariant="emerald"
            />
            <ProgressBar
              label="Problem Solving & Logic"
              value={profile.readinessBreakdown.problemSolving}
              showPercentage
              colorVariant="purple"
            />
            <ProgressBar
              label="Technical Communication"
              value={profile.readinessBreakdown.communication}
              showPercentage
              colorVariant="amber"
            />
            <ProgressBar
              label="Interview & Behavioral Readiness"
              value={profile.readinessBreakdown.interviewReadiness}
              showPercentage
              colorVariant="rose"
            />
          </div>
        </Card>

        {/* Quick Action Feature Grid (5 cols) */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3">
          <Card
            variant="default"
            hoverable
            onClick={() => onNavigate("/assessment")}
            className="p-4 flex flex-col justify-between space-y-3"
          >
            <div className="p-2.5 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 w-fit">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Career Assessment</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">15 multidimensional signals</p>
            </div>
            <span className="text-xs font-bold text-sky-600 flex items-center gap-1">
              Retake / Review →
            </span>
          </Card>

          <Card
            variant="default"
            hoverable
            onClick={() => onNavigate("/skills")}
            className="p-4 flex flex-col justify-between space-y-3"
          >
            <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 w-fit">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Skill Gap Matrix</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Have vs. Developing vs. Need</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              View Matrix →
            </span>
          </Card>

          <Card
            variant="default"
            hoverable
            onClick={() => onNavigate("/evidence")}
            className="p-4 flex flex-col justify-between space-y-3"
          >
            <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 w-fit">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Proof of Skills</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">GitHub & Artifact Verification</p>
            </div>
            <span className="text-xs font-bold text-purple-600 flex items-center gap-1">
              Add Evidence →
            </span>
          </Card>

          <Card
            variant="default"
            hoverable
            onClick={() => onNavigate("/interview")}
            className="p-4 flex flex-col justify-between space-y-3"
          >
            <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 w-fit">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Interview Arena</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Technical & HR Simulations</p>
            </div>
            <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
              Start Simulation →
            </span>
          </Card>
        </div>
      </div>

      {/* Row 3: AI Contextual Insights */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Contextual AI Insights & Guidance
            </h3>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRefreshInsights}
            isLoading={isRefreshingInsights}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>
        </div>

        {isLoadingInsights && insights.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center gap-3 text-xs text-slate-500">
              <RefreshCw className="w-4 h-4 animate-spin text-sky-600" />
              <span>Analyzing progression patterns for personalized recommendations...</span>
            </div>
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center gap-3 text-xs text-slate-500">
              <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
              <span>Evaluating milestone trajectory...</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight) => (
              <InsightCard
                key={insight.id}
                insight={insight}
                onAction={(route) => onNavigate(route)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Row 4: Recent Progress Timeline */}
      <Card variant="default" className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Recent Milestones</h3>
          </div>
          <button
            onClick={() => onNavigate("/timeline")}
            className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
          >
            Full Timeline →
          </button>
        </div>

        <div className="space-y-3">
          {timeline.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-xs"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">{item.title}</h4>
                  <span className="text-[10px] text-slate-400">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-0.5">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
