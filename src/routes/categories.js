import { Router } from "express";
import { prisma } from "../utils/prismaClient.js";
import authMiddleware from "../utils/authMiddleware.js";
import { body, validationResult } from "express-validator";

const { authenticateToken, authorizeAdmin } = authMiddleware;
const router = Router();

router.get("/", async (req, res) => {
  let { page = 1, limit = 10 } = req.query;
  page = parseInt(page, 10);
  limit = parseInt(limit, 10);
  const skip = (page - 1) * limit;
  const take = limit;
  try {
    const [categories, totalCount] = await Promise.all([
      prisma.category.findMany({ skip, take }),
      prisma.category.count(),
    ]);
    res.json({
      data: categories,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Error fetching categories" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
    });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching category" });
  }
});

router.post(
  "/",
  authenticateToken,
  authorizeAdmin,
  [
    body("name").exists().withMessage("Name is required").trim().escape(),
    body("description").optional().trim().escape(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, description } = req.body;
    try {
      const newCategory = await prisma.category.create({
        data: { name, description },
      });
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(500).json({ error: "Error creating category", details: error.message });
    }
  }
);

router.put(
  "/:id",
  authenticateToken,
  authorizeAdmin,
  [
    body("name").optional().trim().escape(),
    body("description").optional().trim().escape(),
  ],
  async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const updatedCategory = await prisma.category.update({
        where: { id: Number(id) },
        data: { name, description },
      });
      res.json(updatedCategory);
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Category not found" });
      }
      res.status(500).json({ error: "Error updating category" });
    }
  }
);

router.delete("/:id", authenticateToken, authorizeAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.category.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(500).json({ error: "Error deleting category" });
  }
});

export default router;