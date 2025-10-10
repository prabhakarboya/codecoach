import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import judgeRoutes from "./routes/judgeRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// CORS settings to allow frontend localhost:3000 with credentials (cookies)
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

// Parse JSON request bodies and cookies
app.use(express.json());
app.use(cookieParser());

// Mount routers
app.use("/api/auth", authRoutes);
app.use("/api/judge", judgeRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/user", userRoutes);

// Root route for sanity check
app.get("/", (req, res) => {
  res.send("Welcome to the CodeCoach AI Backend API");
});

// 404 handler - catch all unknown routes
app.use((req, res) => {
  res.status(404).json({ status: "error", message: "Not Found" });
});

// Centralized error-handling middleware - MUST be last
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({ status: "error", message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
