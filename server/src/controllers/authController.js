const db = require("../config/db");
const {
  hashPassword,
  comparePassword,
  generateToken,
} = require("../utils/authHelper");
const logger = require("../utils/logger");

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Simple validation
    if (!username || !email || !password) {
      const err = new Error(
        "Please fill all fields (username, email, password).",
      );
      err.statusCode = 400;
      return next(err);
    }

    // Check if user already exists
    const [existingUsers] = await db.query(
      "SELECT id FROM users WHERE email = ? OR username = ?",
      [email, username],
    );

    if (existingUsers.length > 0) {
      const err = new Error("Username or Email already registered.");
      err.statusCode = 400;
      return next(err);
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Insert user into DB
    const [result] = await db.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword],
    );

    const userId = result.insertId;

    // Generate JWT Token
    const token = generateToken(userId);

    logger.info({ userId }, "User registered successfully.");

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      token,
      user: {
        id: userId,
        username,
        email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const err = new Error("Please enter email and password.");
      err.statusCode = 400;
      return next(err);
    }

    // Fetch user from DB
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const user = users[0];

    if (!user) {
      const err = new Error("Invalid email or password.");
      err.statusCode = 401;
      return next(err);
    }

    // Verify Password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      const err = new Error("Invalid email or password.");
      err.statusCode = 401;
      return next(err);
    }

    // Generate Token
    const token = generateToken(user.id);

    logger.info({ userId: user.id }, "User logged in successfully.");

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
};
