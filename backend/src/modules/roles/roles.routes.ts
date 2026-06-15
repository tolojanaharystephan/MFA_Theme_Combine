import { Router } from "express";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { asyncHandler } from "../../common/http/async-handler.js";
import { authenticate, authorize } from "../../common/middlewares/authenticate.js";
import { validate } from "../../common/middlewares/validate.js";
import { db } from "../../database/db.js";
import { permissions, rolePermissions, roles } from "../../database/schema.js";

export const rolesRoutes = Router();

const createRoleSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(80),
    description: z.string().optional(),
    permissionIds: z.array(z.string().uuid()).default([])
  })
});

rolesRoutes.use(authenticate, authorize("roles:manage"));

rolesRoutes.get(
  "/",
  asyncHandler(async (_req, res) => {
    const rows = await db.select().from(roles);
    res.json({ success: true, data: rows });
  })
);

rolesRoutes.post(
  "/",
  validate(createRoleSchema),
  asyncHandler(async (req, res) => {
    const [role] = await db.insert(roles).values({ name: req.body.name, description: req.body.description }).$returningId();
    if (req.body.permissionIds.length > 0) {
      await db.insert(rolePermissions).values(
        req.body.permissionIds.map((permissionId: string) => ({ roleId: role.id, permissionId }))
      );
    }
    res.status(201).json({ success: true, data: { id: role.id } });
  })
);

rolesRoutes.get(
  "/permissions",
  asyncHandler(async (_req, res) => {
    const rows = await db.select().from(permissions);
    res.json({ success: true, data: rows });
  })
);

rolesRoutes.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = String(req.params.id);
    await db.delete(roles).where(eq(roles.id, id));
    res.json({ success: true, data: { id } });
  })
);
