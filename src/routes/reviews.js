import { Router } from "express";
import { prisma } from "../utils/prismaClient.js";
import authMiddleware from "../utils/authMiddleware.js";

const { authenticateToken, authorizeAdmin } = authMiddleware;
const router = Router();

/**
 * GET /reviews
 * Returns all reviews (with pagination).
 * Possibly you want GET /products/:productId/reviews instead, up to you.
 */
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
        include: { product: true, user: true },
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
    res.status(500).json({ error: "Error fetching reviews" });
  }
});

/**
 * POST /reviews
 * Creates a review by the logged-in user
 */
router.post("/", authenticateToken, async (req, res) => {
  const { productId, rating, comment } = req.body;
  const userId = req.user.id; // Provided by authenticateToken middleware

  if (!productId || !rating) {
    return res.status(400).json({ error: "Missing productId or rating" });
  }

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
});

/**
 * PUT /reviews/:id
 * Let the user or an admin update a review
 * (You can refine to only let the review's owner or admin do it.)
 */
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    // First, find the existing review
    const existingReview = await prisma.review.findUnique({
      where: { id: Number(id) },
    });
    if (!existingReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    // If not admin, ensure user owns this review
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
    res.status(500).json({ error: "Error updating review" });
  }
});

/**
 * DELETE /reviews/:id
 * Let the user or admin delete a review
 */
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
    res.status(500).json({ error: "Error deleting review" });
  }
});

export default router;
