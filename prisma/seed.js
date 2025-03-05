import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash("admin", 10); 

    const adminUser = await prisma.user.upsert({
        where: { email: "admin@admin.com" },
        update: {},
        create: {
            username: "admin",
            email: "admin@admin.com",
            password: hashedPassword,
            role: "admin", 
        },
    });

    console.log("Admin user ensured:", adminUser);
}

main()
    .catch((e) => {
        console.error("Error seeding database:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });