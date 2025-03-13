// tests/reviews.test.js
import request from "supertest";
import app from "../src/utils/app.js";
import { prisma } from "../src/utils/prismaClient.js";

describe("Reviews API", () => {
  let adminToken;
  let userToken;
  let secondUserToken; // for testing "not the owner"
  let product;
  let createdReviewId;

  beforeAll(async () => {
    // 1. Log in admin
    const adminLogin = await request(app)
      .post("/auth/login")
      .send({ email: "admin@admin.com", password: "admin" });
    adminToken = adminLogin.body.token;

    // 2. Register & log in one normal user (the "review owner")
    const userEmail = `reviewOwner_${Date.now()}@test.com`;
    await request(app).post("/auth/register").send({
      username: "reviewOwner",
      email: userEmail,
      password: "test123"
    });
    const userLogin = await request(app).post("/auth/login").send({
      email: userEmail,
      password: "test123"
    });
    userToken = userLogin.body.token;

    // 3. Register & log in another user (to test "Not authorized" for a different user)
    const secondEmail = `reviewOther_${Date.now()}@test.com`;
    await request(app).post("/auth/register").send({
      username: "reviewOther",
      email: secondEmail,
      password: "test123"
    });
    const secondUserLogin = await request(app).post("/auth/login").send({
      email: secondEmail,
      password: "test123"
    });
    secondUserToken = secondUserLogin.body.token;

    // 4. Ensure we have a product to review
    product = await prisma.product.findFirst(); 
    // If you might have no products, create one here:
    // product = await prisma.product.create({ ... });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should get a list of reviews (public)", async () => {
    const res = await request(app).get("/reviews");
    expect(res.status).toBe(200);
    // expect structure like: { data, currentPage, totalPages, totalCount }
    expect(res.body).toHaveProperty("data");
  });

  it("should fail to create a review without token", async () => {
    const res = await request(app).post("/reviews").send({
      productId: product.id,
      rating: 5,
      comment: "No token here"
    });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error", "No token provided");
  });

  it("should create a review as a logged in user", async () => {
    const res = await request(app)
      .post("/reviews")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        productId: product.id,
        rating: 4,
        comment: "Nice product!"
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    createdReviewId = res.body.id;
  });

  it("should update own review", async () => {
    const res = await request(app)
      .put(`/reviews/${createdReviewId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        rating: 3,
        comment: "Updated my opinion"
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("rating", 3);
    expect(res.body).toHaveProperty("comment", "Updated my opinion");
  });

  it("should fail to update a review if not the owner or admin", async () => {
    const res = await request(app)
      .put(`/reviews/${createdReviewId}`)
      .set("Authorization", `Bearer ${secondUserToken}`)
      .send({ comment: "I want to edit someone else's review" });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error", "Not authorized to update this review");
  });

  it("should let admin update any review", async () => {
    const res = await request(app)
      .put(`/reviews/${createdReviewId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ rating: 2, comment: "Admin changed your review!" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("rating", 2);
    expect(res.body).toHaveProperty("comment", "Admin changed your review!");
  });

  it("should fail to delete a review if not the owner or admin", async () => {
    const res = await request(app)
      .delete(`/reviews/${createdReviewId}`)
      .set("Authorization", `Bearer ${secondUserToken}`);
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error", "Not authorized to delete this review");
  });

  it("should delete a review as admin", async () => {
    const res = await request(app)
      .delete(`/reviews/${createdReviewId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Review deleted successfully");
  });
});
