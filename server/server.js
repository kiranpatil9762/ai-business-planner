const express = require("express");
const cors = require("cors");
require("dotenv").config(); // To load environment variables like API keys
const path = require("path"); // To handle file paths
const { OpenAI } = require("openai"); // Assuming you're using OpenAI API

const app = express();
const port = process.env.PORT || 5000;

// Middleware setup
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON bodies from requests

// Initialize OpenAI client with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST route to generate business plan
app.post("/api/generate-plan", async (req, res) => {
  const { idea } = req.body;

  if (!idea) {
    return res.status(400).json({ error: "Idea is required" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a startup expert. Help users build a startup based on their idea by providing a complete business plan, market research, initial steps, legal requirements, pros and cons, and startup costs.",
        },
        {
          role: "user",
          content: `Business Idea: ${idea}`,
        },
      ],
    });

    const output = completion.choices[0].message.content;
    res.json({ plan: output });
  } catch (error) {
    console.error("Error during OpenAI API call:", error);
    res.status(500).json({
      error: "Failed to generate business plan. Please try again later.",
    });
  }
});

// Serve static files (HTML, CSS, JS) from the 'client/public' folder
app.use(express.static(path.join(__dirname, "client", "public")));

// Catch-all route to serve the index.html for all non-API requests
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "public", "index.html"));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
