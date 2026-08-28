import { GoogleGenAI } from "@google/genai";
import { CareerProfileDoc, AssessmentDoc, CareerDoc, RoadmapPhase } from "../db/models.js";

// Initialize the GoogleGenAI instance safely with telemetry header
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Use gemini-2.5-flash for fast and responsive structured AI generation
const FAST_MODEL_NAME = "gemini-2.5-flash";
const TIMEOUT_MS = 8000;

// In-Flight Promise Deduplication Map
const inFlightRequests = new Map<string, Promise<any>>();

async function runWithDeduplication<T>(key: string, fn: () => Promise<T>): Promise<T> {
  if (inFlightRequests.has(key)) {
    return inFlightRequests.get(key) as Promise<T>;
  }
  const promise = fn().finally(() => {
    inFlightRequests.delete(key);
  });
  inFlightRequests.set(key, promise);
  return promise;
}

async function generateWithTimeout(client: GoogleGenAI, prompt: string, temperature = 0.2): Promise<string | null> {
  const timeoutPromise = new Promise<null>((_, reject) =>
    setTimeout(() => reject(new Error("Gemini request timed out after 8s")), TIMEOUT_MS)
  );

  try {
    const apiPromise = client.models.generateContent({
      model: FAST_MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature,
      },
    });

    const response = (await Promise.race([apiPromise, timeoutPromise])) as any;
    return response?.text || null;
  } catch (err: any) {
    console.warn(`[Gemini Safe Fallback] ${err.message || err}`);
    return null;
  }
}

function cleanJsonText(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return cleaned.trim();
}

/**
 * 1. Analyze Career Profile & Calculate Baseline Readiness
 */
export async function analyzeCareerProfile(profile: Partial<CareerProfileDoc>) {
  const key = `profile_${profile.userId || "anon"}_${profile.updatedAt || ""}`;
  return runWithDeduplication(key, async () => {
    const client = getGeminiClient();
    const prompt = `You are a Career Architect. Analyze the student profile and output concise readiness metrics in valid JSON ONLY:
Profile:
- Degree: ${profile.education?.degree || "Engineering"} (${profile.education?.department || "CS"})
- Academic Score: ${profile.education?.academicPerformance || "80%"}
- Skills: ${(profile.technicalSkills || []).slice(0, 10).map(s => `${s.name}: ${s.level}%`).join(", ")}
- Target Role: ${profile.careerGoals?.desiredRole || "Software Developer"}

Return JSON ONLY:
{
  "readinessScore": number (35-92),
  "readinessBreakdown": {
    "technicalSkills": number (0-100),
    "projects": number (0-100),
    "communication": number (0-100),
    "problemSolving": number (0-100),
    "certifications": number (0-100),
    "interviewReadiness": number (0-100)
  },
  "currentDirection": string,
  "matchPercentage": number (60-95),
  "directionExplanation": string (2 sentences),
  "biggestOpportunity": string (1 sentence),
  "nextBestAction": string (1 sentence)
}`;

    if (client) {
      try {
        const rawText = await generateWithTimeout(client, prompt, 0.2);
        if (rawText) {
          const parsed = JSON.parse(cleanJsonText(rawText));
          if (parsed && typeof parsed.readinessScore === "number") {
            return parsed;
          }
        }
      } catch (err) {
        console.warn("Falling back to heuristic analysis:", err);
      }
    }

    // Heuristics Fallback
    const techSkillCount = profile.technicalSkills?.length || 0;
    const projectCount = profile.experience?.projects?.length || 0;
    const certCount = profile.experience?.certifications?.length || 0;
    const internshipCount = profile.experience?.internships?.length || 0;

    const techScore = Math.min(88, 50 + techSkillCount * 5);
    const projScore = Math.min(85, 45 + projectCount * 12);
    const certScore = Math.min(80, 40 + certCount * 15);
    const commScore = 72;
    const probScore = 74;
    const interviewScore = 60 + (internshipCount > 0 ? 15 : 0);

    const overall = Math.round(
      (techScore * 0.3 + projScore * 0.25 + commScore * 0.15 + probScore * 0.15 + certScore * 0.05 + interviewScore * 0.1)
    );

    const targetRole = profile.careerGoals?.desiredRole || "Software Developer";

    return {
      readinessScore: overall,
      readinessBreakdown: {
        technicalSkills: techScore,
        projects: projScore,
        communication: commScore,
        problemSolving: probScore,
        certifications: certScore,
        interviewReadiness: interviewScore,
      },
      currentDirection: targetRole,
      matchPercentage: Math.min(94, Math.max(68, overall + 10)),
      directionExplanation: `Your academic background and demonstrated technical skills in ${(profile.technicalSkills || []).slice(0, 3).map(s => s.name).join(", ") || "core programming"} establish a strong foundation for ${targetRole}.`,
      biggestOpportunity: "Strengthen full-stack system design and practical test coverage",
      nextBestAction: "Build and deploy a full-stack project demonstrating robust API error handling and database modeling",
    };
  });
}

