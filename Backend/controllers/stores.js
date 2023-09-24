const { Router } = require("express");

// const pool = require("../server"); // Import the MySQL pool from server.js
const router = Router();
const geocoder = require('../utils/geocoder')

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

// @desc Create a store
// @route POST /api/v1/stores
// @access Public
router.post("/", async (req, res) => {
  console.log("POST request to /api/v1/stores received");
  const { address } = req.body;

  if (!address) {
    res.status(400).json({ error: "Address is required" });
    return;
  }

  try {
    // Set your Google Maps API key

    // Use the geocoder to convert the address to coordinates
    const geocodeResponse = await geocoder.geocode(address);
    console.log(geocodeResponse);
    const { latitude, longitude, formattedAddress } = geocodeResponse[0];

    // Insert the data into the database
    const insertQuery =
      "INSERT INTO stores (address, location, formattedAddress) VALUES (?, POINT(?, ?), ?)";
    const values = [address, longitude, latitude , formattedAddress];

    pool.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Server error" });
      } else {
        res.status(201).json({
          success: true,
          data: {
            address: undefined,
            location: { type: "Point", coordinates: [longitude, latitude] },
            formattedAddress,
          },
        });
      }
    });
  } catch (error) {
    console.error("Geocoding error:", error.message); // Log the specific error message
    res.status(500).json({ error: "Geocoding error", message: error.message });
  }

});


module.exports = {
  getStores: router.get("/"),
  addStore: router.post("/"),
};
