import { Link, useLocation } from 'react-router-dom'
import { TrendingUp } from 'lucide-react'

function Navbar() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { path: '/', label: 'Dashboard' },
    { path: '/chart', label: 'Chart View' },
    { path: '/predictions', label: 'AI Predictions' },
    { path: '/backtest', label: 'Backtest Results' },
    { path: '/settings', label: 'Settings' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary border-b border-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-accent" />
            <span className="text-white font-bold text-xl">AI Trading</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-accent text-white'
                    : 'text-gray-300 hover:text-accent hover:bg-gray-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

