import { Router } from "express";
import { authenticate, authorize } from "../../common/middlewares/authenticate.js";
import { analyticsService } from "./analytics.service.js";

export const analyticsRoutes = Router();

analyticsRoutes.get("/overview", authenticate, authorize("analytics:read"), async (_req, res, next) => {
  try {
    res.json({ success: true, data: await analyticsService.getOverview() });
  } catch (error) {
    next(error);
  }
});
