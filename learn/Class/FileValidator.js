import express from "express";
import multer from "multer";
import fs from "fs";

const app = express();
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/";

    fs.mkdirSync(dir, { recursive: true });
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

const PORT = 3000;

class FileValidator {
  static allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
  static maxSize = 2 * 1024 * 1024;

  static validate(file) {
    const errors = [];

    if (!this.allowedTypes.includes(file.mimetype)) {
      errors.push(
        `Invalid file type:${file.type} allowed: ${this.allowedTypes.join(
          ", "
        )} `
      );
    }

    if (file.size > this.maxSize) {
      errors.push(`File is too large, only 2 MB files are allowed.`);
    }

    return {
      success: errors.length === 0,
      errors: errors,
    };
  }
}

app.post("/upload", upload.array("files", 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded." });
  }

  const allErrors = [];

  for (let file of req.files) {
    const validation = FileValidator.validate(file);
    if (!validation.success) {
      allErrors.push(...validation.errors);
    }
  }

  if (allErrors.length > 0) {
    for (let file of req.files) {
      try {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      } catch (err) {
        console.error(`Failed to delete ${file.path}:`, err);
      }
    }
    return res.status(400).json({
      success: false,
      message: "Validation failed. All uploaded files have been removed.",
      errors: allErrors,
    });
  }

  res.json({
    success: true,
    message: "All files passed validation and are saved.",
    count: req.files.length,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
