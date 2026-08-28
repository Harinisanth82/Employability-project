import fs from "fs";
import path from "path";
import {
  UserDoc,
  CareerProfileDoc,
  AssessmentDoc,
  CareerDoc,
  CareerRecommendationDoc,
  RoadmapDoc,
  SkillEvidenceDoc,
  InterviewDoc,
  CareerInsightDoc,
  ProgressTimelineDoc
} from "./models.js";
import { INITIAL_CAREERS } from "./seedData.js";

interface DatabaseSchema {
  users: UserDoc[];
  profiles: CareerProfileDoc[];
  assessments: AssessmentDoc[];
  careers: CareerDoc[];
  recommendations: CareerRecommendationDoc[];
  roadmaps: RoadmapDoc[];
  evidences: SkillEvidenceDoc[];
  interviews: InterviewDoc[];
  insights: CareerInsightDoc[];
  timeline: ProgressTimelineDoc[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

class DatabaseStore {
  private data: DatabaseSchema;
  private saveTimeout: NodeJS.Timeout | null = null;
  
  // High-performance In-Memory Indexes
  private userByIdIndex = new Map<string, UserDoc>();
  private userByEmailIndex = new Map<string, UserDoc>();
  private profileByUserIdIndex = new Map<string, CareerProfileDoc>();
  private assessmentByUserIdIndex = new Map<string, AssessmentDoc>();
  private careerByIdIndex = new Map<string, CareerDoc>();
  private roadmapByUserIdIndex = new Map<string, RoadmapDoc>();
  private recommendationByUserIdIndex = new Map<string, CareerRecommendationDoc>();
  
  // AI Results Cache (Skill Gap, etc.)
  private skillGapCache = new Map<string, { result: any; cachedAt: number; profileUpdatedAt: string }>();

  constructor() {
    this.data = {
      users: [],
      profiles: [],
      assessments: [],
      careers: INITIAL_CAREERS,
      recommendations: [],
      roadmaps: [],
      evidences: [],
      interviews: [],
      insights: [],
      timeline: []
    };
    this.init();
  }

  private rebuildIndexes() {
    this.userByIdIndex.clear();
    this.userByEmailIndex.clear();
    for (const u of this.data.users) {
      this.userByIdIndex.set(u.id, u);
      this.userByEmailIndex.set(u.email.toLowerCase(), u);
    }

    this.profileByUserIdIndex.clear();
    for (const p of this.data.profiles) {
      this.profileByUserIdIndex.set(p.userId, p);
    }

    this.assessmentByUserIdIndex.clear();
    for (const a of this.data.assessments) {
      this.assessmentByUserIdIndex.set(a.userId, a);
    }

    this.careerByIdIndex.clear();
    for (const c of this.data.careers) {
      this.careerByIdIndex.set(c.id, c);
      this.careerByIdIndex.set(c.slug, c);
    }

    this.roadmapByUserIdIndex.clear();
    for (const r of this.data.roadmaps) {
      this.roadmapByUserIdIndex.set(r.userId, r);
    }

    this.recommendationByUserIdIndex.clear();
    for (const rec of this.data.recommendations) {
      this.recommendationByUserIdIndex.set(rec.userId, rec);
    }
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        this.data = {
          users: parsed.users || [],
          profiles: parsed.profiles || [],
          assessments: parsed.assessments || [],
          careers: parsed.careers && parsed.careers.length > 0 ? parsed.careers : INITIAL_CAREERS,
          recommendations: parsed.recommendations || [],
          roadmaps: parsed.roadmaps || [],
          evidences: parsed.evidences || [],
          interviews: parsed.interviews || [],
          insights: parsed.insights || [],
          timeline: parsed.timeline || []
        };
      } else {
        this.persistImmediate();
      }
    } catch (err) {
      console.warn("Database storage initialization warning, using in-memory baseline:", err);
    }
    this.rebuildIndexes();
  }

