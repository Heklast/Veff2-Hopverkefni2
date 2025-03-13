// src/utils/authMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Middleware to check if a user is authenticated
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"]; 
  // Typically in the form: Authorization: Bearer <token>
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach decoded payload to req so we can access user info in subsequent handlers
    req.user = decoded;
    next(); // All good, proceed
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// Middleware to check if the authenticated user is an admin
function authorizeAdmin(req, res, next) {
  // We assume authenticateToken has already set req.user
  if (req.user?.role !== "admin") {
    return res.status(401).json({ error: "Not authorized" });
  }
  next();
}

export default {
  authenticateToken,
  authorizeAdmin
};
