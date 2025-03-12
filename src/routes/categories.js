import { Router } from "express";
import { prisma } from "../utils/prismaClient.js";
import authMiddleware from "../utils/authMiddleware.js";

const { authenticateToken, authorizeAdmin } = authMiddleware;
const router = Router();

/**
 * GET /categories
 * Optionally supports pagination via query params: ?page=1&limit=10
 */
router.get("/", async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    // Prisma uses `skip` and `take` for pagination
    const skip = (page - 1) * limit;
    const take = limit;

    const [categories, totalCount] = await Promise.all([
      prisma.category.findMany({
        skip,
        take,
        // You can include products if you want (with includes, etc.)
        // include: { products: true },
      }),
      prisma.category.count(),
    ]);

    // For clarity, you might also return total pages or next/prev links
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

/**
 * GET /categories/:id
 * Returns a single category by ID
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
      // You could include related products if needed
      // include: { products: true },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ error: "Error fetching category" });
  }
});

/**
 * POST /categories
 * Create a new category
 * Only admins can create categories
 */
router.post("/", authenticateToken, authorizeAdmin, async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const newCategory = await prisma.category.create({
      data: {
        name,
        description,
      },
    });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: "Error creating category", details: error.message });
  }
});

/**
 * PUT /categories/:id
 * Update a category
 * Only admins can update categories
 */
router.put("/:id", authenticateToken, authorizeAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const updatedCategory = await prisma.category.update({
      where: { id: Number(id) },
      data: { name, description },
    });
    res.json(updatedCategory);
  } catch (error) {
    // If category not found, Prisma will throw. We can catch that:
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(500).json({ error: "Error updating category" });
  }
});

/**
 * DELETE /categories/:id
 * Delete a category
 * Only admins can delete categories
 */
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
