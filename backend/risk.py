"""
Risk Metrics Calculator
Calculates various risk and performance metrics
"""

import numpy as np
from typing import List
from schema import Trade, RiskMetrics


def calculate_returns(prices: List[float]) -> List[float]:
    """
    Calculate log returns
    
    Formula: r_t = ln(P_t / P_{t-1})
    
    Args:
        prices: List of prices
        
    Returns:
        List of log returns
    """
    if len(prices) < 2:
        return []
    
    returns = []
    for i in range(1, len(prices)):
        if prices[i-1] > 0:
            ret = np.log(prices[i] / prices[i-1])
            returns.append(ret)
        else:
            returns.append(0.0)
    
    return returns


def calculate_volatility(returns: List[float], annualized: bool = True) -> float:
    """
    Calculate volatility (standard deviation of returns)
    
    Formula: σ = sqrt(Variance(returns))
    Annualized: σ_annual = σ_daily * sqrt(252)
    
    Args:
        returns: List of returns
        annualized: Whether to annualize (default True)
        
    Returns:
        Volatility (as percentage)
    """
    if not returns or len(returns) < 2:
        return 0.0
    
    variance = np.var(returns)
    volatility = np.sqrt(variance)
    
    if annualized:
        # Assume daily returns, annualize by sqrt(252 trading days)
        volatility *= np.sqrt(252)
    
    return volatility * 100  # Convert to percentage


def calculate_sharpe_ratio(
    returns: List[float],
    risk_free_rate: float = 0.02
) -> float:
    """
    Calculate Sharpe Ratio
    
    Formula: SR = (E[R] - R_f) / σ
    where E[R] is expected return, R_f is risk-free rate, σ is volatility
    
    Args:
        returns: List of returns
        risk_free_rate: Annual risk-free rate (default 2%)
        
    Returns:
        Sharpe ratio
    """
    if not returns or len(returns) < 2:
        return 0.0
    
    mean_return = np.mean(returns)
    volatility = calculate_volatility(returns, annualized=False)
    
    if volatility == 0:
        return 0.0
    
    # Annualize mean return (assuming daily returns)
    annualized_return = mean_return * 252
    annualized_vol = volatility / 100 * np.sqrt(252)
    
    # Risk-free rate is already annualized
    excess_return = annualized_return - risk_free_rate
    
    sharpe = excess_return / annualized_vol if annualized_vol > 0 else 0.0
    
    return sharpe


def calculate_sortino_ratio(
    returns: List[float],
    risk_free_rate: float = 0.02
) -> float:
    """
    Calculate Sortino Ratio (only penalizes downside volatility)
    
    Formula: Sortino = (E[R] - R_f) / σ_downside
    
    Args:
        returns: List of returns
        risk_free_rate: Annual risk-free rate (default 2%)
        
    Returns:
        Sortino ratio
    """
    if not returns or len(returns) < 2:
        return 0.0
    
    mean_return = np.mean(returns)
    annualized_return = mean_return * 252
    
    # Calculate downside deviation (only negative returns)
    downside_returns = [r for r in returns if r < 0]
    
    if not downside_returns:
        return float('inf') if annualized_return > risk_free_rate else 0.0
    
    downside_variance = np.var(downside_returns)
    downside_vol = np.sqrt(downside_variance) * np.sqrt(252)
    
    if downside_vol == 0:
        return 0.0
    
    excess_return = annualized_return - risk_free_rate
    sortino = excess_return / downside_vol if downside_vol > 0 else 0.0
    
    return sortino


def calculate_max_drawdown(equity_curve: List[float]) -> float:
    """
    Calculate Maximum Drawdown
    
    Formula: MDD = max((Peak - Trough) / Peak) * 100
    
    Args:
        equity_curve: List of portfolio values over time
        
    Returns:
        Maximum drawdown percentage
    """
    if not equity_curve or len(equity_curve) < 2:
        return 0.0
    
    peak = equity_curve[0]
    max_dd = 0.0
    
    for value in equity_curve:
        if value > peak:
            peak = value
        
        drawdown = ((peak - value) / peak) * 100
        if drawdown > max_dd:
            max_dd = drawdown
    
    return max_dd


def calculate_calmar_ratio(
    total_return: float,
    max_drawdown: float
) -> float:
    """
    Calculate Calmar Ratio
    
    Formula: Calmar = Annual Return / Max Drawdown
    
    Args:
        total_return: Total return percentage
        max_drawdown: Maximum drawdown percentage
        
    Returns:
        Calmar ratio
    """
    if max_drawdown == 0:
        return 0.0
    
    # Assume total_return is annualized
    calmar = total_return / max_drawdown if max_drawdown > 0 else 0.0
    
    return calmar


def calculate_var(
    returns: List[float],
    confidence: float = 0.95
) -> float:
    """
    Calculate Value at Risk (VaR)
    
    Formula: VaR = Percentile(returns, (1 - confidence))
    
    Args:
        returns: List of returns
        confidence: Confidence level (default 0.95 for 95%)
        
    Returns:
        VaR (negative value, as loss)
    """
    if not returns:
        return 0.0
    
    percentile = (1 - confidence) * 100
    var = np.percentile(returns, percentile)
    
    return var * 100  # Convert to percentage


def calculate_cvar(
    returns: List[float],
    confidence: float = 0.95
) -> float:
    """
    Calculate Conditional Value at Risk (CVaR / Expected Shortfall)
    
    Formula: CVaR = E[R | R <= VaR]
    
    Args:
        returns: List of returns
        confidence: Confidence level (default 0.95 for 95%)
        
    Returns:
        CVaR (negative value, as loss)
    """
    if not returns:
        return 0.0
    
    var = calculate_var(returns, confidence) / 100  # Convert back
    
    # Calculate mean of returns below VaR
    tail_returns = [r for r in returns if r <= var]
    
    if not tail_returns:
        return var * 100
    
    cvar = np.mean(tail_returns)
    
    return cvar * 100  # Convert to percentage


def calculate_beta(
    portfolio_returns: List[float],
    market_returns: List[float]
) -> float:
    """
    Calculate Beta (sensitivity to market)
    
    Formula: β = Cov(R_p, R_m) / Var(R_m)
    
    Args:
        portfolio_returns: Portfolio returns
        market_returns: Market returns
        
    Returns:
        Beta value
    """
    if (not portfolio_returns or not market_returns or
        len(portfolio_returns) != len(market_returns) or
        len(portfolio_returns) < 2):
        return 1.0  # Default beta
    
    covariance = np.cov(portfolio_returns, market_returns)[0][1]
    market_variance = np.var(market_returns)
    
    if market_variance == 0:
        return 1.0
    
    beta = covariance / market_variance
    
    return beta


def calculate_risk_metrics(
    equity_curve: List[float],
    trades: List[Trade],
    risk_free_rate: float = 0.02
) -> RiskMetrics:
    """
    Calculate comprehensive risk metrics
    
    Args:
        equity_curve: Portfolio values over time
        trades: List of trades
        risk_free_rate: Risk-free rate (default 2%)
        
    Returns:
        RiskMetrics object
    """
    if not equity_curve or len(equity_curve) < 2:
        # Return default metrics
        return RiskMetrics(
            volatility=0.0,
            var_95=0.0,
            var_99=0.0,
            cvar_95=0.0,
            beta=None,
            sharpe_ratio=0.0,
            sortino_ratio=0.0,
            max_drawdown=0.0,
            calmar_ratio=0.0
        )
    
    # Calculate returns from equity curve
    returns = calculate_returns(equity_curve)
    
    if not returns:
        returns = [0.0]
    
    # Calculate metrics
    volatility = calculate_volatility(returns, annualized=True)
    sharpe = calculate_sharpe_ratio(returns, risk_free_rate)
    sortino = calculate_sortino_ratio(returns, risk_free_rate)
    max_dd = calculate_max_drawdown(equity_curve)
    
    # Calculate total return
    if equity_curve[0] > 0:
        total_return = ((equity_curve[-1] - equity_curve[0]) / equity_curve[0]) * 100
    else:
        total_return = 0.0
    
    calmar = calculate_calmar_ratio(total_return, max_dd)
    
    # VaR calculations
    var_95 = calculate_var(returns, 0.95)
    var_99 = calculate_var(returns, 0.99)
    cvar_95 = calculate_cvar(returns, 0.95)
    
    # Beta (would need market data, defaulting to None)
    beta = None
    
    return RiskMetrics(
        volatility=round(volatility, 2),
        var_95=round(var_95, 2),
        var_99=round(var_99, 2),
        cvar_95=round(cvar_95, 2),
        beta=beta,
        sharpe_ratio=round(sharpe, 2),
        sortino_ratio=round(sortino, 2),
        max_drawdown=round(max_dd, 2),
        calmar_ratio=round(calmar, 2)
    )

