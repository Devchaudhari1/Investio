"use strict";

const fs = require("fs");
const ort = require("onnxruntime-node");
const yahooFinance = require("yahoo-finance2").default;

class LSTMStockPredictor {
  /**
   * @param {string} onnxPath - path to lstm_model.onnx
   * @param {string} scalerConfigPath - path to scaler_config.json
   */
  constructor(onnxPath, scalerConfigPath) {
    this.onnxPath = onnxPath;
    this.scalerConfig = JSON.parse(fs.readFileSync(scalerConfigPath, "utf-8"));
    this.session = null;
  }

  async load() {
    this.session = await ort.InferenceSession.create(this.onnxPath, {
      executionProviders: ["cpu"],
    });
    const { lookback, features } = this.scalerConfig;
    console.log(`Loaded ONNX model from ${this.onnxPath}`);
    console.log(`Expecting ${lookback} days x ${features.length} features: ${features.join(", ")}`);
  }

  // sklearn MinMaxScaler forward transform: X_scaled = X * scale_ + min_
  _scaleRow(rawValues) {
    const { scaler_scale, scaler_min } = this.scalerConfig;
    return rawValues.map((v, i) => v * scaler_scale[i] + scaler_min[i]);
  }

  // Inverse transform, target column only
  _inverseTargetValue(scaledValue) {
    const { scaler_scale, scaler_min, target_index } = this.scalerConfig;
    return (scaledValue - scaler_min[target_index]) / scaler_scale[target_index];
  }

  /**
   * @param {Array<{open:number, high:number, low:number, close:number, volume:number}>} rows
   *   Exactly `lookback` daily bars, oldest first, most recent last.
   * @returns {Promise<number>} predicted next-day close (real price, not scaled)
   */
  async predictNextClose(rows) {
    if (!this.session) throw new Error("Call load() before predicting.");
    const { lookback, features } = this.scalerConfig;
    if (rows.length !== lookback) {
      throw new Error(`Expected ${lookback} rows, got ${rows.length}`);
    }

    const featureOrder = features.map((f) => f.toLowerCase()); // ["open","high","low","close","volume"]
    const flat = new Float32Array(lookback * features.length);

    rows.forEach((row, t) => {
      const raw = featureOrder.map((f) => {
        const v = row[f];
        if (v == null || Number.isNaN(v)) {
          throw new Error(`Missing/NaN value for feature "${f}" at row ${t}`);
        }
        return v;
      });
      const scaled = this._scaleRow(raw);
      scaled.forEach((v, f) => {
        flat[t * features.length + f] = v;
      });
    });

    const inputTensor = new ort.Tensor("float32", flat, [1, lookback, features.length]);
    const results = await this.session.run({ input: inputTensor });
    const scaledPred = results.output.data[0];
    return this._inverseTargetValue(scaledPred);
  }

  /**
   * Convenience wrapper: pulls the latest `lookback` daily bars for `ticker`
   * from Yahoo Finance and predicts tomorrow's close.
   *
   * NOTE: this predicts the next *daily* close using daily OHLCV bars.
   * "Real time" here means "on demand, always using the latest completed
   * daily bar" — not intraday/tick-level prediction. The model only knows
   * about day-level patterns, so feeding it intraday data wouldn't be
   * meaningful without retraining on intraday bars.
   */
  async predictForTicker(ticker) {
    const { lookback } = this.scalerConfig;

    // pull extra calendar days to comfortably cover `lookback` *trading* days
    const period1 = new Date();
    period1.setDate(period1.getDate() - Math.ceil(lookback * 1.6) - 5);

    const history = await yahooFinance.chart(ticker, { period1, interval: "1d" });

    const quotes = (history.quotes || []).filter(
      (q) =>
        q.open != null &&
        q.high != null &&
        q.low != null &&
        q.close != null &&
        q.volume != null
    );

    if (quotes.length < lookback) {
      throw new Error(
        `Not enough recent trading days for ${ticker}: got ${quotes.length}, need ${lookback}`
      );
    }

    const lastN = quotes.slice(-lookback).map((q) => ({
      open: q.open,
      high: q.high,
      low: q.low,
      close: q.close,
      volume: q.volume,
    }));

    const predictedClose = await this.predictNextClose(lastN);
    const lastActual = lastN[lastN.length - 1].close;
    const lastDate = quotes[quotes.length - 1].date;

    return {
      ticker,
      lastDate,
      lastActualClose: lastActual,
      predictedNextClose: predictedClose,
      predictedChange: predictedClose - lastActual,
      predictedChangePct: ((predictedClose - lastActual) / lastActual) * 100,
    };
  }
}

module.exports = { LSTMStockPredictor };
