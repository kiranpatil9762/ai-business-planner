const express = require("express");
const router = express.Router();
const { OpenAI } = require("openai");

// Initialize the OpenAI client with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST route to generate business plan
router.post("/generate-plan", async (req, res) => {
  const { idea } = req.body;

  // Check if the idea is provided in the request
  if (!idea) {
    return res.status(400).json({ error: "Idea is required" });
  }

  try {
    // Requesting a response from OpenAI's GPT model
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

    // Extract the generated plan from the OpenAI response
    const output = completion.choices[0].message.content;
    res.json({ plan: output });
  } catch (error) {
    // Improved error handling with more detailed logging
    console.error("Error during OpenAI API call:", error);
    res.status(500).json({
      error: "Failed to generate business plan. Please try again later.",
    });
  }
});

module.exports = router; // ✅ This line is required
