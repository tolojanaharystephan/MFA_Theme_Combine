import { Router } from "express";
import { authenticate } from "../../common/middlewares/authenticate.js";
import { validate } from "../../common/middlewares/validate.js";
import { login, me, refresh } from "./auth.controller.js";
import { loginSchema, refreshSchema } from "./auth.validation.js";

export const authRoutes = Router();

authRoutes.post("/login", validate(loginSchema), login);
authRoutes.post("/refresh", validate(refreshSchema), refresh);
authRoutes.get("/me", authenticate, me);
