import { useState, useEffect } from 'react'
import { Brain, TrendingUp, TrendingDown, Activity } from 'lucide-react'
import { getPrediction, getMarketData } from '../api/client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import SymbolSelector from '../components/SymbolSelector'

function Predictions() {
  const [symbol, setSymbol] = useState('AAPL')
  const [prediction, setPrediction] = useState(null)
  const [predictionHistory, setPredictionHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPrediction()
    // Simulate prediction history
    loadPredictionHistory()
  }, [symbol])

  const loadPrediction = async () => {
    setLoading(true)
    try {
      const pred = await getPrediction(symbol)
      setPrediction(pred)
    } catch (error) {
      console.error('Error loading prediction:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadPredictionHistory = async () => {
    try {
      const data = await getMarketData(symbol)
      // Simulate historical predictions
      const history = data.slice(-20).map((candle, index) => ({
        timestamp: new Date(candle.timestamp).toLocaleDateString(),
        predicted_return: (Math.random() - 0.5) * 10,
        confidence: 60 + Math.random() * 30,
        actual_return: index > 0 ? ((candle.close - data[data.indexOf(candle) - 1]?.close) / data[data.indexOf(candle) - 1]?.close) * 100 : 0,
      }))
      setPredictionHistory(history)
    } catch (error) {
      console.error('Error loading history:', error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Predictions</h1>
            <p className="text-gray-600">Kimi K2AI model predictions and analysis</p>
          </div>
          <SymbolSelector value={symbol} onChange={setSymbol} />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          <p className="mt-4 text-gray-600">Generating prediction...</p>
        </div>
      ) : (
        <>
          {/* Prediction Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {prediction && (
              <>
                <div className="bg-gradient-to-br from-primary to-gray-800 rounded-xl shadow-lg border border-accent p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <Brain className="w-8 h-8 text-accent" />
                    <span className="text-xs text-gray-300">Model: {prediction.model_version}</span>
                  </div>
                  <p className="text-sm text-gray-300 mb-1">Predicted Price</p>
                  <p className="text-3xl font-bold text-accent mb-4">
                    ${prediction.predicted_price.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-300 mb-1">Expected Return</p>
                  <p
                    className={`text-2xl font-bold ${
                      prediction.predicted_return > 0 ? 'text-success' : 'text-danger'
                    }`}
                  >
                    {prediction.predicted_return > 0 ? '+' : ''}
                    {prediction.predicted_return.toFixed(2)}%
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Activity className="w-6 h-6 text-accent" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Confidence Score</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    {prediction.confidence.toFixed(1)}%
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-accent h-2 rounded-full transition-all"
                      style={{ width: `${prediction.confidence}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    {prediction.predicted_trend === 'bullish' ? (
                      <TrendingUp className="w-6 h-6 text-success" />
                    ) : prediction.predicted_trend === 'bearish' ? (
                      <TrendingDown className="w-6 h-6 text-danger" />
                    ) : (
                      <Activity className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Predicted Trend</p>
                  <p className="text-2xl font-bold text-gray-900 mb-2">
                    {prediction.predicted_trend.toUpperCase()}
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${
                      prediction.predicted_trend === 'bullish'
                        ? 'bg-success text-white'
                        : prediction.predicted_trend === 'bearish'
                        ? 'bg-danger text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {prediction.predicted_trend === 'bullish' ? '↑ Upward' : prediction.predicted_trend === 'bearish' ? '↓ Downward' : '→ Neutral'}
                  </span>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <p className="text-sm font-medium text-gray-600 mb-4">Features Used</p>
                  <div className="space-y-2">
                    {prediction.features_used.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 bg-accent/10 text-accent rounded text-xs font-medium mr-2 mb-2"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Prediction History Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Prediction History</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={predictionHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="timestamp" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="predicted_return"
                  stroke="#38BDF8"
                  strokeWidth={2}
                  name="Predicted Return"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="actual_return"
                  stroke="#22C55E"
                  strokeWidth={2}
                  name="Actual Return"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Prediction History Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Predictions</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Predicted Return
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Confidence
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trend
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {predictionHistory.slice(-10).reverse().map((pred, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {pred.timestamp}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                          pred.predicted_return > 0 ? 'text-success' : 'text-danger'
                        }`}
                      >
                        {pred.predicted_return > 0 ? '+' : ''}
                        {pred.predicted_return.toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {pred.confidence.toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            pred.predicted_return > 0
                              ? 'bg-success/10 text-success'
                              : 'bg-danger/10 text-danger'
                          }`}
                        >
                          {pred.predicted_return > 0 ? 'Bullish' : 'Bearish'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Predictions

