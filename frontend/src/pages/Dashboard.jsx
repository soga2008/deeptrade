import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react'
import { getMarketData, getPrediction, getLatestPrice } from '../api/client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import SymbolSelector from '../components/SymbolSelector'

function Dashboard() {
  const [symbol, setSymbol] = useState('AAPL')
  const [marketData, setMarketData] = useState([])
  const [prediction, setPrediction] = useState(null)
  const [latestPrice, setLatestPrice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
  }, [symbol])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const endDate = new Date()
      const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000) // 30 days

      const [data, pred, latest] = await Promise.all([
        getMarketData(symbol, startDate.toISOString(), endDate.toISOString()),
        getPrediction(symbol),
        getLatestPrice(symbol),
      ])

      setMarketData(data || [])
      setPrediction(pred)
      setLatestPrice(latest)
    } catch (error) {
      console.error('Error loading data:', error)
      setError(error.message || 'Failed to load data. Please check if the backend server is running.')
      // Set empty defaults to prevent crashes
      setMarketData([])
      setPrediction(null)
      setLatestPrice(null)
    } finally {
      setLoading(false)
    }
  }

  const chartData = marketData && marketData.length > 0 
    ? marketData.map((candle) => ({
        date: new Date(candle.timestamp).toLocaleDateString(),
        price: candle.close,
        volume: candle.volume,
      }))
    : []

  const calculateChange = () => {
    if (!latestPrice || marketData.length < 2) return 0
    const prevClose = marketData[marketData.length - 2]?.close
    if (!prevClose || prevClose === 0) return 0
    return ((latestPrice.close - prevClose) / prevClose) * 100
  }

  const metrics = [
    {
      label: 'Current Price',
      value: latestPrice ? `$${latestPrice.close.toFixed(2)}` : '--',
      change: calculateChange(), // This is now a number, not a string
      icon: DollarSign,
    },
    {
      label: 'Predicted Return',
      value: prediction ? `${prediction.predicted_return > 0 ? '+' : ''}${prediction.predicted_return.toFixed(2)}%` : '--',
      change: prediction ? Number(prediction.predicted_return) : 0,
      icon: TrendingUp,
    },
    {
      label: 'Confidence',
      value: prediction ? `${prediction.confidence.toFixed(1)}%` : '--',
      change: null,
      icon: Activity,
    },
    {
      label: 'Trend',
      value: prediction ? prediction.predicted_trend.toUpperCase() : '--',
      change: prediction?.predicted_trend === 'bullish' ? 1 : prediction?.predicted_trend === 'bearish' ? -1 : 0,
      icon: TrendingUp,
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <SymbolSelector value={symbol} onChange={setSymbol} />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      ) : error ? (
        <div className="bg-danger/10 border border-danger rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-danger mb-2">Error Loading Data</h3>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => {
              const Icon = metric.icon
              const changeValue = typeof metric.change === 'number' ? metric.change : 0
              const isPositive = changeValue > 0
              const isNegative = changeValue < 0

              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
                  {metric.change !== null && typeof metric.change === 'number' && (
                    <div className="flex items-center space-x-1">
                      {isPositive && <TrendingUp className="w-4 h-4 text-success" />}
                      {isNegative && <TrendingDown className="w-4 h-4 text-danger" />}
                      <span
                        className={`text-sm font-medium ${
                          isPositive ? 'text-success' : isNegative ? 'text-danger' : 'text-gray-500'
                        }`}
                      >
                        {`${isPositive ? '+' : ''}${changeValue.toFixed(2)}%`}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Price Chart</h2>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="date" stroke="#94A3B8" />
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
                      dataKey="price"
                      stroke="#38BDF8"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-400 flex items-center justify-center text-gray-500">
                  <p>No chart data available</p>
                </div>
              )}
            </div>

            {/* Prediction Widget */}
            <div className="bg-gradient-to-br from-primary to-gray-800 rounded-xl shadow-lg border border-accent p-6 text-white">
              <h2 className="text-xl font-semibold mb-4">AI Prediction</h2>
              {prediction ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-300 mb-1">Predicted Price</p>
                    <p className="text-3xl font-bold text-accent">
                      ${prediction.predicted_price.toFixed(2)}
                    </p>
                  </div>
                  <div>
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
                  <div>
                    <p className="text-sm text-gray-300 mb-1">Confidence</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-accent h-2 rounded-full"
                          style={{ width: `${prediction.confidence}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{prediction.confidence.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-300 mb-1">Trend</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${
                        prediction.predicted_trend === 'bullish'
                          ? 'bg-success text-white'
                          : prediction.predicted_trend === 'bearish'
                          ? 'bg-danger text-white'
                          : 'bg-gray-600 text-white'
                      }`}
                    >
                      {prediction.predicted_trend.toUpperCase()}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">No prediction available</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard

