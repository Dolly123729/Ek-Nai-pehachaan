const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const OpenAI = require("openai");

// Load .env from app folder first, then project root as fallback.
dotenv.config({ path: path.resolve(__dirname, ".env"), quiet: true });
dotenv.config({ path: path.resolve(__dirname, "..", ".env"), quiet: true });

const app = express();
app.use(cors());
app.use(express.json());

if (!process.env.OPENAI_API_KEY) {
  console.error("OPENAI_API_KEY is missing. Add it to ek-nai-pehchaan-app/.env or ../.env");
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    const reply = response.output_text || "I could not generate a response.";
    return res.json({ reply });
  } catch (error) {
    console.error("Chat error:", error?.message || error);
    return res.status(error?.status || 500).json({ error: error?.message || "AI request failed. Check server logs and API key." });
  }
});

app.listen(3001, () => {
  console.log("Chat server running on http://localhost:3001");
});

