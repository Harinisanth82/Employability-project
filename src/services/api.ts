const API_BASE = "/api";

class ApiError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

// In-Flight Promise Deduplication Map for GET requests
const inFlightGetRequests = new Map<string, Promise<any>>();
// Static Catalog In-Memory Cache
let cachedCatalog: any = null;

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const isGet = !options.method || options.method === "GET";
  
  if (isGet && inFlightGetRequests.has(endpoint)) {
    return inFlightGetRequests.get(endpoint) as Promise<T>;
  }

  const exec = async () => {
    const token = localStorage.getItem("career_framework_token");

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    if (token) {
      (headers as any)["Authorization"] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data.message || `Request failed with status ${response.status}`;
      if (response.status === 401 && !endpoint.includes("/auth/login") && !endpoint.includes("/auth/register")) {
        localStorage.removeItem("career_framework_token");
        localStorage.removeItem("career_framework_user");
      }
      throw new ApiError(errorMsg, response.status, data.code);
    }

    return data.data !== undefined ? data.data : data;
  };

  if (isGet) {
    const promise = exec().finally(() => {
      inFlightGetRequests.delete(endpoint);
    });
    inFlightGetRequests.set(endpoint, promise);
    return promise;
  }

  return exec();
}

export const api = {
  // Auth
  auth: {
    register: (body: any) => request<any>("/auth/register", { method: "POST", body: JSON.stringify(body) }),
    login: (body: any) => request<any>("/auth/login", { method: "POST", body: JSON.stringify(body) }),
    getMe: () => request<any>("/auth/me"),
    changePassword: (body: any) => request<any>("/auth/change-password", { method: "POST", body: JSON.stringify(body) }),
    deleteAccount: () => request<any>("/auth/account", { method: "DELETE" }),
  },

  // Profile
  profile: {
    get: () => request<any>("/profile"),
    submitOnboarding: (body: any) => request<any>("/profile/onboarding", { method: "POST", body: JSON.stringify(body) }),
    update: (body: any) => request<any>("/profile", { method: "PUT", body: JSON.stringify(body) }),
    setTargetCareer: (careerId: string) => request<any>("/profile/target-career", { method: "POST", body: JSON.stringify({ careerId }) }),
  },

  // Assessment
  assessment: {
    getQuestions: () => request<any>("/assessment/questions"),
    getCurrent: () => request<any>("/assessment/current"),
    saveProgress: (body: any) => request<any>("/assessment/save-progress", { method: "POST", body: JSON.stringify(body) }),
    submit: (body: any) => request<any>("/assessment/submit", { method: "POST", body: JSON.stringify(body) }),
  },

  // Careers & Recommendations & Skill Gap
  careers: {
    getCatalog: async () => {
      if (cachedCatalog) return cachedCatalog;
      const res = await request<any>("/careers/catalog");
      cachedCatalog = res;
      return res;
    },
    getById: (id: string) => request<any>(`/careers/catalog/${id}`),
    compareWithProfile: (id: string) => request<any>(`/careers/catalog/${id}/compare`),
    getRecommendations: () => request<any>("/careers/recommendations"),
    recalculateRecommendations: () => request<any>("/careers/recommendations/recalculate", { method: "POST" }),
    getSkillGapAnalysis: (role?: string) => request<any>(`/careers/gap-analysis${role ? `?role=${encodeURIComponent(role)}` : ""}`),
  },

  // Skills
  skills: {
    getGapAnalysis: (role?: string, fresh = false) => request<any>(`/careers/gap-analysis?${role ? `role=${encodeURIComponent(role)}&` : ""}${fresh ? "fresh=true" : ""}`),
    recalculateGapAnalysis: (role?: string) => request<any>(`/careers/gap-analysis?${role ? `role=${encodeURIComponent(role)}&` : ""}fresh=true`),
  },

  // Roadmap
  roadmap: {
    get: () => request<any>("/roadmap"),
    regenerate: (careerId?: string) => request<any>("/roadmap/generate", { method: "POST", body: JSON.stringify({ careerId }) }),
    toggleTask: (phaseId: string, taskId: string, taskType: "learning" | "practice" | "project") =>
      request<any>("/roadmap/task", { method: "PATCH", body: JSON.stringify({ phaseId, taskId, taskType }) }),
  },

  // Skill Evidence
  evidence: {
    getAll: () => request<any>("/evidence"),
    add: (body: any) => request<any>("/evidence", { method: "POST", body: JSON.stringify(body) }),
    create: (body: any) => request<any>("/evidence", { method: "POST", body: JSON.stringify(body) }),
    delete: (id: string) => request<any>(`/evidence/${id}`, { method: "DELETE" }),
  },

  // Interview Arena
  interview: {
    getHistory: () => request<any>("/interviews"),
    startSession: (body: any) => request<any>("/interviews/start", { method: "POST", body: JSON.stringify(body) }),
    submitAnswer: (id: string, body: { questionId: string; answer: string }) =>
      request<any>(`/interviews/${id}/answer`, { method: "POST", body: JSON.stringify({ questionId: body.questionId, answerText: body.answer }) }),
    completeSession: (id: string) => request<any>(`/interviews/${id}/finalize`, { method: "POST" }),
  },

  interviews: {
    getAll: () => request<any>("/interviews"),
    getById: (id: string) => request<any>(`/interviews/${id}`),
    start: (body: any) => request<any>("/interviews/start", { method: "POST", body: JSON.stringify(body) }),
    answerQuestion: (id: string, questionId: string, answerText: string) =>
      request<any>(`/interviews/${id}/answer`, { method: "POST", body: JSON.stringify({ questionId, answerText }) }),
    finalize: (id: string) => request<any>(`/interviews/${id}/finalize`, { method: "POST" }),
  },

  // AI Insights
  insights: {
    getAll: () => request<any>("/insights"),
    refresh: () => request<any>("/insights/refresh", { method: "POST" }),
    markRead: (id: string) => request<any>(`/insights/${id}/read`, { method: "PATCH" }),
  },

  // Progress & Employability
  progress: {
    getTimeline: (type?: string) => request<any>(`/progress/timeline${type ? `?type=${type}` : ""}`),
    getEmployability: () => request<any>("/progress/employability"),
  },
};
