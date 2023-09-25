const { Router } = require("express");

// const pool = require("../server"); // Import the MySQL pool from server.js
const router = Router();
const geocoder = require('../utils/geocoder')

const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  port: 5432, // PostgreSQL default port
  user: "postgres",
  password: "Udee1234@#",
  database: "Test",
  max: 10, // Maximum number of connections in the pool
});

// console.log(pool)
// @desc  Get all stores
// @route GET /api/v1/stores
// @access Public
router.get("/", (req, res) => {
  console.log("GET request to /api/v1/stores received");
  const selectQuery =
    "SELECT address, ST_Y(location::geometry) AS latitude, ST_X(location::geometry) AS longitude FROM stores";

  pool.query(selectQuery, (err, result) => {
    if (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Server error" });
      return;
    }

    // Check if the result is an array (result.rows)
    if (!Array.isArray(result.rows)) {
      console.error("Query result is not an array:", result);
      res.status(500).json({ error: "Invalid query result" });
      return;
    }

    const storesWithLatLng = result.rows.map((store) => {
      return {
        address: store.address,
        latitude: store.latitude,
        longitude: store.longitude,
      };
    });

    res.status(200).json({
      success: true,
      count: storesWithLatLng.length,
      data: storesWithLatLng,
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
    const { latitude, longitude, formattedAddress } = geocodeResponse[0];
    console.log(latitude);
    console.log(longitude);
    console.log(formattedAddress);

    // Insert the data into the database
    const insertQuery =
      "INSERT INTO stores (address, location, formattedAddress) VALUES ($1, ST_GeomFromText($2), $3)";
    const values = [
      address,
      `POINT(${longitude} ${latitude})`,
      formattedAddress,
    ];

    
    console.log("Inserting values:", values);


    pool.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Server error" });
      } else {
        console.log("Data inserted successfully");
        res.status(201).json({
          success: true,
          data: {
            address: undefined,
            location: { type: "Point", coordinates: [longitude, latitude] },
            formattedAddress,
            latitude, // Include latitude in the response
            longitude, // Include longitude in the response
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
