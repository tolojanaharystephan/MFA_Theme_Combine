import { Router } from "express";
import { authenticate, authorize } from "../../common/middlewares/authenticate.js";
import { aiClient } from "../../integrations/ai-client.js";

export const aiRoutes = Router();

aiRoutes.post("/recommendations", authenticate, authorize("ai:read"), async (req, res, next) => {
  try {
    const response = await aiClient.post("/recommendations/assignments", req.body);
    res.json({ success: true, data: response.data });
  } catch (error) {
    next(error);
  }
});

aiRoutes.post("/anomalies", authenticate, authorize("ai:read"), async (req, res, next) => {
  try {
    const response = await aiClient.post("/anomalies", req.body);
    res.json({ success: true, data: response.data });
  } catch (error) {
    next(error);
  }
});

