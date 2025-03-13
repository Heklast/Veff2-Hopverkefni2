import { Router } from "express";
import { prisma } from "../utils/prismaClient.js";
import {v2 as cloudinary} from "cloudinary";
import authMiddleware from "../utils/authMiddleware.js";
import multer from "multer";

const { authenticateToken, authorizeAdmin } = authMiddleware;
const router = Router();

const upload = multer({ dest: "uploads/" });

// GET /products (with optional pagination)
router.get("/", async (req, res) => {
  let { page = 1, limit = 10 } = req.query;
  page = parseInt(page, 10);
  limit = parseInt(limit, 10);

  const skip = (page - 1) * limit;
  const take = limit;

  try {
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        skip,
        take,
       // include: { category: true },
      }),
      prisma.product.count(),
    ]);

    res.json({
      data: products,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching products" });
  }
});

// GET /products/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: { category: true },
    });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching product" });
  }
});

// POST /products (admin only)
router.post("/", authenticateToken, authorizeAdmin, async (req, res) => {
  const { name, description, price, stock, categoryId } = req.body;
  if (!name || !price || !stock || !categoryId) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        categoryId: Number(categoryId),
      },
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Error creating product", details: error.message });
  }
});

// PUT /products/:id (admin only)
router.put("/:id", authenticateToken, authorizeAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, categoryId } = req.body;

  try {
    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        price: price !== undefined ? Number(price) : undefined,
        stock: stock !== undefined ? Number(stock) : undefined,
        categoryId: categoryId !== undefined ? Number(categoryId) : undefined,
      },
    });
    res.json(updatedProduct);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(500).json({ error: "Error updating product" });
  }
});

// DELETE /products/:id (admin only)
router.delete("/:id", authenticateToken, authorizeAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.product.delete({ where: { id: Number(id) } });
    res.json({ message: "Product deleted" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(500).json({ error: "Error deleting product" });
  }
});

router.post("/:id/image", authenticateToken, authorizeAdmin, upload.single("image"), async (req, res) => {
  const { id } = req.params;

  try {
    // Upload the file from Multer to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "products", // Optional: specify a folder in your Cloudinary account
      use_filename: true,
      unique_filename: false,
    });

    // Update the product's image field with the Cloudinary URL
    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: { image: result.secure_url },
    });

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: "Error uploading image", details: error.message });
  }
});

export default router;
