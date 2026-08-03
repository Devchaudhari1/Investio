from __future__ import annotations

import argparse
import copy
import os
import random

import numpy as np
import pandas as pd
import torch
import torch.nn as nn
import yfinance as yf
from sklearn.metrics import mean_absolute_error, mean_squared_error
from sklearn.preprocessing import MinMaxScaler
from torch.utils.data import DataLoader, Dataset

FEATURES = ["Open", "High", "Low", "Close", "Volume"]
TARGET = "Close"


def set_seed(seed: int = 42) -> None:
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)

def fetch_ohlcv(ticker: str, start: str, end: str | None) -> pd.DataFrame:
    """Download OHLCV data from Yahoo Finance.

    auto_adjust=False (raw prices) is used deliberately: it matches what
    lightweight Node.js data sources (e.g. yahoo-finance2) return by default.
    If training used adjusted prices but serving used raw prices (or vice
    versa), the model would see a distribution shift in production.
    """
    df = yf.download(ticker, start=start, end=end, auto_adjust=False, progress=False)
    if df.empty:
        raise ValueError(
            f"No data returned for ticker '{ticker}'. Check the symbol and date range."
        )
    # yfinance sometimes returns MultiIndex columns for a single ticker
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)
    df = df[FEATURES].dropna()
    df.index.name = "Date"
    return df


def make_sequences(
    data: np.ndarray, lookback: int, target_col_idx: int
) -> tuple[np.ndarray, np.ndarray]:
    """
    Turn a (n_samples, n_features) array into sliding-window sequences.
    X[i] = data[i : i+lookback, :]   -> all features over `lookback` days
    y[i] = data[i+lookback, target]  -> next day's close (scaled)
    """
    X, y = [], []
    for i in range(len(data) - lookback):
        X.append(data[i : i + lookback, :])
        y.append(data[i + lookback, target_col_idx])
    return np.array(X), np.array(y)


class SequenceDataset(Dataset):
    def __init__(self, X: np.ndarray, y: np.ndarray):
        self.X = torch.tensor(X, dtype=torch.float32)
        self.y = torch.tensor(y, dtype=torch.float32).unsqueeze(-1)

    def __len__(self):
        return len(self.X)

    def __getitem__(self, idx):
        return self.X[idx], self.y[idx]


class LSTMRegressor(nn.Module):
    def __init__(
        self,
        n_features: int,
        hidden_size: int = 64,
        num_layers: int = 2,
        dropout: float = 0.2,
    ):
        super().__init__()
        self.lstm = nn.LSTM(
            input_size=n_features,
            hidden_size=hidden_size,
            num_layers=num_layers,
            batch_first=True,
            dropout=dropout if num_layers > 1 else 0.0,
        )
        self.head = nn.Sequential(
            nn.Linear(hidden_size, hidden_size // 2),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(hidden_size // 2, 1),
        )

    def forward(self, x):
        # x: (batch, seq_len, n_features)
        out, _ = self.lstm(x)
        last_step = out[:, -1, :]  # final time-step hidden state
        return self.head(last_step)


def train_model(
    model: nn.Module,
    train_loader: DataLoader,
    val_loader: DataLoader,
    epochs: int,
    lr: float,
    device: torch.device,
    patience: int = 15,
):
    criterion = nn.MSELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=lr)
    scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(
        optimizer, mode="min", factor=0.5, patience=5
    )

    best_val_loss = float("inf")
    best_state = None
    epochs_no_improve = 0
    history = {"train_loss": [], "val_loss": []}

    for epoch in range(1, epochs + 1):
        model.train()
        train_losses = []
        for xb, yb in train_loader:
            xb, yb = xb.to(device), yb.to(device)
            optimizer.zero_grad()
            pred = model(xb)
            loss = criterion(pred, yb)
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=5.0)
            optimizer.step()
            train_losses.append(loss.item())

        model.eval()
        val_losses = []
        with torch.no_grad():
            for xb, yb in val_loader:
                xb, yb = xb.to(device), yb.to(device)
                pred = model(xb)
                val_losses.append(criterion(pred, yb).item())

        train_loss = float(np.mean(train_losses))
        val_loss = float(np.mean(val_losses))
        history["train_loss"].append(train_loss)
        history["val_loss"].append(val_loss)
        scheduler.step(val_loss)

        if val_loss < best_val_loss - 1e-6:
            best_val_loss = val_loss
            best_state = copy.deepcopy(model.state_dict())
            epochs_no_improve = 0
        else:
            epochs_no_improve += 1

        if epoch == 1 or epoch % 5 == 0 or epoch == epochs:
            print(
                f"Epoch {epoch:3d}/{epochs} | train_loss {train_loss:.6f} "
                f"| val_loss {val_loss:.6f} | best_val {best_val_loss:.6f}"
            )

        if epochs_no_improve >= patience:
            print(f"Early stopping at epoch {epoch} (no improvement for {patience} epochs).")
            break

    if best_state is not None:
        model.load_state_dict(best_state)
    return model, history

