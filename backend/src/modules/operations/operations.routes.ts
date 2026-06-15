import { Router } from "express";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { asyncHandler } from "../../common/http/async-handler.js";
import { AppError } from "../../common/errors/app-error.js";
import { authenticate, authorize } from "../../common/middlewares/authenticate.js";
import { validate } from "../../common/middlewares/validate.js";
import { db } from "../../database/db.js";
import { missions, operations } from "../../database/schema.js";

export const operationsRoutes = Router();

const operationSchema = z.object({
  body: z.object({
    code: z.string().min(2).max(80),
    title: z.string().min(3).max(180),
    objective: z.string().min(5),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
    area: z.string().optional(),
    status: z.enum(["PLANNED", "IN_PROGRESS", "SUSPENDED", "COMPLETED", "CANCELLED"]).default("PLANNED"),
    startDate: z.string().optional(),
    endDate: z.string().optional()
  })
});

const updateOperationSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: operationSchema.shape.body.partial()
});

operationsRoutes.use(authenticate);

operationsRoutes.get(
  "/",
  authorize("operations:read"),
  asyncHandler(async (_req, res) => {
    res.json({ success: true, data: await db.select().from(operations) });
  })
);

operationsRoutes.get(
  "/:id",
  authorize("operations:read"),
  asyncHandler(async (req, res) => {
    const id = String(req.params.id);
    const operation = (await db.select().from(operations).where(eq(operations.id, id)).limit(1))[0];
    const operationMissions = await db.select().from(missions).where(eq(missions.operationId, id));
    res.json({ success: true, data: operation ? { ...operation, missions: operationMissions } : null });
  })
);

operationsRoutes.post(
  "/",
  authorize("operations:create"),
  validate(operationSchema),
  asyncHandler(async (req, res) => {
    if (!req.user) throw new AppError(401, "Authentication required");
    const [created] = await db.insert(operations).values({ ...req.body, createdById: req.user.id }).$returningId();
    res.status(201).json({ success: true, data: { id: created.id } });
  })
);

operationsRoutes.patch(
  "/:id",
  authorize("operations:update"),
  validate(updateOperationSchema),
  asyncHandler(async (req, res) => {
    const id = String(req.params.id);
    await db.update(operations).set(req.body).where(eq(operations.id, id));
    res.json({ success: true, data: { id } });
  })
);
