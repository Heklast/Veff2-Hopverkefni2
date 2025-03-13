import request from "supertest";
import app from "../src/utils/app.js";
import { prisma } from "../src/utils/prismaClient.js";

function randomEmail() {
  return `testuser_${Math.floor(Math.random() * 999999)}@email.com`;
}

function randomUsername() {
  return `user_${Math.floor(Math.random() * 999999)}`;
}

describe("Products API", () => {
  let adminToken;
  let userToken;

  beforeAll(async () => {
    // 1. Log in as admin (assuming admin@admin.com exists with password "admin")
    const adminLogin = await request(app).post("/auth/login").send({
      email: "admin@admin.com",
      password: "admin"
    });
    adminToken = adminLogin.body.token;

    // 2. Register and log in a normal user with unique credentials
    const userEmail = randomEmail();
    const username = randomUsername();
    await request(app).post("/auth/register").send({
      username,
      email: userEmail,
      password: "password"
    });
    const userLogin = await request(app).post("/auth/login").send({
      email: userEmail,
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
});
