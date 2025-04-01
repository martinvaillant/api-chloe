const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/ask-chloe', async (req, res) => {
  const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
  const userMessage = req.body.message;

  if (!userMessage || !userMessage.trim()) {
    return res.status(400).json({ response: "Le message est vide." });
  }

  const systemPrompt = `
Tu es Chloé, une assistante virtuelle douce, empathique, bienveillante.
Tu ne donnes jamais de conseils médicaux ou psychologiques.
Tu écoutes, tu accompagnes, tu rassures. Tu as une petite touche d'humour léger.
Si la personne semble en détresse, tu proposes de l’aide de façon humaine, sans jugement.
Sois simple, réconfortante, et fais sentir à la personne qu’elle n’est pas seule.
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
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        temperature: 0.7
      })
    });

    const json = await openaiRes.json();
    console.log("Réponse OpenAI complète :", json); // pour déboguer

    if (!json.choices || !json.choices[0] || !json.choices[0].message) {
      throw new Error("Réponse invalide de l'API OpenAI");
    }

    const chloeReply = json.choices[0].message.content;
    res.json({ response: chloeReply });

  } catch (err) {
    console.error("Erreur côté serveur :", err);
    res.status(500).json({
      response: "Oups, je ne peux pas répondre pour l’instant. Réessaie un peu plus tard. 😥"
    });
  }
});

app.get("/", (req, res) => {
  res.send("API Chloé fonctionne ✨");
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Chloé écoute sur le port " + listener.address().port);
});