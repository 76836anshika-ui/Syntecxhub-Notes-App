const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();
const PORT = 5000;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "NoteFlow backend is running successfully!",
  });
});

app.get("/test", (req, res) => {
  res.json({
    message: "Test route is working!",
  });
});

// Gemini summary route
app.post("/api/summarize", async (req, res) => {
  try {
    const { note } = req.body;

    if (!note || note.trim() === "") {
      return res.status(400).json({
        error: "Note content is required.",
      });
    }

    const interaction = await ai.interactions.create({
      model: "gemini-3.8-flash",
      input: `Summarize this note in simple language:

${note}`,
    });

    res.json({
      summary: interaction.output_text,
    });

  } catch (error) {
    console.error("Gemini API Error:", error.message);

    res.status(500).json({
      error: "Failed to generate AI summary.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:5000`);
});