import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin", 10); 

  // 1. Ensure one admin user
  await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: {},
    create: {
      username: "admin",
      email: "admin@admin.com",
      password: hashedPassword,
      role: "admin",
    },
  });

  // 2. Create regular users
  for (let i = 0; i < 5; i++) {
    const name = faker.internet.username();
    const email = faker.internet.email();
    const password = await bcrypt.hash("password", 10);

    await prisma.user.create({
      data: {
        username: name,
        email: email,
        password,
        role: "user",
      },
    });
  }

  // 3. Create categories
  const categoryNames = new Set();
  while (categoryNames.size < 3) {
    categoryNames.add(faker.commerce.department());
  }

  const categoryIds = [];
  for (const name of categoryNames) {
    const category = await prisma.category.create({
      data: {
        name,
        description: faker.lorem.sentence(),
      },
    });
    categoryIds.push(category.id);
  }

  // 4. Create products
  const productIds = [];
  for (let i = 0; i < 15; i++) {
    const product = await prisma.product.create({
      data: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: Number(faker.commerce.price()),
        stock: faker.number.int({ min: 1, max: 100 }),
        categoryId: faker.helpers.arrayElement(categoryIds),
        image: faker.image.url(640, 480, 'product', true),
        updatedAt: new Date(),
      },
    });
    productIds.push(product.id);
  }

  // 5. Create orders
  const users = await prisma.user.findMany({ where: { role: "user" } });
  for (const user of users) {
    // 1-2 orders per user
    for (let i = 0; i < faker.number.int({ min: 1, max: 2 }); i++) {
      let totalAmount = 0;
      const orderItemsData = [];

      // 1-3 items per order
      const itemCount = faker.number.int({ min: 1, max: 3 });
      for (let j = 0; j < itemCount; j++) {
        const productId = faker.helpers.arrayElement(productIds);
        const quantity = faker.number.int({ min: 1, max: 5 });

        const product = await prisma.product.findUnique({
          where: { id: productId },
          select: { price: true },
        });

        const itemTotal = product.price * quantity;
        totalAmount += itemTotal;

        orderItemsData.push({
          productId,
          quantity,
          price: product.price,
        });
      }

      await prisma.order.create({
        data: {
          userId: user.id,
          status: "Pending",
          totalAmount,
          OrderItem: {  
            create: orderItemsData,
          },
        },
      });
    }
  }

  // 6. Create reviews
  for (const user of users) {
    const chosenProducts = faker.helpers.arrayElements(productIds, 2);
    for (const prodId of chosenProducts) {
      await prisma.review.create({
        data: {
          productId: prodId,
          userId: user.id,
          rating: faker.number.int({ min: 1, max: 5 }),
          comment: faker.lorem.sentence(),
        },
      });
    }
  }

  console.log("Database seeded with Faker data!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });