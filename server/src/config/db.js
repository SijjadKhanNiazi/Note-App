const mysql = require("mysql2/promise");
const logger = require("../utils/logger");
require("dotenv").config();

// Create a connection pool to optimize performance
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Immediately verify connection pool status
(async () => {
  try {
    const connection = await pool.getConnection();
    logger.info("MySQL Database pool initialized and connected successfully.");
    connection.release();
  } catch (error) {
    logger.error({ err: error }, "Failed to connect to the MySQL database.");
    process.exit(1); // Terminate process if DB connection is critical and fails
  }
})();

module.exports = pool;
