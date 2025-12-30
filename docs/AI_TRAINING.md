# 🤖 AI Model Training Guide

## Current Implementation Status

### ⚠️ Important Note
**The current model is NOT trained** - it uses random/untrained weights. This means predictions are essentially random and not based on learned patterns.

### What's Implemented
- ✅ LSTM model architecture (SimpleLSTMModel)
- ✅ Feature engineering (price, volume, spread, returns)
- ✅ Training infrastructure (train_model.py)
- ✅ Model saving/loading
- ❌ **Model is not trained by default**

---

## How Training Works

### Architecture
- **Model Type**: LSTM (Long Short-Term Memory) Neural Network
- **Input Features**: 5 features per time step
  - Normalized price
  - Normalized volume
  - High-Low spread
  - Price change
  - Log returns
- **Input Sequence**: 100 time periods (configurable)
- **Output**: Predicted return for next period

### Training Process

1. **Data Preparation**
   - Fetch historical price data (real or synthetic)
   - Create sequences of 100 periods
   - Extract 5 features per period
   - Calculate target: future return

2. **Training Loop**
   - Forward pass: Model predicts return
   - Loss calculation: MSE (Mean Squared Error)
   - Backward pass: Update weights via backpropagation
   - Validation: Test on held-out data

3. **Model Saving**
   - Saves best model based on validation loss
   - Includes model weights, optimizer state, epoch info

---

## How to Train the Model

### Method 1: Command Line

```bash
cd backend
python train_model.py
```

This will:
- Train on AAPL data (default)
- Use 2 years of historical data
- Train for 50 epochs
- Save model to `backend/models/kimi_k2ai_aapl.pth`

### Method 2: Python Script

```python
from train_model import train_kimi_model

# Train on specific symbol
history = train_kimi_model(
    symbol="TSLA",
    epochs=100,
    batch_size=32,
    sequence_length=100,
    learning_rate=0.001
)

print(f"Best validation loss: {history['best_val_loss']}")
```

### Method 3: Custom Training

```python
from train_model import ModelTrainer, PriceDataset
from ai_model import SimpleLSTMModel
from torch.utils.data import DataLoader
import torch

# Initialize model
model = SimpleLSTMModel(input_size=5, hidden_size=64, num_layers=2)
trainer = ModelTrainer(model, learning_rate=0.001)

# Prepare your data
features, targets = trainer.prepare_training_data(candles, sequence_length=100)

# Create dataset and loader
dataset = PriceDataset(features, targets)
loader = DataLoader(dataset, batch_size=32, shuffle=True)

# Train
history = trainer.train(train_loader, val_loader, epochs=50)
```

---

## Training Parameters

### Key Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `epochs` | 50 | Number of training iterations |
| `batch_size` | 32 | Samples per batch |
| `sequence_length` | 100 | Input sequence length |
| `learning_rate` | 0.001 | Learning rate for optimizer |
| `train_split` | 0.8 | Train/validation split (80/20) |

### Model Architecture

| Layer | Size | Description |
|-------|------|-------------|
| LSTM | 64 hidden units | Main recurrent layer |
| LSTM Layers | 2 | Stacked LSTM layers |
| Dropout | 0.2 | Regularization |
| Output | 1 | Predicted return |

---

## Training Data Requirements

### Minimum Data
- **At least 110 candles** (100 for sequence + 10 for targets)
- **Recommended: 500+ candles** for good training

### Data Sources
1. **Real Data** (Preferred): Uses Yahoo Finance via `yfinance`
2. **Synthetic Data**: Falls back to generated data if real data unavailable

### Data Quality
- More data = better training
- Longer time periods = more patterns learned
- Multiple symbols = more generalizable model

---

## Model Evaluation

### Metrics
- **Train Loss**: Loss on training data (should decrease)
- **Validation Loss**: Loss on validation data (should decrease)
- **Best Model**: Saved when validation loss is lowest

### Overfitting Detection
- If train loss << validation loss → model is overfitting
- Solution: Add more dropout, reduce model complexity, get more data

---

## Loading Trained Models

The model automatically loads trained weights if available:

1. **Check for trained model on startup**
2. **Load from `backend/models/` directory**
3. **Fall back to untrained model if none found**

### Manual Loading

```python
from ai_model import ai_model

# Load specific model
ai_model.load_model("backend/models/kimi_k2ai_aapl.pth")
```

---

## Training Best Practices

### 1. Use Real Data
```python
# Train on real stock data
history = train_kimi_model(symbol="AAPL", epochs=100)
```

### 2. Train on Multiple Symbols
```python
symbols = ["AAPL", "GOOGL", "MSFT", "TSLA"]
for symbol in symbols:
    train_kimi_model(symbol=symbol, epochs=50)
```

### 3. Monitor Training
- Watch validation loss
- Stop if validation loss stops improving
- Use early stopping (not yet implemented)

### 4. Hyperparameter Tuning
- Try different learning rates: 0.0001, 0.001, 0.01
- Adjust sequence length: 50, 100, 200
- Change hidden size: 32, 64, 128

---

## Current Limitations

1. **No Training by Default**: Model starts untrained
2. **No Fine-tuning**: Can't continue training existing model
3. **No Early Stopping**: Manual epoch selection
4. **Single Symbol Training**: Train on one symbol at a time
5. **No Model Evaluation Metrics**: Only loss, no accuracy/MAE

---

## Future Improvements

- [ ] Automatic training on startup (optional)
- [ ] Multi-symbol training
- [ ] Transfer learning / fine-tuning
- [ ] Early stopping
- [ ] Model evaluation metrics (MAE, RMSE, R²)
- [ ] Hyperparameter optimization
- [ ] Real Kimi K2AI model integration

---

## Quick Start Training

```bash
# 1. Navigate to backend
cd backend

# 2. Train the model
python train_model.py

# 3. Restart backend to load trained model
python main.py
```

The trained model will be automatically loaded on next startup!

---

**Note**: Training can take 10-30 minutes depending on data size and hardware. GPU acceleration significantly speeds up training.








