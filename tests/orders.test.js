import request from "supertest";
import app from "../src/utils/app.js";
import { prisma } from "../src/utils/prismaClient.js";

describe("Orders Tests", () => {
  let token;

  beforeAll(async () => {
    // Disconnect & remove old data if needed, or just do nothing
    // e.g. await prisma.order.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should login as user so we can create an order", async () => {
    // You might seed your DB with a known user, or create one here:
    const registerRes = await request(app).post("/auth/register").send({
      username: "userForOrders",
      email: `userForOrders@test.com`,
      password: "test123",
    });
    expect(registerRes.statusCode).toBe(201);

    // Now login
    const loginRes = await request(app).post("/auth/login").send({
      email: `userForOrders@test.com`,
      password: "test123",
    });
    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body).toHaveProperty("token");

    token = loginRes.body.token;
  });

  it("should create an order with valid items", async () => {
    // Suppose we know there's a product with id=1 from your seed data
    // Or query the DB for a product
    const product = await prisma.product.findFirst();
    expect(product).toBeTruthy(); // Ensure there's at least one product

    const res = await request(app)
      .post("/orders")
      .set("Authorization", `Bearer ${token}`)   // Must be logged in
      .send({
        items: [
          {
            productId: product.id,
            quantity: 2,
          },
        ],
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.orderItems.length).toBeGreaterThan(0);
  });

  it("should fail to create an order without items", async () => {
    const res = await request(app)
      .post("/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({ items: [] }); // empty array
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "No items provided");
  });
});
