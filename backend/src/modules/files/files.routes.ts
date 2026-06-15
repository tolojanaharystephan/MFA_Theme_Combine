import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import { Router } from "express";
import { asyncHandler } from "../../common/http/async-handler.js";
import { authenticate, authorize } from "../../common/middlewares/authenticate.js";

const uploadDir = path.resolve(process.cwd(), "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9_.-]+/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["application/pdf", "image/png", "image/jpeg", "text/plain"];
    cb(null, allowed.includes(file.mimetype));
  }
});

export const filesRoutes = Router();

filesRoutes.use(authenticate);

filesRoutes.post(
  "/upload",
  authorize("reports:generate"),
  upload.single("file"),
  asyncHandler(async (req, res) => {
    res.status(201).json({
      success: true,
      data: req.file
        ? {
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size,
            path: `/uploads/${req.file.filename}`
          }
        : null
    });
  })
);

