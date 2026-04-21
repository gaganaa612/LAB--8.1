const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());

// Mock Database
const products = {
  laptop: { name: "High-End Workstation", price: 2500, region: "Conflict Zone" },
  shirt: { name: "Cotton T-Shirt", price: 30, region: "Stable Zone" }
};

// API Route
app.get('/api/analyze/:item', async (req, res) => {
  const item = req.params.item;
  const product = products[item];

  const newsHeadline =
    item === "laptop"
      ? "War escalates in chip manufacturing hub, factories closing down."
      : "Local textile markets see record harvest and peace.";

  try {
    const response = await axios({
      method: 'POST',
      url: 'https://twinword-sentiment-analysis.p.rapidapi.com/analyze/',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-RapidAPI-Key': process.env.API_KEY, // put key in .env
        'X-RapidAPI-Host': 'twinword-sentiment-analysis.p.rapidapi.com'
      },
      data: new URLSearchParams({ text: newsHeadline })
    });

    const sentimentScore = response.data.score;

    const isUrgent =
      sentimentScore < -0.3 && product.region === "Conflict Zone";

    res.json({
      ...product,
      newsHeadline,
      sentimentScore,
      isUrgent,
      recommendation: isUrgent
        ? "BUY NOW: Prices likely to spike"
        : "PRICE STABLE: Buy at leisure"
    });

  } catch (error) {
    res.status(500).json({ error: "API connection failed" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));