import { CareerDoc } from "./models.js";

export const INITIAL_CAREERS: CareerDoc[] = [
  {
    id: "software-developer",
    title: "Software Developer",
    slug: "software-developer",
    category: "Software Engineering",
    description: "Designs, constructs, tests, and maintains robust application software, backend services, and distributed systems to solve complex computational problems.",
    whatTheyDo: [
      "Translate system requirements into clean, testable, and maintainable code.",
      "Design and consume REST and GraphQL APIs connecting client applications with microservices.",
      "Write comprehensive unit, integration, and end-to-end automated test suites.",
      "Collaborate in Agile teams through code reviews, architectural discussions, and sprint planning.",
      "Optimize computational complexity and system latency across relational and document databases."
    ],
    coreTechnicalSkills: [
      { name: "JavaScript / TypeScript", importance: "Essential", defaultLevel: 85, category: "Programming" },
      { name: "React / Modern Frontend", importance: "High", defaultLevel: 75, category: "Web Development" },
      { name: "Node.js & Express", importance: "Essential", defaultLevel: 80, category: "Web Development" },
      { name: "SQL & Relational DBs", importance: "Essential", defaultLevel: 75, category: "Databases" },
      { name: "Data Structures & Algorithms", importance: "Essential", defaultLevel: 80, category: "Programming" },
      { name: "Git Version Control", importance: "Essential", defaultLevel: 85, category: "Tools & Others" },
      { name: "System Design & Architecture", importance: "Medium", defaultLevel: 65, category: "Programming" },
      { name: "Docker & Containerization", importance: "High", defaultLevel: 70, category: "Cloud & DevOps" },
      { name: "Automated Testing (Jest/Mocha)", importance: "High", defaultLevel: 70, category: "Tools & Others" }
    ],
    softSkills: [
      "Analytical Problem Solving",
      "Clear Technical Communication",
      "Constructive Code Review Feedback",
      "Autonomous Debugging & Research",
      "Agile Team Collaboration"
    ],
    commonTools: ["VS Code", "Git / GitHub", "Docker", "Postman", "Jest", "PostgreSQL", "Linux / Bash", "npm / yarn"],
    entryLevelExpectations: [
      "Ability to build a full-stack CRUD application with authentication and persistent database storage.",
      "Solid comprehension of object-oriented and functional programming paradigms.",
      "Familiarity with Git branching, pull requests, and semantic versioning.",
      "Ability to debug runtime errors and trace asynchronous execution."
    ],
    suggestedProjects: [
      {
        title: "Full-Stack Task & Workflow Management Platform",
        description: "Build a multi-user project planner with JWT authentication, role-based access control, relational database schema, and automated test coverage.",
        difficulty: "Intermediate",
        skillsUsed: ["Node.js", "Express", "React", "PostgreSQL", "JWT", "Docker"]
      },
      {
        title: "High-Throughput Rate-Limited API Gateway Service",
        description: "Create an Express/Node microservice that proxies requests, enforces token bucket rate-limiting, and logs structured analytics.",
        difficulty: "Advanced",
        skillsUsed: ["TypeScript", "Node.js", "Redis/In-Memory Caching", "Jest"]
      }
    ],
    careerProgression: [
      { level: "Junior / Associate", title: "Junior Software Developer", timeframe: "0-2 Years", salaryRange: "$75k - $95k" },
      { level: "Mid-Level", title: "Software Engineer", timeframe: "2-5 Years", salaryRange: "$105k - $140k" },
      { level: "Senior", title: "Senior Software Engineer", timeframe: "5-8 Years", salaryRange: "$145k - $190k" },
      { level: "Staff / Principal", title: "Staff Engineer / Architect", timeframe: "8+ Years", salaryRange: "$200k - $280k+" }
    ],
    relatedCareers: ["Full-Stack Developer", "Cloud Solutions Architect", "DevOps Engineer", "Mobile App Developer"]
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    slug: "data-analyst",
    category: "Data & Analytics",
    description: "Transforms raw data into actionable business intelligence through statistical modeling, SQL transformations, exploratory data analysis, and intuitive visualization dashboards.",
    whatTheyDo: [
      "Extract, clean, and validate data across enterprise databases and third-party data pipelines.",
      "Write complex SQL queries utilizing window functions, CTEs, and aggregation pipelines.",
      "Construct interactive dashboard KPI visualizations for stakeholders and leadership teams.",
      "Perform cohort analysis, statistical hypothesis testing, and user funnel evaluation.",
      "Present quantitative findings into clear narrative recommendations."
    ],
    coreTechnicalSkills: [
      { name: "SQL & Advanced Querying", importance: "Essential", defaultLevel: 90, category: "Databases" },
      { name: "Python (Pandas, NumPy)", importance: "Essential", defaultLevel: 80, category: "Programming" },
      { name: "Data Visualization (Tableau/PowerBI/D3)", importance: "Essential", defaultLevel: 85, category: "AI & Data" },
      { name: "Statistical Analysis & Probability", importance: "Essential", defaultLevel: 75, category: "AI & Data" },
      { name: "Data Cleaning & ETL Pipelines", importance: "High", defaultLevel: 80, category: "AI & Data" },
      { name: "Excel & Spreadsheet Modeling", importance: "High", defaultLevel: 85, category: "Tools & Others" },
      { name: "Git & Jupyter Notebooks", importance: "Medium", defaultLevel: 70, category: "Tools & Others" }
    ],
    softSkills: [
      "Data Storytelling",
      "Business Domain Acumen",
      "Critical Thinking",
      "Stakeholder Communication",
      "Curiosity & Investigation"
    ],
    commonTools: ["PostgreSQL / BigQuery", "Jupyter Notebooks", "Pandas", "Tableau", "Power BI", "Metabase", "Git"],
    entryLevelExpectations: [
      "Fluency with multi-table joins, subqueries, grouping, and aggregations in SQL.",
      "Demonstrated ability to clean messy CSV/JSON datasets and identify statistical anomalies.",
      "Experience creating published interactive dashboards with clear drill-downs."
    ],
    suggestedProjects: [
      {
        title: "E-Commerce Customer Lifetime Value & Churn Analytics",
        description: "Analyze transactional user data, segment customers with RFM modeling, and build an interactive visualization dashboard.",
        difficulty: "Intermediate",
        skillsUsed: ["Python", "SQL", "Pandas", "Matplotlib/Seaborn", "Tableau"]
      },
      {
        title: "Healthcare Outcomes & Resource Allocation Study",
        description: "Perform statistical hypothesis testing on public clinical outcome datasets to identify correlations in patient recovery times.",
        difficulty: "Intermediate",
        skillsUsed: ["Python", "Statistical Testing", "Jupyter", "Plotly"]
      }
    ],
    careerProgression: [
      { level: "Junior / Associate", title: "Junior Data Analyst", timeframe: "0-2 Years", salaryRange: "$65k - $85k" },
      { level: "Mid-Level", title: "Data Analyst / Analytics Engineer", timeframe: "2-5 Years", salaryRange: "$90k - $125k" },
      { level: "Senior", title: "Senior Business Intelligence Analyst", timeframe: "5-8 Years", salaryRange: "$130k - $165k" },
      { level: "Lead / Director", title: "Head of Analytics & Business Intelligence", timeframe: "8+ Years", salaryRange: "$175k - $240k+" }
    ],
    relatedCareers: ["AI/ML Engineer", "Data Engineer", "Product Manager", "Business Intelligence Specialist"]
  },
  {
    id: "ai-ml-engineer",
    title: "AI/ML Engineer",
    slug: "ai-ml-engineer",
    category: "Artificial Intelligence",
    description: "Designs, trains, fine-tunes, and deploys scalable machine learning models and Generative AI pipelines to production cloud environments.",
    whatTheyDo: [
      "Preprocess, tokenize, and engineer features from massive structured and unstructured datasets.",
      "Design neural network architectures with PyTorch / TensorFlow and evaluate performance metrics.",
      "Deploy inference pipelines and LLM workflows utilizing vector databases, embeddings, and RAG.",
      "Monitor model drift, latency, and throughput in containerized production infrastructure.",
      "Implement prompt engineering protocols and fine-tuning adapters for domain-specific models."
    ],
    coreTechnicalSkills: [
      { name: "Python & Numerical Computing", importance: "Essential", defaultLevel: 90, category: "Programming" },
      { name: "PyTorch / TensorFlow", importance: "Essential", defaultLevel: 80, category: "AI & Data" },
      { name: "Generative AI & LLM APIs (Gemini/OpenAI)", importance: "Essential", defaultLevel: 85, category: "AI & Data" },
      { name: "Vector Databases & RAG Pipelines", importance: "High", defaultLevel: 75, category: "AI & Data" },
      { name: "Linear Algebra & Calculus", importance: "Essential", defaultLevel: 75, category: "AI & Data" },
      { name: "MLOps & Docker Deployment", importance: "High", defaultLevel: 75, category: "Cloud & DevOps" },
      { name: "Data Structures & API Integration", importance: "Essential", defaultLevel: 80, category: "Programming" }
    ],
    softSkills: [
      "Scientific Rigor & Experimentation",
      "Ethical AI & Bias Awareness",
      "Research Paper Translation",
      "Cross-Functional Collaboration",
      "Iterative Problem Formulation"
    ],
    commonTools: ["PyTorch", "Hugging Face", "Google Gemini SDK", "ChromaDB / Pinecone", "Docker", "FastAPI", "Weights & Biases"],
    entryLevelExpectations: [
      "Solid mathematical understanding of gradient descent, loss functions, overfitting, and regularization.",
      "Demonstrated ability to train a model, evaluate metrics (F1, Precision/Recall, ROC-AUC), and expose it via a REST API.",
      "Experience with modern Generative AI tooling, structured prompting, and embeddings."
    ],
    suggestedProjects: [
      {
        title: "Intelligent Document Q&A Retrieval-Augmented System",
        description: "Build an end-to-end RAG application that chunks PDFs, generates vector embeddings, stores them in a vector index, and answers queries with citation validation.",
        difficulty: "Intermediate",
        skillsUsed: ["Python", "FastAPI", "Gemini API", "Vector Search", "Docker"]
      },
      {
        title: "Multimodal Visual Inspection & Classification Model",
        description: "Train a convolutional neural network with transfer learning to classify defect patterns in manufacturing images.",
        difficulty: "Advanced",
        skillsUsed: ["PyTorch", "Computer Vision", "TensorBoard", "Flask"]
      }
    ],
    careerProgression: [
      { level: "Junior / Associate", title: "Junior ML Engineer", timeframe: "0-2 Years", salaryRange: "$85k - $115k" },
      { level: "Mid-Level", title: "Machine Learning Engineer", timeframe: "2-5 Years", salaryRange: "$125k - $165k" },
      { level: "Senior", title: "Senior AI/ML Systems Engineer", timeframe: "5-8 Years", salaryRange: "$170k - $230k" },
      { level: "Principal / Lead", title: "Staff AI Researcher / Director of AI", timeframe: "8+ Years", salaryRange: "$240k - $340k+" }
    ],
    relatedCareers: ["Data Analyst", "Data Engineer", "Software Developer", "Research Scientist"]
  },
  {
    id: "cloud-solutions-architect",
    title: "Cloud Solutions Architect",
    slug: "cloud-solutions-architect",
    category: "Cloud & Infrastructure",
    description: "Architects scalable, resilient, highly available, and cost-effective cloud architectures and automated deployment pipelines across multi-cloud environments.",
    whatTheyDo: [
      "Design cloud topologies balancing security, scalability, disaster recovery, and latency.",
      "Implement Infrastructure as Code (Terraform, CloudFormation, Pulumi) for repeatable provisioning.",
      "Architect microservices orchestration using Kubernetes, Docker, and service meshes.",
      "Establish enterprise cloud security controls, IAM policies, and VPC networking.",
      "Analyze cloud consumption metrics to optimize architectural efficiency and cost."
    ],
    coreTechnicalSkills: [
      { name: "Cloud Platforms (GCP / AWS / Azure)", importance: "Essential", defaultLevel: 85, category: "Cloud & DevOps" },
      { name: "Docker & Container Orchestration", importance: "Essential", defaultLevel: 80, category: "Cloud & DevOps" },
      { name: "Infrastructure as Code (Terraform)", importance: "Essential", defaultLevel: 75, category: "Cloud & DevOps" },
      { name: "CI/CD Automation Pipelines", importance: "Essential", defaultLevel: 80, category: "Cloud & DevOps" },
      { name: "Networking (DNS, VPC, Load Balancers)", importance: "Essential", defaultLevel: 75, category: "Cloud & DevOps" },
      { name: "Linux Administration & Bash", importance: "Essential", defaultLevel: 85, category: "Tools & Others" },
      { name: "System Security & IAM", importance: "High", defaultLevel: 75, category: "Cloud & DevOps" }
    ],
    softSkills: [
      "High-Level Systems Thinking",
      "Executive Technical Presentation",
      "Risk Mitigation & Planning",
      "Vendor Evaluation",
      "Cross-Team Governance"
    ],
    commonTools: ["Google Cloud Platform", "AWS", "Terraform", "Kubernetes", "Docker", "GitHub Actions", "Prometheus / Grafana"],
    entryLevelExpectations: [
      "Understanding of core compute, storage, networking, and serverless cloud building blocks.",
      "Ability to write Dockerfiles and multi-stage container builds.",
      "Experience automating deployments using CI/CD pipelines."
    ],
    suggestedProjects: [
      {
        title: "Multi-Tier High Availability Microservice Infrastructure",
        description: "Provision a zero-downtime auto-scaling Kubernetes cluster with load balancing, TLS certificates, and centralized logging using Terraform.",
        difficulty: "Advanced",
        skillsUsed: ["Terraform", "GCP/AWS", "Kubernetes", "Docker", "GitHub Actions"]
      },
      {
        title: "Automated Serverless Event-Driven Processing Pipeline",
        description: "Create an event-driven file processing pipeline utilizing cloud functions, pub/sub queues, and object storage with automated alerting.",
        difficulty: "Intermediate",
        skillsUsed: ["Cloud Functions", "Pub/Sub", "Python", "Cloud Monitoring"]
      }
    ],
    careerProgression: [
      { level: "Junior / Associate", title: "Associate Cloud Engineer", timeframe: "0-2 Years", salaryRange: "$80k - $105k" },
      { level: "Mid-Level", title: "Cloud Infrastructure Engineer", timeframe: "2-5 Years", salaryRange: "$115k - $155k" },
      { level: "Senior", title: "Senior Cloud Solutions Architect", timeframe: "5-8 Years", salaryRange: "$160k - $210k" },
      { level: "Principal / Enterprise", title: "Principal Enterprise Architect", timeframe: "8+ Years", salaryRange: "$220k - $300k+" }
    ],
    relatedCareers: ["DevOps Engineer", "Software Developer", "Cybersecurity Specialist", "Site Reliability Engineer"]
  },
  {
    id: "product-engineer",
    title: "Product Engineer",
    slug: "product-engineer",
    category: "Product & UI/UX Engineering",
    description: "Bridges user-centered product design and frontend technical excellence to craft polished, performant, and accessible digital customer experiences.",
    whatTheyDo: [
      "Build fluid, responsive, and accessible client interfaces with modern component frameworks.",
      "Collaborate directly with product managers and designers to test hypotheses and prototype features.",
      "Instrument user behavioral telemetry, A/B experiment variations, and conversion funnels.",
      "Optimize Core Web Vitals, asset bundling, caching strategies, and render cycle efficiency.",
      "Maintain cohesive design systems with strict typographic, token, and accessibility standards."
    ],
    coreTechnicalSkills: [
      { name: "React & TypeScript", importance: "Essential", defaultLevel: 90, category: "Web Development" },
      { name: "Tailwind CSS & Design Tokens", importance: "Essential", defaultLevel: 85, category: "Web Development" },
      { name: "Web Accessibility (WCAG / ARIA)", importance: "Essential", defaultLevel: 80, category: "Web Development" },
      { name: "State Management & Reactivity", importance: "Essential", defaultLevel: 85, category: "Web Development" },
      { name: "REST / GraphQL Client Integration", importance: "Essential", defaultLevel: 80, category: "Web Development" },
      { name: "Micro-Animations (Framer Motion)", importance: "High", defaultLevel: 75, category: "Web Development" },
      { name: "Performance Profiling & Web Vitals", importance: "High", defaultLevel: 75, category: "Tools & Others" }
    ],
    softSkills: [
      "Empathy for End-User Experience",
      "Design & Visual Intuition",
      "Product Experimentation Mindset",
      "Clear Cross-Functional Communication",
      "Pragmatic Trade-off Evaluation"
    ],
    commonTools: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Figma", "Storybook", "Chrome DevTools", "Vite"],
    entryLevelExpectations: [
      "Ability to convert complex Figma designs into responsive, accessible code without layout shifting.",
      "Deep understanding of React state cycles, custom hooks, and memoization techniques.",
      "Proficiency in responsive design across mobile, tablet, and desktop breakpoints."
    ],
    suggestedProjects: [
      {
        title: "Enterprise Component Design System & Playground",
        description: "Build an accessible, themeable UI library with Storybook documentation, keyboard navigation testing, and token-based styling.",
        difficulty: "Intermediate",
        skillsUsed: ["React", "TypeScript", "Tailwind CSS", "Storybook", "WCAG Testing"]
      },
      {
        title: "Real-Time Collaborative Whiteboard / Canvas",
        description: "Develop a high-performance interactive canvas supporting multi-user shape manipulation, undo/redo stacks, and responsive zoom/pan.",
        difficulty: "Advanced",
        skillsUsed: ["TypeScript", "Canvas/SVG API", "WebSockets", "Optimistic State"]
      }
    ],
    careerProgression: [
      { level: "Junior / Associate", title: "Junior Product Engineer", timeframe: "0-2 Years", salaryRange: "$75k - $95k" },
      { level: "Mid-Level", title: "Product Software Engineer", timeframe: "2-5 Years", salaryRange: "$105k - $145k" },
      { level: "Senior", title: "Senior Product Engineer", timeframe: "5-8 Years", salaryRange: "$150k - $195k" },
      { level: "Staff / Design Lead", title: "Staff Product Engineer / Head of UI", timeframe: "8+ Years", salaryRange: "$205k - $285k+" }
    ],
    relatedCareers: ["Software Developer", "UI/UX Designer", "Frontend Architect", "Technical Product Manager"]
  },
  {
    id: "cybersecurity-analyst",
    title: "Cybersecurity Analyst",
    slug: "cybersecurity-analyst",
    category: "Information Security",
    description: "Protects organizational assets and network infrastructure by monitoring threat vectors, evaluating vulnerability posture, and responding to security incidents.",
    whatTheyDo: [
      "Monitor SIEM alerts and network traffic for intrusion attempts and anomalies.",
      "Conduct vulnerability assessments and penetration test simulations across applications.",
      "Perform digital forensics and incident triage during potential security breaches.",
      "Enforce compliance standards (SOC2, ISO27001, GDPR) and zero-trust policies.",
      "Educate engineering teams on secure coding guidelines (OWASP Top 10)."
    ],
    coreTechnicalSkills: [
      { name: "Network Security & Protocols", importance: "Essential", defaultLevel: 85, category: "Cloud & DevOps" },
      { name: "SIEM & Log Analysis", importance: "Essential", defaultLevel: 80, category: "Tools & Others" },
      { name: "OWASP Top 10 & Web App Security", importance: "Essential", defaultLevel: 85, category: "Web Development" },
      { name: "Linux Security & Scripting (Bash/Python)", importance: "Essential", defaultLevel: 80, category: "Programming" },
      { name: "Vulnerability Scanning & Penetration Testing", importance: "High", defaultLevel: 75, category: "Tools & Others" },
      { name: "Cryptography Fundamentals & PKI", importance: "High", defaultLevel: 75, category: "Programming" }
    ],
    softSkills: [
      "Investigative Detective Mindset",
      "Calm Composure During Incidents",
      "Clear Risk Communication",
      "Ethical Judgment",
      "Continuous Threat Awareness"
    ],
    commonTools: ["Wireshark", "Burp Suite", "Splunk / ELK", "Nmap", "Metasploit", "Kali Linux", "Snort"],
    entryLevelExpectations: [
      "Solid grasp of TCP/IP, OSI layers, firewall configurations, and DNS security.",
      "Familiarity with common web application vulnerabilities like XSS, SQLi, CSRF, and SSRF.",
      "Ability to analyze packet captures and system authentication logs."
    ],
    suggestedProjects: [
      {
        title: "Automated Web Application Security Vulnerability Scanner",
        description: "Create a security audit tool that inspects web endpoints for headers misconfigurations, outdated libraries, and injection vulnerabilities.",
        difficulty: "Intermediate",
        skillsUsed: ["Python", "OWASP Standards", "Requests", "Security Headers", "CLI"]
      },
      {
        title: "Intrusion Detection System Honeypot & SIEM Dashboard",
        description: "Deploy a honeypot server, capture malicious probing attempts, and stream log telemetry into an interactive analysis dashboard.",
        difficulty: "Advanced",
        skillsUsed: ["Linux", "Python", "Elasticsearch / Kibana", "Network Protocols"]
      }
    ],
    careerProgression: [
      { level: "Junior / Associate", title: "Junior SOC Analyst", timeframe: "0-2 Years", salaryRange: "$70k - $90k" },
      { level: "Mid-Level", title: "Information Security Analyst", timeframe: "2-5 Years", salaryRange: "$95k - $135k" },
      { level: "Senior", title: "Senior Threat Hunter / Security Architect", timeframe: "5-8 Years", salaryRange: "$140k - $185k" },
      { level: "Chief Officer", title: "Chief Information Security Officer (CISO)", timeframe: "8+ Years", salaryRange: "$200k - $300k+" }
    ],
    relatedCareers: ["Cloud Solutions Architect", "DevOps Engineer", "Software Developer", "Network Engineer"]
  }
];

