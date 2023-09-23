// const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
// const { createPool } = require("mysql2");
const storeRoutes = require('./routes/stores'); // Import the store routes

const app = express();

// const pool = createPool({
//   host: "localhost",
//   port: 3310, // Correct the port if needed
//   user: "root",
//   password: "Udee1234@#",
//   database: "location",
//   connectionLimit: 10,
// });

// pool.query("SELECT * FROM stores", (err, result, fields) => {
//   if (err) {
//     console.error("Error:", err);
//     return;
//   }
//   console.log("Result:", result);
// });

app.get('/api/stores', (req, res) => {
  res.send("Hello")
})




app.use(express.json());
app.use(cors());


// Use the store routes defined in stores.js
app.use('/api/v1/stores', storeRoutes);

app.listen(8880, () => {
  console.log("Connected to backend!");
});

// module.exports = { app, pool };
