import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { POPULAR_SYMBOLS, SYMBOL_CATEGORIES } from '../constants/symbols'

function SymbolSelector({ value, onChange, className = '' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [customSymbol, setCustomSymbol] = useState('')

  const filteredSymbols = POPULAR_SYMBOLS.filter(symbol =>
    symbol.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelect = (symbol) => {
    onChange(symbol)
    setIsOpen(false)
    setSearchTerm('')
  }

  const handleCustomSubmit = (e) => {
    e.preventDefault()
    if (customSymbol.trim()) {
      const symbol = customSymbol.trim().toUpperCase()
      onChange(symbol)
      setCustomSymbol('')
      setIsOpen(false)
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Selected Symbol Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent flex items-center justify-between min-w-[120px]"
      >
        <span className="font-medium">{value || 'Select Symbol'}</span>
        <Search className="w-4 h-4 ml-2 text-gray-400" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-20 max-h-96 overflow-hidden">
            {/* Search Input */}
            <div className="p-3 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search symbols..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  autoFocus
                />
              </div>
            </div>

            {/* Custom Symbol Input */}
            <div className="p-3 border-b border-gray-200 bg-gray-50">
              <form onSubmit={handleCustomSubmit} className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Enter custom symbol (e.g., SPY, QQQ)"
                  value={customSymbol}
                  onChange={(e) => setCustomSymbol(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                  maxLength={10}
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors text-sm font-medium"
                >
                  Add
                </button>
              </form>
            </div>

            {/* Symbol List */}
            <div className="overflow-y-auto max-h-64">
              {/* Popular Symbols */}
              <div className="p-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2">
                  Popular Symbols
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {filteredSymbols.map((symbol) => (
                    <button
                      key={symbol}
                      onClick={() => handleSelect(symbol)}
                      className={`px-3 py-2 text-sm rounded hover:bg-accent hover:text-white transition-colors ${
                        value === symbol
                          ? 'bg-accent text-white font-medium'
                          : 'bg-gray-50 hover:bg-accent/10'
                      }`}
                    >
                      {symbol}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              {Object.entries(SYMBOL_CATEGORIES).map(([category, symbols]) => (
                <div key={category} className="p-2 border-t border-gray-100">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2">
                    {category}
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {symbols
                      .filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((symbol) => (
                        <button
                          key={symbol}
                          onClick={() => handleSelect(symbol)}
                          className={`px-3 py-2 text-sm rounded hover:bg-accent hover:text-white transition-colors ${
                            value === symbol
                              ? 'bg-accent text-white font-medium'
                              : 'bg-gray-50 hover:bg-accent/10'
                          }`}
                        >
                          {symbol}
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default SymbolSelector








