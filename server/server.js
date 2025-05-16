const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const { OpenAI } = require("openai");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from client/public
app.use(express.static(path.join(__dirname, "..", "client", "public")));

// OpenAI route
app.post("/api/generate-plan", async (req, res) => {
  const { idea } = req.body;

  if (!idea) {
    return res.status(400).json({ error: "Idea is required" });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

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
    console.error("OpenAI error:", error);
    res.status(500).json({
      error: "Failed to generate business plan. Please try again later.",
    });
  }
});

// Fallback: serve index.html for unmatched routes
app.get("/*any", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
