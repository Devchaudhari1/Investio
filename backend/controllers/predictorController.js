import { LSTMStockPredictor} from '../lstm/predictor.js';

const onnxPath = '../lstm/onnx_export/lstm_model.onnx';
const scalerConfigPath= '../lstm/onnx_export/scaler_config.json'; 
const predictor = new LSTMStockPredictor(onnxPath, scalerConfigPath);

const predict = async (requestAnimationFrame, res) => {
    
} 