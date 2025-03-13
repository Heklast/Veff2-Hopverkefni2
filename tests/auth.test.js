import request from "supertest";
import app from "../src/utils/app.js";
import { prisma } from "../src/utils/prismaClient.js";

// A helper to generate random emails/usernames (so each test can be unique)
function randomEmail() {
  return `testuser_${Math.floor(Math.random() * 999999)}@email.com`;
}

describe("Auth Tests", () => {
  // After all tests finish, disconnect Prisma
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should register a new user", async () => {
    const res = await request(app).post("/auth/register").send({
      username: "testUser",
      email: randomEmail(),
      password: "somepassword",
    });
    
    expect(res.statusCode).toBe(201); // expecting "201 Created" from your code
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("id");
    // ... additional checks
  });

  it("should fail to register if missing fields", async () => {
    const res = await request(app).post("/auth/register").send({
      username: "noEmailOrPassword",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Missing fields");
  });

  let token; // store token for subsequent tests

  it("should login with the newly created user", async () => {
    // First, register a user
    const email = randomEmail();
    const registerRes = await request(app).post("/auth/register").send({
      username: "anotherUser",
      email,
      password: "secret",
    });
    expect(registerRes.statusCode).toBe(201);

    // Then, try to login
    const loginRes = await request(app).post("/auth/login").send({
      email,
      password: "secret",
    });
    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body).toHaveProperty("token");
    token = loginRes.body.token;
  });

  it("should deny admin route if not admin", async () => {
    const res = await request(app)
      .get("/admin")       // GET /admin
      .set("Authorization", `Bearer ${token}`); // regular user token
    expect(res.statusCode).toBe(401);  // "Not authorized"
    expect(res.body).toHaveProperty("error", "Not authorized");
  });
});
