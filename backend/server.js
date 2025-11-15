import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import fileUpload from "express-fileupload";
import path from "path";
import logger from "./middleware/logger.js";
import { dbConnection } from "./config/database.js";

// Import routes
import authRoutes from "./routes/auth.js";
import pgRoutes from "./routes/pg.js";
import bookingRoutes from "./routes/booking.js";

// Initialize express app
const app = express();

// Connect to MongoDB
dbConnection();

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
});
app.use(limiter);

// Enable CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// File upload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: process.env.MAX_FILE_SIZE || 10 * 1024 * 1024 },
    abortOnLimit: true,
  })
);

// Static files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/pgs", pgRoutes);
app.use("/api/bookings", bookingRoutes);

// Simple health endpoints without plugin
app.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const uptime = process.uptime();

  res.json({
    status: dbState === 1 ? "healthy" : "unhealthy",
    uptime: Math.floor(uptime),
    database: {
      connected: dbState === 1,
      state: ["disconnected", "connected", "connecting", "disconnecting"][dbState],
    },
    memory: process.memoryUsage().heapUsed,
  });
});

// Quick status endpoint
app.get("/health/simple", (req, res) => {
  res
    .status(mongoose.connection.readyState === 1 ? 200 : 503)
    .send(mongoose.connection.readyState === 1 ? "OK" : "ERROR");
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
