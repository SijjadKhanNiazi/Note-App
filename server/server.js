const express = require("express");
const dotenv = require("dotenv");
const logger = require("./src/utils/logger");
const requestLogger = require("./src/middleware/requestLogger");
const errorHandler = require("./src/middleware/errorHandler");
const authRoutes = require("./src/routes/authRoutes");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware for parsing JSON requests
app.use(express.json());

// Apply HTTP Request Logging Middleware
app.use(requestLogger);

// Health Check Route
app.get("/health", (req, res) => {
  res
    .status(200)
    .json({ status: "UP", message: "Notes API is running smoothly." });
});

// Test Error Route (Global Error handler check karne ke liye)
app.get("/test-error", (req, res, next) => {
  const error = new Error("This is a test crash!");
  error.statusCode = 400;
  next(error);
});

// Global Exception Handler (Sabse end me routes ke baad register hona chahiye)
app.use(errorHandler);
// Register API Modules
app.use("/api/auth", authRoutes);

// Start Server
app.listen(PORT, () => {
  logger.info(
    `Server is running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
  );
});
