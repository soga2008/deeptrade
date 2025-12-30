"""
AI Model Training Module
Trains the Kimi K2AI LSTM model on historical price data
"""

import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from datetime import datetime, timedelta
from typing import List, Tuple
import os
from ai_model import SimpleLSTMModel
from price_data import price_manager
from real_data import real_data_fetcher


class PriceDataset(Dataset):
    """Dataset for training on price sequences"""
    
    def __init__(self, features: np.ndarray, targets: np.ndarray):
        """
        Args:
            features: Input sequences (N, sequence_length, feature_size)
            targets: Target returns (N,)
        """
        self.features = torch.FloatTensor(features)
        self.targets = torch.FloatTensor(targets)
    
    def __len__(self):
        return len(self.features)
    
    def __getitem__(self, idx):
        return self.features[idx], self.targets[idx]


class ModelTrainer:
    """Train the LSTM model on historical data"""
    
    def __init__(
        self,
        model: SimpleLSTMModel,
        learning_rate: float = 0.001,
        device: str = None
    ):
        self.model = model
        self.device = device or torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model.to(self.device)
        
        # Loss function and optimizer
        self.criterion = nn.MSELoss()  # Mean Squared Error for regression
        self.optimizer = optim.Adam(self.model.parameters(), lr=learning_rate)
        self.scheduler = optim.lr_scheduler.ReduceLROnPlateau(
            self.optimizer, mode='min', factor=0.5, patience=5, verbose=True
        )
    
    def prepare_training_data(
        self,
        candles: List,
        sequence_length: int = 100,
        prediction_horizon: int = 1
    ) -> Tuple[np.ndarray, np.ndarray]:
        """
        Prepare training data from price candles
        
        Args:
            candles: List of PriceCandle objects
            sequence_length: Number of periods to use as input
            prediction_horizon: How many periods ahead to predict (default: 1)
            
        Returns:
            Tuple of (features, targets)
        """
        if len(candles) < sequence_length + prediction_horizon:
            return np.array([]), np.array([])
        
        # Extract features (same as in ai_model.py)
        features = []
        targets = []
        
        prices = [c.close for c in candles]
        
        for i in range(len(candles) - sequence_length - prediction_horizon + 1):
            # Get sequence window
            window = candles[i:i + sequence_length]
            
            # Prepare features for this window
            window_features = []
            for j, candle in enumerate(window):
                # Normalized price
                normalized_price = candle.close / prices[i] if prices[i] > 0 else 1.0
                
                # Normalized volume
                window_volumes = [c.volume for c in window]
                normalized_volume = candle.volume / max(window_volumes) if max(window_volumes) > 0 else 0.0
                
                # Spread
                spread = (candle.high - candle.low) / candle.close if candle.close > 0 else 0.0
                
                # Price change
                if j > 0:
                    price_change = (candle.close - window[j-1].close) / window[j-1].close
                else:
                    price_change = 0.0
                
                # Returns
                if j > 0:
                    returns = np.log(candle.close / window[j-1].close) if window[j-1].close > 0 else 0.0
                else:
                    returns = 0.0
                
                window_features.append([
                    normalized_price,
                    normalized_volume,
                    spread,
                    price_change,
                    returns
                ])
            
            # Target: future return
            future_candle = candles[i + sequence_length + prediction_horizon - 1]
            current_candle = candles[i + sequence_length - 1]
            target_return = np.log(future_candle.close / current_candle.close) if current_candle.close > 0 else 0.0
            
            features.append(window_features)
            targets.append(target_return)
        
        return np.array(features), np.array(targets)
    
    def train_epoch(
        self,
        dataloader: DataLoader,
        epoch: int
    ) -> float:
        """Train for one epoch"""
        self.model.train()
        total_loss = 0.0
        num_batches = 0
        
        for batch_idx, (features, targets) in enumerate(dataloader):
            features = features.to(self.device)
            targets = targets.to(self.device).unsqueeze(1)  # Add dimension for loss
            
            # Forward pass
            self.optimizer.zero_grad()
            predictions = self.model(features)
            loss = self.criterion(predictions, targets)
            
            # Backward pass
            loss.backward()
            torch.nn.utils.clip_grad_norm_(self.model.parameters(), max_norm=1.0)  # Gradient clipping
            self.optimizer.step()
            
            total_loss += loss.item()
            num_batches += 1
        
        avg_loss = total_loss / num_batches if num_batches > 0 else 0.0
        return avg_loss
    
    def validate(
        self,
        dataloader: DataLoader
    ) -> float:
        """Validate the model"""
        self.model.eval()
        total_loss = 0.0
        num_batches = 0
        
        with torch.no_grad():
            for features, targets in dataloader:
                features = features.to(self.device)
                targets = targets.to(self.device).unsqueeze(1)
                
                predictions = self.model(features)
                loss = self.criterion(predictions, targets)
                
                total_loss += loss.item()
                num_batches += 1
        
        avg_loss = total_loss / num_batches if num_batches > 0 else 0.0
        return avg_loss
    
    def train(
        self,
        train_loader: DataLoader,
        val_loader: DataLoader,
        epochs: int = 50,
        save_path: str = "backend/models/trained_model.pth"
    ) -> dict:
        """
        Train the model
        
        Args:
            train_loader: Training data loader
            val_loader: Validation data loader
            epochs: Number of training epochs
            save_path: Path to save trained model
            
        Returns:
            Training history dictionary
        """
        history = {
            'train_loss': [],
            'val_loss': [],
            'best_val_loss': float('inf'),
            'best_epoch': 0
        }
        
        print(f"Starting training on {self.device}...")
        print(f"Training samples: {len(train_loader.dataset)}")
        print(f"Validation samples: {len(val_loader.dataset)}")
        
        # Create models directory if it doesn't exist
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        
        for epoch in range(epochs):
            # Train
            train_loss = self.train_epoch(train_loader, epoch)
            
            # Validate
            val_loss = self.validate(val_loader)
            
            # Learning rate scheduling
            self.scheduler.step(val_loss)
            
            # Save history
            history['train_loss'].append(train_loss)
            history['val_loss'].append(val_loss)
            
            # Save best model
            if val_loss < history['best_val_loss']:
                history['best_val_loss'] = val_loss
                history['best_epoch'] = epoch
                torch.save({
                    'epoch': epoch,
                    'model_state_dict': self.model.state_dict(),
                    'optimizer_state_dict': self.optimizer.state_dict(),
                    'val_loss': val_loss,
                }, save_path)
                print(f"✓ Saved best model (epoch {epoch}, val_loss: {val_loss:.6f})")
            
            # Print progress
            if (epoch + 1) % 10 == 0 or epoch == 0:
                print(f"Epoch {epoch+1}/{epochs} - Train Loss: {train_loss:.6f}, Val Loss: {val_loss:.6f}")
        
        print(f"\nTraining complete!")
        print(f"Best model: Epoch {history['best_epoch']+1}, Val Loss: {history['best_val_loss']:.6f}")
        print(f"Model saved to: {save_path}")
        
        return history


