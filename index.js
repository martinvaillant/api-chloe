const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

// Utiliser CORS et JSON
app.use(cors());
app.use(express.json());

// Clé OpenAI depuis .env
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// POST - Route pour Chloé
app.post('/ask-chloe', async (req, res) => {
  const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

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

    if (!json.choices || !json.choices[0]) {
      throw new Error("Réponse invalide de l'API OpenAI");
    }

    const chloeReply = json.choices[0].message.content;
    res.json({ response: chloeReply });

  } catch (err) {
    console.error("Erreur côté serveur :", err);
    res.status(500).json({ response: "Oups, je ne peux pas répondre pour l’instant. Réessaie un peu plus tard. 😥" });
  }
});

// GET - Pour tester que ça marche
app.get("/", (req, res) => {
  res.send("API Chloé fonctionne ✨");
});

// Lancer le serveur
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Chloé écoute sur le port " + listener.address().port);
});