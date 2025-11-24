import { useState, useEffect } from 'react'
import { Play, BarChart3, TrendingUp, TrendingDown } from 'lucide-react'
import { quickBacktest, runBacktest } from '../api/client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function BacktestResults() {
  const [symbol, setSymbol] = useState('AAPL')
  const [days, setDays] = useState(365)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const runQuickBacktest = async () => {
    setLoading(true)
    try {
      const result = await quickBacktest(symbol, days)
      setResults(result)
    } catch (error) {
      console.error('Error running backtest:', error)
      alert('Error running backtest. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const equityData = results?.equity_curve?.map((value, index) => ({
    day: index,
    equity: value,
  })) || []

  const metrics = results
    ? [
        {
          label: 'Total Return',
          value: `${results.total_return > 0 ? '+' : ''}${results.total_return.toFixed(2)}%`,
          color: results.total_return > 0 ? 'text-success' : 'text-danger',
          icon: results.total_return > 0 ? TrendingUp : TrendingDown,
        },
        {
          label: 'Sharpe Ratio',
          value: results.sharpe_ratio.toFixed(2),
          color: 'text-gray-900',
          icon: BarChart3,
        },
        {
          label: 'Max Drawdown',
          value: `${results.max_drawdown.toFixed(2)}%`,
          color: 'text-danger',
          icon: TrendingDown,
        },
        {
          label: 'Win Rate',
          value: `${results.win_rate.toFixed(1)}%`,
          color: 'text-gray-900',
          icon: BarChart3,
        },
        {
          label: 'Total Trades',
          value: results.total_trades.toString(),
          color: 'text-gray-900',
          icon: BarChart3,
        },
        {
          label: 'Profit Factor',
          value: results.profit_factor.toFixed(2),
          color: 'text-gray-900',
          icon: BarChart3,
        },
      ]
    : []

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Backtest Results</h1>
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
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value={30}>30 Days</option>
            <option value={90}>90 Days</option>
            <option value={180}>180 Days</option>
            <option value={365}>1 Year</option>
          </select>
          <button
            onClick={runQuickBacktest}
            disabled={loading}
            className="px-6 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Play className="w-4 h-4" />
            <span>{loading ? 'Running...' : 'Run Backtest'}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          <p className="mt-4 text-gray-600">Running backtest...</p>
        </div>
      ) : results ? (
        <>
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {metrics.map((metric, index) => {
              const Icon = metric.icon
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                </div>
              )
            })}
          </div>

          {/* Equity Curve Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Equity Curve</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={equityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="day" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  formatter={(value) => [`$${value.toFixed(2)}`, 'Equity']}
                />
                <Line
                  type="monotone"
                  dataKey="equity"
                  stroke="#38BDF8"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Trades Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Trades ({results.trades.length})</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entry Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Exit Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entry Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Exit Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Return %
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.trades.slice(-20).reverse().map((trade, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(trade.entry_time).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(trade.exit_time).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            trade.position === 'long'
                              ? 'bg-success/10 text-success'
                              : 'bg-danger/10 text-danger'
                          }`}
                        >
                          {trade.position.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${trade.entry_price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${trade.exit_price.toFixed(2)}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                          trade.profit > 0 ? 'text-success' : 'text-danger'
                        }`}
                      >
                        ${trade.profit.toFixed(2)}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                          trade.profit_pct > 0 ? 'text-success' : 'text-danger'
                        }`}
                      >
                        {trade.profit_pct > 0 ? '+' : ''}
                        {trade.profit_pct.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No backtest results yet. Click "Run Backtest" to get started.</p>
        </div>
      )}
    </div>
  )
}

export default BacktestResults

