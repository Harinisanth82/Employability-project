import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

import authRoutes from "./server/routes/authRoutes.js";
import profileRoutes from "./server/routes/profileRoutes.js";
import assessmentRoutes from "./server/routes/assessmentRoutes.js";
import careerRoutes from "./server/routes/careerRoutes.js";
import roadmapRoutes from "./server/routes/roadmapRoutes.js";
import evidenceRoutes from "./server/routes/evidenceRoutes.js";
import interviewRoutes from "./server/routes/interviewRoutes.js";
import insightsRoutes from "./server/routes/insightsRoutes.js";
import progressRoutes from "./server/routes/progressRoutes.js";
import { errorHandler } from "./server/middleware/errorHandler.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Global Middlewares
  app.use(express.json({ limit: "5mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Performance request timing middleware (dev / debug)
  app.use((req, res, next) => {
    if (req.path.startsWith("/api/")) {
      const start = Date.now();
      res.on("finish", () => {
        const duration = Date.now() - start;
        console.log(`[API ${req.method}] ${req.path} -> ${res.statusCode} (${duration}ms)`);
      });
    }
    next();
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "AI-Based Career Guidance Framework API",
      aiServiceAvailable: !!process.env.GEMINI_API_KEY,
    });
  });

  // REST API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/profile", profileRoutes);
  app.use("/api/assessment", assessmentRoutes);
  app.use("/api/careers", careerRoutes);
  app.use("/api/roadmap", roadmapRoutes);
  app.use("/api/evidence", evidenceRoutes);
  app.use("/api/interviews", interviewRoutes);
  app.use("/api/insights", insightsRoutes);
  app.use("/api/progress", progressRoutes);

  // Centralized Error Handling
  app.use(errorHandler);

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Career Guidance Framework Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Fatal server boot failure:", err);
});
