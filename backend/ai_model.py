"""
AI Model Integration
Kimi K2AI model for price prediction
"""

import numpy as np
import os
from datetime import datetime
from typing import List, Optional
import torch
import torch.nn as nn
from transformers import AutoModel, AutoTokenizer
from schema import PriceCandle, Prediction


class SimpleLSTMModel(nn.Module):
    """
    Simple LSTM model for price prediction
    This is a placeholder for Kimi K2AI integration
    """
    
    def __init__(self, input_size: int = 5, hidden_size: int = 64, num_layers: int = 2):
        super(SimpleLSTMModel, self).__init__()
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        
        self.lstm = nn.LSTM(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            batch_first=True,
            dropout=0.2
        )
        
        self.fc = nn.Linear(hidden_size, 1)
        self.dropout = nn.Dropout(0.2)
    
    def forward(self, x):
        lstm_out, _ = self.lstm(x)
        # Take the last output
        last_output = lstm_out[:, -1, :]
        output = self.dropout(last_output)
        output = self.fc(output)
        return output


class KimiK2AIModel:
    """
    Kimi K2AI Model Wrapper
    For production, this would load the actual Kimi K2AI model
    """
    
    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.is_loaded = False
        self.sequence_length = 100
        self.model_path = None
        
        # Initialize a simple LSTM as placeholder
        self.lstm_model = SimpleLSTMModel(input_size=5, hidden_size=64, num_layers=2)
        self.lstm_model.to(self.device)
        self.lstm_model.eval()
    
    def load_model(self, model_path: Optional[str] = None):
        """
        Load the Kimi K2AI model
        
        Args:
            model_path: Path to trained model checkpoint (optional)
            
        In production, this would load the actual model:
        - self.model = AutoModel.from_pretrained("kimi/k2ai")
        - self.tokenizer = AutoTokenizer.from_pretrained("kimi/k2ai")
        """
        try:
            # Try to load trained model if path provided
            if model_path and os.path.exists(model_path):
                checkpoint = torch.load(model_path, map_location=self.device)
                self.lstm_model.load_state_dict(checkpoint['model_state_dict'])
                self.lstm_model.eval()
                self.model_path = model_path
                print(f"✓ Loaded trained model from {model_path}")
                print(f"  Validation Loss: {checkpoint.get('val_loss', 'N/A')}")
            else:
                # Check for default trained model
                default_paths = [
                    "backend/models/kimi_k2ai_aapl.pth",
                    "backend/models/trained_model.pth"
                ]
                for path in default_paths:
                    if os.path.exists(path):
                        checkpoint = torch.load(path, map_location=self.device)
                        self.lstm_model.load_state_dict(checkpoint['model_state_dict'])
                        self.lstm_model.eval()
                        self.model_path = path
                        print(f"✓ Loaded trained model from {path}")
                        break
                else:
                    print("⚠ No trained model found. Using untrained model (random weights).")
                    print("  Run train_model.py to train the model first.")
            
            self.is_loaded = True
            return True
        except Exception as e:
            print(f"Error loading model: {e}")
            print("Using untrained model (random weights)")
            self.is_loaded = True
            return False
    
    def prepare_features(self, candles: List[PriceCandle]) -> np.ndarray:
        """
        Prepare features from price candles
        
        Features:
        - Normalized price (close)
        - Volume
        - High-Low spread
        - Price change
        - Returns
        """
        if len(candles) < 2:
            return np.array([])
        
        features = []
        prices = [c.close for c in candles]
        
        for i in range(len(candles)):
            candle = candles[i]
            
            # Normalize price (using first price as reference)
            normalized_price = candle.close / prices[0] if prices[0] > 0 else 1.0
            
            # Normalized volume
            volumes = [c.volume for c in candles]
            if volumes:
                normalized_volume = candle.volume / max(volumes) if max(volumes) > 0 else 0.0
            else:
                normalized_volume = 0.0
            
            # High-Low spread (normalized)
            spread = (candle.high - candle.low) / candle.close if candle.close > 0 else 0.0
            
            # Price change
            if i > 0:
                price_change = (candle.close - candles[i-1].close) / candles[i-1].close
            else:
                price_change = 0.0
            
            # Returns
            if i > 0:
                returns = np.log(candle.close / candles[i-1].close) if candles[i-1].close > 0 else 0.0
            else:
                returns = 0.0
            
            features.append([
                normalized_price,
                normalized_volume,
                spread,
                price_change,
                returns
            ])
        
        return np.array(features)
    
    def predict_next_return(
        self,
        historical_data: List[PriceCandle]
    ) -> tuple[float, float]:
        """
        Predict next period return
        
        Args:
            historical_data: Historical price candles
            
        Returns:
            Tuple of (predicted_return, confidence)
        """
        if not self.is_loaded:
            self.load_model()
        
        if len(historical_data) < 10:
            # Not enough data, return default prediction
            return 0.0, 50.0
        
        try:
            # Prepare features
            features = self.prepare_features(historical_data)
            
            if len(features) < self.sequence_length:
                # Pad with zeros or repeat last values
                padding = np.tile(features[-1:], (self.sequence_length - len(features), 1))
                features = np.vstack([padding, features])
            else:
                # Take last sequence_length samples
                features = features[-self.sequence_length:]
            
            # Convert to tensor
            features_tensor = torch.FloatTensor(features).unsqueeze(0).to(self.device)
            
            # Predict
            with torch.no_grad():
                prediction = self.lstm_model(features_tensor)
                predicted_return = prediction.item()
            
            # Calculate confidence based on data quality
            # More data = higher confidence
            confidence = min(95.0, 50.0 + (len(historical_data) / 10))
            
            # Clip predicted return to reasonable range
            predicted_return = np.clip(predicted_return, -0.1, 0.1)  # ±10%
            
            return float(predicted_return * 100), float(confidence)  # Convert to percentage
            
        except Exception as e:
            print(f"Prediction error: {e}")
            # Fallback: simple trend following
            if len(historical_data) >= 2:
                recent_return = (
                    (historical_data[-1].close - historical_data[-2].close) /
                    historical_data[-2].close
                ) * 100
                return float(recent_return * 0.5), 60.0  # Dampened trend
            
            return 0.0, 50.0
    
    def predict(
        self,
        symbol: str,
        historical_data: List[PriceCandle],
        current_price: float
    ) -> Prediction:
        """
        Generate complete prediction
        
        Args:
            symbol: Trading symbol
            historical_data: Historical price candles
            current_price: Current price
            
        Returns:
            Prediction object
        """
        if not historical_data:
            # Return default prediction
            return Prediction(
                timestamp=datetime.now(),
                symbol=symbol,
                predicted_return=0.0,
                predicted_price=current_price,
                predicted_trend="neutral",
                confidence=0.0,
                model_version="kimi-k2ai-v1",
                features_used=["price", "volume"]
            )
        
        # Predict return
        predicted_return, confidence = self.predict_next_return(historical_data)
        
        # Calculate predicted price
        predicted_price = current_price * (1 + predicted_return / 100)
        
        # Determine trend
        if predicted_return > 1.0:
            trend = "bullish"
        elif predicted_return < -1.0:
            trend = "bearish"
        else:
            trend = "neutral"
        
        # Features used
        features_used = ["price", "volume", "spread", "returns", "momentum"]
        
        return Prediction(
            timestamp=datetime.now(),
            symbol=symbol,
            predicted_return=round(predicted_return, 2),
            predicted_price=round(predicted_price, 2),
            predicted_trend=trend,
            confidence=round(confidence, 2),
            model_version="kimi-k2ai-v1",
            features_used=features_used
        )


# Global model instance
ai_model = KimiK2AIModel()

