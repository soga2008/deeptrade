import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ErrorBoundary from './components/ErrorBoundary'
import Dashboard from './pages/Dashboard'
import ChartView from './pages/ChartView'
import Predictions from './pages/Predictions'
import BacktestResults from './pages/BacktestResults'
import MathReference from './pages/MathReference'
import Settings from './pages/Settings'
import client from './api/client'

function App() {
  useEffect(() => {
    // Test backend connection on app load
    client.get('/health')
      .then(() => console.log('✅ Backend connection successful'))
      .catch((error) => console.error('❌ Backend connection failed:', error))
  }, [])

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/chart" element={<ChartView />} />
              <Route path="/predictions" element={<Predictions />} />
              <Route path="/backtest" element={<BacktestResults />} />
              <Route path="/math" element={<MathReference />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App
