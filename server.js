import app from "./src/utils/app.js";
import dotenv from "dotenv";

console.log("🛠 Loading environment variables...");
dotenv.config();

const PORT = process.env.PORT || 3000;
console.log(`🚀 Starting server on port ${PORT}...`);

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});