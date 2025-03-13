import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {prisma} from "../utils/prismaClient.js"

const router = Router();

router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "Missing fields" });
    }

    console.log("Registering user:", { username, email });

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role: "user",
            },
        });

        res.status(201).json({ message: "Aðgangur búinn til", user: newUser });
    } catch (error) {
        res.status(500).json({ error: "Error creating user", details: error.message });
    }

    
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    console.log("Login attempt with:", { email, password });
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

    if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log("Password valid:", isValidPassword); 

    if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.json({ token, username:user.username });
} catch (error) {
    res.status(500).json({ error: "Login failed", details: error.message });
}
});

export default router;

