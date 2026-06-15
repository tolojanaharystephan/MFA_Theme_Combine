import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../../common/http/async-handler.js";
import { authenticate, authorize } from "../../common/middlewares/authenticate.js";
import { validate } from "../../common/middlewares/validate.js";
import { db } from "../../database/db.js";
import { grades, skills } from "../../database/schema.js";

export const referencesRoutes = Router();

const gradeSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    rankOrder: z.coerce.number().int().min(1),
    category: z.string().optional()
  })
});

const skillSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    category: z.string().optional(),
    description: z.string().optional()
  })
});

referencesRoutes.use(authenticate);

referencesRoutes.get(
  "/grades",
  authorize("personnel:read"),
  asyncHandler(async (_req, res) => {
    res.json({ success: true, data: await db.select().from(grades) });
  })
);

referencesRoutes.post(
  "/grades",
  authorize("personnel:create"),
  validate(gradeSchema),
  asyncHandler(async (req, res) => {
    const [created] = await db.insert(grades).values(req.body).$returningId();
    res.status(201).json({ success: true, data: { id: created.id } });
  })
);

referencesRoutes.get(
  "/skills",
  authorize("personnel:read"),
  asyncHandler(async (_req, res) => {
    res.json({ success: true, data: await db.select().from(skills) });
  })
);

referencesRoutes.post(
  "/skills",
  authorize("personnel:create"),
  validate(skillSchema),
  asyncHandler(async (req, res) => {
    const [created] = await db.insert(skills).values(req.body).$returningId();
    res.status(201).json({ success: true, data: { id: created.id } });
  })
);

