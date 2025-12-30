"""
Database Schema Definitions
Pydantic models for data validation and serialization
"""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


# ============================================================================
# Market Data Models
# ============================================================================

class PriceCandle(BaseModel):
    """OHLCV candle data"""
    timestamp: datetime
    open: float = Field(..., gt=0, description="Opening price")
    high: float = Field(..., gt=0, description="Highest price")
    low: float = Field(..., gt=0, description="Lowest price")
    close: float = Field(..., gt=0, description="Closing price")
    volume: float = Field(..., ge=0, description="Trading volume")
    
    class Config:
        json_schema_extra = {
            "example": {
                "timestamp": "2024-01-15T10:30:00",
                "open": 100.50,
                "high": 102.30,
                "low": 99.80,
                "close": 101.20,
                "volume": 1500000.0
            }
        }


class MarketDataRequest(BaseModel):
    """Request for market data"""
    symbol: str = Field(..., min_length=1, description="Trading symbol (e.g., 'AAPL')")
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    interval: str = Field(default="1d", description="Time interval (1m, 5m, 1h, 1d)")


# ============================================================================
# Trade Models
# ============================================================================

class Trade(BaseModel):
    """Individual trade record"""
    entry_time: datetime
    exit_time: datetime
    entry_price: float = Field(..., gt=0, description="Entry price")
    exit_price: float = Field(..., gt=0, description="Exit price")
    position: str = Field(..., pattern="^(long|short)$", description="Position type")
    quantity: float = Field(..., gt=0, description="Number of shares/units")
    profit: float = Field(..., description="Profit or loss")
    profit_pct: float = Field(..., description="Profit percentage")
    commission: float = Field(default=0.0, ge=0, description="Trading commission")
    
    class Config:
        json_schema_extra = {
            "example": {
                "entry_time": "2024-01-15T10:00:00",
                "exit_time": "2024-01-15T14:30:00",
                "entry_price": 100.00,
                "exit_price": 105.50,
                "position": "long",
                "quantity": 100.0,
                "profit": 550.0,
                "profit_pct": 5.5,
                "commission": 1.0
            }
        }


# ============================================================================
# Backtest Models
# ============================================================================

class BacktestConfig(BaseModel):
    """Backtest configuration"""
    symbol: str = Field(..., description="Trading symbol")
    start_date: datetime = Field(..., description="Backtest start date")
    end_date: datetime = Field(..., description="Backtest end date")
    initial_capital: float = Field(default=100000.0, gt=0, description="Starting capital")
    commission: float = Field(default=0.001, ge=0, description="Commission rate (0.1% default)")
    strategy: str = Field(default="momentum", description="Trading strategy")
    indicators: List[str] = Field(default_factory=list, description="Technical indicators to use")


class BacktestResult(BaseModel):
    """Complete backtest results"""
    config: BacktestConfig
    equity_curve: List[float] = Field(..., description="Portfolio value over time")
    trades: List[Trade] = Field(..., description="All executed trades")
    sharpe_ratio: float = Field(..., description="Sharpe ratio")
    max_drawdown: float = Field(..., ge=0, le=100, description="Maximum drawdown percentage")
    total_return: float = Field(..., description="Total return percentage")
    win_rate: float = Field(..., ge=0, le=100, description="Win rate percentage")
    profit_factor: float = Field(..., ge=0, description="Profit factor")
    total_trades: int = Field(..., ge=0, description="Total number of trades")
    avg_trade_duration: float = Field(..., ge=0, description="Average trade duration in hours")
    final_capital: float = Field(..., gt=0, description="Final portfolio value")
    
    class Config:
        json_schema_extra = {
            "example": {
                "config": {
                    "symbol": "AAPL",
                    "start_date": "2024-01-01T00:00:00",
                    "end_date": "2024-12-31T23:59:59",
                    "initial_capital": 100000.0,
                    "commission": 0.001,
                    "strategy": "momentum",
                    "indicators": ["SMA", "RSI"]
                },
                "equity_curve": [100000.0, 101200.0, 102500.0],
                "trades": [],
                "sharpe_ratio": 1.85,
                "max_drawdown": 8.5,
                "total_return": 25.3,
                "win_rate": 58.5,
                "profit_factor": 1.75,
                "total_trades": 45,
                "avg_trade_duration": 48.5,
                "final_capital": 125300.0
            }
        }


# ============================================================================
# AI Prediction Models
# ============================================================================

