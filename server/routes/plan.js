const express = require("express");
const router = express.Router();
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

router.post("/", async (req, res) => {
  const { idea } = req.body;

  if (!idea) return res.status(400).json({ error: "No idea provided" });

  const prompt = `I have a business idea: "${idea}". Give a detailed plan including:
  - Steps to start
  - Required documents/licenses (India-specific)
  - Investment breakdown
  - Supplier sources
  - Pros/cons
  - Market reference
  - Do's and Don'ts
  - Logo & name suggestions
  - Business plan summary`;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ plan: completion.data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI response error" });
  }
});

module.exports = router;
