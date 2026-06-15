import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { pinoHttp } from "pino-http";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { errorHandler } from "./common/middlewares/error-handler.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { analyticsRoutes } from "./modules/analytics/analytics.routes.js";
import { aiRoutes } from "./modules/ai/ai.routes.js";
import { auditRoutes } from "./modules/audit/audit.routes.js";
import { missionsRoutes } from "./modules/missions/missions.routes.js";
import { operationsRoutes } from "./modules/operations/operations.routes.js";
import { personnelRoutes } from "./modules/personnel/personnel.routes.js";
import { referencesRoutes } from "./modules/references/references.routes.js";
import { rolesRoutes } from "./modules/roles/roles.routes.js";
import { unitsRoutes } from "./modules/units/units.routes.js";
import { usersRoutes } from "./modules/users/users.routes.js";
import { assignmentsRoutes } from "./modules/assignments/assignments.routes.js";
import { filesRoutes } from "./modules/files/files.routes.js";
import { reportsRoutes } from "./modules/reports/reports.routes.js";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(pinoHttp({ logger }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get("/api/v1/health", (_req, res) => {
  res.json({ success: true, data: { service: "mfa-backend", status: "ok" } });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/roles", rolesRoutes);
app.use("/api/v1", referencesRoutes);
app.use("/api/v1/units", unitsRoutes);
app.use("/api/v1/personnel", personnelRoutes);
app.use("/api/v1/assignments", assignmentsRoutes);
app.use("/api/v1/operations", operationsRoutes);
app.use("/api/v1/missions", missionsRoutes);
app.use("/api/v1/reports", reportsRoutes);
app.use("/api/v1/files", filesRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/audit-logs", auditRoutes);
app.use(errorHandler);