def train_kimi_model(
    symbol: str = "AAPL",
    start_date: datetime = None,
    end_date: datetime = None,
    epochs: int = 50,
    batch_size: int = 32,
    sequence_length: int = 100,
    train_split: float = 0.8,
    learning_rate: float = 0.001
) -> dict:
    """
    Main training function
    
    Args:
        symbol: Stock symbol to train on
        start_date: Training start date
        end_date: Training end date
        epochs: Number of training epochs
        batch_size: Batch size
        sequence_length: Input sequence length
        train_split: Train/validation split ratio
        learning_rate: Learning rate
        
    Returns:
        Training history
    """
    # Set default dates
    if end_date is None:
        end_date = datetime.now()
    if start_date is None:
        start_date = end_date - timedelta(days=730)  # 2 years of data
    
    print(f"Fetching training data for {symbol}...")
    print(f"Date range: {start_date.date()} to {end_date.date()}")
    
    # Get historical data
    try:
        candles = real_data_fetcher.get_historical_data(
            symbol=symbol,
            start_date=start_date,
            end_date=end_date,
            interval="1d"
        )
        if not candles or len(candles) < sequence_length + 10:
            print("Not enough data, using synthetic data...")
            candles = price_manager.get_historical_data(
                symbol=symbol,
                start_date=start_date,
                end_date=end_date
            )
    except Exception as e:
        print(f"Error fetching real data: {e}, using synthetic...")
        candles = price_manager.get_historical_data(
            symbol=symbol,
            start_date=start_date,
            end_date=end_date
        )
    
    if len(candles) < sequence_length + 10:
        raise ValueError(f"Not enough data: need at least {sequence_length + 10} candles, got {len(candles)}")
    
    print(f"Loaded {len(candles)} candles")
    
    # Initialize model
    model = SimpleLSTMModel(input_size=5, hidden_size=64, num_layers=2)
    trainer = ModelTrainer(model, learning_rate=learning_rate)
    
    # Prepare data
    print("Preparing training data...")
    features, targets = trainer.prepare_training_data(candles, sequence_length)
    
    if len(features) == 0:
        raise ValueError("Could not prepare training data")
    
    print(f"Prepared {len(features)} training sequences")
    
    # Split train/validation
    split_idx = int(len(features) * train_split)
    train_features = features[:split_idx]
    train_targets = targets[:split_idx]
    val_features = features[split_idx:]
    val_targets = targets[split_idx:]
    
    # Create datasets and loaders
    train_dataset = PriceDataset(train_features, train_targets)
    val_dataset = PriceDataset(val_features, val_targets)
    
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)
    
    # Train
    history = trainer.train(
        train_loader=train_loader,
        val_loader=val_loader,
        epochs=epochs,
        save_path=f"backend/models/kimi_k2ai_{symbol.lower()}.pth"
    )
    
    return history


if __name__ == "__main__":
    # Example: Train on AAPL data
    print("=" * 60)
    print("Kimi K2AI Model Training")
    print("=" * 60)
    
    history = train_kimi_model(
        symbol="AAPL",
        epochs=50,
        batch_size=32,
        sequence_length=100
    )
    
    print("\nTraining History:")
    print(f"Final Train Loss: {history['train_loss'][-1]:.6f}")
    print(f"Final Val Loss: {history['val_loss'][-1]:.6f}")
    print(f"Best Val Loss: {history['best_val_loss']:.6f} (Epoch {history['best_epoch']+1})")








