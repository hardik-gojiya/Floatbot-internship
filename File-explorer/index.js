import express from "express";
import fileRoutes from "./routes/file.route.js";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/api", fileRoutes);

app.listen(PORT || 8080, () => {
  console.log(`Server Is Running On  http://localhost:${PORT}`);
});