/**
 * 2. Recommend Careers with Match Scores and Qualitative Reasons
 */
export async function recommendCareers(profile: CareerProfileDoc, assessment?: AssessmentDoc | null, catalogCareers: CareerDoc[] = []) {
  const key = `recs_${profile.userId}_${catalogCareers.length}`;
  return runWithDeduplication(key, async () => {
    const client = getGeminiClient();
    const prompt = `You are a Career Guidance Intelligence engine. Given candidate profile, evaluate matches against:
${catalogCareers.map(c => `- ${c.id}: ${c.title}`).join("\n")}

Profile:
- Skills: ${(profile.technicalSkills || []).slice(0, 8).map(s => `${s.name}: ${s.level}%`).join(", ")}
- Projects: ${(profile.experience?.projects || []).slice(0, 4).map(p => p.title).join(", ")}
- Assessment: ${assessment?.aiAnalysis?.dominantArchetype || "Practical Builder & Problem Solver"}

Return a JSON array ONLY:
[
  {
    "careerId": string,
    "title": string,
    "matchPercentage": number (60-94),
    "matchExplanation": string (2 sentences),
    "strongFactors": string[] (3 items),
    "missingFactors": string[] (2 items),
    "recommendedPriority": number
  }
]`;

    if (client) {
      try {
        const rawText = await generateWithTimeout(client, prompt, 0.2);
        if (rawText) {
          const parsed = JSON.parse(cleanJsonText(rawText));
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (err) {
        console.warn("Gemini recommendCareers fallback:", err);
      }
    }

    // Fast Heuristic Matcher
    const skillsUserHas = (profile.technicalSkills || []).map(s => s.name.toLowerCase());
    const interestsUserHas = (profile.interests || []).map(i => i.toLowerCase());

    return catalogCareers.map((career, idx) => {
      let matchPoints = 65;
      const strongFactors: string[] = [];
      const missingFactors: string[] = [];

      career.coreTechnicalSkills.forEach(reqSkill => {
        const found = skillsUserHas.some(s => s.includes(reqSkill.name.toLowerCase()) || reqSkill.name.toLowerCase().includes(s));
        if (found) {
          matchPoints += 5;
          if (strongFactors.length < 3) strongFactors.push(`Foundational strength in ${reqSkill.name}`);
        } else {
          if (missingFactors.length < 3) missingFactors.push(`${reqSkill.name} proficiency`);
        }
      });

      if (interestsUserHas.some(i => i.includes("software") || i.includes("web") || i.includes("data") || i.includes("cloud") || i.includes("ai"))) {
        matchPoints += 8;
        strongFactors.push(`Strong career interest alignment with ${career.title}`);
      }

      if (strongFactors.length === 0) strongFactors.push("Core analytical and computational mindset", "Academic coursework foundation");
      if (missingFactors.length === 0) missingFactors.push("Production-scale deployment experience", "Automated integration testing");

      const matchPercentage = Math.min(92, Math.max(62, matchPoints - idx * 4));

      return {
        careerId: career.id,
        title: career.title,
        matchPercentage,
        matchExplanation: `Your profile displays high aptitude for ${career.title}, with complementary skills in ${strongFactors[0] || "problem solving"} and clear motivation.`,
        strongFactors,
        missingFactors,
        recommendedPriority: idx + 1,
      };
    });
  });
}

/**
 * 3. Skill Gap Analysis
 */
export async function analyzeSkillGap(profile: CareerProfileDoc, targetCareer: CareerDoc) {
  const key = `skillgap_${profile.userId}_${targetCareer.id}`;
  return runWithDeduplication(key, async () => {
    const client = getGeminiClient();
    const prompt = `Compare student skills against requirements for "${targetCareer.title}".
Student Skills:
${(profile.technicalSkills || []).slice(0, 10).map(s => `- ${s.name}: ${s.level}%`).join("\n")}
Target Role Core Skills:
${targetCareer.coreTechnicalSkills.map(s => `- ${s.name} (benchmark: ${s.defaultLevel}%)`).join("\n")}

Categorize each skill into: "have" (>=70%), "developing" (40-69%), "need" (<40%).
Return JSON ONLY:
{
  "targetRole": "${targetCareer.title}",
  "summary": string (2 sentences),
  "skills": [
    {
      "name": string,
      "category": string,
      "status": "have" | "developing" | "need",
      "currentLevel": number (0-100),
      "targetLevel": number (0-100),
      "gap": number,
      "importance": "Essential" | "High" | "Medium",
      "whyItMatters": string (1 sentence),
      "recommendedAction": string (1 sentence)
    }
  ]
}`;

    if (client) {
      try {
        const rawText = await generateWithTimeout(client, prompt, 0.2);
        if (rawText) {
          const parsed = JSON.parse(cleanJsonText(rawText));
          if (parsed && Array.isArray(parsed.skills)) {
            return parsed;
          }
        }
      } catch (err) {
        console.warn("Gemini analyzeSkillGap fallback:", err);
      }
    }

    // Heuristics Fallback
    const userSkillMap = new Map<string, number>();
    (profile.technicalSkills || []).forEach(s => {
      userSkillMap.set(s.name.toLowerCase(), s.level);
    });

    const skills = targetCareer.coreTechnicalSkills.map(req => {
      let cur = 0;
      for (const [k, lvl] of userSkillMap.entries()) {
        if (k.includes(req.name.toLowerCase()) || req.name.toLowerCase().includes(k)) {
          cur = lvl;
          break;
        }
      }
      const target = req.defaultLevel || 80;
      const gap = Math.max(0, target - cur);
      let status: "have" | "developing" | "need" = "need";
      if (cur >= 70) status = "have";
      else if (cur >= 40) status = "developing";

      return {
        name: req.name,
        category: req.category || "Programming",
        status,
        currentLevel: cur,
        targetLevel: target,
        gap,
        importance: (req.importance as any) || "High",
        whyItMatters: `Crucial for implementing robust ${req.name} architectures in professional ${targetCareer.title} environments.`,
        recommendedAction: status === "have"
          ? `Document GitHub proof and complete advanced benchmark challenge.`
          : `Build a focused hands-on project utilizing ${req.name} with real-world error handling.`,
      };
    });

    return {
      targetRole: targetCareer.title,
      summary: `You possess strong foundations in ${(profile.technicalSkills || []).slice(0, 2).map(s => s.name).join(" and ") || "programming"}, with high-impact opportunities in ${skills.filter(s => s.status === 'need').slice(0, 2).map(s => s.name).join(" and ") || "system testing"}.`,
      skills,
    };
  });
}

/**
 * 4. Generate 5-Phase Personalized Career Roadmap
 */
export async function generateRoadmap(profile: CareerProfileDoc, targetCareer: CareerDoc): Promise<RoadmapPhase[]> {
  const key = `roadmap_${profile.userId}_${targetCareer.id}`;
  return runWithDeduplication(key, async () => {
    const client = getGeminiClient();
    const prompt = `Generate a concise 5-phase career roadmap for "${targetCareer.title}".
Student Skills: ${(profile.technicalSkills || []).slice(0, 8).map(s => s.name).join(", ")}
Target Core Skills: ${targetCareer.coreTechnicalSkills.map(s => s.name).join(", ")}

Phases:
1: Strengthen Fundamentals
2: Develop Missing Skills
3: Build Real Projects
4: Validate & Prove Skills
5: Interview & Employment Preparation

Return JSON array of 5 objects ONLY:
[
  {
    "id": "phase-1",
    "phaseNumber": 1,
    "title": "Strengthen Fundamentals",
    "description": string,
    "estimatedEffort": "3-4 Weeks",
    "skills": string[],
    "learningTasks": [{ "id": "p1-l1", "title": string, "description": string, "completed": false }],
    "practiceTasks": [{ "id": "p1-p1", "title": string, "description": string, "completed": false }],
    "project": { "title": string, "description": string, "deliverables": string[], "completed": false },
    "isUnlocked": true
  }
]`;

    if (client) {
      try {
        const rawText = await generateWithTimeout(client, prompt, 0.2);
        if (rawText) {
          const parsed = JSON.parse(cleanJsonText(rawText));
          if (Array.isArray(parsed) && parsed.length === 5) {
            return parsed;
          }
        }
      } catch (err) {
        console.warn("Gemini generateRoadmap fallback:", err);
      }
    }

    // Structured fallback roadmap template
    return [
      {
        id: "phase-1",
        phaseNumber: 1,
        title: "Strengthen Fundamentals",
        description: "Solidify core language paradigms, algorithmic problem-solving patterns, and Git version control workflow.",
        estimatedEffort: "3-4 Weeks",
        skills: [targetCareer.coreTechnicalSkills[0]?.name || "Core Programming", "Data Structures", "Git & GitHub"],
        learningTasks: [
          { id: "p1-l1", title: "Master Asynchronous Execution & Memory Management", description: "Study event loops, concurrency, and error propagation.", completed: true },
          { id: "p1-l2", title: "Deep Dive into Data Structures", description: "Implement hash maps, trees, and graph traversal patterns.", completed: false }
        ],
        practiceTasks: [
          { id: "p1-p1", title: "Solve 20 Algorithmic Coding Problems", description: "Focus on two-pointer, sliding window, and recursion patterns.", completed: false },
          { id: "p1-p2", title: "Clean Branching Workflow Setup", description: "Establish semantic commits and interactive rebase routines.", completed: true }
        ],
        project: {
          title: "Algorithmic Utility Library with Unit Test Suite",
          description: "Develop a standalone package with TypeScript, automated Jest tests, and published npm packaging configuration.",
          deliverables: ["Modular TypeScript codebase", "Jest test suite with >90% coverage", "GitHub CI workflow"],
          completed: false
        },
        isUnlocked: true
      },
      {
        id: "phase-2",
        phaseNumber: 2,
        title: "Develop Missing Skills",
        description: "Target key skill gaps identified in your profile, including database schema optimization and backend APIs.",
        estimatedEffort: "4-5 Weeks",
        skills: [targetCareer.coreTechnicalSkills[1]?.name || "Backend Frameworks", "SQL & Database Design", "Docker Basics"],
        learningTasks: [
          { id: "p2-l1", title: "Relational Schema Normalization & Indexing", description: "Learn 3NF normalization, foreign key constraints, and index optimization.", completed: false },
          { id: "p2-l2", title: "RESTful API Architecture & Authentication", description: "Build JWT-based authentication pipelines and input sanitization.", completed: false }
        ],
        practiceTasks: [
          { id: "p2-p1", title: "Construct a Multi-Table SQL Database Schema", description: "Write complex joins, aggregation queries, and schema migrations.", completed: false },
          { id: "p2-p2", title: "Dockerize a Multi-Container Application", description: "Create Dockerfile and docker-compose configurations.", completed: false }
        ],
        project: {
          title: "Secure RESTful Service with Relational Persistence",
          description: "Build an Express/Node backend service featuring rate limiting, JWT auth, and PostgreSQL database queries.",
          deliverables: ["OpenAPI/Swagger documentation", "Authentication middleware", "Containerized setup"],
          completed: false
        },
        isUnlocked: true
      },
      {
        id: "phase-3",
        phaseNumber: 3,
        title: "Build Real Projects",
        description: "Assemble complete, production-grade applications that demonstrate end-to-end craftsmanship.",
        estimatedEffort: "4-6 Weeks",
        skills: ["Full-Stack Architecture", "State Management", "CI/CD Deployment"],
        learningTasks: [
          { id: "p3-l1", title: "Frontend State Architecture & Responsive Design", description: "Master custom React hooks, optimistic UI updates, and Tailwind design tokens.", completed: false },
          { id: "p3-l2", title: "Automated Continuous Deployment Pipelines", description: "Deploy cloud services with automated GitHub Actions.", completed: false }
        ],
        practiceTasks: [
          { id: "p3-p1", title: "Conduct Responsive Cross-Browser UI Audit", description: "Ensure mobile touch compliance and zero layout shifts.", completed: false },
          { id: "p3-p2", title: "Implement Telemetry & Structured Logging", description: "Integrate error monitoring and request logging.", completed: false }
        ],
        project: {
          title: `${targetCareer.title} Capstone Platform`,
          description: "An end-to-end production platform addressing a real-world problem with live cloud deployment and documentation.",
          deliverables: ["Live cloud deployment URL", "Comprehensive GitHub README with architecture diagram", "Video walkthrough demonstrating features"],
          completed: false
        },
        isUnlocked: true
      },
      {
        id: "phase-4",
        phaseNumber: 4,
        title: "Validate & Prove Skills",
        description: "Consolidate verifiable evidence, earn industry certifications, and publish your portfolio.",
        estimatedEffort: "2-3 Weeks",
        skills: ["Technical Writing", "Code Review Documentation", "Skill Verification"],
        learningTasks: [
          { id: "p4-l1", title: "Write In-Depth Technical Engineering Case Studies", description: "Document architectural decisions, trade-offs, and latency benchmarks.", completed: false },
          { id: "p4-l2", title: "Prepare for Industry Skill Certifications", description: "Review standardized domain knowledge domains.", completed: false }
        ],
        practiceTasks: [
          { id: "p4-p1", title: "Add Proof of Skills to Portfolio", description: "Link GitHub repositories and live demo URLs to your profile evidence tracker.", completed: false },
          { id: "p4-p2", title: "Perform Peer Code Reviews", description: "Review open-source pull requests and write constructive comments.", completed: false }
        ],
        project: {
          title: "Interactive Engineering Portfolio & Evidence Showcase",
          description: "A fast, accessible developer portfolio highlighting your live applications, metrics, and skill verifications.",
          deliverables: ["Clean responsive portfolio site", "Links to 3 evidence artifacts", "Lighthouse score > 95"],
          completed: false
        },
        isUnlocked: false
      },
      {
        id: "phase-5",
        phaseNumber: 5,
        title: "Interview & Employment Preparation",
        description: "Master technical coding evaluations, system design discussions, and STAR behavioral questions.",
        estimatedEffort: "3-4 Weeks",
        skills: ["System Design", "Behavioral (STAR Method)", "Live Technical Communication"],
        learningTasks: [
          { id: "p5-l1", title: "High-Level System Design Patterns", description: "Study load balancers, caching strategies, and database sharding.", completed: false },
          { id: "p5-l2", title: "Craft STAR Behavioral Stories", description: "Structure 5 key stories demonstrating conflict resolution, leadership, and technical obstacles.", completed: false }
        ],
        practiceTasks: [
          { id: "p5-p1", title: "Complete 3 AI Mock Interview Simulations", description: "Simulate Technical and HR interview rounds in the Interview Arena.", completed: false },
          { id: "p5-p2", title: "Whiteboard Live Problem Deconstruction", description: "Explain time/space complexity trade-offs verbally while writing solutions.", completed: false }
        ],
        project: {
          title: "Complete Job-Ready Application Package",
          description: "Tailored ATS-friendly resume, curated GitHub repositories, and verified interview practice summaries.",
          deliverables: ["Single-page high-contrast resume", "Interview summary scores > 85%", "Active application pipeline"],
          completed: false
        },
        isUnlocked: false
      }
    ];
  });
}

/**
 * 5. Generate AI Interview Simulator Questions
 */
export async function generateInterviewQuestions(careerTitle: string, difficulty: string, interviewType: string) {
  const key = `interview_q_${careerTitle}_${difficulty}_${interviewType}`;
  return runWithDeduplication(key, async () => {
    const client = getGeminiClient();
    const prompt = `Generate 5 realistic interview questions for:
Role: ${careerTitle}, Level: ${difficulty}, Type: ${interviewType}

Return JSON array ONLY:
[
  {
    "id": "q1",
    "question": string,
    "type": "${interviewType}",
    "contextOrScenario": string
  }
]`;

    if (client) {
      try {
        const rawText = await generateWithTimeout(client, prompt, 0.3);
        if (rawText) {
          const parsed = JSON.parse(cleanJsonText(rawText));
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (err) {
        console.warn("Gemini generateInterviewQuestions fallback:", err);
      }
    }

    // Curated bank fallback
    if (interviewType === "Behavioral" || interviewType === "HR") {
      return [
        { id: "q1", question: "Can you describe a challenging technical project you worked on where requirements changed mid-way? How did you adapt?", type: interviewType, contextOrScenario: "Assess adaptability and project resilience." },
        { id: "q2", question: "Tell me about a time you had a technical disagreement with a teammate or lead. How did you resolve it?", type: interviewType, contextOrScenario: "Assess communication and collaborative diplomacy." },
        { id: "q3", question: "Describe a situation where you discovered a critical bug right before a demo or submission. What steps did you take?", type: interviewType, contextOrScenario: "Assess composure and prioritization under pressure." },
        { id: "q4", question: "How do you keep yourself updated with rapidly evolving technology stacks and evaluate when to adopt a new tool?", type: interviewType, contextOrScenario: "Assess continuous learning and pragmatic judgment." },
        { id: "q5", question: "Where do you see your technical leadership trajectory developing over the next 2 to 3 years?", type: interviewType, contextOrScenario: "Assess self-awareness and goal clarity." }
      ];
    }

    return [
      { id: "q1", question: `How would you design and structure a high-performance REST API for ${careerTitle} that handles authenticated user traffic and database queries?`, type: interviewType, contextOrScenario: "Assess backend architecture and API principles." },
      { id: "q2", question: "Suppose an endpoint is experiencing slow query response times under high concurrency. Walk me through your step-by-step diagnostic workflow.", type: interviewType, contextOrScenario: "Assess debugging methodology and database indexing concepts." },
      { id: "q3", question: "Explain the difference between optimistic concurrency control and pessimistic locking, and when you would choose one over the other.", type: interviewType, contextOrScenario: "Assess data consistency and state management concepts." },
      { id: "q4", question: "How do you approach automated testing (unit, integration, and mocking) in your development lifecycle?", type: interviewType, contextOrScenario: "Assess code quality and verification mindset." },
      { id: "q5", question: `What are the primary security considerations you enforce when writing client-server applications in ${careerTitle}?`, type: interviewType, contextOrScenario: "Assess OWASP guidelines and token security." }
    ];
  });
}

/**
 * 6. Evaluate Candidate Interview Answer
 */
export async function evaluateInterviewAnswer(careerTitle: string, question: string, answerText: string, interviewType: string) {
  const client = getGeminiClient();
  const prompt = `Evaluate candidate answer for ${careerTitle}:
Question: "${question}"
Answer: "${answerText}"
Type: ${interviewType}

Return JSON ONLY:
{
  "relevanceScore": number (0-100),
  "technicalCorrectnessScore": number (0-100),
  "clarityScore": number (0-100),
  "structureScore": number (0-100),
  "confidenceIndicator": "High" | "Moderate" | "Developing",
  "constructiveFeedback": string (2 sentences),
  "keyImprovement": string (1 sentence)
}`;

  if (client) {
    try {
      const rawText = await generateWithTimeout(client, prompt, 0.2);
      if (rawText) {
        const parsed = JSON.parse(cleanJsonText(rawText));
        if (parsed && typeof parsed.relevanceScore === "number") {
          return parsed;
        }
      }
    } catch (err) {
      console.warn("Gemini evaluateInterviewAnswer fallback:", err);
    }
  }

  // Heuristic scoring
  const wordCount = answerText.trim().split(/\s+/).length;
  let baseScore = 65;
  if (wordCount > 60) baseScore += 15;
  else if (wordCount > 25) baseScore += 8;
  else baseScore -= 10;

  return {
    relevanceScore: Math.min(95, Math.max(50, baseScore + 5)),
    technicalCorrectnessScore: Math.min(95, Math.max(50, baseScore)),
    clarityScore: Math.min(95, Math.max(50, baseScore + 2)),
    structureScore: Math.min(95, Math.max(50, baseScore - 3)),
    confidenceIndicator: (wordCount > 50 ? "High" : wordCount > 20 ? "Moderate" : "Developing") as any,
    constructiveFeedback: "Good foundational response. To make it stand out further, ground your explanation with specific concrete metrics and mention the architectural trade-offs you considered.",
    keyImprovement: "Quantify your impact and explicitly state how you verified the outcome.",
  };
}

/**
 * 7. Generate Full Interview Summary
 */
export async function generateInterviewSummary(careerTitle: string, answersWithEval: any[]) {
  const client = getGeminiClient();
  const prompt = `Synthesize Interview Performance Summary for "${careerTitle}":
Evaluations:
${answersWithEval.map((a, i) => `Q${i + 1}: ${a.question}\nScore: ${a.evaluation?.relevanceScore}, Feedback: ${a.evaluation?.constructiveFeedback}`).join("\n")}

Return JSON ONLY:
{
  "overallScore": number (0-100),
  "summaryText": string (2-3 sentences),
  "strengths": string[] (3 items),
  "areasToImprove": string[] (2 items),
  "recommendedPractice": string[] (2 items)
}`;

  if (client) {
    try {
      const rawText = await generateWithTimeout(client, prompt, 0.2);
      if (rawText) {
        const parsed = JSON.parse(cleanJsonText(rawText));
        if (parsed && typeof parsed.overallScore === "number") {
          return parsed;
        }
      }
    } catch (err) {
      console.warn("Gemini generateInterviewSummary fallback:", err);
    }
  }

  // Fallback
  const avg = Math.round(
    answersWithEval.reduce((acc, curr) => {
      const evalScores = curr.evaluation;
      const qAvg = evalScores ? (evalScores.relevanceScore + evalScores.technicalCorrectnessScore + evalScores.clarityScore + evalScores.structureScore) / 4 : 70;
      return acc + qAvg;
    }, 0) / Math.max(1, answersWithEval.length)
  );

  return {
    overallScore: avg,
    summaryText: `You demonstrated solid foundational understanding and structured thinking for the ${careerTitle} role. Your technical explanations were clear, with minor opportunities to provide deeper system metrics.`,
    strengths: [
      "Clear articulation of technical concepts and problem-solving steps",
      "Good awareness of error handling and practical implementation details",
      "Calm, structured responses to scenario questions"
    ],
    areasToImprove: [
      "Incorporate more quantitative impact metrics (e.g. latency reduction, test coverage)",
      "Structure behavioral answers strictly around Situation, Task, Action, and Result (STAR)"
    ],
    recommendedPractice: [
      "Practice whiteboarding API endpoints and database schema diagrams",
      "Prepare 3 concrete stories of past project roadblocks and how you solved them"
    ]
  };
}

/**
 * 8. Generate Contextual AI Career Insights (Non-intrusive)
 */
export async function generateCareerInsights(profile: CareerProfileDoc, roadmap?: any, evidences: any[] = [], interviews: any[] = []) {
  const key = `insights_${profile.userId}_${evidences.length}_${interviews.length}`;
  return runWithDeduplication(key, async () => {
    const client = getGeminiClient();
    const prompt = `Analyze student status and output 2 concise career progression insights:
Direction: ${profile.currentDirection} (${profile.readinessScore}%)
Verified Evidences: ${evidences.length}
Interviews: ${interviews.filter(i => i.status === 'completed').length}

Return JSON array of 2 items ONLY:
[
  {
    "id": string,
    "title": string,
    "observation": string (2 sentences),
    "suggestedAction": string (1 sentence),
    "actionRoute": string (one of "/roadmap", "/skills", "/evidence", "/interview", "/learning"),
    "category": "readiness" | "skill_gap" | "interview" | "portfolio" | "momentum"
  }
]`;

    if (client) {
      try {
        const rawText = await generateWithTimeout(client, prompt, 0.2);
        if (rawText) {
          const parsed = JSON.parse(cleanJsonText(rawText));
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((item, idx) => ({
              ...item,
              id: item.id || `insight-${Date.now()}-${idx}`,
              userId: profile.userId,
              isRead: false,
              createdAt: new Date().toISOString(),
            }));
          }
        }
      } catch (err) {
        console.warn("Gemini generateCareerInsights fallback:", err);
      }
    }

    // Fallback Contextual Insights
    const results = [];
    const completedInterviews = interviews.filter(i => i.status === "completed").length;
    
    if (completedInterviews === 0) {
      results.push({
        id: `insight-interview-${Date.now()}`,
        userId: profile.userId,
        title: "Interview Readiness Opportunity",
        observation: "Your technical project foundation is progressing well, but you haven't completed a mock interview simulation yet. Practicing verbal deconstruction increases hiring confidence significantly.",
        suggestedAction: "Complete an Entry-Level Technical mock session in the Interview Arena.",
        actionRoute: "/interview",
        category: "interview" as const,
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }

    if (evidences.length < 2) {
      results.push({
        id: `insight-evidence-${Date.now()}`,
        userId: profile.userId,
        title: "Evidence Strength Boost",
        observation: "Adding verifiable proof (GitHub repositories or live project links) transforms claimed skills into demonstrated competencies for prospective employers.",
        suggestedAction: "Add GitHub repository evidence for your core programming skills.",
        actionRoute: "/evidence",
        category: "portfolio" as const,
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }

    results.push({
      id: `insight-roadmap-${Date.now()}`,
      userId: profile.userId,
      title: "Continuous Roadmap Momentum",
      observation: `Your career direction is aligned with ${profile.currentDirection}. Consistent execution on Phase 2 tasks will bridge your remaining skill gaps quickly.`,
      suggestedAction: "Check off your next practice task on your personalized roadmap.",
      actionRoute: "/roadmap",
      category: "momentum" as const,
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    return results;
  });
}
