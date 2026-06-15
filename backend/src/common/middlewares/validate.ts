import type { RequestHandler } from "express";
import type { ZodSchema } from "zod";

export const validate =
  (schema: ZodSchema): RequestHandler =>
  (req, _res, next) => {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    }) as { body?: unknown; query?: unknown; params?: unknown };

    req.body = parsed.body ?? req.body;
    req.query = (parsed.query ?? req.query) as typeof req.query;
    req.params = (parsed.params ?? req.params) as typeof req.params;
    next();
  };
