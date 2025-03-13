import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "../routes/auth.js";
import adminRoutes from "../routes/admin.js";
import categoryRoutes from "../routes/categories.js";
import productRoutes from "../routes/products.js";
import orderRoutes from "../routes/orders.js";
import reviewRoutes from "../routes/reviews.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../../public")));

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/reviews", reviewRoutes);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public", "index.html"));
});

export default app;