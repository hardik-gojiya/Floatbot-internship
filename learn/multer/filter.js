import express from "express";
import multer from "multer";
import fs from "fs";

const app = express();
app.use(express.json());

const PORT = 3000;

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "text/plain",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

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

const limits = {
  fileSize: 2 * 1024 * 1024, // 2 MB
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits,
});

const fieldsUpload = upload.fields([
  { name: "files", maxCount: 5 },
  { name: "doc", maxCount: 2 },
]);

app.post("/upload", (req, res) => {
  fieldsUpload(req, res, (err) => {
    if (err) {
      console.error(err);
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    if (!req.files) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    res.json({
      success: true,
      message: "Files uploaded successfully",
      files: req.files,
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