def evaluate(
    model: nn.Module,
    loader: DataLoader,
    device: torch.device,
    scaler: MinMaxScaler,
    target_idx: int,
    n_features: int,
):
    model.eval()
    preds, actuals = [], []
    with torch.no_grad():
        for xb, yb in loader:
            xb = xb.to(device)
            pred = model(xb).cpu().numpy().flatten()
            preds.append(pred)
            actuals.append(yb.numpy().flatten())
    preds = np.concatenate(preds)
    actuals = np.concatenate(actuals)

    preds_real = inverse_transform_target(preds, scaler, target_idx, n_features)
    actuals_real = inverse_transform_target(actuals, scaler, target_idx, n_features)

    rmse = float(np.sqrt(mean_squared_error(actuals_real, preds_real)))
    mae = float(mean_absolute_error(actuals_real, preds_real))
    mape = float(np.mean(np.abs((actuals_real - preds_real) / actuals_real)) * 100)

    return preds_real, actuals_real, {"RMSE": rmse, "MAE": mae, "MAPE_%": mape}


def inverse_transform_target(
    scaled_values: np.ndarray, scaler: MinMaxScaler, target_idx: int, n_features: int
) -> np.ndarray:
    """Undo MinMax scaling for a single (target) column."""
    dummy = np.zeros((len(scaled_values), n_features))
    dummy[:, target_idx] = scaled_values
    return scaler.inverse_transform(dummy)[:, target_idx]

def predict_next_day(
    model: nn.Module,
    last_window_scaled: np.ndarray,
    scaler: MinMaxScaler,
    target_idx: int,
    n_features: int,
    device: torch.device,
) -> float:
    model.eval()
    x = torch.tensor(last_window_scaled, dtype=torch.float32).unsqueeze(0).to(device)
    with torch.no_grad():
        pred_scaled = model(x).cpu().numpy().flatten()
    return float(inverse_transform_target(pred_scaled, scaler, target_idx, n_features)[0])


