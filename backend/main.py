"""
FastAPI Main Application
AI Trading Application Backend
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from typing import List, Optional
import uvicorn

from schema import (
    PriceCandle,
    MarketDataRequest,
    Trade,
    BacktestConfig,
    BacktestResult,
    Prediction,
    PredictionRequest,
    RiskMetrics,
    AppSettings,
    HealthCheck,
    ErrorResponse
)
from price_data import price_manager
from indicators import calculate_indicators
from backtester import Backtester
from risk import calculate_risk_metrics
from ai_model import ai_model

# Initialize FastAPI app
app = FastAPI(
    title="AI Trading Application",
    description="Full-stack AI trading simulator with backtesting and predictions",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite default ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# Health & Info Endpoints
# ============================================================================

@app.get("/", tags=["Info"])
async def root():
    """Root endpoint"""
    return {
        "message": "AI Trading Application API",
        "version": "1.0.0",
        "docs": "/docs",
        "features": {
            "real_data": "Integrated with Yahoo Finance for real stock data",
            "symbols": "Supports any stock, ETF, or crypto symbol"
        }
    }


@app.get("/health", response_model=HealthCheck, tags=["Info"])
async def health_check():
    """Health check endpoint"""
    return HealthCheck()


# ============================================================================
# Market Data Endpoints
# ============================================================================

@app.get("/api/market-data/{symbol}", response_model=List[PriceCandle], tags=["Market Data"])
async def get_market_data(
    symbol: str,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    interval: str = "1d",
    use_real_data: bool = True
):
    """
    Get historical market data
    
    Args:
        symbol: Trading symbol (e.g., AAPL, GOOGL, BTC-USD, SPY, QQQ)
        start_date: Start date (ISO format)
        end_date: End date (ISO format)
        interval: Time interval (1m, 5m, 1h, 1d)
        use_real_data: Use real data from Yahoo Finance (default: True)
    """
    try:
        data = price_manager.get_historical_data(
            symbol=symbol,
            start_date=start_date,
            end_date=end_date,
            interval=interval,
            use_real_data=use_real_data
        )
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/market-data", response_model=List[PriceCandle], tags=["Market Data"])
async def get_market_data_post(request: MarketDataRequest):
    """Get market data via POST request"""
    try:
        data = price_manager.get_historical_data(
            symbol=request.symbol,
            start_date=request.start_date,
            end_date=request.end_date,
            interval=request.interval,
            use_real_data=True
        )
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/market-data/{symbol}/latest", response_model=PriceCandle, tags=["Market Data"])
async def get_latest_price(symbol: str):
    """Get latest price for symbol (uses real data when available)"""
    try:
        # Try real data first
        try:
            from real_data import real_data_fetcher
            latest = real_data_fetcher.get_latest_price(symbol)
            if latest:
                return latest
        except Exception as e:
            print(f"Real data fetch failed, using fallback: {e}")
        
        # Fallback to historical data
        data = price_manager.get_historical_data(
            symbol=symbol,
            start_date=datetime.now() - timedelta(days=1),
            end_date=datetime.now(),
            interval="1d",
            use_real_data=True
        )
        if not data:
            raise HTTPException(status_code=404, detail="No data available")
        return data[-1]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/search-symbols", tags=["Market Data"])
async def search_symbols(query: str):
    """Search for stock symbols"""
    try:
        from real_data import real_data_fetcher
        results = real_data_fetcher.search_symbol(query)
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# Indicators Endpoints
# ============================================================================

@app.get("/api/indicators/{symbol}", tags=["Indicators"])
async def get_indicators(
    symbol: str,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None
):
    """
    Get technical indicators for symbol
    
    Returns:
        Dictionary with all calculated indicators
    """
    try:
        candles = price_manager.get_historical_data(
            symbol=symbol,
            start_date=start_date,
            end_date=end_date,
            use_real_data=True
        )
        
        if not candles:
            raise HTTPException(status_code=404, detail="No data available")
        
        indicators = calculate_indicators(candles)
        
        # Convert NaN to None for JSON serialization
        def clean_nan(obj):
            if isinstance(obj, dict):
                return {k: clean_nan(v) for k, v in obj.items()}
            elif isinstance(obj, list):
                return [clean_nan(item) for item in obj]
            elif isinstance(obj, float) and (obj != obj):  # NaN check
                return None
            return obj
        
        return clean_nan(indicators)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# Backtesting Endpoints
# ============================================================================

@app.post("/api/backtest", response_model=BacktestResult, tags=["Backtesting"])
async def run_backtest(config: BacktestConfig):
    """
    Run backtest with given configuration
    
    Args:
        config: Backtest configuration
        
    Returns:
        BacktestResult with all metrics and trades
    """
    try:
        # Get historical data
        candles = price_manager.get_historical_data(
            symbol=config.symbol,
            start_date=config.start_date,
            end_date=config.end_date,
            use_real_data=True
        )
        
        if not candles:
            raise HTTPException(status_code=404, detail="No data available for backtest period")
        
        # Run backtest
        backtester = Backtester(config)
        result = backtester.run_backtest(candles)
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/backtest/{symbol}/quick", response_model=BacktestResult, tags=["Backtesting"])
async def quick_backtest(
    symbol: str,
    days: int = 365
):
    """
    Quick backtest with default settings
    
    Args:
        symbol: Trading symbol
        days: Number of days to backtest (default 365)
    """
    try:
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        
        config = BacktestConfig(
            symbol=symbol,
            start_date=start_date,
            end_date=end_date
        )
        
        candles = price_manager.get_historical_data(
            symbol=symbol,
            start_date=start_date,
            end_date=end_date,
            use_real_data=True
        )
        
        if not candles:
            raise HTTPException(status_code=404, detail="No data available")
        
        backtester = Backtester(config)
        result = backtester.run_backtest(candles)
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# AI Prediction Endpoints
# ============================================================================

@app.post("/api/predict", response_model=Prediction, tags=["AI Predictions"])
async def predict_price(request: PredictionRequest):
    """
    Get AI prediction for next period
    
    Args:
        request: Prediction request with symbol and optional historical data
        
    Returns:
        Prediction object with forecasted price and trend
    """
    try:
        # Get historical data if not provided
        if not request.historical_data:
            historical_data = price_manager.get_historical_data(
                symbol=request.symbol,
                start_date=datetime.now() - timedelta(days=365),
                end_date=datetime.now(),
                use_real_data=True
            )
            # Take last N periods
            historical_data = historical_data[-request.lookback_periods:]
        else:
            historical_data = request.historical_data
        
        if not historical_data:
            raise HTTPException(status_code=404, detail="No historical data available")
        
        current_price = historical_data[-1].close
        
        # Generate prediction
        prediction = ai_model.predict(
            symbol=request.symbol,
            historical_data=historical_data,
            current_price=current_price
        )
        
        return prediction
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/predict/{symbol}", response_model=Prediction, tags=["AI Predictions"])
async def predict_price_get(
    symbol: str,
    lookback_periods: int = 100
):
    """Get prediction via GET request"""
    try:
        historical_data = price_manager.get_historical_data(
            symbol=symbol,
            start_date=datetime.now() - timedelta(days=365),
            end_date=datetime.now(),
            use_real_data=True
        )
        
        if not historical_data:
            raise HTTPException(status_code=404, detail="No data available")
        
        historical_data = historical_data[-lookback_periods:]
        current_price = historical_data[-1].close
        
        prediction = ai_model.predict(
            symbol=symbol,
            historical_data=historical_data,
            current_price=current_price
        )
        
        return prediction
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# Risk Metrics Endpoints
# ============================================================================

@app.post("/api/risk", response_model=RiskMetrics, tags=["Risk Analysis"])
async def calculate_risk(equity_curve: List[float], trades: List[Trade]):
    """
    Calculate risk metrics from equity curve and trades
    
    Args:
        equity_curve: Portfolio values over time
        trades: List of executed trades
        
    Returns:
        RiskMetrics object
    """
    try:
        if not equity_curve:
            raise HTTPException(status_code=400, detail="Equity curve cannot be empty")
        
        metrics = calculate_risk_metrics(equity_curve, trades)
        return metrics
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# Settings Endpoints
# ============================================================================

@app.get("/api/settings", response_model=AppSettings, tags=["Settings"])
async def get_settings():
    """Get current application settings"""
    # In production, load from database or config file
    return AppSettings()


@app.post("/api/settings", response_model=AppSettings, tags=["Settings"])
async def update_settings(settings: AppSettings):
    """Update application settings"""
    # In production, save to database or config file
    return settings


# ============================================================================
# Error Handlers
# ============================================================================

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Custom HTTP exception handler"""
    return ErrorResponse(
        error=exc.detail,
        detail=f"Status code: {exc.status_code}",
        timestamp=datetime.now()
    )


# ============================================================================
# Startup Event
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """Initialize on startup"""
    # Load AI model
    print("Loading AI model...")
    ai_model.load_model()
    print("AI model loaded successfully!")
    print("✅ Real stock data integration enabled (Yahoo Finance)")


# ============================================================================
# Run Server
# ============================================================================

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
