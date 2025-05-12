const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
// Initialize OpenAI with your API key (make sure to store in .env and load it)
// Example of correct initialization

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure this is set in your environment
});


router.post("/generate-plan", async (req, res) => {
  const { idea } = req.body;

  if (!idea) {
    return res.status(400).json({ error: "Idea is required" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or gpt-4 if you have access
      messages: [
        {
          role: "system",
          content:
            "You are a startup expert. Help users build a startup based on their idea by giving complete business plans, market research, initial steps, legal requirements, pros and cons, and startup costs.",
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
    res.status(500).json({ error: "Failed to generate business plan" });
  }
});

module.exports = router;
