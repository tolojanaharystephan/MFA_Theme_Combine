import bcrypt from "bcrypt";
import { and, eq, isNull } from "drizzle-orm";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { env } from "../../config/env.js";
import { db } from "../../database/db.js";
import { auditLogs, permissions, refreshTokens, rolePermissions, roles, users } from "../../database/schema.js";
import { AppError } from "../../common/errors/app-error.js";

export class AuthService {
  async login(email: string, password: string) {
    const row = (
      await db
        .select({ user: users, role: roles })
        .from(users)
        .innerJoin(roles, eq(users.roleId, roles.id))
        .where(eq(users.email, email))
        .limit(1)
    )[0];

    if (!row || row.user.status !== "ACTIVE") {
      throw new AppError(401, "Invalid credentials");
    }

    const passwordMatches = await bcrypt.compare(password, row.user.passwordHash);
    if (!passwordMatches) {
      throw new AppError(401, "Invalid credentials");
    }

    const rolePermissionRows = await db
      .select({ key: permissions.key })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(rolePermissions.roleId, row.role.id));
    const grantedPermissions = rolePermissionRows.map((permission) => permission.key);

    const payload = {
      id: row.user.id,
      email: row.user.email,
      role: row.role.name,
      permissions: grantedPermissions
    };

    const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"]
    });
    const refreshToken = jwt.sign({ id: row.user.id }, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"]
    });

    await db.insert(refreshTokens).values({
      userId: row.user.id,
      tokenHash: await bcrypt.hash(refreshToken, 10),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    await db.insert(auditLogs).values({
      userId: row.user.id,
      action: "LOGIN_SUCCESS",
      entity: "User",
      entityId: row.user.id
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: row.user.id,
        email: row.user.email,
        fullName: row.user.fullName,
        role: row.role.name,
        permissions: grantedPermissions
      }
    };
  }

  async refresh(token: string) {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as { id: string };
    const storedTokens = await db
      .select()
      .from(refreshTokens)
      .where(and(eq(refreshTokens.userId, decoded.id), isNull(refreshTokens.revokedAt)))
      .limit(20);

    const valid = await Promise.all(storedTokens.map((stored) => bcrypt.compare(token, stored.tokenHash)));
    if (!valid.some(Boolean)) {
      throw new AppError(401, "Invalid refresh token");
    }

    const row = (
      await db
        .select({ user: users, role: roles })
        .from(users)
        .innerJoin(roles, eq(users.roleId, roles.id))
        .where(eq(users.id, decoded.id))
        .limit(1)
    )[0];

    if (!row) {
      throw new AppError(401, "Invalid refresh token");
    }

    const rolePermissionRows = await db
      .select({ key: permissions.key })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(rolePermissions.roleId, row.role.id));

    return {
      accessToken: jwt.sign(
        {
          id: row.user.id,
          email: row.user.email,
          role: row.role.name,
          permissions: rolePermissionRows.map((permission) => permission.key)
        },
        env.JWT_ACCESS_SECRET,
        { expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"] }
      )
    };
  }
}

export const authService = new AuthService();
