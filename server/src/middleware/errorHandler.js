const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  logger.error(
    {
      err: {
        message: err.message,
        stack: err.stack,
        context: err.context || "Global Error Handler",
      },
    },
    "An unhandled exception occurred!",
  );

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message,

    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = errorHandler;
