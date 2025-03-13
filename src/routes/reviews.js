import { Router } from "express";
import { prisma } from "../utils/prismaClient.js";
import authMiddleware from "../utils/authMiddleware.js";
import { body, validationResult } from "express-validator";

const { authenticateToken } = authMiddleware;
const router = Router();

router.get("/", async (req, res) => {
  let { page = 1, limit = 10 } = req.query;
  page = parseInt(page, 10);
  limit = parseInt(limit, 10);
  const skip = (page - 1) * limit;
  const take = limit;
  try {
    const [reviews, totalCount] = await Promise.all([
      prisma.review.findMany({
        skip,
        take,
        include: { Product: true, User: true },
      }),
      prisma.review.count(),
    ]);
    res.json({
      data: reviews,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching reviews" });
  }
});

router.post(
  "/",
  authenticateToken,
  [
    body("productId")
      .exists().withMessage("Product ID is required")
      .isInt().withMessage("Product ID must be an integer"),
    body("rating")
      .exists().withMessage("Rating is required")
      .isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
    body("comment")
      .optional()
      .isString().withMessage("Comment must be a string")
      .trim()
      .escape()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;
    try {
      const newReview = await prisma.review.create({
        data: {
          productId: Number(productId),
          userId: Number(userId),
          rating: Number(rating),
          comment: comment || null,
        },
      });
      res.status(201).json(newReview);
    } catch (error) {
      res.status(500).json({ error: "Error creating review", details: error.message });
    }
  }
);

router.put(
  "/:id",
  authenticateToken,
  [
    body("rating")
      .optional()
      .isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
    body("comment")
      .optional()
      .isString().withMessage("Comment must be a string")
      .trim()
      .escape()
  ],
  async (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const existingReview = await prisma.review.findUnique({
        where: { id: Number(id) },
      });
      if (!existingReview) {
        return res.status(404).json({ error: "Review not found" });
      }
      if (userRole !== "admin" && existingReview.userId !== userId) {
        return res.status(401).json({ error: "Not authorized to update this review" });
      }
      const updatedReview = await prisma.review.update({
        where: { id: Number(id) },
        data: {
          rating: rating !== undefined ? Number(rating) : existingReview.rating,
          comment: comment !== undefined ? comment : existingReview.comment,
        },
      });
      res.json(updatedReview);
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Review not found" });
      }
      res.status(500).json({ error: "Error updating review", details: error.message });
    }
  }
);

router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;
  try {
    const existingReview = await prisma.review.findUnique({
      where: { id: Number(id) },
    });
    if (!existingReview) {
      return res.status(404).json({ error: "Review not found" });
    }
    if (userRole !== "admin" && existingReview.userId !== userId) {
      return res.status(401).json({ error: "Not authorized to delete this review" });
    }
    await prisma.review.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error deleting review" });
  }
});

export default router;