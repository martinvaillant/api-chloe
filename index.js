const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();
app.use(cors()); // 👈 autorise toutes les origines (y compris Wix)
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/", async (req, res) => {
  try {
    const message = req.body.message;

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Tu es Chloé, une assistante empathique qui répond avec douceur...",
        },
        { role: "user", content: message },
      ],
    });

    const response = chatCompletion.choices[0].message.content;
    res.json({ response });

  } catch (error) {
    console.error("Erreur dans l’API :", error);
    res.status(500).json({ error: "Erreur interne." });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API Chloé active sur le port ${port}`));