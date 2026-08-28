export interface UserDoc {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  isOnboarded: boolean;
  targetCareerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EducationInfo {
  degree: string;
  department: string;
  institution: string;
  graduationYear: string;
  academicPerformance: string; // e.g. "CGPA 8.8 / 10" or "85%"
}

export interface SkillItem {
  name: string;
  category: "Programming" | "Web Development" | "Databases" | "Cloud & DevOps" | "AI & Data" | "Tools & Others";
  level: number; // 0 to 100
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  link?: string;
  role?: string;
}

export interface InternshipItem {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  year: string;
  url?: string;
}

export interface CareerGoals {
  preferredAreas: string[];
  desiredRole: string;
  shortTermGoal: string;
  longTermGoal: string;
}

export interface WorkPreferences {
  workStyle: "Individual Contributor" | "Team-Centric" | "Flexible";
  focus: "Technical Depth" | "Creative & UI" | "Balanced";
  domain: "Product Development" | "Research & Innovation" | "Enterprise Systems";
  orgType: "High-Growth Startup" | "Established Enterprise" | "Consulting & Agency";
  location: "Remote" | "Hybrid" | "On-site";
}

export interface ReadinessBreakdown {
  technicalSkills: number;
  projects: number;
  communication: number;
  problemSolving: number;
  certifications: number;
  interviewReadiness: number;
}

export interface CareerProfileDoc {
  id: string;
  userId: string;
  education: EducationInfo;
  technicalSkills: SkillItem[];
  softSkills: string[];
  interests: string[];
  experience: {
    projects: ProjectItem[];
    internships: InternshipItem[];
    certifications: CertificationItem[];
    hackathons: string[];
    achievements: string[];
  };
  careerGoals: CareerGoals;
  workPreferences: WorkPreferences;
  readinessScore: number;
  readinessBreakdown: ReadinessBreakdown;
  currentDirection: string;
  matchPercentage: number;
  directionExplanation: string;
  biggestOpportunity: string;
  nextBestAction: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentAnswer {
  questionId: string;
  category: "Interests" | "Skills" | "Work Style" | "Problem Solving" | "Career Preferences";
  questionText: string;
  selectedOption: string | string[] | number;
  score: number;
}

export interface AssessmentDoc {
  id: string;
  userId: string;
  currentQuestionIndex: number;
  isCompleted: boolean;
  answers: AssessmentAnswer[];
  categoryScores: Record<string, number>;
  aiAnalysis?: {
    summary: string;
    dominantArchetype: string;
    keyStrengths: string[];
    growthAreas: string[];
    recommendedCareerFocus: string[];
  };
  startedAt: string;
  completedAt?: string;
}

export interface CareerDoc {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  whatTheyDo: string[];
  coreTechnicalSkills: Array<{ name: string; importance: string; defaultLevel: number; category: string }>;
  softSkills: string[];
  commonTools: string[];
  entryLevelExpectations: string[];
  suggestedProjects: Array<{ title: string; description: string; difficulty: "Beginner" | "Intermediate" | "Advanced"; skillsUsed: string[] }>;
  careerProgression: Array<{ level: string; title: string; timeframe: string; salaryRange: string }>;
  relatedCareers: string[];
}

export interface CareerRecommendationDoc {
  id: string;
  userId: string;
  recommendations: Array<{
    careerId: string;
    title: string;
    matchPercentage: number;
    matchExplanation: string;
    strongFactors: string[];
    missingFactors: string[];
    recommendedPriority: number;
  }>;
  generatedAt: string;
}

export interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface RoadmapPhase {
  id: string;
  phaseNumber: number;
  title: string;
  description: string;
  estimatedEffort: string;
  skills: string[];
  learningTasks: RoadmapTask[];
  practiceTasks: RoadmapTask[];
  project: {
    title: string;
    description: string;
    deliverables: string[];
    completed: boolean;
  };
  isUnlocked: boolean;
}

export interface RoadmapDoc {
  id: string;
  userId: string;
  targetCareerId: string;
  targetCareerTitle: string;
  phases: RoadmapPhase[];
  overallProgress: number; // 0 to 100
  generatedAt: string;
  updatedAt: string;
}

export interface SkillEvidenceDoc {
  id: string;
  userId: string;
  skillName: string;
  evidenceType: "github" | "portfolio" | "certification" | "internship" | "hackathon" | "assessment" | "achievement";
  title: string;
  url?: string;
  description: string;
  verifiedStatus: "Demonstrated Through Project" | "Evidence Added" | "Verified Assessment";
  strength: "Strong" | "Moderate" | "Emerging";
  createdAt: string;
}

export interface InterviewQuestionItem {
  id: string;
  question: string;
  type: string;
  contextOrScenario?: string;
}

export interface InterviewAnswerItem {
  questionId: string;
  answerText: string;
  evaluation?: {
    relevanceScore: number; // 0-100
    technicalCorrectnessScore: number; // 0-100
    clarityScore: number; // 0-100
    structureScore: number; // 0-100
    confidenceIndicator: "High" | "Moderate" | "Developing";
    constructiveFeedback: string;
    keyImprovement: string;
  };
}

export interface InterviewDoc {
  id: string;
  userId: string;
  careerTitle: string;
  difficulty: "Entry-Level" | "Mid-Level" | "Advanced";
  interviewType: "Technical" | "HR" | "Behavioral" | "Scenario";
  status: "in_progress" | "completed";
  questions: InterviewQuestionItem[];
  answers: InterviewAnswerItem[];
  finalSummary?: {
    overallScore: number;
    summaryText: string;
    strengths: string[];
    areasToImprove: string[];
    recommendedPractice: string[];
  };
  createdAt: string;
  completedAt?: string;
}

export interface CareerInsightDoc {
  id: string;
  userId: string;
  title: string;
  observation: string;
  suggestedAction: string;
  actionRoute: string;
  category: "readiness" | "skill_gap" | "interview" | "portfolio" | "momentum";
  isRead: boolean;
  createdAt: string;
}

export interface ProgressTimelineDoc {
  id: string;
  userId: string;
  type: "assessment" | "skill" | "project" | "evidence" | "interview" | "roadmap";
  title: string;
  description: string;
  timestamp: string;
  meta?: Record<string, any>;
}