export const ASSESSMENT_QUESTIONS = [
  {
    id: "q1",
    category: "Interests",
    questionText: "When working on a technical project, which phase gives you the most satisfaction?",
    options: [
      { text: "Architecting backend services, data schemas, and API logic", score: 85, weight: { "software-developer": 9, "ai-ml-engineer": 6 } },
      { text: "Exploring raw data, finding patterns, and generating charts", score: 85, weight: { "data-analyst": 10, "ai-ml-engineer": 7 } },
      { text: "Training models, optimizing algorithms, and exploring AI prompts", score: 85, weight: { "ai-ml-engineer": 10, "data-analyst": 6 } },
      { text: "Crafting fluid, intuitive user interfaces and interactions", score: 85, weight: { "product-engineer": 10, "software-developer": 5 } },
      { text: "Configuring infrastructure, containers, and deployment pipelines", score: 85, weight: { "cloud-solutions-architect": 10, "cybersecurity-analyst": 6 } }
    ]
  },
  {
    id: "q2",
    category: "Skills",
    questionText: "How comfortable are you writing SQL queries with multi-table joins and data aggregations?",
    options: [
      { text: "Expert: I write complex CTEs, window functions, and optimize query plans regularly", score: 95, weight: { "data-analyst": 9, "software-developer": 8 } },
      { text: "Comfortable: I can write multi-table joins, GROUP BY, and nested queries confidently", score: 75, weight: { "data-analyst": 7, "software-developer": 7 } },
      { text: "Basic: I know SELECT, WHERE, INSERT, and simple joins", score: 50, weight: { "product-engineer": 5, "cybersecurity-analyst": 4 } },
      { text: "Novice: I have barely touched SQL databases", score: 25, weight: { "product-engineer": 3 } }
    ]
  },
  {
    id: "q3",
    category: "Skills",
    questionText: "What is your current level of experience with Python programming?",
    options: [
      { text: "Advanced: I use NumPy, Pandas, PyTorch, or FastAPI for data and backend apps", score: 95, weight: { "ai-ml-engineer": 10, "data-analyst": 9 } },
      { text: "Intermediate: I write modular scripts, automate tasks, and work with APIs", score: 75, weight: { "ai-ml-engineer": 7, "cybersecurity-analyst": 7, "data-analyst": 7 } },
      { text: "Beginner: I understand syntax, loops, functions, and basic structures", score: 50, weight: { "software-developer": 4 } },
      { text: "None / Not my primary language: I primarily use JavaScript/TypeScript or other languages", score: 35, weight: { "product-engineer": 7, "software-developer": 6 } }
    ]
  },
  {
    id: "q4",
    category: "Work Style",
    questionText: "Which workplace collaboration environment matches your optimal working style?",
    options: [
      { text: "Deep individual focus solving intricate technical architecture problems", score: 80, weight: { "software-developer": 8, "ai-ml-engineer": 8 } },
      { text: "Cross-functional collaboration with product managers, designers, and users", score: 85, weight: { "product-engineer": 10, "data-analyst": 7 } },
      { text: "Investigative research discovering anomalies and validating hypotheses", score: 85, weight: { "data-analyst": 8, "cybersecurity-analyst": 9 } },
      { text: "Reliability & system operations ensuring enterprise resilience", score: 80, weight: { "cloud-solutions-architect": 9, "cybersecurity-analyst": 8 } }
    ]
  },
  {
    id: "q5",
    category: "Problem Solving",
    questionText: "When faced with an unexpected production bug or data anomaly, what is your initial instinct?",
    options: [
      { text: "Trace the execution flow with breakpoints, log inspections, and unit tests", score: 85, weight: { "software-developer": 9, "product-engineer": 8 } },
      { text: "Audit statistical distributions and isolate corrupted data records in the pipeline", score: 85, weight: { "data-analyst": 9, "ai-ml-engineer": 7 } },
      { text: "Inspect server logs, network packets, IAM permissions, and cluster health", score: 85, weight: { "cloud-solutions-architect": 9, "cybersecurity-analyst": 9 } },
      { text: "Evaluate edge-case user inputs and reproduction steps across browser environments", score: 85, weight: { "product-engineer": 9 } }
    ]
  },
  {
    id: "q6",
    category: "Career Preferences",
    questionText: "What type of product domain excites you the most?",
    options: [
      { text: "High-scale consumer applications used by millions of daily users", score: 85, weight: { "product-engineer": 9, "software-developer": 9 } },
      { text: "Artificial Intelligence, Generative AI, and autonomous agent systems", score: 90, weight: { "ai-ml-engineer": 10, "software-developer": 7 } },
      { text: "Data intelligence, market analytics, and strategic business metrics", score: 85, weight: { "data-analyst": 10 } },
      { text: "Cloud infrastructure, developer tooling, and distributed systems", score: 85, weight: { "cloud-solutions-architect": 10, "software-developer": 7 } },
      { text: "Enterprise threat defense, penetration testing, and zero-trust security", score: 85, weight: { "cybersecurity-analyst": 10 } }
    ]
  },
  {
    id: "q7",
    category: "Interests",
    questionText: "How eager are you to stay updated with cutting-edge AI developments (LLMs, neural networks, computer vision)?",
    options: [
      { text: "Extremely eager: I read papers, experiment with models, and build AI projects regularly", score: 95, weight: { "ai-ml-engineer": 10 } },
      { text: "Moderately eager: I integrate AI APIs into my applications when helpful", score: 75, weight: { "software-developer": 8, "product-engineer": 7 } },
      { text: "Curious: I follow news but focus on foundational programming first", score: 60, weight: { "software-developer": 7, "data-analyst": 6 } },
      { text: "Focused elsewhere: I prefer mastering infrastructure, security, or core systems", score: 45, weight: { "cloud-solutions-architect": 8, "cybersecurity-analyst": 8 } }
    ]
  },
  {
    id: "q8",
    category: "Skills",
    questionText: "What is your comfort level with Git, branching strategies, and pull requests?",
    options: [
      { text: "Confident: I use feature branching, interactive rebases, resolve merge conflicts, and review PRs", score: 90, weight: { "software-developer": 9, "product-engineer": 8, "cloud-solutions-architect": 8 } },
      { text: "Moderate: I know git clone, commit, push, pull, and basic PR creation", score: 70, weight: { "software-developer": 6, "data-analyst": 6 } },
      { text: "Basic: I upload files or use GitHub Desktop for simple commits", score: 45, weight: { "data-analyst": 4 } },
      { text: "Need learning: I have rarely worked with version control", score: 20, weight: {} }
    ]
  },
  {
    id: "q9",
    category: "Work Style",
    questionText: "When given a broad goal with little guidance, how do you proceed?",
    options: [
      { text: "Deconstruct into modular sub-tasks, write specifications, and build iteratively", score: 90, weight: { "software-developer": 9, "product-engineer": 9 } },
      { text: "Collect relevant data samples, explore baseline numbers, and validate hypotheses", score: 90, weight: { "data-analyst": 9, "ai-ml-engineer": 8 } },
      { text: "Review system blueprints, assess dependencies and security trade-offs, then scaffold", score: 90, weight: { "cloud-solutions-architect": 9, "cybersecurity-analyst": 9 } },
      { text: "Rapidly sketch interactive mockups and test with users to get quick feedback", score: 90, weight: { "product-engineer": 10 } }
    ]
  },
  {
    id: "q10",
    category: "Problem Solving",
    questionText: "Suppose an API response time spikes from 100ms to 4,000ms. Where do you look first?",
    options: [
      { text: "Database query execution plans, unindexed columns, and N+1 query loops", score: 90, weight: { "software-developer": 10, "data-analyst": 7 } },
      { text: "Server CPU/memory saturation, connection pool exhaustion, and network bottlenecks", score: 90, weight: { "cloud-solutions-architect": 10, "cybersecurity-analyst": 7 } },
      { text: "Model inference latency, batch sizing, or unoptimized token generation", score: 90, weight: { "ai-ml-engineer": 10 } },
      { text: "Client-side bundle parsing, redundant re-renders, and synchronous blocking scripts", score: 90, weight: { "product-engineer": 10 } }
    ]
  },
  {
    id: "q11",
    category: "Skills",
    questionText: "How familiar are you with Docker containers and CI/CD pipelines?",
    options: [
      { text: "Advanced: I write multi-stage Dockerfiles, compose setups, and GitHub Action workflows", score: 90, weight: { "cloud-solutions-architect": 10, "software-developer": 8 } },
      { text: "Intermediate: I run containerized services and know how CI/CD builds pass", score: 70, weight: { "software-developer": 7, "ai-ml-engineer": 6 } },
      { text: "Beginner: I understand what a container is conceptually", score: 45, weight: { "data-analyst": 4 } },
      { text: "None: I have not worked with Docker or CI/CD yet", score: 20, weight: {} }
    ]
  },
  {
    id: "q12",
    category: "Career Preferences",
    questionText: "In your ideal 3-year horizon, which milestone matters the most to you?",
    options: [
      { text: "Shipping scalable software products and mastering complex backend systems", score: 90, weight: { "software-developer": 10 } },
      { text: "Delivering data-driven insights that directly influence executive company decisions", score: 90, weight: { "data-analyst": 10 } },
      { text: "Deploying proprietary AI models and machine learning pipelines into production", score: 90, weight: { "ai-ml-engineer": 10 } },
      { text: "Architecting cloud infrastructure that effortlessly sustains enterprise scale", score: 90, weight: { "cloud-solutions-architect": 10 } },
      { text: "Building design-led, delightful user experiences recognized across the industry", score: 90, weight: { "product-engineer": 10 } }
    ]
  },
  {
    id: "q13",
    category: "Interests",
    questionText: "How do you feel about designing user interfaces and optimizing visual aesthetics?",
    options: [
      { text: "Love it: I obsess over typography, spacing, micro-interactions, and accessibility", score: 95, weight: { "product-engineer": 10 } },
      { text: "Enjoy it for charts and data presentation: Clean dashboards and graphs excite me", score: 85, weight: { "data-analyst": 9, "product-engineer": 6 } },
      { text: "Functional interest: I want UI to be clean and simple, but care more about backend logic", score: 70, weight: { "software-developer": 8 } },
      { text: "Prefer headless/backend: I prefer working in the terminal, APIs, databases, or cloud", score: 80, weight: { "cloud-solutions-architect": 9, "cybersecurity-analyst": 9, "software-developer": 7 } }
    ]
  },
  {
    id: "q14",
    category: "Problem Solving",
    questionText: "How do you evaluate whether a project is truly 'done' and ready for release?",
    options: [
      { text: "Code is cleanly reviewed, tests pass with high coverage, and endpoints handle errors gracefully", score: 90, weight: { "software-developer": 9, "product-engineer": 8 } },
      { text: "Metrics are validated against ground truth data, and statistical assumptions are verified", score: 90, weight: { "data-analyst": 9, "ai-ml-engineer": 9 } },
      { text: "Security checks, penetration tests, and vulnerability scans show zero critical flaws", score: 90, weight: { "cybersecurity-analyst": 10, "cloud-solutions-architect": 8 } },
      { text: "Infrastructure is provisioned as code with automated failover and monitoring alerts active", score: 90, weight: { "cloud-solutions-architect": 10 } }
    ]
  },
  {
    id: "q15",
    category: "Career Preferences",
    questionText: "What is your preferred balance between theoretical research and hands-on building?",
    options: [
      { text: "100% Practical Building: I learn best by shipping real code, projects, and products", score: 90, weight: { "software-developer": 9, "product-engineer": 9 } },
      { text: "70% Building / 30% Theory: I like implementing cutting-edge algorithms and architectures", score: 90, weight: { "ai-ml-engineer": 9, "cloud-solutions-architect": 8 } },
      { text: "Analytical & Empirical: I like investigating data patterns and proving conclusions with numbers", score: 90, weight: { "data-analyst": 10 } },
      { text: "Systems & Governance: I like formulating standards, security guidelines, and infrastructure policies", score: 85, weight: { "cybersecurity-analyst": 9, "cloud-solutions-architect": 8 } }
    ]
  }
];
