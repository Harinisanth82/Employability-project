import React, { useState, useEffect } from "react";
import { api } from "../services/api.js";
import { useToast } from "../context/ToastContext.js";
import { CareerProfile } from "../types/index.js";
import { Card } from "../components/ui/Card.js";
import { Button } from "../components/ui/Button.js";
import { Badge } from "../components/ui/Badge.js";
import { LoadingState } from "../components/ui/LoadingState.js";
import {
  GraduationCap,
  Layers,
  Code,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Award,
} from "lucide-react";

export const LearningHubPage: React.FC<{ onNavigate: (route: string) => void }> = ({ onNavigate }) => {
  const toast = useToast();

  const [profile, setProfile] = useState<CareerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.profile
      .get()
      .then((p) => setProfile(p))
      .catch((err) => toast.error("Failed to load profile: " + err.message))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <LoadingState message="Curating project architectures and learning resources..." />;
  }

  const projects = [
    {
      title: "Real-Time Collaborative Document Canvas",
      difficulty: "Advanced",
      skills: ["React", "TypeScript", "WebSockets", "Node.js", "Redis"],
      description: "Multi-user collaborative workspace with operational transformation/CRDT, live cursor syncing, and automated snapshot saves.",
      deliverables: ["Live Demo deployed to cloud", "Public GitHub repo with unit tests", "System architecture diagram in README"],
    },
    {
      title: "Resilient Microservices REST API & Gateway",
      difficulty: "Intermediate",
      skills: ["Node.js", "Express", "Docker", "PostgreSQL", "JWT Auth"],
      description: "Decoupled service handling auth, order processing, and payment webhooks with rate limiting, logging, and automated migrations.",
      deliverables: ["Swagger/OpenAPI docs", "Docker Compose setup", "GitHub Actions CI pipeline"],
    },
    {
      title: "Analytics Dashboard with Custom Data Visualizations",
      difficulty: "Intermediate",
      skills: ["React", "Tailwind CSS", "Recharts", "SQL Aggregations"],
      description: "Interactive data visualization tool with date filtering, CSV export, and responsive metrics breakdown.",
      deliverables: ["Clean mobile-responsive UI", "Zero layout shift", "Lighthouse score > 90"],
    },
  ];

  const learningTracks = [
    {
      category: "Software Engineering & Architecture",
      topics: [
        "Clean Code & SOLID Design Principles in TypeScript",
        "Designing Idempotent & Scalable RESTful APIs",
        "Relational Schema Normalization & Index Optimization",
        "Authentication Strategies: JWT, Refresh Tokens, and OAuth2",
      ],
    },
    {
      category: "Production Readiness & DevOps",
      topics: [
        "Containerizing Node/React Applications with Docker",
        "Continuous Integration with GitHub Actions",
        "Cloud Deployment Best Practices on Container Ingress",
        "Structured Logging, Error Middleware & Health Checks",
      ],
    },
    {
      category: "Interview & Problem Solving",
      topics: [
        "Data Structures: Hash Maps, Trees, Graphs & DP",
        "System Design: Caching, Load Balancing, DB Sharding",
        "Behavioral Interview Preparation: STAR Technique",
      ],
    },
  ];

  return (
    <div id="learning-hub-page" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5" /> Hands-On Engineering
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Learning & Projects Hub
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Capstone project blueprints and industry learning modules tailored for {profile?.currentDirection || "Software Development"}.
          </p>
        </div>

        <Button
          id="learning-add-evidence-btn"
          variant="academic"
          size="sm"
          onClick={() => onNavigate("/evidence")}
          leftIcon={<Award className="w-3.5 h-3.5 text-sky-400" />}
        >
          Submit Project as Evidence
        </Button>
      </div>

      {/* Suggested Industry Projects */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-sky-600" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Recommended Portfolio Capstones
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {projects.map((proj, idx) => (
            <Card key={idx} variant="default" className="p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Capstone #{idx + 1}
                  </span>
                  <Badge variant={proj.difficulty === "Advanced" ? "danger" : "primary"} size="sm">
                    {proj.difficulty}
                  </Badge>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {proj.title}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {proj.description}
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {proj.skills.map((sk, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300"
                    >
                      {sk}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] space-y-1">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Deliverables:</span>
                  {proj.deliverables.map((del, dIdx) => (
                    <p key={dIdx} className="text-slate-500 flex items-start gap-1">
                      • {del}
                    </p>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => onNavigate("/evidence")}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Log This Artifact
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Structured Knowledge Tracks */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Core Knowledge & Conceptual Mastery
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {learningTracks.map((track, idx) => (
            <Card key={idx} variant="default" className="p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                {track.category}
              </h4>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {track.topics.map((top, tIdx) => (
                  <li key={tIdx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                    <span className="leading-relaxed">{top}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
