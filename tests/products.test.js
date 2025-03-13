import request from "supertest";
import app from "../src/utils/app.js";
import { prisma } from "../src/utils/prismaClient.js";

describe("Products API", () => {
  let adminToken;
  let userToken;

  beforeAll(async () => {
    // 1. Log in as admin (assuming you have seeded admin@admin.com / "admin")
    const adminLogin = await request(app).post("/auth/login").send({
      email: "admin@admin.com",
      password: "admin"
    });
    adminToken = adminLogin.body.token;

    // 2. Register + login a normal user
    const userReg = await request(app).post("/auth/register").send({
      username: "testUser",
      email: "testUser@example.com",
      password: "password"
    });
    const userLogin = await request(app).post("/auth/login").send({
      email: "testUser@example.com",
      password: "password"
    });
    userToken = userLogin.body.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should get a list of products publicly", async () => {
    const res = await request(app).get("/products");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
  });

  it("should fail to create a product if not admin", async () => {
    const res = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "Unauth Product",
        price: 9.99,
        stock: 10,
        categoryId: 1
      });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error", "Not authorized");
  });

  it("should create a product as admin", async () => {
    const res = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Admin Product",
        price: 19.99,
        stock: 20,
        categoryId: 1
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
  });

  // ...test PUT /products/:id, DELETE /products/:id similarly
});
