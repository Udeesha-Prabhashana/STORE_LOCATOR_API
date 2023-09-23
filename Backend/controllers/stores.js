const { Router } = require("express");
// const pool = require("../server"); // Import the MySQL pool from server.js
const router = Router();

const { createPool } = require("mysql2");

const pool = createPool({
  host: "localhost",
  port: 3310, // Correct the port if needed
  user: "root",
  password: "Udee1234@#",
  database: "location",
  connectionLimit: 10,
});

// console.log(pool)
// @desc  Get all stores
// @route GET /api/v1/stores
// @access Public
router.get("/", (req, res) => {
   console.log("GET request to /api/v1/stores received");
  const selectQuery = "SELECT * FROM stores";

  pool.query(selectQuery, (err, result, fields) => {
    if (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Server error" });
      return;
    }
    res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  });
});

// @desc  Create a store
// @route POST /api/v1/stores
// @access Public
router.post("/api/v1/stores", (req, res) => {
  const { name, location } = req.body; // Adjust the body parameters as needed

  if (!name || !location) {
    res.status(400).json({ error: "Name and location are required" });
    return;
  }

  const insertQuery = "INSERT INTO stores (name, location) VALUES (?, ?)";
  pool.query(insertQuery, [name, location], (err, result, fields) => {
    if (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Server error" });
      return;
    }
    res.status(201).json({
      success: true,
      data: { name, location },
    });
  });
});

module.exports = {
  getStores: router.get("/"),
  addStore: router.post("/"),
};
