import multer from "multer";
import express from "express";

const app = express();

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/png", "image/jpg"];

  if (!allowedTypes.includes(file.mimetype)) {
    cb(new Error("Invalid file Type."), false);
    return;
  }
  cb(null, true);
};

const limits = {
  fileSize: 5 * 1024 * 1024,
};

const upload = multer({ storage, fileFilter, limits });

app.post("/upload", (req, res) => {
  upload.single("file")(req, res, (err) => {
    console.log(req.file);
    if (err) {
      res.json({
        Error: err.message,
      });
      return;
    }

    if (!req.file) {
      res.json({
        Error: "No File Upload",
      });
      return;
    }

    res.json({
      message: "File uploaded to memory",
      size: req.file.size,
      type: req.file.mimetype,
    });
  });
});

app.listen(3000, () => {
  console.log("server Started.");
});
