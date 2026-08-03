"""
Export a trained LSTM model (best_model.pt) to ONNX for serving from Node.js.

Produces:
    onnx_export/lstm_model.onnx     - the model, ONNX format
    onnx_export/scaler_config.json  - MinMaxScaler params + feature/lookback
                                       metadata needed to preprocess inputs
                                       and un-scale predictions in JS

Usage
-----
    python export_to_onnx.py --checkpoint best_model.pt --out_dir ./onnx_export

Requires the same environment used for training (torch), plus `onnx`.
onnxruntime is optional but recommended so this script can self-verify
the export (`pip install onnxruntime`).
"""

import argparse
import json
import os

import torch

from lstm_stock_predictor import LSTMRegressor, TARGET


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--checkpoint", type=str, default="best_model.pt")
    parser.add_argument("--out_dir", type=str, default="./onnx_export")
    parser.add_argument("--opset", type=int, default=17)
    args = parser.parse_args()

    os.makedirs(args.out_dir, exist_ok=True)
    try:
        ckpt = torch.load(args.checkpoint, map_location="cpu", weights_only=False)
    except TypeError:
       # Older torch versions don't accept weights_only
        ckpt = torch.load(args.checkpoint, map_location="cpu")
# ...existing code...

    features = ckpt["features"]
    lookback = ckpt["lookback"]

    model = LSTMRegressor(
        n_features=len(features),
        hidden_size=ckpt["hidden_size"],
        num_layers=ckpt["num_layers"],
        dropout=ckpt["dropout"],
    )
    model.load_state_dict(ckpt["model_state_dict"])
    model.eval()

    dummy_input = torch.randn(1, lookback, len(features), dtype=torch.float32)

    onnx_path = os.path.join(args.out_dir, "lstm_model.onnx")
    torch.onnx.export(
        model,
        dummy_input,
        onnx_path,
        input_names=["input"],
        output_names=["output"],
        dynamic_axes={"input": {0: "batch"}, "output": {0: "batch"}},
        opset_version=args.opset,
        do_constant_folding=True,
    )
    print(f"Saved ONNX model to {onnx_path}")

    scaler_config = {
        "features": features,               # e.g. ["Open","High","Low","Close","Volume"]
        "target": TARGET,                   # "Close"
        "target_index": features.index(TARGET),
        "lookback": lookback,
        # sklearn MinMaxScaler: X_scaled = X * scale_ + min_
        "scaler_min": ckpt["scaler_min"].tolist(),
        "scaler_scale": ckpt["scaler_scale"].tolist(),
    }
    config_path = os.path.join(args.out_dir, "scaler_config.json")
    with open(config_path, "w") as f:
        json.dump(scaler_config, f, indent=2)
    print(f"Saved scaler config to {config_path}")

    # Optional self-check: confirm ONNX output matches PyTorch output
    try:
        import numpy as np
        import onnxruntime as ort

        sess = ort.InferenceSession(onnx_path, providers=["CPUExecutionProvider"])
        onnx_out = sess.run(None, {"input": dummy_input.numpy()})[0]
        with torch.no_grad():
            torch_out = model(dummy_input).numpy()
        max_diff = float(np.abs(onnx_out - torch_out).max())
        print(f"Sanity check max |ONNX - PyTorch| diff: {max_diff:.8f} (should be ~0)")
    except ImportError:
        print(
            "onnxruntime not installed locally — skipping sanity check. "
            "This only affects verification here, not Node.js serving."
        )


if __name__ == "__main__":
    main()