def main():
    parser = argparse.ArgumentParser(description="LSTM next-day closing price predictor")
    parser.add_argument("--ticker", type=str, default="AAPL", help="Stock ticker symbol")
    parser.add_argument("--start", type=str, default="2012-01-01", help="History start date")
    parser.add_argument("--end", type=str, default=None, help="History end date (default: today)")
    parser.add_argument("--lookback", type=int, default=60, help="Days of history per sample")
    parser.add_argument("--hidden_size", type=int, default=64, help="LSTM hidden size")
    parser.add_argument("--num_layers", type=int, default=2, help="Number of stacked LSTM layers")
    parser.add_argument("--dropout", type=float, default=0.2, help="Dropout rate")
    parser.add_argument("--epochs", type=int, default=100, help="Max training epochs")
    parser.add_argument("--batch_size", type=int, default=32, help="Batch size")
    parser.add_argument("--lr", type=float, default=1e-3, help="Learning rate")
    parser.add_argument("--patience", type=int, default=15, help="Early stopping patience")
    parser.add_argument("--train_frac", type=float, default=0.7, help="Fraction of data for training")
    parser.add_argument("--val_frac", type=float, default=0.15, help="Fraction of data for validation")
    parser.add_argument("--out_dir", type=str, default=".", help="Where to save outputs")
    parser.add_argument("--seed", type=int, default=42)
    args = parser.parse_args()

    set_seed(args.seed)
    os.makedirs(args.out_dir, exist_ok=True)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")
    #Fetching data
    print(f"Downloading {args.ticker} OHLCV data from {args.start} to {args.end or 'today'}...")
    df = fetch_ohlcv(args.ticker, args.start, args.end)
    print(f"Downloaded {len(df)} rows. Columns: {list(df.columns)}")
    target_idx = FEATURES.index(TARGET)
    # Preprocessing data
    n = len(df)
    n_train = int(n * args.train_frac)
    n_val = int(n * args.val_frac)

    train_df = df.iloc[:n_train]
    val_df = df.iloc[n_train - args.lookback : n_train + n_val]  # overlap for windowing
    test_df = df.iloc[n_train + n_val - args.lookback :]

    scaler = MinMaxScaler(feature_range=(0, 1))
    scaler.fit(train_df.values)  # fit ONLY on training data

    train_scaled = scaler.transform(train_df.values)
    val_scaled = scaler.transform(val_df.values)
    test_scaled = scaler.transform(test_df.values)

    X_train, y_train = make_sequences(train_scaled, args.lookback, target_idx)
    X_val, y_val = make_sequences(val_scaled, args.lookback, target_idx)
    X_test, y_test = make_sequences(test_scaled, args.lookback, target_idx)

    print(
        f"Sequences -> train: {len(X_train)}, val: {len(X_val)}, test: {len(X_test)} "
        f"(lookback={args.lookback})"
    )

    train_loader = DataLoader(SequenceDataset(X_train, y_train), batch_size=args.batch_size, shuffle=True)
    val_loader = DataLoader(SequenceDataset(X_val, y_val), batch_size=args.batch_size, shuffle=False)
    test_loader = DataLoader(SequenceDataset(X_test, y_test), batch_size=args.batch_size, shuffle=False)

    # training model
    model = LSTMRegressor(
        n_features=len(FEATURES),
        hidden_size=args.hidden_size,
        num_layers=args.num_layers,
        dropout=args.dropout,
    ).to(device)
    print(model)

    model, history = train_model(
        model, train_loader, val_loader, args.epochs, args.lr, device, args.patience
    )

    ckpt_path = os.path.join(args.out_dir, "best_model.pt")
    torch.save(
        {
            "model_state_dict": model.state_dict(),
            "scaler_min": scaler.min_,
            "scaler_scale": scaler.scale_,
            "features": FEATURES,
            "lookback": args.lookback,
            "hidden_size": args.hidden_size,
            "num_layers": args.num_layers,
            "dropout": args.dropout,
        },
        ckpt_path,
    )
    print(f"Saved best model to {ckpt_path}")

    # Testig model
    preds, actuals, metrics = evaluate(
        model, test_loader, device, scaler, target_idx, len(FEATURES)
    )
    print("\nTest set performance:")
    for k, v in metrics.items():
        print(f"  {k}: {v:.4f}")

    # Generating plots
    try:
        import matplotlib.pyplot as plt

        plt.figure(figsize=(11, 5))
        plt.plot(actuals, label="Actual Close")
        plt.plot(preds, label="Predicted Close")
        plt.title(f"{args.ticker} — Actual vs Predicted Next-Day Close (Test Set)")
        plt.xlabel("Test sample index (chronological)")
        plt.ylabel("Price")
        plt.legend()
        plt.tight_layout()
        plt.savefig(os.path.join(args.out_dir, "actual_vs_predicted.png"), dpi=150)
        plt.close()

        plt.figure(figsize=(8, 4))
        plt.plot(history["train_loss"], label="Train Loss")
        plt.plot(history["val_loss"], label="Val Loss")
        plt.title("Training / Validation Loss (MSE, scaled space)")
        plt.xlabel("Epoch")
        plt.ylabel("MSE")
        plt.legend()
        plt.tight_layout()
        plt.savefig(os.path.join(args.out_dir, "training_loss.png"), dpi=150)
        plt.close()
        print("Saved plots: actual_vs_predicted.png, training_loss.png")
    except Exception as e:
        print(f"Plotting skipped ({e})")

    # Predicting next day closing price
    
    last_window_scaled = scaler.transform(df.values[-args.lookback :])
    next_close = predict_next_day(
        model, last_window_scaled, scaler, target_idx, len(FEATURES), device
    )
    last_actual_close = df[TARGET].iloc[-1]
    last_date = df.index[-1].date()
    print(f"\nLast known close ({last_date}): {last_actual_close:.2f}")
    print(f"Predicted next-day close: {next_close:.2f}")
    change = next_close - last_actual_close
    pct = change / last_actual_close * 100
    print(f"Predicted change: {change:+.2f} ({pct:+.2f}%)")


if __name__ == "__main__":
    main()
