import { useState, useEffect } from 'react'
import { getMarketData, getIndicators } from '../api/client'
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

function ChartView() {
  const [symbol, setSymbol] = useState('AAPL')
  const [interval, setInterval] = useState('1d')
  const [marketData, setMarketData] = useState([])
  const [indicators, setIndicators] = useState({})
  const [showSMA, setShowSMA] = useState(true)
  const [showRSI, setShowRSI] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [symbol, interval])

  const loadData = async () => {
    setLoading(true)
    try {
      const endDate = new Date()
      const startDate = new Date(endDate.getTime() - 90 * 24 * 60 * 60 * 1000) // 90 days

      const [data, inds] = await Promise.all([
        getMarketData(symbol, startDate.toISOString(), endDate.toISOString(), interval),
        getIndicators(symbol, startDate.toISOString(), endDate.toISOString()),
      ])

      setMarketData(data)
      setIndicators(inds)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const chartData = marketData.map((candle, index) => {
    const dataPoint = {
      date: new Date(candle.timestamp).toLocaleDateString(),
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
      volume: candle.volume,
    }

    // Add indicators
    if (indicators.sma_20 && indicators.sma_20[index] !== null) {
      dataPoint.sma20 = indicators.sma_20[index]
    }
    if (indicators.sma_50 && indicators.sma_50[index] !== null) {
      dataPoint.sma50 = indicators.sma_50[index]
    }
    if (indicators.rsi && indicators.rsi[index] !== null) {
      dataPoint.rsi = indicators.rsi[index]
    }

    return dataPoint
  })

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Chart View</h1>
        <div className="flex items-center space-x-4">
          <select
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="AAPL">AAPL</option>
            <option value="GOOGL">GOOGL</option>
            <option value="MSFT">MSFT</option>
            <option value="TSLA">TSLA</option>
            <option value="BTC">BTC</option>
          </select>
          <select
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="1d">Daily</option>
            <option value="1h">Hourly</option>
            <option value="5m">5 Minutes</option>
            <option value="1m">1 Minute</option>
          </select>
        </div>
      </div>

      {/* Indicator Toggles */}
      <div className="mb-6 flex items-center space-x-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showSMA}
            onChange={(e) => setShowSMA(e.target.checked)}
            className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
          />
          <span className="text-sm font-medium text-gray-700">SMA (20, 50)</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showRSI}
            onChange={(e) => setShowRSI(e.target.checked)}
            className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
          />
          <span className="text-sm font-medium text-gray-700">RSI</span>
        </label>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          <p className="mt-4 text-gray-600">Loading chart data...</p>
        </div>
      ) : (
        <>
          {/* Main Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Price Chart</h2>
            <ResponsiveContainer width="100%" height={500}>
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="date" stroke="#94A3B8" />
                <YAxis yAxisId="left" stroke="#94A3B8" />
                <YAxis yAxisId="right" orientation="right" stroke="#94A3B8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="high"
                  fill="#38BDF8"
                  fillOpacity={0.1}
                  stroke="#38BDF8"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="close"
                  stroke="#38BDF8"
                  strokeWidth={2}
                  dot={false}
                />
                {showSMA && (
                  <>
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="sma20"
                      stroke="#22C55E"
                      strokeWidth={1}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="sma50"
                      stroke="#EF4444"
                      strokeWidth={1}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  </>
                )}
                {showRSI && (
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="rsi"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    dot={false}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Volume Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Volume</h2>
            <ResponsiveContainer width="100%" height={200}>
              <ComposedChart data={chartData}>
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
                <Bar dataKey="volume" fill="#38BDF8" fillOpacity={0.6} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  )
}

export default ChartView

