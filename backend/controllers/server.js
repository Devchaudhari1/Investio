"use strict";

const express = require("express");
const path = require("path");
const { LSTMStockPredictor } = require("../lstm/predictor");

const PORT = process.env.PORT || 3000;
const ONNX_PATH = path.join(__dirname, "onnx_export", "lstm_model.onnx");
const CONFIG_PATH = path.join(__dirname, "onnx_export", "scaler_config.json");

const predictor = new LSTMStockPredictor(ONNX_PATH, CONFIG_PATH);

// Simple per-ticker cache: new daily bars only appear once/day, so there's
// no point re-fetching + re-running inference on every request.
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes
const cache = new Map(); // ticker -> { result, expiresAt }

const app = express();

app.get("/predict/:ticker", async (req, res) => {
  const ticker = req.params.ticker.toUpperCase();
  try {
    const cached = cache.get(ticker);
    if (cached && cached.expiresAt > Date.now()) {
      return res.json({ ...cached.result, cached: true });
    }

    const result = await predictor.predictForTicker(ticker);
    cache.set(ticker, { result, expiresAt: Date.now() + CACHE_TTL_MS });
    res.json({ ...result, cached: false });
  } catch (err) {
    console.error(`Prediction failed for ${ticker}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/health", (req, res) => res.json({ status: "ok" }));

predictor
  .load()
  .then(() => {
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to load ONNX model:", err);
    process.exit(1);
  });
