const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header: "Bearer <token>"
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user id to the request object
      req.user = { id: decoded.id };

      return next();
    } catch (error) {
      logger.warn({ err: error.message }, "JWT verification failed.");
      return res.status(401).json({
        success: false,
        message: "Not authorized, token failed.",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token provided.",
    });
  }
};

module.exports = { protect };
