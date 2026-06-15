import type { RequestHandler } from "express";
import { authService } from "./auth.service.js";

export const login: RequestHandler = async (req, res, next) => {
  try {
    const result = await authService.login(req.body.email, req.body.password);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const me: RequestHandler = (req, res) => {
  res.json({ success: true, data: req.user });
};

export const refresh: RequestHandler = async (req, res, next) => {
  try {
    const result = await authService.refresh(req.body.refreshToken);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
