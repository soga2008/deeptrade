# 🚀 Running the App in VS Code

## 🖥️ Run as Desktop App (Recommended)

### Quick Start - Desktop Application

1. **Press `Ctrl+Shift+P`** (Command Palette)
2. Type: **`Tasks: Run Task`**
3. Select: **`start-desktop-app`** ⭐

This opens the app in a **desktop window** (not browser)!

---

## 🌐 Run as Website

### Method 1: Using VS Code Tasks

1. **Open Command Palette:**
   - Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)

2. **Run Tasks:**
   - Type: `Tasks: Run Task`
   - Select: `start-all` (runs both backend and frontend in browser)

   OR

   - Select: `start-backend` (backend only)
   - Select: `start-frontend` (frontend only)

3. **Access the App:**
   - Backend: http://localhost:8000
   - Frontend: http://localhost:5173 (opens in browser)

---

### Method 2: Using Integrated Terminal

1. **Open Terminal:**
   - Press `` Ctrl+` `` (backtick) or `View → Terminal`

2. **Start Backend:**
   ```bash
   cd backend
   python main.py
   ```

3. **Open New Terminal:**
   - Click the `+` button in terminal panel
   - Or press `Ctrl+Shift+` `` (backtick)

4. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

---

### Method 3: Using Debug Configuration

1. **Open Run and Debug:**
   - Press `F5` or click the Debug icon in sidebar
   - Or go to `Run → Start Debugging`

2. **Select Configuration:**
   - Choose: `Python: FastAPI Backend`
   - This will start the backend with debugging enabled

3. **Start Frontend Separately:**
   - Use Method 2 or Task: `start-frontend`

---

### Method 4: Run as Desktop App (Electron)

1. **Start Backend First:**
   - Use any method above to start backend

2. **Run Electron:**
   - Command Palette → `Tasks: Run Task` → `start-electron`
   - OR in terminal: `cd frontend && npm run electron:dev`

---

## Terminal Shortcuts

- **New Terminal:** `` Ctrl+Shift+` ``
- **Split Terminal:** `` Ctrl+\ ``
- **Kill Terminal:** `Ctrl+C` (when terminal is focused)

---

## Debugging

### Backend Debugging

1. Set breakpoints in Python files
2. Press `F5` or select `Python: FastAPI Backend`
3. Execution will pause at breakpoints
4. Use Debug panel to inspect variables

### Frontend Debugging

1. Open browser DevTools (`F12`)
2. Use React DevTools extension (recommended)
3. Set breakpoints in `.jsx` files
4. Use VS Code's built-in debugger for Node.js

---

## Recommended VS Code Extensions

Install these for better experience:

1. **Python** (Microsoft) - Python support
2. **ES7+ React/Redux/React-Native snippets** - React snippets
3. **Tailwind CSS IntelliSense** - Tailwind autocomplete
4. **ESLint** - JavaScript linting
5. **Prettier** - Code formatting
6. **Thunder Client** - API testing (alternative to Postman)

---

## Troubleshooting

### Backend won't start
- Check if Python is installed: `python --version`
- Activate virtual environment: `cd backend && .\venv\Scripts\activate` (Windows)
- Install dependencies: `pip install -r requirements.txt`

### Frontend won't start
- Check if Node.js is installed: `node --version`
- Install dependencies: `cd frontend && npm install`
- Clear cache: `npm cache clean --force`

### Port already in use
- Backend (8000): Change port in `backend/main.py`
- Frontend (5173): Change in `frontend/vite.config.js`

---

## Quick Commands Reference

| Action | Command |
|--------|---------|
| Start Backend | `cd backend && python main.py` |
| Start Frontend | `cd frontend && npm run dev` |
| Start Electron | `cd frontend && npm run electron:dev` |
| Install Backend Deps | `cd backend && pip install -r requirements.txt` |
| Install Frontend Deps | `cd frontend && npm install` |

---

**Happy Coding! 🎉**

