"""
Market Data Handler
Generates and manages price data (OHLCV candles)
"""

import random
from datetime import datetime, timedelta
from typing import List, Optional
import numpy as np
from schema import PriceCandle


class PriceDataGenerator:
    """Generate synthetic price data for testing"""
    
    def __init__(self, initial_price: float = 100.0, volatility: float = 0.02):
        """
        Initialize price data generator
        
        Args:
            initial_price: Starting price
            volatility: Daily volatility (2% default)
        """
        self.initial_price = initial_price
        self.volatility = volatility
        self.current_price = initial_price
    
    def generate_candle(
        self, 
        timestamp: datetime, 
        previous_close: Optional[float] = None
    ) -> PriceCandle:
        """
        Generate a single OHLCV candle using Geometric Brownian Motion
        
        Args:
            timestamp: Candle timestamp
            previous_close: Previous candle's close price
            
        Returns:
            PriceCandle object
        """
        if previous_close is None:
            previous_close = self.current_price
        
        # Geometric Brownian Motion: dS = S * (mu * dt + sigma * dW)
        # Simplified: use random walk with drift
        mu = 0.0001  # Small positive drift
        dt = 1.0  # One time step
        sigma = self.volatility
        
        # Random shock
        dW = np.random.normal(0, 1)
        change = mu * dt + sigma * dW
        
        # Calculate prices
        open_price = previous_close
        close_price = open_price * (1 + change)
        
        # High and low with some randomness
        high_factor = abs(np.random.normal(0, 0.005))
        low_factor = abs(np.random.normal(0, 0.005))
        
        high_price = max(open_price, close_price) * (1 + high_factor)
        low_price = min(open_price, close_price) * (1 - low_factor)
        
        # Ensure high >= max(open, close) and low <= min(open, close)
        high_price = max(high_price, open_price, close_price)
        low_price = min(low_price, open_price, close_price)
        
        # Volume (random with some correlation to price movement)
        volume_base = 1000000
        volume_multiplier = 1 + abs(change) * 5
        volume = volume_base * volume_multiplier * abs(np.random.normal(1, 0.3))
        volume = max(volume, 10000)  # Minimum volume
        
        self.current_price = close_price
        
        return PriceCandle(
            timestamp=timestamp,
            open=round(open_price, 2),
            high=round(high_price, 2),
            low=round(low_price, 2),
            close=round(close_price, 2),
            volume=round(volume, 2)
        )
    
    def generate_series(
        self,
        start_date: datetime,
        end_date: datetime,
        interval: str = "1d"
    ) -> List[PriceCandle]:
        """
        Generate a series of candles
        
        Args:
            start_date: Start date
            end_date: End date
            interval: Time interval ("1m", "5m", "1h", "1d")
            
        Returns:
            List of PriceCandle objects
        """
        candles = []
        current_date = start_date
        
        # Parse interval
        interval_map = {
            "1m": timedelta(minutes=1),
            "5m": timedelta(minutes=5),
            "1h": timedelta(hours=1),
            "1d": timedelta(days=1)
        }
        delta = interval_map.get(interval, timedelta(days=1))
        
        previous_close = self.initial_price
        
        while current_date <= end_date:
            candle = self.generate_candle(current_date, previous_close)
            candles.append(candle)
            previous_close = candle.close
            current_date += delta
        
        return candles


class PriceDataManager:
    """Manage price data operations"""
    
    def __init__(self):
        self.generators = {}  # Cache generators per symbol
    
    def get_generator(self, symbol: str) -> PriceDataGenerator:
        """Get or create generator for symbol"""
        if symbol not in self.generators:
            # Different initial prices for different symbols
            initial_prices = {
                "AAPL": 150.0,
                "GOOGL": 2500.0,
                "MSFT": 350.0,
                "TSLA": 200.0,
                "BTC": 45000.0,
            }
            initial_price = initial_prices.get(symbol, 100.0)
            self.generators[symbol] = PriceDataGenerator(
                initial_price=initial_price,
                volatility=0.02
            )
        return self.generators[symbol]
    
    def get_historical_data(
        self,
        symbol: str,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        interval: str = "1d"
    ) -> List[PriceCandle]:
        """
        Get historical price data
        
        Args:
            symbol: Trading symbol
            start_date: Start date (default: 1 year ago)
            end_date: End date (default: now)
            interval: Time interval
            
        Returns:
            List of PriceCandle objects
        """
        if end_date is None:
            end_date = datetime.now()
        if start_date is None:
            start_date = end_date - timedelta(days=365)
        
        generator = self.get_generator(symbol)
        return generator.generate_series(start_date, end_date, interval)
    
    def get_latest_price(self, symbol: str) -> float:
        """Get latest price for symbol"""
        generator = self.get_generator(symbol)
        return generator.current_price
    
    def get_price_at_time(
        self,
        symbol: str,
        timestamp: datetime
    ) -> Optional[PriceCandle]:
        """Get price candle at specific time"""
        data = self.get_historical_data(
            symbol,
            start_date=timestamp - timedelta(days=1),
            end_date=timestamp + timedelta(days=1),
            interval="1d"
        )
        
        # Find closest candle
        if not data:
            return None
        
        closest = min(data, key=lambda x: abs((x.timestamp - timestamp).total_seconds()))
        return closest


# Global instance
price_manager = PriceDataManager()

