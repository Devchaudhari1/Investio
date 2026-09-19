
const { LSTMStockPredictor}  =require('../lstm/predictor.js');
const path=require('path');
const onnxPath = path.join(__dirname, '..','lstm','onnx_export','lstm_model.onnx');
const scalerConfigPath= path.join(__dirname, '..','lstm','onnx_export','scaler_config.json'); 
const predictor = new LSTMStockPredictor(onnxPath, scalerConfigPath);
const {redis,  connectRedis} = require('../redis.js');


const CACHE_TTL = 15 * 60 ; // 15 minutes

const predict = async (req, res) => {
  
  const ticker = req.params.ticker.toUpperCase();

  const CACHE_KEY = `prediction:${ticker}`;

    try {
      const cached = await redis.get(CACHE_KEY);

      if (cached ) {
        console.log(`Redis cache HIT: ${ticker}`);
        return res.json({ ...JSON.parse(cached), cached: true });
      }
      
      console.log(`Redis CACHE MISS: ${ticker}`);

      const result = await predictor.predictForTicker(ticker);
      await redis.set(CACHE_KEY, JSON.stringify(result), { EX : CACHE_TTL });
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

module.exports={predict, health};