import { useState } from 'react'
import { BookOpen, ChevronDown, ChevronRight } from 'lucide-react'

function MathReference() {
  const [expandedSections, setExpandedSections] = useState({
    indicators: true,
    returns: false,
    risk: false,
    ai: false,
  })

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const sections = [
    {
      id: 'indicators',
      title: 'Technical Indicators',
      icon: '📊',
      content: [
        {
          title: 'Simple Moving Average (SMA)',
          formula: 'SMA(n) = (P₁ + P₂ + ... + Pₙ) / n',
          explanation: 'The SMA is the arithmetic mean of prices over a specified period. It smooths out price fluctuations and helps identify trends.',
          example: 'For a 20-day SMA: Add the closing prices of the last 20 days and divide by 20.'
        },
        {
          title: 'Exponential Moving Average (EMA)',
          formula: 'EMA(t) = (Price(t) - EMA(t-1)) × (2 / (n + 1)) + EMA(t-1)',
          explanation: 'EMA gives more weight to recent prices, making it more responsive to price changes than SMA. The smoothing factor α = 2/(n+1).',
          example: 'Common periods: EMA(12) and EMA(26) are used in MACD calculations.'
        },
        {
          title: 'Relative Strength Index (RSI)',
          formula: 'RS = Average Gain / Average Loss\nRSI = 100 - (100 / (1 + RS))',
          explanation: 'RSI measures the speed and magnitude of price changes. It oscillates between 0 and 100.',
          interpretation: 'RSI > 70: Overbought (potential sell signal)\nRSI < 30: Oversold (potential buy signal)\nRSI = 50: Neutral'
        },
        {
          title: 'Moving Average Convergence Divergence (MACD)',
          formula: 'MACD Line = EMA(12) - EMA(26)\nSignal Line = EMA(MACD Line, 9)\nHistogram = MACD Line - Signal Line',
          explanation: 'MACD shows the relationship between two moving averages. Crossovers indicate potential trend changes.',
          signals: 'Bullish: MACD crosses above Signal Line\nBearish: MACD crosses below Signal Line'
        },
        {
          title: 'Bollinger Bands',
          formula: 'Middle Band = SMA(period)\nUpper Band = Middle + (σ × k)\nLower Band = Middle - (σ × k)',
          explanation: 'Bollinger Bands measure volatility. Prices tend to stay within bands during normal conditions and break out during strong trends.',
          parameters: 'Default: period = 20, k = 2 standard deviations'
        },
        {
          title: 'Average True Range (ATR)',
          formula: 'TR = max(High - Low, |High - Prev Close|, |Low - Prev Close|)\nATR = SMA(TR, period)',
          explanation: 'ATR measures market volatility. Used for setting stop-loss levels and position sizing.',
          default: 'Default period: 14'
        }
      ]
    },
    {
      id: 'returns',
      title: 'Return Calculations',
      icon: '📈',
      content: [
        {
          title: 'Log Returns',
          formula: 'r(t) = ln(P(t) / P(t-1))',
          explanation: 'Log returns are time-additive and have better statistical properties. They are symmetric and normalized.',
          why: 'Better for mathematical models, closer to normal distribution, compounding is additive.'
        },
        {
          title: 'Simple Returns',
          formula: 'R(t) = (P(t) - P(t-1)) / P(t-1)',
          explanation: 'Simple returns show the percentage change in price.',
          conversion: 'r = ln(1 + R) and R = e^r - 1'
        }
      ]
    },
    {
      id: 'risk',
      title: 'Risk Metrics',
      icon: '📉',
      content: [
        {
          title: 'Volatility',
          formula: 'σ = √(Var(R))\nσ_annual = σ_daily × √252',
          explanation: 'Volatility measures the dispersion of returns. Higher volatility = higher risk.',
          note: '252 = number of trading days per year'
        },
        {
          title: 'Sharpe Ratio',
          formula: 'Sharpe = (E[R] - R_f) / σ',
          explanation: 'Measures excess return per unit of risk. Higher is better.',
          interpretation: '> 1: Good\n> 2: Very good\n> 3: Excellent\n< 1: Poor'
        },
        {
          title: 'Sortino Ratio',
          formula: 'Sortino = (E[R] - R_f) / σ_downside',
          explanation: 'Only penalizes downside volatility (losses), not upside volatility (gains).',
          advantage: 'More relevant for investors who care about downside risk.'
        },
        {
          title: 'Maximum Drawdown',
          formula: 'MDD = max((Peak - Trough) / Peak) × 100%',
          explanation: 'Measures the largest peak-to-trough decline. Key risk metric for understanding worst-case scenarios.'
        },
        {
          title: 'Value at Risk (VaR)',
          formula: 'VaR(α) = Percentile(Returns, (1 - α))',
          explanation: 'The maximum loss expected with a given confidence level.',
          example: 'VaR(95%) = -2.5% means 95% confidence that losses won\'t exceed 2.5%'
        },
        {
          title: 'Conditional VaR (CVaR)',
          formula: 'CVaR(α) = E[R | R ≤ VaR(α)]',
          explanation: 'Expected loss given that the loss exceeds VaR. Measures tail risk more accurately.',
          also: 'Also known as Expected Shortfall'
        },
        {
          title: 'Beta',
          formula: 'β = Cov(R_portfolio, R_market) / Var(R_market)',
          explanation: 'Measures sensitivity to market movements.',
          interpretation: 'β = 1: Moves with market\nβ > 1: More volatile (aggressive)\nβ < 1: Less volatile (defensive)'
        },
        {
          title: 'Calmar Ratio',
          formula: 'Calmar = Annual Return / Max Drawdown',
          explanation: 'Measures return relative to maximum risk experienced. Higher is better.'
        }
      ]
    },
    {
      id: 'ai',
      title: 'AI Model Mathematics',
      icon: '🤖',
      content: [
        {
          title: 'LSTM Architecture',
          formula: 'f_t = σ(W_f · [h_{t-1}, x_t] + b_f)\ni_t = σ(W_i · [h_{t-1}, x_t] + b_i)\nC̃_t = tanh(W_C · [h_{t-1}, x_t] + b_C)\nC_t = f_t ⊙ C_{t-1} + i_t ⊙ C̃_t\no_t = σ(W_o · [h_{t-1}, x_t] + b_o)\nh_t = o_t ⊙ tanh(C_t)',
          explanation: 'LSTM (Long Short-Term Memory) networks can learn long-term dependencies in time series data, making them ideal for price prediction.',
          components: 'Forget gate, Input gate, Cell state, Output gate'
        },
        {
          title: 'Feature Engineering',
          formulas: [
            'Normalized Price: P_norm = P(t) / P(0)',
            'Price Change: ΔP = (P(t) - P(t-1)) / P(t-1)',
            'Log Returns: r(t) = ln(P(t) / P(t-1))',
            'Volume Normalization: V_norm = V(t) / max(V)',
            'High-Low Spread: Spread = (High - Low) / Close'
          ],
          explanation: 'These features help the model understand price patterns, trends, and volatility.'
        }
      ]
    }
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <BookOpen className="w-8 h-8 text-accent" />
          <h1 className="text-3xl font-bold text-gray-900">Mathematical Reference</h1>
        </div>
        <p className="text-gray-600">Complete mathematical formulas and explanations for all calculations used in the application</p>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{section.icon}</span>
                <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
              </div>
              {expandedSections[section.id] ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSections[section.id] && (
              <div className="px-6 py-4 border-t border-gray-200 space-y-6">
                {section.content.map((item, index) => (
                  <div key={index} className="pb-6 border-b border-gray-100 last:border-b-0 last:pb-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.title}</h3>
                    
                    {item.formula && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-3 font-mono text-sm">
                        <div className="whitespace-pre-wrap">{item.formula}</div>
                      </div>
                    )}

                    {item.formulas && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-3 space-y-2">
                        {item.formulas.map((formula, idx) => (
                          <div key={idx} className="font-mono text-sm">{formula}</div>
                        ))}
                      </div>
                    )}

                    <p className="text-gray-700 mb-2">{item.explanation}</p>

                    {item.interpretation && (
                      <div className="bg-blue-50 border-l-4 border-accent p-3 rounded mt-3">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{item.interpretation}</p>
                      </div>
                    )}

                    {item.example && (
                      <div className="bg-green-50 border-l-4 border-success p-3 rounded mt-3">
                        <p className="text-sm text-gray-700">{item.example}</p>
                      </div>
                    )}

                    {item.signals && (
                      <div className="bg-purple-50 border-l-4 border-purple-500 p-3 rounded mt-3">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{item.signals}</p>
                      </div>
                    )}

                    {item.parameters && (
                      <div className="text-sm text-gray-600 mt-2 italic">{item.parameters}</div>
                    )}

                    {item.note && (
                      <div className="text-sm text-gray-600 mt-2 italic">{item.note}</div>
                    )}

                    {item.advantage && (
                      <div className="text-sm text-gray-600 mt-2 italic">{item.advantage}</div>
                    )}

                    {item.also && (
                      <div className="text-sm text-gray-600 mt-2 italic">{item.also}</div>
                    )}

                    {item.components && (
                      <div className="text-sm text-gray-600 mt-2 italic">{item.components}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MathReference








