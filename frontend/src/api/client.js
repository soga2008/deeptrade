import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Market Data
export const getMarketData = async (symbol, startDate, endDate, interval = '1d') => {
  try {
    const response = await client.get(`/api/market-data/${symbol}`, {
      params: { start_date: startDate, end_date: endDate, interval },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching market data:', error)
    throw error
  }
}

export const getLatestPrice = async (symbol) => {
  try {
    const response = await client.get(`/api/market-data/${symbol}/latest`)
    return response.data
  } catch (error) {
    console.error('Error fetching latest price:', error)
    throw error
  }
}

// Indicators
export const getIndicators = async (symbol, startDate, endDate) => {
  const response = await client.get(`/api/indicators/${symbol}`, {
    params: { start_date: startDate, end_date: endDate },
  })
  return response.data
}

// Backtesting
export const runBacktest = async (config) => {
  const response = await client.post('/api/backtest', config)
  return response.data
}

export const quickBacktest = async (symbol, days = 365) => {
  const response = await client.get(`/api/backtest/${symbol}/quick`, {
    params: { days },
  })
  return response.data
}

// AI Predictions
export const getPrediction = async (symbol, lookbackPeriods = 100) => {
  try {
    const response = await client.get(`/api/predict/${symbol}`, {
      params: { lookback_periods: lookbackPeriods },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching prediction:', error)
    throw error
  }
}

export const predictPrice = async (request) => {
  const response = await client.post('/api/predict', request)
  return response.data
}

// Risk Metrics
export const calculateRisk = async (equityCurve, trades) => {
  const response = await client.post('/api/risk', {
    equity_curve: equityCurve,
    trades: trades,
  })
  return response.data
}

// Settings
export const getSettings = async () => {
  const response = await client.get('/api/settings')
  return response.data
}

export const updateSettings = async (settings) => {
  const response = await client.post('/api/settings', settings)
  return response.data
}

export default client

