"""
Technical Indicators
Implementation of common trading indicators
"""

import numpy as np
from typing import List
from schema import PriceCandle


def calculate_sma(prices: List[float], period: int) -> List[float]:
    """
    Simple Moving Average
    
    Formula: SMA = (P1 + P2 + ... + Pn) / n
    where P is price and n is period
    
    Args:
        prices: List of closing prices
        period: Number of periods
        
    Returns:
        List of SMA values (NaN for first period-1 values)
    """
    if len(prices) < period:
        return [np.nan] * len(prices)
    
    sma = []
    for i in range(len(prices)):
        if i < period - 1:
            sma.append(np.nan)
        else:
            window = prices[i - period + 1:i + 1]
            sma.append(np.mean(window))
    
    return sma


def calculate_ema(prices: List[float], period: int) -> List[float]:
    """
    Exponential Moving Average
    
    Formula: EMA = (Price - EMA_prev) * (2 / (n + 1)) + EMA_prev
    where n is period
    
    Args:
        prices: List of closing prices
        period: Number of periods
        
    Returns:
        List of EMA values
    """
    if len(prices) < period:
        return [np.nan] * len(prices)
    
    ema = []
    multiplier = 2 / (period + 1)
    
    # First EMA is SMA
    first_sma = np.mean(prices[:period])
    ema.extend([np.nan] * (period - 1))
    ema.append(first_sma)
    
    # Calculate subsequent EMAs
    for i in range(period, len(prices)):
        ema_value = (prices[i] - ema[-1]) * multiplier + ema[-1]
        ema.append(ema_value)
    
    return ema


def calculate_rsi(prices: List[float], period: int = 14) -> List[float]:
    """
    Relative Strength Index
    
    Formula:
        RS = Average Gain / Average Loss
        RSI = 100 - (100 / (1 + RS))
    
    Args:
        prices: List of closing prices
        period: Number of periods (default 14)
        
    Returns:
        List of RSI values (0-100)
    """
    if len(prices) < period + 1:
        return [np.nan] * len(prices)
    
    rsi = [np.nan] * period
    
    # Calculate price changes
    deltas = [prices[i] - prices[i-1] for i in range(1, len(prices))]
    
    # Initial average gain and loss
    gains = [d if d > 0 else 0 for d in deltas[:period]]
    losses = [-d if d < 0 else 0 for d in deltas[:period]]
    
    avg_gain = np.mean(gains)
    avg_loss = np.mean(losses)
    
    # Calculate first RSI
    if avg_loss == 0:
        rsi.append(100.0)
    else:
        rs = avg_gain / avg_loss
        rsi.append(100 - (100 / (1 + rs)))
    
    # Calculate subsequent RSIs using Wilder's smoothing
    for i in range(period, len(deltas)):
        gain = deltas[i] if deltas[i] > 0 else 0
        loss = -deltas[i] if deltas[i] < 0 else 0
        
        # Wilder's smoothing: new_avg = (old_avg * (n-1) + new_value) / n
        avg_gain = (avg_gain * (period - 1) + gain) / period
        avg_loss = (avg_loss * (period - 1) + loss) / period
        
        if avg_loss == 0:
            rsi.append(100.0)
        else:
            rs = avg_gain / avg_loss
            rsi.append(100 - (100 / (1 + rs)))
    
    return rsi


