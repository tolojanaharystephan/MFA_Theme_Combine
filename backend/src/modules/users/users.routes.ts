import bcrypt from "bcrypt";
import { Router } from "express";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { asyncHandler } from "../../common/http/async-handler.js";
import { authenticate, authorize } from "../../common/middlewares/authenticate.js";
import { validate } from "../../common/middlewares/validate.js";
import { db } from "../../database/db.js";
import { roles, users } from "../../database/schema.js";

export const usersRoutes = Router();

const createUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    fullName: z.string().min(2),
    password: z.string().min(8),
    roleId: z.string().uuid(),
    status: z.enum(["ACTIVE", "DISABLED", "LOCKED"]).default("ACTIVE")
  })
});

const updateUserSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    fullName: z.string().min(2).optional(),
    roleId: z.string().uuid().optional(),
    status: z.enum(["ACTIVE", "DISABLED", "LOCKED"]).optional()
  })
});

usersRoutes.use(authenticate);

usersRoutes.get(
  "/",
  authorize("users:read"),
  asyncHandler(async (_req, res) => {
    const rows = await db
      .select({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        status: users.status,
        role: roles.name,
        createdAt: users.createdAt
      })
      .from(users)
      .innerJoin(roles, eq(users.roleId, roles.id));

    res.json({ success: true, data: rows });
  })
);

usersRoutes.post(
  "/",
  authorize("users:create"),
  validate(createUserSchema),
  asyncHandler(async (req, res) => {
    const [created] = await db.insert(users).values({
      email: req.body.email,
      fullName: req.body.fullName,
      passwordHash: await bcrypt.hash(req.body.password, 12),
      roleId: req.body.roleId,
      status: req.body.status
    }).$returningId();

    res.status(201).json({ success: true, data: { id: created.id } });
  })
);

usersRoutes.patch(
  "/:id",
  authorize("users:update"),
  validate(updateUserSchema),
  asyncHandler(async (req, res) => {
    const id = String(req.params.id);
    await db.update(users).set(req.body).where(eq(users.id, id));
    res.json({ success: true, data: { id } });
  })
);
