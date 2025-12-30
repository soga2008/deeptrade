# 📦 Building Installable Desktop App

## Quick Build (Windows)

### Step 1: Build Frontend
```bash
cd frontend
npm run build
```

### Step 2: Build Installer
```bash
npm run electron:build:win
```

This creates an installer in `frontend/dist-electron/`

---

## Detailed Steps

### Prerequisites
1. ✅ Backend dependencies installed
2. ✅ Frontend dependencies installed
3. ✅ Node.js and npm working

### Build Process

#### 1. Prepare Backend for Packaging

The backend needs to be packaged with the app. We'll use PyInstaller to create an executable.

**Option A: Bundle Python Backend (Recommended)**

```bash
# Install PyInstaller
cd backend
pip install pyinstaller

# Create executable
pyinstaller --onefile --name "ai-trading-backend" main.py

# This creates: backend/dist/ai-trading-backend.exe
```

**Option B: Include Python Scripts (Simpler)**

For now, we'll bundle the Python scripts and require Python to be installed.

#### 2. Build Frontend

```bash
cd frontend
npm run build
```

This creates optimized production files in `frontend/dist/`

#### 3. Build Electron App

**Windows:**
```bash
npm run electron:build:win
```

**macOS:**
```bash
npm run electron:build:mac
```

**Linux:**
```bash
npm run electron:build:linux
```

---

## Output Files

### Windows
- **Installer**: `frontend/dist-electron/AI Trading Application Setup.exe`
- **Portable**: `frontend/dist-electron/win-unpacked/` (run `AI Trading Application.exe`)

### macOS
- **DMG**: `frontend/dist-electron/AI Trading Application.dmg`

### Linux
- **AppImage**: `frontend/dist-electron/AI Trading Application.AppImage`

---

## Installation

### Windows
1. Run `AI Trading Application Setup.exe`
2. Follow installer wizard
3. App installs to `C:\Users\YourName\AppData\Local\Programs\ai-trading-app\`
4. Shortcut created on desktop and Start menu

### macOS
1. Open `AI Trading Application.dmg`
2. Drag app to Applications folder
3. Run from Applications

### Linux
1. Make AppImage executable: `chmod +x "AI Trading Application.AppImage"`
2. Double-click to run

---

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
cd frontend
rm -rf node_modules dist dist-electron
npm install
npm run build
npm run electron:build:win
```

### Backend Not Starting
- Ensure Python is installed on target machine
- Or bundle backend as executable (PyInstaller)

### App Too Large
- Remove unused dependencies
- Use production builds only
- Exclude dev dependencies

---

## Advanced: Bundle Backend

To create a fully standalone app (no Python required):

### 1. Create Backend Executable
```bash
cd backend
pip install pyinstaller
pyinstaller --onefile --name "backend" --add-data "schema.py;." main.py
```

### 2. Update Electron Main Process
Modify `frontend/electron/main.js` to use the executable:
```javascript
const backendExe = path.join(__dirname, '../../backend/dist/backend.exe')
backendProcess = spawn(backendExe, [], {
  cwd: path.dirname(backendExe)
})
```

### 3. Include in Electron Build
Update `package.json` build config to include backend executable.

---

## Quick Build Script

Create `build-all.bat` (Windows):
```batch
@echo off
echo Building frontend...
cd frontend
call npm run build
echo Building installer...
call npm run electron:build:win
echo Done! Check frontend/dist-electron/
pause
```

---

**Your installer will be ready in `frontend/dist-electron/`!** 🎉

