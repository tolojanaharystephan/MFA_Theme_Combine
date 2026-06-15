import PDFDocument from "pdfkit";
import { Router } from "express";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { asyncHandler } from "../../common/http/async-handler.js";
import { AppError } from "../../common/errors/app-error.js";
import { authenticate, authorize } from "../../common/middlewares/authenticate.js";
import { validate } from "../../common/middlewares/validate.js";
import { db } from "../../database/db.js";
import { reports } from "../../database/schema.js";

export const reportsRoutes = Router();

const createReportSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    type: z.enum(["PERSONNEL", "UNIT", "OPERATION", "MISSION", "ANALYTICS"]),
    operationId: z.string().uuid().optional(),
    missionId: z.string().uuid().optional(),
    summary: z.string().optional()
  })
});

reportsRoutes.use(authenticate);

reportsRoutes.get(
  "/",
  authorize("reports:generate"),
  asyncHandler(async (_req, res) => {
    res.json({ success: true, data: await db.select().from(reports) });
  })
);

reportsRoutes.post(
  "/",
  authorize("reports:generate"),
  validate(createReportSchema),
  asyncHandler(async (req, res) => {
    if (!req.user) throw new AppError(401, "Authentication required");

    const [created] = await db
      .insert(reports)
      .values({
        ...req.body,
        generatedById: req.user.id
      })
      .$returningId();

    res.status(201).json({ success: true, data: { id: created.id } });
  })
);

reportsRoutes.get(
  "/:id/download",
  authorize("reports:generate"),
  asyncHandler(async (req, res) => {
    const id = String(req.params.id);
    const report = (await db.select().from(reports).where(eq(reports.id, id)).limit(1))[0];

    if (!report) throw new AppError(404, "Report not found");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=\"${report.title.replace(/[^a-z0-9-]+/gi, "_")}.pdf\"`);

    const doc = new PDFDocument({ margin: 48 });
    doc.pipe(res);
    doc.fontSize(18).text("MFA Decision Platform", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(report.title);
    doc.fontSize(10).fillColor("#475569").text(`Type: ${report.type}`);
    doc.text(`Genere le: ${new Date(report.createdAt).toLocaleString("fr-FR")}`);
    doc.moveDown();
    doc.fillColor("#111827").fontSize(11).text(report.summary ?? "Rapport genere automatiquement par la plateforme.");
    doc.end();
  })
);

