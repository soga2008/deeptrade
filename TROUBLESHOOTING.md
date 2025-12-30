# 🔧 Troubleshooting Guide

## Port Already in Use Error

### Quick Fix:
```bash
# Find process using port 5173
netstat -ano | findstr :5173

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Or Use Different Port:
The Vite config is now set to automatically use the next available port if 5173 is busy.

---

## Vite CJS Deprecation Warning

**Status:** ✅ Fixed

The warning about "CJS build of Vite's Node API is deprecated" is now resolved. The config has been updated to use ES modules properly.

**What was changed:**
- Updated `vite.config.js` to use ES modules
- Added `optimizeDeps` configuration
- Set `strictPort: false` to allow port flexibility

---

## Common Issues & Solutions

### Backend Port 8000 Already in Use

```bash
# Find and kill process
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Or change port in backend/main.py
# Change: uvicorn.run(..., port=8000)
# To: uvicorn.run(..., port=8001)
```

### Frontend Won't Start

1. **Clear node_modules and reinstall:**
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check Node.js version:**
   ```bash
   node --version  # Should be >= 18
   ```

### Backend Import Errors

1. **Activate virtual environment:**
   ```bash
   cd backend
   .\venv\Scripts\activate  # Windows
   # or
   source venv/bin/activate  # Linux/Mac
   ```

2. **Reinstall dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

### Module Not Found Errors

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
```

---

## VS Code Specific Issues

### Tasks Not Working

1. Reload VS Code: `Ctrl+Shift+P` → `Developer: Reload Window`
2. Check if tasks.json exists in `.vscode/` folder
3. Verify terminal is using correct shell (PowerShell/CMD)

### Debug Not Starting

1. Check Python interpreter: `Ctrl+Shift+P` → `Python: Select Interpreter`
2. Ensure virtual environment is activated
3. Check launch.json configuration

---

## Still Having Issues?

1. **Check all processes:**
   ```bash
   # Windows
   tasklist | findstr python
   tasklist | findstr node
   
   # Kill all Node processes (use with caution)
   taskkill /F /IM node.exe
   ```

2. **Restart VS Code completely**

3. **Clear all caches:**
   ```bash
   # Frontend
   cd frontend
   rm -rf node_modules .vite dist
   npm install
   
   # Backend
   cd backend
   rm -rf __pycache__ .pytest_cache
   ```

---

**Need more help?** Check the main README.md or RUN_IN_VSCODE.md








