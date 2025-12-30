import { useState, useEffect } from 'react'
import { Save, Settings as SettingsIcon } from 'lucide-react'
import { getSettings, updateSettings } from '../api/client'

function Settings() {
  const [settings, setSettings] = useState({
    model: {
      model_name: 'Kimi K2AI',
      model_version: 'v1',
      sequence_length: 100,
      use_gpu: false,
    },
    risk: {
      max_position_size: 0.1,
      stop_loss_pct: 2.0,
      take_profit_pct: 5.0,
      max_daily_loss: 5.0,
      max_leverage: 1.0,
    },
    trading: {
      strategy: 'momentum',
      indicators: ['SMA', 'RSI'],
      entry_threshold: 0.02,
      exit_threshold: 0.01,
      min_holding_period: 1,
    },
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const data = await getSettings()
      setSettings(data)
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      await updateSettings(settings)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const updateModelSetting = (key, value) => {
    // Only allow updating sequence_length and use_gpu
    // Model name and version are fixed to Kimi K2AI
    if (key === 'model_name' || key === 'model_version') {
      return // Don't allow changing model name or version
    }
    setSettings({
      ...settings,
      model: { ...settings.model, [key]: value },
    })
  }

  const updateRiskSetting = (key, value) => {
    setSettings({
      ...settings,
      risk: { ...settings.risk, [key]: value },
    })
  }

  const updateTradingSetting = (key, value) => {
    setSettings({
      ...settings,
      trading: { ...settings.trading, [key]: value },
    })
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">Configure AI model, risk parameters, and trading strategy</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      {/* AI Model Info */}
      <div className="bg-gradient-to-br from-primary to-gray-800 rounded-xl shadow-sm border border-accent p-6 mb-6 text-white">
        <div className="flex items-center space-x-2 mb-4">
          <SettingsIcon className="w-5 h-5 text-accent" />
          <h2 className="text-xl font-semibold">AI Model: Kimi K2AI</h2>
        </div>
        <div className="space-y-3">
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-sm text-gray-300 mb-3">Model Information</p>
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <span className="text-gray-400">Model:</span>
                <span className="ml-2 font-medium text-accent">Kimi K2AI</span>
              </div>
              <div>
                <span className="text-gray-400">Version:</span>
                <span className="ml-2 font-medium">{settings.model.model_version || 'v1'}</span>
              </div>
              <div>
                <span className="text-gray-400">Status:</span>
                <span className="ml-2 font-medium text-success">✓ Active</span>
              </div>
              <div>
                <span className="text-gray-400">GPU:</span>
                <span className="ml-2 font-medium">{settings.model.use_gpu ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>
            <div className="border-t border-white/20 pt-3">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Lookback Periods (for predictions)
              </label>
              <input
                type="number"
                value={settings.model.sequence_length}
                onChange={(e) => updateModelSetting('sequence_length', Number(e.target.value))}
                min="10"
                max="500"
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <p className="text-xs text-gray-400 mt-1">Number of historical periods the model uses for predictions (10-500)</p>
            </div>
            <div className="mt-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.model.use_gpu}
                  onChange={(e) => updateModelSetting('use_gpu', e.target.checked)}
                  className="w-4 h-4 text-accent border-white/20 rounded focus:ring-accent bg-white/10"
                />
                <span className="text-sm text-gray-300">Use GPU Acceleration (if available)</span>
              </label>
            </div>
          </div>
          <p className="text-sm text-gray-300">
            <strong className="text-white">Kimi K2AI</strong> is a deep learning model optimized for financial time series prediction. 
            It uses LSTM (Long Short-Term Memory) architecture to analyze price patterns and generate accurate predictions.
          </p>
        </div>
      </div>

      {/* Risk Parameters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center space-x-2 mb-6">
          <SettingsIcon className="w-5 h-5 text-accent" />
          <h2 className="text-xl font-semibold text-gray-900">Risk Management</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Position Size (% of capital)
            </label>
            <input
              type="number"
              step="0.01"
              value={settings.risk.max_position_size}
              onChange={(e) => updateRiskSetting('max_position_size', Number(e.target.value))}
              min="0"
              max="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stop Loss (%)</label>
              <input
                type="number"
                step="0.1"
                value={settings.risk.stop_loss_pct}
                onChange={(e) => updateRiskSetting('stop_loss_pct', Number(e.target.value))}
                min="0"
                max="10"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Take Profit (%)</label>
              <input
                type="number"
                step="0.1"
                value={settings.risk.take_profit_pct}
                onChange={(e) => updateRiskSetting('take_profit_pct', Number(e.target.value))}
                min="0"
                max="20"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Daily Loss (%)</label>
              <input
                type="number"
                step="0.1"
                value={settings.risk.max_daily_loss}
                onChange={(e) => updateRiskSetting('max_daily_loss', Number(e.target.value))}
                min="0"
                max="20"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Leverage</label>
              <input
                type="number"
                step="0.1"
                value={settings.risk.max_leverage}
                onChange={(e) => updateRiskSetting('max_leverage', Number(e.target.value))}
                min="1"
                max="10"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Trading Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <SettingsIcon className="w-5 h-5 text-accent" />
          <h2 className="text-xl font-semibold text-gray-900">Trading Strategy</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Strategy</label>
            <select
              value={settings.trading.strategy}
              onChange={(e) => updateTradingSetting('strategy', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="momentum">Momentum</option>
              <option value="mean_reversion">Mean Reversion</option>
              <option value="breakout">Breakout</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Active Indicators</label>
            <div className="space-y-2">
              {['SMA', 'EMA', 'RSI', 'MACD', 'Bollinger Bands'].map((indicator) => (
                <label key={indicator} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.trading.indicators.includes(indicator)}
                    onChange={(e) => {
                      const indicators = e.target.checked
                        ? [...settings.trading.indicators, indicator]
                        : settings.trading.indicators.filter((i) => i !== indicator)
                      updateTradingSetting('indicators', indicators)
                    }}
                    className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                  />
                  <span className="text-sm text-gray-700">{indicator}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Entry Threshold</label>
              <input
                type="number"
                step="0.01"
                value={settings.trading.entry_threshold}
                onChange={(e) => updateTradingSetting('entry_threshold', Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Exit Threshold</label>
              <input
                type="number"
                step="0.01"
                value={settings.trading.exit_threshold}
                onChange={(e) => updateTradingSetting('exit_threshold', Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Min Holding Period (hours)</label>
            <input
              type="number"
              value={settings.trading.min_holding_period}
              onChange={(e) => updateTradingSetting('min_holding_period', Number(e.target.value))}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings

