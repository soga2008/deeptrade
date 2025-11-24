# Mathematical Explanations
## AI Trading Application - Quantitative Finance Formulas

This document provides detailed mathematical explanations for all indicators, metrics, and calculations used in the application.

---

## 📊 Technical Indicators

### 1. Simple Moving Average (SMA)

**Formula:**
```
SMA(n) = (P₁ + P₂ + ... + Pₙ) / n
```

Where:
- `Pᵢ` = Price at period i
- `n` = Number of periods

**Explanation:**
The SMA is the arithmetic mean of prices over a specified period. It smooths out price fluctuations and helps identify trends.

**Implementation:**
```python
SMA = sum(prices[-period:]) / period
```

---

### 2. Exponential Moving Average (EMA)

**Formula:**
```
EMA(t) = (Price(t) - EMA(t-1)) × (2 / (n + 1)) + EMA(t-1)
```

Or equivalently:
```
EMA(t) = Price(t) × α + EMA(t-1) × (1 - α)
```

Where:
- `α = 2 / (n + 1)` = Smoothing factor
- `n` = Period
- Initial EMA = SMA of first n periods

**Explanation:**
EMA gives more weight to recent prices, making it more responsive to price changes than SMA.

**Key Properties:**
- More sensitive to recent price changes
- Reduces lag compared to SMA
- Commonly used periods: 12, 26 (for MACD)

---

### 3. Relative Strength Index (RSI)

**Formula:**
```
RS = Average Gain / Average Loss
RSI = 100 - (100 / (1 + RS))
```

**Wilder's Smoothing Method:**
```
Avg Gain(t) = (Avg Gain(t-1) × (n-1) + Gain(t)) / n
Avg Loss(t) = (Avg Loss(t-1) × (n-1) + Loss(t)) / n
```

Where:
- `Gain(t) = Price(t) - Price(t-1)` if positive, else 0
- `Loss(t) = Price(t-1) - Price(t)` if positive, else 0
- `n` = Period (typically 14)

**Interpretation:**
- RSI > 70: Overbought (potential sell signal)
- RSI < 30: Oversold (potential buy signal)
- RSI = 50: Neutral

**Explanation:**
RSI measures the speed and magnitude of price changes. It oscillates between 0 and 100.

---

### 4. Moving Average Convergence Divergence (MACD)

**Formula:**
```
MACD Line = EMA(12) - EMA(26)
Signal Line = EMA(MACD Line, 9)
Histogram = MACD Line - Signal Line
```

**Components:**
1. **MACD Line**: Difference between 12-period and 26-period EMAs
2. **Signal Line**: 9-period EMA of MACD Line
3. **Histogram**: Visual representation of the difference

**Trading Signals:**
- **Bullish**: MACD crosses above Signal Line
- **Bearish**: MACD crosses below Signal Line
- **Divergence**: Price and MACD move in opposite directions

---

### 5. Bollinger Bands

**Formula:**
```
Middle Band = SMA(n)
Upper Band = Middle + (σ × k)
Lower Band = Middle - (σ × k)
```

Where:
- `σ` = Standard deviation of prices
- `n` = Period (typically 20)
- `k` = Number of standard deviations (typically 2)

**Explanation:**
Bollinger Bands measure volatility. Prices tend to:
- Stay within bands during normal conditions
- Break above/below during strong trends
- Return to middle band (mean reversion)

**Trading Signals:**
- **Squeeze**: Bands narrow (low volatility, potential breakout)
- **Expansion**: Bands widen (high volatility)
- **Overbought**: Price touches upper band
- **Oversold**: Price touches lower band

---

### 6. Average True Range (ATR)

**Formula:**
```
TR = max(
    High - Low,
    |High - Previous Close|,
    |Low - Previous Close|
)
ATR = SMA(TR, n)
```

Where:
- `TR` = True Range
- `n` = Period (typically 14)

**Explanation:**
ATR measures market volatility. It's used for:
- Setting stop-loss levels
- Position sizing
- Volatility-based trading strategies

---

## 📈 Return Calculations

### Log Returns

**Formula:**
```
r(t) = ln(P(t) / P(t-1))
```

Where:
- `P(t)` = Price at time t
- `ln` = Natural logarithm

**Properties:**
- **Time-additive**: r(t₁→t₃) = r(t₁→t₂) + r(t₂→t₃)
- **Symmetric**: Can be positive or negative
- **Normalized**: Independent of price level

**Why Log Returns?**
- Better statistical properties (closer to normal distribution)
- Easier to work with in mathematical models
- Compounding is additive

### Simple Returns

**Formula:**
```
R(t) = (P(t) - P(t-1)) / P(t-1)
```

**Conversion:**
```
r = ln(1 + R)
R = e^r - 1
```

---

## 📉 Risk Metrics

### 1. Volatility (Standard Deviation)

**Formula:**
```
σ = √(Var(R))
```

Where:
- `Var(R) = E[(R - μ)²]` = Variance of returns
- `μ = E[R]` = Mean return

**Annualized Volatility:**
```
σ_annual = σ_daily × √252
```

Where 252 = Number of trading days per year.

**Explanation:**
Volatility measures the dispersion of returns. Higher volatility = higher risk.

---

### 2. Sharpe Ratio

**Formula:**
```
Sharpe Ratio = (E[R] - R_f) / σ
```

Where:
- `E[R]` = Expected return (annualized)
- `R_f` = Risk-free rate (annualized)
- `σ` = Volatility (annualized)

**Interpretation:**
- **> 1**: Good risk-adjusted return
- **> 2**: Very good
- **> 3**: Excellent
- **< 1**: Poor risk-adjusted return

**Explanation:**
Sharpe Ratio measures excess return per unit of risk. Higher is better.

---

### 3. Sortino Ratio

**Formula:**
```
Sortino Ratio = (E[R] - R_f) / σ_downside
```

Where:
- `σ_downside = √(E[min(R - R_f, 0)²])` = Downside deviation

**Explanation:**
Sortino Ratio only penalizes downside volatility (losses), not upside volatility (gains). More relevant for investors who care about downside risk.

---

### 4. Maximum Drawdown

**Formula:**
```
MDD = max((Peak - Trough) / Peak) × 100%
```

Where:
- `Peak` = Highest portfolio value before decline
- `Trough` = Lowest portfolio value during decline

**Explanation:**
Maximum Drawdown measures the largest peak-to-trough decline. It's a key risk metric for understanding worst-case scenarios.

---

### 5. Calmar Ratio

**Formula:**
```
Calmar Ratio = Annual Return / Maximum Drawdown
```

**Interpretation:**
- Higher is better
- Measures return relative to maximum risk experienced

---

### 6. Value at Risk (VaR)

**Formula (Historical Method):**
```
VaR(α) = Percentile(Returns, (1 - α))
```

Where:
- `α` = Confidence level (e.g., 0.95 for 95%)

**Example:**
If VaR(95%) = -2.5%, it means:
- 95% confidence that losses won't exceed 2.5%
- 5% chance of losses exceeding 2.5%

**Parametric Method (assuming normal distribution):**
```
VaR(α) = μ - z_α × σ
```

Where:
- `z_α` = Z-score for confidence level α
- For 95%: z = 1.645
- For 99%: z = 2.326

---

### 7. Conditional Value at Risk (CVaR / Expected Shortfall)

**Formula:**
```
CVaR(α) = E[R | R ≤ VaR(α)]
```

**Explanation:**
CVaR is the expected loss given that the loss exceeds VaR. It measures tail risk more accurately than VaR.

**Calculation:**
```
CVaR = Mean of all returns ≤ VaR
```

---

### 8. Beta

**Formula:**
```
β = Cov(R_portfolio, R_market) / Var(R_market)
```

Where:
- `Cov` = Covariance
- `Var` = Variance

**Interpretation:**
- **β = 1**: Moves with market
- **β > 1**: More volatile than market (aggressive)
- **β < 1**: Less volatile than market (defensive)
- **β < 0**: Moves opposite to market (rare)

---

## 🤖 AI Model Mathematics

### LSTM Architecture

**Long Short-Term Memory (LSTM) Cell:**

```
f_t = σ(W_f · [h_{t-1}, x_t] + b_f)  (Forget gate)
i_t = σ(W_i · [h_{t-1}, x_t] + b_i)  (Input gate)
C̃_t = tanh(W_C · [h_{t-1}, x_t] + b_C)  (Candidate values)
C_t = f_t ⊙ C_{t-1} + i_t ⊙ C̃_t  (Cell state)
o_t = σ(W_o · [h_{t-1}, x_t] + b_o)  (Output gate)
h_t = o_t ⊙ tanh(C_t)  (Hidden state)
```

Where:
- `σ` = Sigmoid activation
- `tanh` = Hyperbolic tangent
- `⊙` = Element-wise multiplication
- `W` = Weight matrices
- `b` = Bias vectors

**Explanation:**
LSTM networks can learn long-term dependencies in time series data, making them ideal for price prediction.

---

### Feature Engineering

**Normalized Price:**
```
P_norm = P(t) / P(0)
```

**Price Change:**
```
ΔP = (P(t) - P(t-1)) / P(t-1)
```

**Log Returns:**
```
r(t) = ln(P(t) / P(t-1))
```

**Volume Normalization:**
```
V_norm = V(t) / max(V)
```

**High-Low Spread:**
```
Spread = (High - Low) / Close
```

---

## 📐 Linear Algebra

### Matrix Operations

**Matrix Multiplication:**
```
C = A × B
C_ij = Σ_k A_ik × B_kj
```

**Transpose:**
```
A^T_ij = A_ji
```

**Inverse:**
```
A × A^(-1) = I
```

Where `I` is the identity matrix.

---

### Covariance Matrix

**Formula:**
```
Σ_ij = Cov(X_i, X_j) = E[(X_i - μ_i)(X_j - μ_j)]
```

**Properties:**
- Symmetric: `Σ_ij = Σ_ji`
- Positive semi-definite
- Diagonal elements are variances

---

## 🔢 Statistical Concepts

### Normal Distribution

**Probability Density Function:**
```
f(x) = (1 / (σ√(2π))) × e^(-(x-μ)²/(2σ²))
```

Where:
- `μ` = Mean
- `σ` = Standard deviation

**Properties:**
- 68% of data within 1σ
- 95% of data within 2σ
- 99.7% of data within 3σ

---

### Central Limit Theorem

**Statement:**
As sample size increases, the distribution of sample means approaches a normal distribution, regardless of the original distribution.

**Application:**
- Returns often assumed to be normally distributed
- Enables use of parametric statistical tests

---

## 📚 References

1. **Technical Analysis:**
   - J. Welles Wilder - "New Concepts in Technical Trading Systems"
   - John Bollinger - "Bollinger on Bollinger Bands"

2. **Quantitative Finance:**
   - John Hull - "Options, Futures, and Other Derivatives"
   - Paul Wilmott - "Quantitative Finance"

3. **Machine Learning:**
   - Ian Goodfellow - "Deep Learning"
   - Christopher Bishop - "Pattern Recognition and Machine Learning"

---

*This document provides the mathematical foundation for all calculations in the AI Trading Application.*

