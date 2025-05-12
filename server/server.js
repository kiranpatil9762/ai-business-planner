const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from client/public
app.use(express.static(path.join(__dirname, "..", "client", "public")));

// API routes
const planRoute = require("./routes/plan");
app.use("/api", planRoute);

// Fallback route for frontend (for GET / and others)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "public", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
