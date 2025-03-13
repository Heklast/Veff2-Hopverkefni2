import { Router } from "express";
import { prisma } from "../utils/prismaClient.js";
import authMiddleware from "../utils/authMiddleware.js";

const { authenticateToken, authorizeAdmin } = authMiddleware;
const router = Router();

/**
 * GET /orders
 * If admin => see all orders, else => only see the orders of the logged in user.
 */
router.get("/", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;

  let { page = 1, limit = 10 } = req.query;
  page = parseInt(page, 10);
  limit = parseInt(limit, 10);

  const skip = (page - 1) * limit;
  const take = limit;

  try {
    let whereClause = {};
    if (userRole !== "admin") {
      whereClause = { userId: userId };
    }

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where: whereClause,
        skip,
        take,
        include: {
          orderItems: {
            include: { product: true },
          },
          user: true,
        },
      }),
      prisma.order.count({ where: whereClause }),
    ]);

    res.json({
      data: orders,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching orders" });
  }
});

/**
 * GET /orders/:id
 * If admin => can see any order, else => must be your own order
 */
router.get("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
      include: {
        orderItems: {
          include: { product: true },
        },
        user: true,
      },
    });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (userRole !== "admin" && order.userId !== userId) {
      return res.status(401).json({ error: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Error fetching order" });
  }
});

/**
 * POST /orders
 * Create an order for the logged in user
 * Body typically includes the items: [ { productId, quantity }, ... ]
 */
router.post("/", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { items } = req.body;

  // We expect items to be an array of { productId, quantity }
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "No items provided" });
  }

  try {
    // 1. Fetch all product info to compute total and validate
    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    // 2. Build order items data, check stock, compute total
    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return res.status(400).json({ error: `Product ${item.productId} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: `Not enough stock for product ${product.name}`,
        });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // 3. Create the order, then create the order items
    //    In a real scenario, you might do a transaction
    const newOrder = await prisma.order.create({
      data: {
        userId,
        status: "Pending",
        totalAmount,
        orderItems: {
          create: orderItemsData,
        },
      },
      include: {
        orderItems: true,
      },
    });

    // 4. Update product stock
    // In a transaction, you can do it all atomically. For simplicity:
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      const updatedStock = product.stock - item.quantity;
      await prisma.product.update({
        where: { id: product.id },
        data: { stock: updatedStock },
      });
    }

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: "Error creating order", details: error.message });
  }
});

/**
 * PUT /orders/:id
 * Admin might update the status (e.g. from "Pending" to "Shipped")
 * Or a user might be allowed to cancel their own order if it’s still "Pending"
 */
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // e.g. "Shipped" or "Cancelled"
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    const existingOrder = await prisma.order.findUnique({
      where: { id: Number(id) },
    });
    if (!existingOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    // If not admin, ensure user owns this order
    if (userRole !== "admin" && existingOrder.userId !== userId) {
      return res.status(401).json({ error: "Not authorized to update this order" });
    }

    // Possibly check if the order is still "Pending" to allow user cancellation
    const updatedOrder = await prisma.order.update({
      where: { id: Number(id) },
      data: { status: status || existingOrder.status },
    });

    res.json(updatedOrder);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(500).json({ error: "Error updating order" });
  }
});

/**
 * DELETE /orders/:id
 * Typically, you might not allow full deletion, 
 * but maybe an admin can do it or user can do it if still pending.
 */
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    const existingOrder = await prisma.order.findUnique({
      where: { id: Number(id) },
    });
    if (!existingOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (userRole !== "admin" && existingOrder.userId !== userId) {
      return res.status(401).json({ error: "Not authorized to delete this order" });
    }

    await prisma.order.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting order" });
  }
});

export default router;
