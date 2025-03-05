const express = require('express');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
dotenv.config();

const prisma = new PrismaClient();
const app = express();

// Middleware for JSON parsing
app.use(express.json());

// Landing route to list available endpoints
app.get('/', (req, res) => {
  res.json({
    endpoints: [
      "/products",
      "/categories",
      "/orders",
      // Add more as needed
    ],
  });
});

// Example: GET /products (with pagination)
app.get('/products', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const products = await prisma.product.findMany({
      skip,
      take: limit,
      include: { category: true }, // include category info if needed
    });
    res.json(products);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching products' });
  }
});

// Additional endpoints can be defined for CRUD operations on Users, Orders, Reviews, etc.

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
