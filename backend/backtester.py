"""
Backtesting Engine
Simulates trading strategies on historical data
"""

from datetime import datetime, timedelta
from typing import List, Optional
import numpy as np
from schema import PriceCandle, Trade, BacktestConfig, BacktestResult
from indicators import calculate_indicators, calculate_rsi, calculate_macd, calculate_sma
from risk import calculate_risk_metrics


class Backtester:
    """Backtesting engine for trading strategies"""
    
    def __init__(self, config: BacktestConfig):
        """
        Initialize backtester
        
        Args:
            config: Backtest configuration
        """
        self.config = config
        self.capital = config.initial_capital
        self.initial_capital = config.initial_capital
        self.position = None  # None, "long", or "short"
        self.position_size = 0.0
        self.entry_price = 0.0
        self.entry_time = None
        self.trades: List[Trade] = []
        self.equity_curve: List[float] = [config.initial_capital]
        self.commission_rate = config.commission
    
    def calculate_position_size(self, price: float) -> float:
        """Calculate position size based on available capital"""
        # Use 100% of capital (can be adjusted)
        return self.capital / price
    
    def open_position(
        self,
        price: float,
        position_type: str,
        timestamp: datetime
    ):
        """Open a new position"""
        if self.position is not None:
            return  # Already in a position
        
        self.position = position_type
        self.position_size = self.calculate_position_size(price)
        self.entry_price = price
        self.entry_time = timestamp
        
        # Deduct commission
        commission = self.capital * self.commission_rate
        self.capital -= commission
    
    def close_position(
        self,
        price: float,
        timestamp: datetime
    ) -> Optional[Trade]:
        """Close current position and record trade"""
        if self.position is None:
            return None
        
        # Calculate profit
        if self.position == "long":
            profit = (price - self.entry_price) * self.position_size
        else:  # short
            profit = (self.entry_price - price) * self.position_size
        
        # Deduct commission
        commission = self.capital * self.commission_rate
        profit -= commission
        
        # Update capital
        self.capital += profit
        
        # Calculate profit percentage
        profit_pct = (profit / (self.entry_price * self.position_size)) * 100
        
        # Create trade record
        trade = Trade(
            entry_time=self.entry_time,
            exit_time=timestamp,
            entry_price=self.entry_price,
            exit_price=price,
            position=self.position,
            quantity=self.position_size,
            profit=round(profit, 2),
            profit_pct=round(profit_pct, 2),
            commission=round(commission, 2)
        )
        
        self.trades.append(trade)
        self.equity_curve.append(self.capital)
        
        # Reset position
        self.position = None
        self.position_size = 0.0
        self.entry_price = 0.0
        self.entry_time = None
        
        return trade
    
    def update_position_value(self, current_price: float):
        """Update current portfolio value (unrealized P&L)"""
        if self.position is None:
            return self.capital
        
        # Calculate unrealized profit
        if self.position == "long":
            unrealized = (current_price - self.entry_price) * self.position_size
        else:  # short
            unrealized = (self.entry_price - current_price) * self.position_size
        
        return self.capital + unrealized
    
    def generate_signals(
        self,
        candles: List[PriceCandle],
        indicators: dict
    ) -> List[dict]:
        """
        Generate trading signals based on indicators
        
        Strategy: Momentum-based
        - Buy when RSI < 30 (oversold) and MACD crosses above signal
        - Sell when RSI > 70 (overbought) or MACD crosses below signal
        
        Args:
            candles: Price candles
            indicators: Calculated indicators
            
        Returns:
            List of signal dictionaries
        """
        signals = []
        prices = [c.close for c in candles]
        rsi = indicators.get('rsi', [])
        macd_data = indicators.get('macd', {})
        macd_line = macd_data.get('macd', [])
        signal_line = macd_data.get('signal', [])
        
        for i in range(len(candles)):
            signal = {
                'timestamp': candles[i].timestamp,
                'action': 'hold',
                'price': prices[i]
            }
            
            if i < 50:  # Need enough data for indicators
                signals.append(signal)
                continue
            
            # Check RSI
            rsi_value = rsi[i] if i < len(rsi) and not np.isnan(rsi[i]) else 50.0
            
            # Check MACD crossover
            macd_cross_up = False
            macd_cross_down = False
            
            if (i > 0 and i < len(macd_line) and i < len(signal_line) and
                not np.isnan(macd_line[i]) and not np.isnan(signal_line[i]) and
                not np.isnan(macd_line[i-1]) and not np.isnan(signal_line[i-1])):
                
                # MACD crosses above signal
                if macd_line[i-1] <= signal_line[i-1] and macd_line[i] > signal_line[i]:
                    macd_cross_up = True
                
                # MACD crosses below signal
                if macd_line[i-1] >= signal_line[i-1] and macd_line[i] < signal_line[i]:
                    macd_cross_down = True
            
            # Generate signals
            if self.position is None:
                # Look for entry
                if rsi_value < 30 and macd_cross_up:
                    signal['action'] = 'buy'
            else:
                # Look for exit
                if rsi_value > 70 or macd_cross_down:
                    signal['action'] = 'sell'
            
            signals.append(signal)
        
        return signals
    
    def run_backtest(self, candles: List[PriceCandle]) -> BacktestResult:
        """
        Run backtest on historical data
        
        Args:
            candles: Historical price candles
            
        Returns:
            BacktestResult object
        """
        if not candles:
            return self._empty_result()
        
        # Calculate indicators
        indicators = calculate_indicators(candles)
        
        # Generate signals
        signals = self.generate_signals(candles, indicators)
        
        # Execute trades
        for i, signal in enumerate(signals):
            candle = candles[i]
            current_price = candle.close
            timestamp = candle.timestamp
            
            if signal['action'] == 'buy' and self.position is None:
                self.entry_time = timestamp
                self.open_position(current_price, "long", timestamp)
            
            elif signal['action'] == 'sell' and self.position is not None:
                self.close_position(current_price, timestamp)
            
            # Update equity curve (with unrealized P&L)
            current_value = self.update_position_value(current_price)
            if i == len(self.equity_curve) - 1:
                self.equity_curve[-1] = current_value
            else:
                self.equity_curve.append(current_value)
        
        # Close any open position at the end
        if self.position is not None:
            final_price = candles[-1].close
            self.close_position(final_price, candles[-1].timestamp)
        
        # Calculate metrics
        return self._calculate_results()
    
    def _calculate_results(self) -> BacktestResult:
        """Calculate backtest results and metrics"""
        if not self.trades:
            return self._empty_result()
        
        # Calculate returns
        total_return = ((self.capital - self.initial_capital) / self.initial_capital) * 100
        
        # Win rate
        winning_trades = [t for t in self.trades if t.profit > 0]
        win_rate = (len(winning_trades) / len(self.trades)) * 100 if self.trades else 0.0
        
        # Profit factor
        total_profit = sum(t.profit for t in self.trades if t.profit > 0)
        total_loss = abs(sum(t.profit for t in self.trades if t.profit < 0))
        profit_factor = total_profit / total_loss if total_loss > 0 else float('inf')
        
        # Average trade duration
        durations = [
            (t.exit_time - t.entry_time).total_seconds() / 3600
            for t in self.trades
        ]
        avg_duration = np.mean(durations) if durations else 0.0
        
        # Risk metrics
        risk_metrics = calculate_risk_metrics(self.equity_curve, self.trades)
        
        return BacktestResult(
            config=self.config,
            equity_curve=[round(v, 2) for v in self.equity_curve],
            trades=self.trades,
            sharpe_ratio=risk_metrics.sharpe_ratio,
            max_drawdown=risk_metrics.max_drawdown,
            total_return=round(total_return, 2),
            win_rate=round(win_rate, 2),
            profit_factor=round(profit_factor, 2),
            total_trades=len(self.trades),
            avg_trade_duration=round(avg_duration, 2),
            final_capital=round(self.capital, 2)
        )
    
    def _empty_result(self) -> BacktestResult:
        """Return empty result when no trades"""
        return BacktestResult(
            config=self.config,
            equity_curve=[self.initial_capital],
            trades=[],
            sharpe_ratio=0.0,
            max_drawdown=0.0,
            total_return=0.0,
            win_rate=0.0,
            profit_factor=0.0,
            total_trades=0,
            avg_trade_duration=0.0,
            final_capital=self.initial_capital
        )