class Prediction(BaseModel):
    """AI model prediction"""
    timestamp: datetime = Field(..., description="Prediction timestamp")
    symbol: str = Field(..., description="Trading symbol")
    predicted_return: float = Field(..., description="Predicted return percentage")
    predicted_price: float = Field(..., gt=0, description="Predicted price")
    predicted_trend: str = Field(..., pattern="^(bullish|bearish|neutral)$", description="Trend prediction")
    confidence: float = Field(..., ge=0, le=100, description="Confidence score (0-100)")
    model_version: str = Field(default="kimi-k2ai-v1", description="Model version")
    features_used: List[str] = Field(default_factory=list, description="Features used for prediction")
    
    class Config:
        json_schema_extra = {
            "example": {
                "timestamp": "2024-01-15T15:00:00",
                "symbol": "AAPL",
                "predicted_return": 2.5,
                "predicted_price": 103.75,
                "predicted_trend": "bullish",
                "confidence": 78.5,
                "model_version": "kimi-k2ai-v1",
                "features_used": ["price", "volume", "RSI", "MACD"]
            }
        }


class PredictionRequest(BaseModel):
    """Request for AI prediction"""
    symbol: str = Field(..., description="Trading symbol")
    historical_data: Optional[List[PriceCandle]] = None
    lookback_periods: int = Field(default=100, ge=10, le=500, description="Number of periods to use")


# ============================================================================
# Risk Metrics Models
# ============================================================================

class RiskMetrics(BaseModel):
    """Risk analysis metrics"""
    volatility: float = Field(..., ge=0, description="Annualized volatility")
    var_95: float = Field(..., description="Value at Risk (95% confidence)")
    var_99: float = Field(..., description="Value at Risk (99% confidence)")
    cvar_95: float = Field(..., description="Conditional VaR (95% confidence)")
    beta: Optional[float] = Field(None, description="Beta relative to market")
    sharpe_ratio: float = Field(..., description="Sharpe ratio")
    sortino_ratio: float = Field(..., description="Sortino ratio")
    max_drawdown: float = Field(..., ge=0, le=100, description="Maximum drawdown percentage")
    calmar_ratio: float = Field(..., description="Calmar ratio")
    
    class Config:
        json_schema_extra = {
            "example": {
                "volatility": 18.5,
                "var_95": -2.3,
                "var_99": -3.8,
                "cvar_95": -3.2,
                "beta": 1.15,
                "sharpe_ratio": 1.85,
                "sortino_ratio": 2.45,
                "max_drawdown": 8.5,
                "calmar_ratio": 2.98
            }
        }


# ============================================================================
# Settings Models
# ============================================================================

class ModelSettings(BaseModel):
    """AI model configuration - Kimi K2AI only"""
    model_name: str = Field(default="Kimi K2AI", description="Model name (fixed to Kimi K2AI)")
    model_version: str = Field(default="v1", description="Model version")
    sequence_length: int = Field(default=100, ge=10, le=500, description="Lookback periods for prediction")
    use_gpu: bool = Field(default=False, description="Use GPU acceleration (if available)")
    
    class Config:
        json_schema_extra = {
            "example": {
                "model_name": "Kimi K2AI",
                "model_version": "v1",
                "sequence_length": 100,
                "use_gpu": False
            }
        }


class RiskSettings(BaseModel):
    """Risk management settings"""
    max_position_size: float = Field(default=0.1, ge=0, le=1, description="Max position as % of capital")
    stop_loss_pct: float = Field(default=2.0, ge=0, le=10, description="Stop loss percentage")
    take_profit_pct: float = Field(default=5.0, ge=0, le=20, description="Take profit percentage")
    max_daily_loss: float = Field(default=5.0, ge=0, le=20, description="Max daily loss percentage")
    max_leverage: float = Field(default=1.0, ge=1, le=10, description="Maximum leverage")


class TradingSettings(BaseModel):
    """Trading strategy settings"""
    strategy: str = Field(default="momentum", description="Trading strategy")
    indicators: List[str] = Field(default_factory=lambda: ["SMA", "RSI"], description="Active indicators")
    entry_threshold: float = Field(default=0.02, description="Entry signal threshold")
    exit_threshold: float = Field(default=0.01, description="Exit signal threshold")
    min_holding_period: int = Field(default=1, ge=0, description="Minimum holding period (hours)")


class AppSettings(BaseModel):
    """Complete application settings"""
    model: ModelSettings = Field(default_factory=ModelSettings)
    risk: RiskSettings = Field(default_factory=RiskSettings)
    trading: TradingSettings = Field(default_factory=TradingSettings)
    api_key: Optional[str] = Field(None, description="API key for data provider")


# ============================================================================
# Response Models
# ============================================================================

class HealthCheck(BaseModel):
    """Health check response"""
    status: str = "healthy"
    version: str = "1.0.0"
    timestamp: datetime = Field(default_factory=datetime.now)


class ErrorResponse(BaseModel):
    """Error response format"""
    error: str
    detail: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.now)

