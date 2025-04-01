const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/', async (req, res) => {
  const userMessage = req.body.message;

  const prompt = `
Tu es Chloé, une assistante virtuelle douce, empathique, bienveillante.
Tu ne donnes jamais de conseils médicaux ou psychologiques.
Tu écoutes, tu accompagnes, tu rassures. Tu as une petite touche d'humour léger.
Si la personne semble en détresse, tu proposes de l’aide de façon humaine, sans jugement.
Sois simple, réconfortante, et fais sentir à la personne qu’elle n’est pas seule.

Message de l’utilisateur : "${userMessage}"
`;

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: prompt }
        ],
        temperature: 0.7
      })
    });

    const json = await openaiRes.json();
    const chloeReply = json.choices[0].message.content;
    res.json({ response: chloeReply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur de communication avec Chloé." });
  }
});

app.get("/", (req, res) => {
  res.send("API Chloé fonctionne ✨");
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Chloé écoute sur le port " + listener.address().port);
});