const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { createPool } = require("mysql2");

const pool = createPool({
  host: "localhost",
  port: 3310, // Correct the port if needed
  user: "root",
  password: "Udee1234@#",
  database: "location",
  connectionLimit: 10,
});

pool.query("SELECT * FROM stores", (err, result, fields) => {
  if (err) {
    console.error("Error:", err);
    return;
  }
  console.log("Result:", result);
});

// app.get('/api/stores', (req, res) => {
//   res.send("Hello")
// })

const app = express();

app.use(express.json());
app.use(cors());

app.listen(8880, () => {
  console.log("Connected to backend!");
});
