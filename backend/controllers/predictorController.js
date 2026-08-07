
const { LSTMStockPredictor}  =require('../lstm/predictor.js');
const path=require('path');
const onnxPath = path.join(__dirname, '..','lstm','onnx_export','lstm_model.onnx');
const scalerConfigPath= path.join(__dirname, '..','lstm','onnx_export','scaler_config.json'); 
const predictor = new LSTMStockPredictor(onnxPath, scalerConfigPath);


const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes
const cache = new Map(); // ticker -> { result, expiresAt }

 const predict = async (req, res) => {
  const ticker = req.params.ticker.toUpperCase();
  try {
    const cached = cache.get(ticker);
    if (cached && cached.expiresAt > Date.now()) {
      return res.json({ ...cached.result, cached: true });
    }
    console.log(`Received message for predicting ${ticker}`);
    const result = await predictor.predictForTicker(ticker);
    cache.set(ticker, { result, expiresAt: Date.now() + CACHE_TTL_MS });
    res.json({ ...result, cached: false });
  } catch (err) {
    console.error(`Prediction failed for ${ticker}:`, err.message);
    res.status(500).json({ error: err.message });
  }
};

const health = (req, res) => res.json({ status: "ok" });

predictor
  .load()
  .then(()=>{
    console.log(`Model online`);
  })
  .catch((err) => {
    console.error("Failed to load ONNX model:", err);
    process.exit(1);
  });

module.exports={predict};