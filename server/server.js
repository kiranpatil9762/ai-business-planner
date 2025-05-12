const express = require("express");
const cors = require("cors");
require('dotenv').config(); // To load environment variables like API keys

const app = express();
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON bodies from requests

// Import the routes
const planRoute = require("./routes/plan");
app.use("/api", planRoute); // Use /api prefix for all routes in the planRoute file

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
