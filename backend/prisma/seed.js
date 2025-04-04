import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
//admin account
  const hashedPassword = await bcrypt.hash("admin", 10);
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
  console.log("Admin user upserted.");

  const userCount = await prisma.user.count({ where: { role: "user" } });
  if (userCount === 0) {
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
    console.log("Regular users created.");
  } else {
    console.log("Regular users already exist, skipping user creation.");
  }

  let categoryIds = [];
  const categoryCount = await prisma.category.count();
  if (categoryCount === 0) {
    const categoryNames = new Set();
    while (categoryNames.size < 3) {
      categoryNames.add(faker.commerce.department());
    }

    for (const name of categoryNames) {
      const category = await prisma.category.create({
        data: {
          name,
          description: faker.lorem.sentence(),
        },
      });
      categoryIds.push(category.id);
    }
    console.log("Categories created.");
  } else {
    const categories = await prisma.category.findMany();
    categoryIds = categories.map(cat => cat.id);
    console.log("Categories already exist, skipping category creation.");
  }

  let productIds = [];
  const productCount = await prisma.product.count();
  if (productCount === 0) {
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
    console.log("Products created.");
  } else {
    const products = await prisma.product.findMany();
    productIds = products.map(prod => prod.id);
    console.log("Products already exist, skipping product creation.");
  }

  const orderCount = await prisma.order.count();
  if (orderCount === 0) {
    const users = await prisma.user.findMany({ where: { role: "user" } });
    for (const user of users) {
      for (let i = 0; i < faker.number.int({ min: 1, max: 2 }); i++) {
        let totalAmount = 0;
        const orderItemsData = [];
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
    console.log("Orders created.");
  } else {
    console.log("Orders already exist, skipping order creation.");
  }

  const reviewCount = await prisma.review.count();
  if (reviewCount === 0) {
    const users = await prisma.user.findMany({ where: { role: "user" } });
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
    console.log("Reviews created.");
  } else {
    console.log("Reviews already exist, skipping review creation.");
  }

  console.log("Database seeding completed.");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });