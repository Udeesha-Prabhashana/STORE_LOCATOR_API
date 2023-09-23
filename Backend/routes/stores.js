const express = require("express");
const router = express.Router();
const { getStores, addStore } = require("../controllers/stores");

console.log("Router initialized"); 
// Define a GET route with a callback function
router.get("/", getStores);

// Define a POST route with a callback function
router.post("/", addStore);

// Export the router
module.exports = router;
