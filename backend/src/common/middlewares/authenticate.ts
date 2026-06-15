import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { AppError } from "../errors/app-error.js";

export type AuthUser = {
  id: string;
  email: string;
  role: string;
  permissions: string[];
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const authenticate: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    throw new AppError(401, "Authentication required");
  }

  try {
    req.user = jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthUser;
    next();
  } catch {
    throw new AppError(401, "Invalid or expired token");
  }
};

export const authorize =
  (...permissions: string[]): RequestHandler =>
  (req, _res, next) => {
    const granted = req.user?.permissions ?? [];
    const allowed = permissions.every((permission) => granted.includes(permission));

    if (!allowed) {
      throw new AppError(403, "Insufficient permissions");
    }

    next();
  };

