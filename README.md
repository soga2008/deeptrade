# 🚀 AI Trading Application

A full-stack AI-powered trading simulator with backtesting, risk analysis, and real-time predictions using Kimi K2AI.

![Tech Stack](https://img.shields.io/badge/React-18.2-blue)
![Tech Stack](https://img.shields.io/badge/FastAPI-0.121-green)
![Tech Stack](https://img.shields.io/badge/PyTorch-2.5-orange)
![Tech Stack](https://img.shields.io/badge/Tailwind-3.3-cyan)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Usage Guide](#usage-guide)
- [Development](#development)

---

## ✨ Features

### Frontend
- 📊 **Dashboard** - Real-time metrics, price charts, and AI predictions
- 📈 **Chart View** - Interactive candlestick charts with technical indicators
- 🤖 **AI Predictions** - Kimi K2AI model predictions with confidence scores
- 📉 **Backtest Results** - Comprehensive backtesting with equity curves and trade analysis
- ⚙️ **Settings** - Configure AI model, risk parameters, and trading strategies

### Backend
- 🔄 **Market Data** - Historical price data generation and management
- 📊 **Technical Indicators** - SMA, EMA, RSI, MACD, Bollinger Bands, ATR
- 🧪 **Backtesting Engine** - Strategy simulation with full trade tracking
- 📉 **Risk Metrics** - Sharpe ratio, Sortino ratio, VaR, CVaR, Max Drawdown
- 🤖 **AI Integration** - Kimi K2AI model for price prediction

---

## 🛠 Tech Stack

### Frontend
- **React 18.2** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Recharts** - Charting library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Lucide React** - Icons

### Backend
- **FastAPI** - Web framework
- **Python 3.12** - Programming language
- **PyTorch** - Deep learning framework
- **NumPy** - Numerical computing
- **Pydantic** - Data validation

---

## 📁 Project Structure

```
deeptradev2/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── schema.py            # Pydantic models
│   ├── price_data.py        # Market data generation
│   ├── indicators.py        # Technical indicators
│   ├── backtester.py        # Backtesting engine
│   ├── risk.py              # Risk metrics
│   ├── ai_model.py          # AI model integration
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── pages/           # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ChartView.jsx
│   │   │   ├── Predictions.jsx
│   │   │   ├── BacktestResults.jsx
│   │   │   └── Settings.jsx
│   │   ├── components/      # Reusable components
│   │   │   └── Navbar.jsx
│   │   ├── api/             # API client
│   │   │   └── client.js
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── docs/
    ├── ui_design.md         # UI design system
    └── math_explanations.md # Mathematical formulas
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** ≥ 18.0
- **npm** ≥ 9.0
- **Python** ≥ 3.10
- **pip** (Python package manager)

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create virtual environment (recommended):**
```bash
python -m venv venv
```

3. **Activate virtual environment:**
   - **Windows:**
     ```bash
     .\venv\Scripts\activate
     ```
   - **Linux/Mac:**
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies:**
```bash
pip install -r requirements.txt
```

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

---

## 🏃 Running the Application

### Option 1: Desktop Application (Recommended)

Run as a native desktop app using Electron:

1. **Start Backend Server:**
```bash
cd backend
python main.py
```

2. **In a new terminal, start the Electron app:**
```bash
cd frontend
npm run electron:dev
```

This will open the application as a desktop window!

### Option 2: Web Application

Run as a web application in your browser:

#### Start Backend Server

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Activate virtual environment (if using):**
   - **Windows:**
     ```bash
     .\venv\Scripts\activate
     ```
   - **Linux/Mac:**
     ```bash
     source venv/bin/activate
     ```

3. **Run FastAPI server:**
```bash
python main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at: **http://localhost:8000**

API documentation (Swagger UI): **http://localhost:8000/docs**

#### Start Frontend Development Server

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Start Vite dev server:**
```bash
npm run dev
```

The frontend will be available at: **http://localhost:5173**

---

## 📡 API Documentation

### Endpoints

#### Market Data
- `GET /api/market-data/{symbol}` - Get historical market data
- `GET /api/market-data/{symbol}/latest` - Get latest price
- `POST /api/market-data` - Get market data via POST

#### Technical Indicators
- `GET /api/indicators/{symbol}` - Get technical indicators

#### Backtesting
- `POST /api/backtest` - Run backtest with configuration
- `GET /api/backtest/{symbol}/quick` - Quick backtest

#### AI Predictions
- `GET /api/predict/{symbol}` - Get AI prediction
- `POST /api/predict` - Get prediction via POST

#### Risk Metrics
- `POST /api/risk` - Calculate risk metrics

#### Settings
- `GET /api/settings` - Get settings
- `POST /api/settings` - Update settings

### Interactive API Docs

Visit **http://localhost:8000/docs** for interactive Swagger UI documentation.

---

## 📖 Usage Guide

### Dashboard

1. Select a trading symbol (AAPL, GOOGL, MSFT, TSLA, BTC)
2. View real-time metrics and price charts
3. Check AI predictions with confidence scores

### Chart View

1. Select symbol and time interval
2. Toggle technical indicators (SMA, RSI)
3. Analyze price patterns and volume

### AI Predictions

1. Select symbol
2. View current prediction with confidence
3. Analyze prediction history and accuracy

### Backtest Results

1. Select symbol and time period
2. Click "Run Backtest"
3. Review metrics, equity curve, and trade history

### Settings

1. Configure AI model parameters
2. Set risk management rules
3. Adjust trading strategy settings

---

## 🔧 Development

### Desktop App Development

**Run Electron app in development:**
```bash
cd frontend
npm run electron:dev
```

This starts the Vite dev server and launches Electron automatically.

### Backend Development

**Run with auto-reload:**
```bash
cd backend
uvicorn main:app --reload
```

**Run tests (if available):**
```bash
pytest
```

### Frontend Development

**Run dev server:**
```bash
cd frontend
npm run dev
```

**Build for production:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

## 📦 Building Desktop Application

### Build for Windows
```bash
cd frontend
npm run electron:build:win
```
Creates an installer in `frontend/dist-electron/`

### Build for macOS
```bash
cd frontend
npm run electron:build:mac
```
Creates a DMG file in `frontend/dist-electron/`

### Build for Linux
```bash
cd frontend
npm run electron:build:linux
```
Creates an AppImage in `frontend/dist-electron/`

The built application will be a standalone executable that includes both frontend and backend!

---

## 🎨 UI Design

The application follows a modern design system inspired by Robinhood, Notion, and Stripe. See `/docs/ui_design.md` for complete design specifications.

**Color Palette:**
- Primary: `#0F172A` (Navy)
- Accent: `#38BDF8` (Sky Blue)
- Success: `#22C55E` (Green)
- Danger: `#EF4444` (Red)

---

## 📐 Mathematical Foundations

All mathematical formulas and calculations are documented in `/docs/math_explanations.md`, including:
- Technical indicators (SMA, EMA, RSI, MACD)
- Risk metrics (Sharpe, Sortino, VaR, CVaR)
- Return calculations
- AI model mathematics

---

## 🐛 Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Change port in main.py or use:
uvicorn main:app --port 8001
```

**Import errors:**
```bash
# Ensure virtual environment is activated
# Reinstall dependencies:
pip install -r requirements.txt --force-reinstall
```

### Frontend Issues

**Port already in use:**
```bash
# Vite will automatically use next available port
# Or specify in vite.config.js
```

**Module not found:**
```bash
# Reinstall dependencies:
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 License

This project is for educational and demonstration purposes.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📧 Support

For issues or questions, please open an issue on the repository.

---

**Built with ❤️ using React, FastAPI, and PyTorch**

