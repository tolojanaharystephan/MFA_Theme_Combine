import { Router } from "express";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { asyncHandler } from "../../common/http/async-handler.js";
import { authenticate, authorize } from "../../common/middlewares/authenticate.js";
import { validate } from "../../common/middlewares/validate.js";
import { db } from "../../database/db.js";
import { militaryPersonnel, units } from "../../database/schema.js";

export const unitsRoutes = Router();

const unitSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    code: z.string().min(2).max(50),
    type: z.string().min(2),
    location: z.string().optional(),
    parentUnitId: z.string().uuid().optional(),
    status: z.string().default("ACTIVE")
  })
});
const updateUnitSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: unitSchema.shape.body.partial()
});

unitsRoutes.use(authenticate);

unitsRoutes.get(
  "/",
  authorize("units:read"),
  asyncHandler(async (_req, res) => {
    res.json({ success: true, data: await db.select().from(units) });
  })
);

unitsRoutes.post(
  "/",
  authorize("units:manage"),
  validate(unitSchema),
  asyncHandler(async (req, res) => {
    const [created] = await db.insert(units).values(req.body).$returningId();
    res.status(201).json({ success: true, data: { id: created.id } });
  })
);

unitsRoutes.get(
  "/:id/personnel",
  authorize("units:read"),
  asyncHandler(async (req, res) => {
    const id = String(req.params.id);
    const rows = await db.select().from(militaryPersonnel).where(eq(militaryPersonnel.unitId, id));
    res.json({ success: true, data: rows });
  })
);

unitsRoutes.patch(
  "/:id",
  authorize("units:manage"),
  validate(updateUnitSchema),
  asyncHandler(async (req, res) => {
    const id = String(req.params.id);
    await db.update(units).set(req.body).where(eq(units.id, id));
    res.json({ success: true, data: { id } });
  })
);
