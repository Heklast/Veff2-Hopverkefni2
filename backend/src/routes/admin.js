import { Router } from "express";
import authMiddleware from "../utils/authMiddleware.js";
import { prisma } from "../utils/prismaClient.js";

const { authenticateToken, authorizeAdmin } = authMiddleware;

const router = Router();

router.get("/", authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching users" });
    }
});

export default router;