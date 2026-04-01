const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");
const path = require("path");

dotenv.config({ quiet: true });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

if (!process.env.OPENAI_API_KEY) {
  console.error("OPENAI_API_KEY is missing in .env");
}

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body?.message;

    if (!userMessage || typeof userMessage !== "string") {
      return res.status(400).json({ error: "message is required" });
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: userMessage,
      max_output_tokens: 200,
    });

    return res.json({ reply: response.output_text || "I could not generate a response." });
  } catch (error) {
    console.error("Chat error:", error?.message || error);
    return res.status(error?.status || 500).json({ error: error?.message || "AI request failed. Check API key and billing." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Chat server running on port ${PORT}`);
});


