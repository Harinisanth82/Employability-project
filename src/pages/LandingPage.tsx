import React from "react";
import { Button } from "../components/ui/Button.js";
import { Card } from "../components/ui/Card.js";
import {
  Compass,
  ArrowRight,
  Sparkles,
  BarChart3,
  MapPin,
  Award,
  Bot,
  CheckCircle2,
  Layers,
  GraduationCap,
  ShieldCheck,
  Zap,
} from "lucide-react";

export const LandingPage: React.FC<{ onNavigate: (route: string) => void }> = ({ onNavigate }) => {
  const steps = [
    {
      num: "01",
      title: "Understand Yourself",
      desc: "Structured profile mapping & multidimensional psychometric evaluation of skills, interests, and working styles.",
    },
    {
      num: "02",
      title: "Discover Careers",
      desc: "Intelligent matching with 8+ verified tech domains, highlighting exact reasons, alignment factors, and missing skills.",
    },
    {
      num: "03",
      title: "Identify Skill Gaps",
      desc: "Granular comparison of what you have, what is developing, and what is critically required by modern industry standards.",
    },
    {
      num: "04",
      title: "Build Skills with Roadmaps",
      desc: "Personalized 5-phase progressive curricula moving from fundamentals to production-grade capstone architectures.",
    },
    {
      num: "05",
      title: "Prove Skills with Evidence",
      desc: "Transform claimed skills into demonstrated competencies backed by GitHub repositories, live projects, and verified credentials.",
    },
    {
      num: "06",
      title: "Simulate & Measure Readiness",
      desc: "Realistic AI technical and behavioral mock interview arena with objective scoring and composite employability metrics.",
    },
  ];

  const features = [
    {
      icon: Compass,
      title: "Intelligent Career Discovery",
      desc: "Transparent recommendation engine that gives clear qualitative reasoning for every match, not mysterious black-box rankings.",
    },
    {
      icon: BarChart3,
      title: "Visual Skill Gap Diagnostics",
      desc: "Know exactly which technical and conceptual benchmarks you need to hit before applying to real engineering positions.",
    },
    {
      icon: MapPin,
      title: "Personalized 5-Phase Roadmaps",
      desc: "Structured step-by-step milestones combining theory, deliberate practice, and full-stack capstone projects.",
    },
    {
      icon: Award,
      title: "Verifiable Skill Evidence",
      desc: "Link GitHub repositories, live demo URLs, and achievements into an evidence portfolio employers trust.",
    },
    {
      icon: Bot,
      title: "AI Mock Interview Simulator",
      desc: "Practice realistic technical and behavioral interview scenarios with instantaneous multidimensional feedback.",
    },
    {
      icon: Sparkles,
      title: "Employability Readiness Score",
      desc: "A holistic, multi-factor metric tracking your transition from student learner to job-ready software engineer.",
    },
  ];

  return (
    <div id="landing-page" className="space-y-20 py-6 sm:py-12">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/80 text-xs font-semibold text-sky-800 dark:text-sky-300">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          <span>Academic & Industry Employability Framework</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-[1.15]">
          Build a Career That Fits You. <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-indigo-600">
            Systematic Employability Readiness.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          From multidimensional self-discovery and visual skill gap analysis to verified evidence portfolios and AI mock interviews — an end-to-end framework engineered for modern students.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button
            id="hero-get-started-btn"
            size="lg"
            variant="primary"
            onClick={() => onNavigate("/register")}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Start Your Free Assessment
          </Button>
          <Button
            id="hero-login-btn"
            size="lg"
            variant="outline"
            onClick={() => onNavigate("/login")}
          >
            Existing Student Sign In
          </Button>
        </div>

        {/* Framework Highlights Pills */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-8 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 8+ Curated Tech Careers
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Transparent AI Reasoning
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Verifiable Proof of Skills
          </span>
        </div>
      </section>

      {/* The 6-Step Employability Framework */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            The Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            How The Career Framework Operates
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            A structured, evidence-grounded workflow transforming raw interest into confirmed employability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map((s, idx) => (
            <Card key={idx} variant="default" className="relative p-6 space-y-3">
              <div className="text-2xl font-black text-slate-300 dark:text-slate-700 tracking-wider">
                {s.num}
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                {s.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {s.desc}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Feature Capabilities Grid */}
      <section className="space-y-8 pt-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            Platform Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Engineered for Real-World Career Success
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, fIdx) => {
            const Icon = f.icon;
            return (
              <Card key={fIdx} variant="subtle" className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">{f.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Comparison: Generic Advice vs This Framework */}
      <section className="p-6 sm:p-10 rounded-3xl bg-slate-900 text-white space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
            Why It Works
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Why Generic Career Chatbots Fail Students
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Generic AI chats generate vague summaries with no persistent accountability. Our framework delivers deterministic structure, skill benchmarking, and proof tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
            <h4 className="text-sm font-bold text-rose-400 uppercase tracking-wider">
              Generic AI / Surface Level Advice
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span> Ephemeral chat with zero persistent progress tracking
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span> Hallucinates 100% matches without explaining missing skills
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span> No tangible evidence validation or GitHub repository linkage
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span> Superficial question-answer loops with no mock interview scoring
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-sky-950/60 border border-sky-700/60 space-y-4">
            <h4 className="text-sm font-bold text-sky-400 uppercase tracking-wider">
              This Employability Framework
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-200">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span> Persistent 5-phase customized roadmap tied to real milestones
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span> Transparent strong factors and missing factors for every role
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span> Verifiable Proof of Skills repository with verified artifact links
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span> Multidimensional interview evaluation (Relevance, Technical, Clarity)
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="text-center p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 text-white space-y-6 shadow-xl">
        <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Ready to Map Your Career Trajectory?
        </h3>
        <p className="text-xs sm:text-sm text-sky-100 max-w-xl mx-auto leading-relaxed">
          Create your student profile in 2 minutes, identify your exact skill gaps, and start checking off verified milestones.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            id="bottom-cta-btn"
            variant="secondary"
            size="lg"
            onClick={() => onNavigate("/register")}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Academic Framework Footer */}
      <footer className="pt-10 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-bold text-slate-800 dark:text-slate-200">
            AI-Based Career Guidance Framework for Employability Development
          </span>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Academic & Industry Employability Intelligence System
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium">
          <span>React.js</span>
          <span>•</span>
          <span>Node.js Express</span>
          <span>•</span>
          <span>Google Gemini AI</span>
          <span>•</span>
          <span>JWT + bcrypt</span>
        </div>
      </footer>
    </div>
  );
};
