import { Router } from "express";
import { desc } from "drizzle-orm";
import { asyncHandler } from "../../common/http/async-handler.js";
import { authenticate, authorize } from "../../common/middlewares/authenticate.js";
import { db } from "../../database/db.js";
import { auditLogs } from "../../database/schema.js";

export const auditRoutes = Router();

auditRoutes.use(authenticate, authorize("audit:read"));

auditRoutes.get(
  "/",
  asyncHandler(async (_req, res) => {
    const rows = await db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(200);
    res.json({ success: true, data: rows });
  })
);