  public persistImmediate() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to write db.json:", err);
    }
  }

  public schedulePersist() {
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => {
      this.persistImmediate();
    }, 200);
  }

  // Users - O(1) Lookups
  public getUsers() { return this.data.users; }
  public findUserById(id: string) { return this.userByIdIndex.get(id) || null; }
  public findUserByEmail(email: string) { return this.userByEmailIndex.get(email.toLowerCase()) || null; }
  public insertUser(user: UserDoc) {
    this.data.users.push(user);
    this.userByIdIndex.set(user.id, user);
    this.userByEmailIndex.set(user.email.toLowerCase(), user);
    this.schedulePersist();
    return user;
  }
  public updateUser(id: string, updates: Partial<UserDoc>) {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      const updated = { ...this.data.users[idx], ...updates, updatedAt: new Date().toISOString() };
      this.data.users[idx] = updated;
      this.userByIdIndex.set(id, updated);
      if (updated.email) this.userByEmailIndex.set(updated.email.toLowerCase(), updated);
      this.schedulePersist();
      return updated;
    }
    return null;
  }
  public deleteUser(id: string) {
    this.data.users = this.data.users.filter(u => u.id !== id);
    this.data.profiles = this.data.profiles.filter(p => p.userId !== id);
    this.data.assessments = this.data.assessments.filter(a => a.userId !== id);
    this.data.recommendations = this.data.recommendations.filter(r => r.userId !== id);
    this.data.roadmaps = this.data.roadmaps.filter(r => r.userId !== id);
    this.data.evidences = this.data.evidences.filter(e => e.userId !== id);
    this.data.interviews = this.data.interviews.filter(i => i.userId !== id);
    this.data.insights = this.data.insights.filter(i => i.userId !== id);
    this.data.timeline = this.data.timeline.filter(t => t.userId !== id);
    this.rebuildIndexes();
    this.schedulePersist();
  }

  // Profiles - O(1) Lookup with Cache Invalidation
  public getProfileByUserId(userId: string) {
    return this.profileByUserIdIndex.get(userId) || null;
  }
  public upsertProfile(profile: CareerProfileDoc) {
    const idx = this.data.profiles.findIndex(p => p.userId === profile.userId);
    const updated = { ...profile, updatedAt: new Date().toISOString() };
    if (idx !== -1) {
      this.data.profiles[idx] = updated;
    } else {
      this.data.profiles.push(updated);
    }
    this.profileByUserIdIndex.set(profile.userId, updated);
    // Invalidate AI caches when profile is updated
    this.invalidateUserAiCache(profile.userId);
    this.schedulePersist();
    return updated;
  }

  // Assessments - O(1) Lookup
  public getAssessmentByUserId(userId: string) {
    return this.assessmentByUserIdIndex.get(userId) || null;
  }
  public upsertAssessment(assessment: AssessmentDoc) {
    const idx = this.data.assessments.findIndex(a => a.userId === assessment.userId);
    if (idx !== -1) {
      this.data.assessments[idx] = assessment;
    } else {
      this.data.assessments.push(assessment);
    }
    this.assessmentByUserIdIndex.set(assessment.userId, assessment);
    this.invalidateUserAiCache(assessment.userId);
    this.schedulePersist();
    return assessment;
  }

  // Careers - O(1) Lookup
  public getCareers() { return this.data.careers; }
  public getCareerById(id: string) {
    return this.careerByIdIndex.get(id) || this.data.careers.find(c => c.id === id || c.slug === id || c.title.toLowerCase() === id.toLowerCase()) || null;
  }

  // Recommendations - O(1) Lookup
  public getRecommendationByUserId(userId: string) {
    return this.recommendationByUserIdIndex.get(userId) || null;
  }
  public upsertRecommendation(rec: CareerRecommendationDoc) {
    const idx = this.data.recommendations.findIndex(r => r.userId === rec.userId);
    if (idx !== -1) {
      this.data.recommendations[idx] = rec;
    } else {
      this.data.recommendations.push(rec);
    }
    this.recommendationByUserIdIndex.set(rec.userId, rec);
    this.schedulePersist();
    return rec;
  }

  // Roadmaps - O(1) Lookup
  public getRoadmapByUserId(userId: string) {
    return this.roadmapByUserIdIndex.get(userId) || null;
  }
  public upsertRoadmap(roadmap: RoadmapDoc) {
    const updated = { ...roadmap, updatedAt: new Date().toISOString() };
    const idx = this.data.roadmaps.findIndex(r => r.userId === roadmap.userId);
    if (idx !== -1) {
      this.data.roadmaps[idx] = updated;
    } else {
      this.data.roadmaps.push(updated);
    }
    this.roadmapByUserIdIndex.set(roadmap.userId, updated);
    this.schedulePersist();
    return updated;
  }

  // Skill Gap Cache
  public getCachedSkillGap(userId: string, careerId: string, profileUpdatedAt?: string) {
    const key = `${userId}_${careerId}`;
    const cached = this.skillGapCache.get(key);
    if (!cached) return null;
    // If profile has been updated after the cached analysis, invalidate
    if (profileUpdatedAt && cached.profileUpdatedAt && new Date(profileUpdatedAt) > new Date(cached.profileUpdatedAt)) {
      this.skillGapCache.delete(key);
      return null;
    }
    return cached.result;
  }
  public setCachedSkillGap(userId: string, careerId: string, result: any, profileUpdatedAt?: string) {
    const key = `${userId}_${careerId}`;
    this.skillGapCache.set(key, {
      result,
      cachedAt: Date.now(),
      profileUpdatedAt: profileUpdatedAt || new Date().toISOString()
    });
  }

  public invalidateUserAiCache(userId: string) {
    for (const key of this.skillGapCache.keys()) {
      if (key.startsWith(`${userId}_`)) {
        this.skillGapCache.delete(key);
      }
    }
  }

  // Evidences - with pagination
  public getEvidencesByUserId(userId: string, page = 1, limit = 50) {
    const filtered = this.data.evidences.filter(e => e.userId === userId);
    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }
  public insertEvidence(evidence: SkillEvidenceDoc) {
    this.data.evidences.unshift(evidence);
    this.schedulePersist();
    return evidence;
  }
  public deleteEvidence(id: string, userId: string) {
    const initialLen = this.data.evidences.length;
    this.data.evidences = this.data.evidences.filter(e => !(e.id === id && e.userId === userId));
    this.schedulePersist();
    return this.data.evidences.length < initialLen;
  }

  // Interviews - with pagination
  public getInterviewsByUserId(userId: string, page = 1, limit = 50) {
    const filtered = this.data.interviews.filter(i => i.userId === userId);
    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }
  public getInterviewById(id: string, userId: string) {
    return this.data.interviews.find(i => i.id === id && i.userId === userId) || null;
  }
  public insertInterview(interview: InterviewDoc) {
    this.data.interviews.unshift(interview);
    this.schedulePersist();
    return interview;
  }
  public updateInterview(id: string, userId: string, updates: Partial<InterviewDoc>) {
    const idx = this.data.interviews.findIndex(i => i.id === id && i.userId === userId);
    if (idx !== -1) {
      this.data.interviews[idx] = { ...this.data.interviews[idx], ...updates };
      this.schedulePersist();
      return this.data.interviews[idx];
    }
    return null;
  }

  // Insights - O(1) operations
  public getInsightsByUserId(userId: string) {
    return this.data.insights.filter(i => i.userId === userId);
  }
  public upsertInsights(userId: string, newInsights: CareerInsightDoc[]) {
    const existing = this.data.insights.filter(i => i.userId !== userId);
    this.data.insights = [...newInsights, ...existing];
    this.schedulePersist();
    return this.getInsightsByUserId(userId);
  }
  public markInsightRead(id: string, userId: string) {
    const item = this.data.insights.find(i => i.id === id && i.userId === userId);
    if (item) {
      item.isRead = true;
      this.schedulePersist();
    }
    return item || null;
  }

  // Timeline events - with pagination
  public getTimelineByUserId(userId: string, page = 1, limit = 20) {
    const filtered = this.data.timeline
      .filter(t => t.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }
  public addTimelineEvent(event: ProgressTimelineDoc) {
    this.data.timeline.unshift(event);
    this.schedulePersist();
    return event;
  }
}

export const db = new DatabaseStore();
