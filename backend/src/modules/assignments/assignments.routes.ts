import { Router } from "express";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { asyncHandler } from "../../common/http/async-handler.js";
import { authenticate, authorize } from "../../common/middlewares/authenticate.js";
import { validate } from "../../common/middlewares/validate.js";
import { assignments } from "../../database/schema.js";
import { db } from "../../database/db.js";

export const assignmentsRoutes = Router();

const assignmentSchema = z.object({
  body: z.object({
    personnelId: z.string().uuid(),
    unitId: z.string().uuid(),
    roleTitle: z.string().optional(),
    startDate: z.string(),
    endDate: z.string().optional(),
    reason: z.string().optional()
  })
});

const updateAssignmentSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: assignmentSchema.shape.body.partial()
});

assignmentsRoutes.use(authenticate);

assignmentsRoutes.get(
  "/",
  authorize("personnel:read"),
  asyncHandler(async (_req, res) => {
    res.json({ success: true, data: await db.select().from(assignments) });
  })
);

assignmentsRoutes.post(
  "/",
  authorize("personnel:update"),
  validate(assignmentSchema),
  asyncHandler(async (req, res) => {
    const [created] = await db.insert(assignments).values(req.body).$returningId();
    res.status(201).json({ success: true, data: { id: created.id } });
  })
);

assignmentsRoutes.patch(
  "/:id",
  authorize("personnel:update"),
  validate(updateAssignmentSchema),
  asyncHandler(async (req, res) => {
    const id = String(req.params.id);
    await db.update(assignments).set(req.body).where(eq(assignments.id, id));
    res.json({ success: true, data: { id } });
  })
);

