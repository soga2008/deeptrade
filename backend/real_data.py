"""
Real Stock Data Integration
Uses yfinance to fetch real market data for any symbol
"""

import yfinance as yf
from datetime import datetime, timedelta
from typing import List, Optional
from schema import PriceCandle


class RealDataFetcher:
    """Fetch real stock data from Yahoo Finance"""
    
    def __init__(self):
        self.cache = {}  # Simple cache to avoid repeated API calls
        self.cache_duration = timedelta(minutes=5)  # Cache for 5 minutes
    
    def get_historical_data(
        self,
        symbol: str,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        interval: str = "1d"
    ) -> List[PriceCandle]:
        """
        Fetch real historical data from Yahoo Finance
        
        Args:
            symbol: Stock symbol (e.g., 'AAPL', 'TSLA', 'BTC-USD')
            start_date: Start date
            end_date: End date
            interval: Time interval ('1m', '5m', '15m', '30m', '1h', '1d', '1wk', '1mo')
            
        Returns:
            List of PriceCandle objects
        """
        try:
            # Normalize symbol for yfinance
            # Crypto symbols need -USD suffix
            if symbol.upper() in ['BTC', 'ETH', 'BNB', 'ADA', 'SOL', 'DOT', 'DOGE']:
                symbol = f"{symbol.upper()}-USD"
            
            # Check cache
            cache_key = f"{symbol}_{start_date}_{end_date}_{interval}"
            if cache_key in self.cache:
                cached_data, cached_time = self.cache[cache_key]
                if datetime.now() - cached_time < self.cache_duration:
                    return cached_data
            
            # Set default dates if not provided
            if end_date is None:
                end_date = datetime.now()
            if start_date is None:
                start_date = end_date - timedelta(days=365)
            
            # Map our interval to yfinance interval
            interval_map = {
                "1m": "1m",
                "5m": "5m",
                "1h": "1h",
                "1d": "1d",
            }
            yf_interval = interval_map.get(interval, "1d")
            
            # Fetch data from Yahoo Finance
            ticker = yf.Ticker(symbol)
            
            # Try to fetch data
            try:
                hist = ticker.history(
                    start=start_date,
                    end=end_date,
                    interval=yf_interval
                )
            except Exception as e:
                print(f"Error fetching data for {symbol}: {e}")
                # Fallback to synthetic data
                return self._get_fallback_data(symbol, start_date, end_date, interval)
            
            if hist.empty:
                print(f"No data found for {symbol}, using fallback")
                return self._get_fallback_data(symbol, start_date, end_date, interval)
            
            # Convert to PriceCandle objects
            candles = []
            for timestamp, row in hist.iterrows():
                candle = PriceCandle(
                    timestamp=timestamp.to_pydatetime() if hasattr(timestamp, 'to_pydatetime') else timestamp,
                    open=float(row['Open']),
                    high=float(row['High']),
                    low=float(row['Low']),
                    close=float(row['Close']),
                    volume=float(row['Volume']) if 'Volume' in row else 0.0
                )
                candles.append(candle)
            
            # Cache the result
            self.cache[cache_key] = (candles, datetime.now())
            
            return candles
            
        except Exception as e:
            print(f"Error in get_historical_data for {symbol}: {e}")
            # Fallback to synthetic data
            return self._get_fallback_data(symbol, start_date, end_date, interval)
    
    def _get_fallback_data(
        self,
        symbol: str,
        start_date: datetime,
        end_date: datetime,
        interval: str
    ) -> List[PriceCandle]:
        """Fallback to synthetic data if real data unavailable"""
        from price_data import price_manager
        return price_manager.get_historical_data(symbol, start_date, end_date, interval)
    
    def get_latest_price(self, symbol: str) -> Optional[PriceCandle]:
        """Get latest price for a symbol"""
        try:
            # Normalize symbol
            if symbol.upper() in ['BTC', 'ETH', 'BNB', 'ADA', 'SOL', 'DOT', 'DOGE']:
                symbol = f"{symbol.upper()}-USD"
            
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period="1d", interval="1d")
            
            if hist.empty:
                return None
            
            latest = hist.iloc[-1]
            latest_timestamp = hist.index[-1]
            
            return PriceCandle(
                timestamp=latest_timestamp.to_pydatetime() if hasattr(latest_timestamp, 'to_pydatetime') else datetime.now(),
                open=float(latest['Open']),
                high=float(latest['High']),
                low=float(latest['Low']),
                close=float(latest['Close']),
                volume=float(latest['Volume']) if 'Volume' in latest else 0.0
            )
        except Exception as e:
            print(f"Error getting latest price for {symbol}: {e}")
            return None
    
    def search_symbol(self, query: str) -> List[dict]:
        """
        Search for symbols (basic implementation)
        In production, you'd use a proper symbol search API
        """
        # This is a simple implementation
        # For production, integrate with a symbol search API
        common_symbols = [
            'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'META', 'NVDA', 'TSLA', 'NFLX',
            'JPM', 'BAC', 'WFC', 'GS', 'WMT', 'HD', 'MCD', 'SBUX',
            'JNJ', 'PFE', 'UNH', 'XOM', 'CVX', 'BA', 'CAT'
        ]
        
        query_upper = query.upper()
        matches = [s for s in common_symbols if query_upper in s]
        
        return [{'symbol': s, 'name': s} for s in matches[:10]]


# Global instance
real_data_fetcher = RealDataFetcher()








