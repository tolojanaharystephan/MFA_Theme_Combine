import { Router } from "express";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { asyncHandler } from "../../common/http/async-handler.js";
import { authenticate, authorize } from "../../common/middlewares/authenticate.js";
import { validate } from "../../common/middlewares/validate.js";
import { db } from "../../database/db.js";
import { missionPersonnel, missionUnits, missions } from "../../database/schema.js";

export const missionsRoutes = Router();

const missionSchema = z.object({
  body: z.object({
    operationId: z.string().uuid(),
    title: z.string().min(3).max(180),
    description: z.string().optional(),
    requiredSkills: z.array(z.string()).default([]),
    riskLevel: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
    status: z.enum(["PLANNED", "IN_PROGRESS", "SUSPENDED", "COMPLETED", "CANCELLED"]).default("PLANNED"),
    startDate: z.string().optional(),
    endDate: z.string().optional()
  })
});

const assignPersonnelSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    personnelId: z.string().uuid(),
    assignmentRole: z.string().optional()
  })
});

const assignUnitSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    unitId: z.string().uuid()
  })
});

missionsRoutes.use(authenticate);

missionsRoutes.get(
  "/",
  authorize("operations:read"),
  asyncHandler(async (_req, res) => {
    res.json({ success: true, data: await db.select().from(missions) });
  })
);

missionsRoutes.post(
  "/",
  authorize("operations:create"),
  validate(missionSchema),
  asyncHandler(async (req, res) => {
    const [created] = await db.insert(missions).values(req.body).$returningId();
    res.status(201).json({ success: true, data: { id: created.id } });
  })
);

missionsRoutes.post(
  "/:id/personnel",
  authorize("missions:assign"),
  validate(assignPersonnelSchema),
  asyncHandler(async (req, res) => {
    const id = String(req.params.id);
    await db
      .insert(missionPersonnel)
      .values({ missionId: id, personnelId: req.body.personnelId, assignmentRole: req.body.assignmentRole })
      .onDuplicateKeyUpdate({ set: { assignmentRole: req.body.assignmentRole } });
    res.json({ success: true, data: { missionId: id, personnelId: req.body.personnelId } });
  })
);

missionsRoutes.post(
  "/:id/units",
  authorize("missions:assign"),
  validate(assignUnitSchema),
  asyncHandler(async (req, res) => {
    const id = String(req.params.id);
    await db
      .insert(missionUnits)
      .values({ missionId: id, unitId: req.body.unitId })
      .onDuplicateKeyUpdate({ set: { unitId: req.body.unitId } });
    res.json({ success: true, data: { missionId: id, unitId: req.body.unitId } });
  })
);

missionsRoutes.patch(
  "/:id/status",
  authorize("operations:update"),
  validate(
    z.object({
      params: z.object({ id: z.string().uuid() }),
      body: z.object({ status: z.enum(["PLANNED", "IN_PROGRESS", "SUSPENDED", "COMPLETED", "CANCELLED"]) })
    })
  ),
  asyncHandler(async (req, res) => {
    const id = String(req.params.id);
    await db.update(missions).set({ status: req.body.status }).where(eq(missions.id, id));
    res.json({ success: true, data: { id, status: req.body.status } });
  })
);
