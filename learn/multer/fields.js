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

app.post("/upload", (req, res) => {
  upload.fields([
    { name: "files", maxCount: 5 },
    { name: "doc", maxCount: 2 },
  ]),
    (req, res) => {
      if (!req.files) {
        return res.status(400).send("No files uploaded.");
      }
      // console.log("Uploaded file info:", req.files);
      res.send(`Files uploaded successfully.`);
    };
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
