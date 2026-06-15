import { Router } from "express";
import { and, eq, isNull, like } from "drizzle-orm";
import { z } from "zod";
import { asyncHandler } from "../../common/http/async-handler.js";
import { authenticate, authorize } from "../../common/middlewares/authenticate.js";
import { validate } from "../../common/middlewares/validate.js";
import { db } from "../../database/db.js";
import { grades, militaryPersonnel, units } from "../../database/schema.js";

export const personnelRoutes = Router();

const createPersonnelSchema = z.object({
  body: z.object({
    serviceNumber: z.string().min(2),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    gender: z.string().min(1),
    birthDate: z.string().optional(),
    gradeId: z.string().uuid(),
    unitId: z.string().uuid(),
    availabilityStatus: z
      .enum(["AVAILABLE", "ASSIGNED", "ON_LEAVE", "TRAINING", "UNAVAILABLE"])
      .default("AVAILABLE"),
    healthStatus: z.string().optional(),
    enlistmentDate: z.string().optional()
  })
});

const updatePersonnelSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: createPersonnelSchema.shape.body.partial()
});

personnelRoutes.use(authenticate);

personnelRoutes.get(
  "/",
  authorize("personnel:read"),
  asyncHandler(async (req, res) => {
    const q = typeof req.query.q === "string" ? req.query.q : undefined;
    const unitId = typeof req.query.unitId === "string" ? req.query.unitId : undefined;
    const filters = [isNull(militaryPersonnel.archivedAt)];
    if (q) filters.push(like(militaryPersonnel.lastName, `%${q}%`));
    if (unitId) filters.push(eq(militaryPersonnel.unitId, unitId));

    const rows = await db
      .select({
        id: militaryPersonnel.id,
        serviceNumber: militaryPersonnel.serviceNumber,
        firstName: militaryPersonnel.firstName,
        lastName: militaryPersonnel.lastName,
        availabilityStatus: militaryPersonnel.availabilityStatus,
        grade: grades.name,
        unit: units.name,
        createdAt: militaryPersonnel.createdAt
      })
      .from(militaryPersonnel)
      .innerJoin(grades, eq(militaryPersonnel.gradeId, grades.id))
      .innerJoin(units, eq(militaryPersonnel.unitId, units.id))
      .where(and(...filters));

    res.json({ success: true, data: rows });
  })
);

personnelRoutes.get(
  "/:id",
  authorize("personnel:read"),
  asyncHandler(async (req, res) => {
    const id = String(req.params.id);
    const row = (
      await db
        .select()
        .from(militaryPersonnel)
        .where(eq(militaryPersonnel.id, id))
        .limit(1)
    )[0];
    res.json({ success: true, data: row ?? null });
  })
);

personnelRoutes.post(
  "/",
  authorize("personnel:create"),
  validate(createPersonnelSchema),
  asyncHandler(async (req, res) => {
    const [created] = await db.insert(militaryPersonnel).values(req.body).$returningId();
    res.status(201).json({ success: true, data: { id: created.id } });
  })
);

personnelRoutes.patch(
  "/:id",
  authorize("personnel:update"),
  validate(updatePersonnelSchema),
  asyncHandler(async (req, res) => {
    const id = String(req.params.id);
    await db.update(militaryPersonnel).set(req.body).where(eq(militaryPersonnel.id, id));
    res.json({ success: true, data: { id } });
  })
);

personnelRoutes.delete(
  "/:id",
  authorize("personnel:archive"),
  asyncHandler(async (req, res) => {
    const id = String(req.params.id);
    await db.update(militaryPersonnel).set({ archivedAt: new Date() }).where(eq(militaryPersonnel.id, id));
    res.json({ success: true, data: { id, archived: true } });
  })
);
