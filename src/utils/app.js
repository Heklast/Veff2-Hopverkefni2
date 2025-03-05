import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "../routes/auth.js"; 

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../../public")));

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public", "index.html"));
});

export default app;