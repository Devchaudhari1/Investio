# Investio

Investio is an **LSTM-based financial market analysis and prediction platform** that uses historical **OHLCV (Open, High, Low, Close, Volume)** data to model price trends across multiple financial instruments.

## Features

* **Historical Market Data:** Processes OHLCV time-series data for financial instruments.
* **LSTM-Based Prediction:** Uses a **Long Short-Term Memory (LSTM)** neural network to learn temporal patterns in historical price data and generate preliminary price predictions.
* **Multi-Asset Analysis:** Supports analysis across **equities, indices, commodities, and forex** markets.
* **Market Visualization:** Provides visualization of historical price movements and model-generated predictions.
* **Web-Based Interface:** Built with **Next.js** to provide an interactive interface for exploring market data and predictions.

## Technology Stack

* **Frontend:** Next.js, JavaScript
* **Machine Learning:** Python, PyTorch
* **Data Processing:** OHLCV time-series data
* **Model:** Long Short-Term Memory (LSTM)

## Overview

The project follows a time-series forecasting pipeline:

1. Collect historical OHLCV market data.
2. Preprocess and normalize the time-series data.
3. Construct sequential input windows for the LSTM model.
4. Train the model on historical market observations.
5. Generate predictions based on previously observed market patterns.
6. Visualize historical data alongside model predictions.

> **Note:** Investio is an experimental/personal project intended to explore the application of recurrent neural networks to financial time-series forecasting. Predictions should not be interpreted as financial advice.
