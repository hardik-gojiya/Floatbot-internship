import express from "express";
import {
  createFolder,
  deleteFile,
  deleteFolder,
  listAllFiles,
  renameItem,
} from "../controllers/file.controller.js";

const router = express.Router();

router.get("/", listAllFiles);
router.post("/create-folder", createFolder);
router.post("/rename", renameItem);
router.post("/deletefile", deleteFile);
router.post("/delete-folder", deleteFolder);

export default router;
