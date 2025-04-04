import request from "supertest";
import app from "../src/utils/app.js";
import { prisma } from "../src/utils/prismaClient.js";

function randomEmail() {
  return `testuser_${Math.floor(Math.random() * 999999)}@email.com`;
}

function randomUsername() {
  return `user_${Math.floor(Math.random() * 999999)}`;
}

describe("Auth Tests", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should register a new user", async () => {
    const res = await request(app).post("/auth/register").send({
      username: randomUsername(),
      email: randomEmail(),
      password: "somepassword",
    });
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("id");
  });

  it("should fail to register if missing fields", async () => {
    const res = await request(app).post("/auth/register").send({
      username: randomUsername(),
      // Missing email and password
    });
    expect(res.statusCode).toBe(400);
    // Check that the response has an "errors" property that is an array
    expect(res.body).toHaveProperty("errors");
    expect(Array.isArray(res.body.errors)).toBe(true);
    
    // Optionally, check that the error messages include the ones we expect.
    const errorMessages = res.body.errors.map(err => err.msg);
    expect(errorMessages).toContain("Please provide a valid email");
    expect(errorMessages).toContain("Password is required");
  });

  let token;

  it("should login with the newly created user", async () => {
    const email = randomEmail();
    const username = randomUsername();
    const registerRes = await request(app).post("/auth/register").send({
      username,
      email,
      password: "secret",
    });
    expect(registerRes.statusCode).toBe(201);

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
      .get("/admin")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", "Not authorized");
  });
});