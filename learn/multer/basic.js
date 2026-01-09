import express from "express";
import multer from "multer";

const app = express();

const upload = multer({ dest: "uploads/" });

const PORT = 3000;

app.use(express.json());

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  console.log("Uploaded file info:", req.file);
  res.send(`File ${req.file.originalname} uploaded successfully.`);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
