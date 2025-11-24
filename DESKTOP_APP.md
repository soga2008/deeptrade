# 🖥️ Desktop Application Guide

## Quick Start

### Run as Desktop App

1. **Start the backend:**
```bash
cd backend
python main.py
```

2. **Run the Electron app:**
```bash
cd frontend
npm run electron:dev
```

The app will open in a desktop window! 🎉

---

## What Changed?

Your web application is now also a **native desktop application** using Electron!

### Benefits:
- ✅ Runs as a standalone desktop app
- ✅ No browser needed
- ✅ Native window controls
- ✅ Can be packaged as an installer
- ✅ Works offline (once backend is bundled)

---

## Development Mode

In development, you need to run the backend separately:

```bash
# Terminal 1: Backend
cd backend
python main.py

# Terminal 2: Desktop App
cd frontend
npm run electron:dev
```

The `electron:dev` command will:
1. Start the Vite dev server
2. Wait for it to be ready
3. Launch Electron with your app

---

## Building for Distribution

### Windows Installer

```bash
cd frontend
npm run electron:build:win
```

This creates:
- `dist-electron/AI Trading Application Setup.exe` - Installer
- `dist-electron/win-unpacked/` - Portable version

### macOS DMG

```bash
cd frontend
npm run electron:build:mac
```

Creates: `dist-electron/AI Trading Application.dmg`

### Linux AppImage

```bash
cd frontend
npm run electron:build:linux
```

Creates: `dist-electron/AI Trading Application.AppImage`

---

## Features

### Native Menu Bar
- File, Edit, View, Window, Help menus
- Keyboard shortcuts
- About dialog

### Window Controls
- Minimize, maximize, close
- Resizable window
- Minimum size constraints

### Security
- Context isolation enabled
- Node integration disabled
- Secure preload script

---

## Customization

### Change App Icon

Replace these files in `frontend/electron/`:
- `icon.ico` - Windows icon
- `icon.icns` - macOS icon  
- `icon.png` - Linux icon

### Change App Name

Edit `frontend/package.json`:
```json
{
  "build": {
    "productName": "Your App Name"
  }
}
```

### Change Window Size

Edit `frontend/electron/main.js`:
```javascript
mainWindow = new BrowserWindow({
  width: 1400,  // Change this
  height: 900,  // Change this
})
```

---

## Troubleshooting

### App won't start
- Make sure backend is running on port 8000
- Check that Vite dev server is on port 5173
- Look at the Electron console for errors

### Build fails
- Ensure all dependencies are installed: `npm install`
- Check that Python backend is accessible
- Verify icon files exist

### Backend not connecting
- In development: Make sure backend is running separately
- In production: Backend should auto-start (if bundled)

---

## Next Steps

1. **Add an icon**: Create proper icon files for your app
2. **Bundle backend**: Package Python backend with the app (using PyInstaller)
3. **Code signing**: Sign the app for distribution
4. **Auto-updater**: Add update functionality

---

**Enjoy your desktop application!** 🚀

