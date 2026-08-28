import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.js";
import { useToast } from "../context/ToastContext.js";
import { api } from "../services/api.js";
import { Card } from "../components/ui/Card.js";
import { Button } from "../components/ui/Button.js";
import { Input } from "../components/ui/Input.js";
import { Badge } from "../components/ui/Badge.js";
import {
  GraduationCap,
  Code2,
  Heart,
  Briefcase,
  Target,
  Settings2,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { SkillItem, ProjectItem, InternshipItem, CertificationItem } from "../types/index.js";

const DEFAULT_PRESET_SKILLS = [
  { name: "JavaScript / TypeScript", category: "Programming" as const, level: 75 },
  { name: "React.js", category: "Web Development" as const, level: 70 },
  { name: "Node.js & Express", category: "Web Development" as const, level: 65 },
  { name: "SQL & Relational DBs", category: "Databases" as const, level: 60 },
  { name: "Git & Version Control", category: "Tools & Others" as const, level: 80 },
  { name: "REST API Design", category: "Web Development" as const, level: 70 },
];

const PRESET_SOFT_SKILLS = [
  "Problem Solving",
  "Technical Communication",
  "Team Collaboration",
  "Analytical Reasoning",
  "Time Management",
  "Adaptability",
];

const PRESET_INTERESTS = [
  "Full-Stack Web Development",
  "Cloud & Distributed Systems",
  "Artificial Intelligence & ML",
  "Data Engineering & Analytics",
  "DevOps & Infrastructure",
  "Mobile App Development",
  "Cybersecurity & Security Engineering",
];

export const OnboardingPage: React.FC<{ onNavigate: (route: string) => void }> = ({ onNavigate }) => {
  const { user, refreshUser } = useAuth();
  const toast = useToast();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Education
  const [education, setEducation] = useState({
    degree: "Bachelor of Technology / B.S.",
    department: "Computer Science & Engineering",
    institution: "State University Institute of Technology",
    graduationYear: "2026",
    academicPerformance: "82% / 3.6 CGPA",
  });

  // Step 2: Skills
  const [technicalSkills, setTechnicalSkills] = useState<SkillItem[]>(DEFAULT_PRESET_SKILLS);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState<SkillItem["category"]>("Programming");
  const [softSkills, setSoftSkills] = useState<string[]>(["Problem Solving", "Technical Communication", "Team Collaboration"]);

  // Step 3: Interests
  const [interests, setInterests] = useState<string[]>([
    "Full-Stack Web Development",
    "Cloud & Distributed Systems",
  ]);
  const [customInterest, setCustomInterest] = useState("");

  // Step 4: Experience
  const [projects, setProjects] = useState<ProjectItem[]>([
    {
      id: "p1",
      title: "Campus Resource Management System",
      description: "Full-stack web application with role-based access, inventory tracking, and REST APIs.",
      techStack: ["React", "Node.js", "Express", "PostgreSQL"],
    },
  ]);
  const [newProject, setNewProject] = useState({ title: "", description: "", techStack: "" });

  const [internships, setInternships] = useState<InternshipItem[]>([]);
  const [certifications, setCertifications] = useState<CertificationItem[]>([
    { id: "c1", name: "Modern React & Redux Fundamentals", issuer: "Coursera / Meta", year: "2024" },
  ]);

  // Step 5: Career Goals
  const [careerGoals, setCareerGoals] = useState({
    preferredAreas: ["Software Engineering", "Full-Stack Development"],
    desiredRole: "Software Developer",
    shortTermGoal: "Secure an entry-level software engineer role or high-impact developer internship.",
    longTermGoal: "Advance to Senior Full-Stack Architect building scalable distributed cloud systems.",
  });

  // Step 6: Work Preferences
  const [workPreferences, setWorkPreferences] = useState({
    workStyle: "Flexible" as const,
    focus: "Balanced" as const,
    domain: "Product Development" as const,
    orgType: "High-Growth Startup" as const,
    location: "Hybrid" as const,
  });

  // Helper Methods
  const addTechnicalSkill = () => {
    if (!newSkillName.trim()) return;
    if (technicalSkills.some((s) => s.name.toLowerCase() === newSkillName.trim().toLowerCase())) return;
    setTechnicalSkills([...technicalSkills, { name: newSkillName.trim(), category: newSkillCategory, level: 65 }]);
    setNewSkillName("");
  };

  const removeTechnicalSkill = (name: string) => {
    setTechnicalSkills(technicalSkills.filter((s) => s.name !== name));
  };

  const updateSkillLevel = (name: string, level: number) => {
    setTechnicalSkills(technicalSkills.map((s) => (s.name === name ? { ...s, level } : s)));
  };

  const toggleSoftSkill = (s: string) => {
    if (softSkills.includes(s)) {
      setSoftSkills(softSkills.filter((item) => item !== s));
    } else {
      setSoftSkills([...softSkills, s]);
    }
  };

  const toggleInterest = (i: string) => {
    if (interests.includes(i)) {
      setInterests(interests.filter((item) => item !== i));
    } else {
      setInterests([...interests, i]);
    }
  };

  const addCustomInterest = () => {
    if (!customInterest.trim()) return;
    if (!interests.includes(customInterest.trim())) {
      setInterests([...interests, customInterest.trim()]);
    }
    setCustomInterest("");
  };

  const handleAddProject = () => {
    if (!newProject.title.trim()) return;
    setProjects([
      ...projects,
      {
        id: "proj_" + Date.now(),
        title: newProject.title.trim(),
        description: newProject.description.trim() || "Independent student project",
        techStack: newProject.techStack ? newProject.techStack.split(",").map((s) => s.trim()) : ["JavaScript"],
      },
    ]);
    setNewProject({ title: "", description: "", techStack: "" });
  };

  const handleSubmitProfile = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        education,
        technicalSkills,
        softSkills,
        interests,
        experience: {
          projects,
          internships,
          certifications,
          hackathons: [],
          achievements: [],
        },
        careerGoals,
        workPreferences,
      };

      await api.profile.submitOnboarding(payload);
      await refreshUser();
      toast.success("Profile synthesized! Career roadmap and readiness breakdown generated.");
      onNavigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit career profile.");
      setIsSubmitting(false);
    }
  };

  return (
    <div id="onboarding-wizard" className="max-w-3xl mx-auto py-6 sm:py-10 px-4">
      {/* Step Indicator Header */}
      <div className="mb-8 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
          <span>Step {step} of 6</span>
          <span>{Math.round((step / 6) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-sky-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>
      </div>

      {isSubmitting ? (
        <Card variant="default" className="p-12 text-center space-y-6 animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-2xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 flex items-center justify-center mx-auto animate-pulse">
            <Sparkles className="w-8 h-8 animate-spin" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Synthesizing Career Intelligence Profile...
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              Evaluating your skills against 8+ industry career tracks, identifying core technical gaps, and structuring your personalized 5-phase career roadmap.
            </p>
          </div>
          <div className="flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-sky-600" />
          </div>
        </Card>
      ) : (
        <Card variant="default" className="p-6 sm:p-8 space-y-6">
          {/* STEP 1: EDUCATION */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Academic Background</h3>
                  <p className="text-xs text-slate-500">Provide your degree and institutional details.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="edu-degree"
                  label="Degree Program"
                  value={education.degree}
                  onChange={(e) => setEducation({ ...education, degree: e.target.value })}
                  placeholder="e.g. B.Tech / B.S. / Master's"
                  required
                />
                <Input
                  id="edu-department"
                  label="Department / Major"
                  value={education.department}
                  onChange={(e) => setEducation({ ...education, department: e.target.value })}
                  placeholder="e.g. Computer Science, Information Tech"
                  required
                />
              </div>

              <Input
                id="edu-institution"
                label="College / University Name"
                value={education.institution}
                onChange={(e) => setEducation({ ...education, institution: e.target.value })}
                placeholder="e.g. Institute of Engineering & Technology"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="edu-grad-year"
                  label="Graduation Year"
                  value={education.graduationYear}
                  onChange={(e) => setEducation({ ...education, graduationYear: e.target.value })}
                  placeholder="e.g. 2026"
                />
                <Input
                  id="edu-performance"
                  label="Academic Metric (CGPA / %)"
                  value={education.academicPerformance}
                  onChange={(e) => setEducation({ ...education, academicPerformance: e.target.value })}
                  placeholder="e.g. 8.4 CGPA or 82%"
                />
              </div>
            </div>
          )}

          {/* STEP 2: TECHNICAL & SOFT SKILLS */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Technical & Soft Skills</h3>
                  <p className="text-xs text-slate-500">Add your existing skills and estimate your confidence levels.</p>
                </div>
              </div>

              {/* Technical Skills List with Level Sliders */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Technical Proficiencies
                </label>
                <div className="space-y-3">
                  {technicalSkills.map((skill) => (
                    <div
                      key={skill.name}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{skill.name}</span>
                          <span className="text-[10px] text-slate-400 font-semibold uppercase">({skill.category})</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-sky-600 dark:text-sky-400">{skill.level}%</span>
                          <button
                            type="button"
                            onClick={() => removeTechnicalSkill(skill.name)}
                            className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        step="5"
                        value={skill.level}
                        onChange={(e) => updateSkillLevel(skill.name, parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-600"
                      />
                    </div>
                  ))}
                </div>

                {/* Add Custom Skill Form */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Add other technical skill (e.g. Docker, Python, Java)"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <select
                    value={newSkillCategory}
                    onChange={(e) => setNewSkillCategory(e.target.value as any)}
                    className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Programming">Programming</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Databases">Databases</option>
                    <option value="Cloud & DevOps">Cloud & DevOps</option>
                    <option value="AI & Data">AI & Data</option>
                    <option value="Tools & Others">Tools & Others</option>
                  </select>
                  <Button type="button" size="sm" variant="secondary" onClick={addTechnicalSkill} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                    Add
                  </Button>
                </div>
              </div>

              {/* Soft Skills Selector */}
              <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Select Your Strong Soft Skills
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_SOFT_SKILLS.map((skill) => {
                    const isSelected = softSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSoftSkill(skill)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          isSelected
                            ? "bg-sky-50 dark:bg-sky-950/80 border-sky-300 dark:border-sky-800 text-sky-700 dark:text-sky-300"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: INTERESTS */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Technical Interests</h3>
                  <p className="text-xs text-slate-500">Select fields that spark your genuine engineering curiosity.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PRESET_INTERESTS.map((interest) => {
                  const isSelected = interests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`p-3.5 rounded-xl text-left border transition-all flex items-center justify-between text-xs font-bold ${
                        isSelected
                          ? "bg-sky-50 dark:bg-sky-950/80 border-sky-400 dark:border-sky-700 text-sky-900 dark:text-sky-100"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                      }`}
                    >
                      <span>{interest}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Add custom interest (e.g. Distributed Consensus, Blockchain, AR/VR)"
                  value={customInterest}
                  onChange={(e) => setCustomInterest(e.target.value)}
                  className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <Button type="button" size="sm" variant="secondary" onClick={addCustomInterest}>
                  Add Interest
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: EXPERIENCE & PROJECTS */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Projects & Demonstrated Experience</h3>
                  <p className="text-xs text-slate-500">Add key academic or personal software projects you've worked on.</p>
                </div>
              </div>

              {/* Projects List */}
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{proj.title}</h4>
                      <button
                        type="button"
                        onClick={() => setProjects(projects.filter((p) => p.id !== proj.id))}
                        className="text-slate-400 hover:text-rose-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{proj.description}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.techStack.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-semibold text-slate-600 dark:text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Add Project Form */}
                <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Add A Project
                  </h5>
                  <Input
                    label="Project Title"
                    placeholder="e.g. E-Commerce Microservices API"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  />
                  <Input
                    label="Brief Description"
                    placeholder="e.g. Built JWT authentication and Stripe webhook integration"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  />
                  <Input
                    label="Tech Stack (comma separated)"
                    placeholder="e.g. React, Node.js, MongoDB, Docker"
                    value={newProject.techStack}
                    onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })}
                  />
                  <Button type="button" size="sm" variant="secondary" onClick={handleAddProject} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                    Save Project
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: CAREER GOALS */}
          {step === 5 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Career Trajectory & Goals</h3>
                  <p className="text-xs text-slate-500">Define your primary ambition and timeline targets.</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Desired Target Role
                </label>
                <select
                  value={careerGoals.desiredRole}
                  onChange={(e) => setCareerGoals({ ...careerGoals, desiredRole: e.target.value })}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="Software Developer">Software Developer (General Full-Stack)</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Full-Stack Developer">Full-Stack Developer</option>
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                  <option value="Cloud / DevOps Engineer">Cloud / DevOps Engineer</option>
                  <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
                </select>
              </div>

              <Input
                label="Short-Term Goal (Next 6-12 Months)"
                value={careerGoals.shortTermGoal}
                onChange={(e) => setCareerGoals({ ...careerGoals, shortTermGoal: e.target.value })}
                placeholder="e.g. Complete 2 full-stack capstone projects and secure an internship"
              />

              <Input
                label="Long-Term Vision (3-5 Years)"
                value={careerGoals.longTermGoal}
                onChange={(e) => setCareerGoals({ ...careerGoals, longTermGoal: e.target.value })}
                placeholder="e.g. Lead system architecture on high-scale distributed systems"
              />
            </div>
          )}

          {/* STEP 6: WORK PREFERENCES */}
          {step === 6 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600">
                  <Settings2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Work Preferences</h3>
                  <p className="text-xs text-slate-500">Fine-tune your working environment and organization profile.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Work Location
                  </label>
                  <select
                    value={workPreferences.location}
                    onChange={(e) => setWorkPreferences({ ...workPreferences, location: e.target.value as any })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Target Organization Type
                  </label>
                  <select
                    value={workPreferences.orgType}
                    onChange={(e) => setWorkPreferences({ ...workPreferences, orgType: e.target.value as any })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="High-Growth Startup">High-Growth Startup</option>
                    <option value="Established Enterprise">Established Enterprise</option>
                    <option value="Consulting & Agency">Consulting & Agency</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <span className="font-bold text-sky-800 dark:text-sky-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-sky-600" /> Complete Setup Summary
                </span>
                <p className="leading-relaxed">
                  Upon clicking submit, our AI framework will calculate your readiness scores, compare your competencies against the {careerGoals.desiredRole} role, and initialize your 5-phase career roadmap.
                </p>
              </div>
            </div>
          )}

          {/* Wizard Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
            {step > 1 ? (
              <Button
                id="wizard-back-btn"
                type="button"
                variant="outline"
                size="md"
                onClick={() => setStep(step - 1)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < 6 ? (
              <Button
                id="wizard-next-btn"
                type="button"
                variant="primary"
                size="md"
                onClick={() => setStep(step + 1)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Next Step
              </Button>
            ) : (
              <Button
                id="wizard-submit-btn"
                type="button"
                variant="academic"
                size="md"
                onClick={handleSubmitProfile}
                rightIcon={<Sparkles className="w-4 h-4 text-sky-400" />}
              >
                Build My Career Profile
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
