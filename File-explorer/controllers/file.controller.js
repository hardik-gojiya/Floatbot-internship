import fs from "fs/promises";
import path from "path";

const ROOT_DIR = path.join(process.cwd(), "storage");

const pathResolver = (rpath = "") => {
  const resolvedPath = path.join(ROOT_DIR, rpath);
  if (!resolvedPath.startsWith(ROOT_DIR)) {
    throw new Error("Invalid Path Access.");
  }
  return resolvedPath;
};

const getStats = async (fullPath, name) => {
  const stats = await fs.stat(fullPath);

  return {
    name,
    type: stats.isDirectory ? "Folder" : "File",
    size: stats.size,
    createdAt: stats.birthtime,
    modifiedAt: stats.mtime,
  };
};

export const listAllFiles = async (req, res) => {
  try {
    const userPath = req.query.path || "";
    const fullPath = pathResolver(userPath);

    const items = await fs.readdir(fullPath);
    const list = [];

    for (let item of items) {
      const itemPath = path.join(fullPath, item);
      list.push(await getStats(itemPath, item));
    }

    res.json({ success: true, data: list });
  } catch (error) {
    return res.json({ success: "false", message: error.message });
  }
};

export const createFolder = async (req, res) => {
  try {
    const { path: userPath, folderName } = req.body;
    const fullPath = pathResolver(path.join(userPath, folderName));

    await fs.mkdir(fullPath, { recursive: false });

    res.json({ success: true, message: "Folder created" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const renameItem = async (req, res) => {
  try {
    console.log(req.body);
    const { oldPath, newName } = req.body;

    const fullPath = pathResolver(oldPath);
    const newPath = path.join(path.dirname(fullPath), newName);
    console.log(fullPath, newPath);

    await fs.rename(fullPath, newPath);

    return res
      .status(200)
      .json({ success: true, message: "Rename SucessFully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const { path: userPath } = req.body;

    const fullPath = pathResolver(userPath);
    await fs.unlink(fullPath, { recursive: true, force: true });
    return res
      .status(200)
      .json({ success: true, message: "File deleted Sucessfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteFolder = async (req, res) => {
  try {
    const { path: userPath } = req.body;

    const fullPath = pathResolver(userPath);

    await fs.rm(fullPath, { recursive: true, force: true });
    return res
      .status(200)
      .json({ success: true, message: "Folder deleted Sucessfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