def calculate_macd(
    prices: List[float],
    fast_period: int = 12,
    slow_period: int = 26,
    signal_period: int = 9
) -> dict:
    """
    Moving Average Convergence Divergence
    
    Formula:
        MACD Line = EMA(fast) - EMA(slow)
        Signal Line = EMA(MACD Line)
        Histogram = MACD Line - Signal Line
    
    Args:
        prices: List of closing prices
        fast_period: Fast EMA period (default 12)
        slow_period: Slow EMA period (default 26)
        signal_period: Signal line period (default 9)
        
    Returns:
        Dictionary with 'macd', 'signal', and 'histogram' lists
    """
    if len(prices) < slow_period + signal_period:
        nan_list = [np.nan] * len(prices)
        return {
            'macd': nan_list,
            'signal': nan_list,
            'histogram': nan_list
        }
    
    # Calculate EMAs
    fast_ema = calculate_ema(prices, fast_period)
    slow_ema = calculate_ema(prices, slow_period)
    
    # MACD line
    macd_line = [
        fast_ema[i] - slow_ema[i] if not (np.isnan(fast_ema[i]) or np.isnan(slow_ema[i]))
        else np.nan
        for i in range(len(prices))
    ]
    
    # Signal line (EMA of MACD line)
    # Filter out NaN values for signal calculation
    macd_values = [v for v in macd_line if not np.isnan(v)]
    if len(macd_values) < signal_period:
        signal_line = [np.nan] * len(prices)
    else:
        signal_line = calculate_ema(macd_values, signal_period)
        # Pad with NaN to match original length
        nan_count = len(prices) - len(signal_line)
        signal_line = [np.nan] * nan_count + signal_line
    
    # Histogram
    histogram = [
        macd_line[i] - signal_line[i] if not (np.isnan(macd_line[i]) or np.isnan(signal_line[i]))
        else np.nan
        for i in range(len(prices))
    ]
    
    return {
        'macd': macd_line,
        'signal': signal_line,
        'histogram': histogram
    }


def calculate_bollinger_bands(
    prices: List[float],
    period: int = 20,
    num_std: float = 2.0
) -> dict:
    """
    Bollinger Bands
    
    Formula:
        Middle Band = SMA(period)
        Upper Band = Middle + (std * num_std)
        Lower Band = Middle - (std * num_std)
    
    Args:
        prices: List of closing prices
        period: Number of periods (default 20)
        num_std: Number of standard deviations (default 2.0)
        
    Returns:
        Dictionary with 'upper', 'middle', 'lower' bands
    """
    sma = calculate_sma(prices, period)
    
    upper = []
    lower = []
    
    for i in range(len(prices)):
        if np.isnan(sma[i]):
            upper.append(np.nan)
            lower.append(np.nan)
        else:
            window = prices[max(0, i - period + 1):i + 1]
            std = np.std(window)
            upper.append(sma[i] + (std * num_std))
            lower.append(sma[i] - (std * num_std))
    
    return {
        'upper': upper,
        'middle': sma,
        'lower': lower
    }


def calculate_atr(
    candles: List[PriceCandle],
    period: int = 14
) -> List[float]:
    """
    Average True Range
    
    Formula:
        TR = max(high - low, abs(high - prev_close), abs(low - prev_close))
        ATR = SMA(TR, period)
    
    Args:
        candles: List of PriceCandle objects
        period: Number of periods (default 14)
        
    Returns:
        List of ATR values
    """
    if len(candles) < period + 1:
        return [np.nan] * len(candles)
    
    true_ranges = []
    
    for i in range(1, len(candles)):
        high = candles[i].high
        low = candles[i].low
        prev_close = candles[i-1].close
        
        tr = max(
            high - low,
            abs(high - prev_close),
            abs(low - prev_close)
        )
        true_ranges.append(tr)
    
    # Calculate ATR as SMA of TR
    atr = [np.nan] * period
    for i in range(period, len(true_ranges) + 1):
        window = true_ranges[i - period:i]
        atr.append(np.mean(window))
    
    # Pad beginning
    atr = [np.nan] + atr
    
    return atr


def calculate_indicators(candles: List[PriceCandle]) -> dict:
    """
    Calculate all indicators for a series of candles
    
    Args:
        candles: List of PriceCandle objects
        
    Returns:
        Dictionary with all indicator values
    """
    if not candles:
        return {}
    
    prices = [c.close for c in candles]
    
    return {
        'sma_20': calculate_sma(prices, 20),
        'sma_50': calculate_sma(prices, 50),
        'ema_12': calculate_ema(prices, 12),
        'ema_26': calculate_ema(prices, 26),
        'rsi': calculate_rsi(prices, 14),
        'macd': calculate_macd(prices),
        'bollinger': calculate_bollinger_bands(prices, 20, 2.0),
        'atr': calculate_atr(candles, 14)
    }

