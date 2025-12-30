# 🖥️ Run as Desktop App in VS Code

## Quick Start - Desktop App

### Method 1: Using Tasks (Easiest)

1. **Press `Ctrl+Shift+P`** (Command Palette)
2. Type: **`Tasks: Run Task`**
3. Select: **`start-desktop-app`**

This will:
- ✅ Start the backend server
- ✅ Start the Electron desktop app
- ✅ Open in a desktop window (not browser)

---

### Method 2: Using Debug

1. **Press `F5`** or click Debug icon
2. Select: **`Launch Desktop App (Electron)`**
3. The desktop window will open!

---

### Method 3: Manual (Terminal)

**Terminal 1 - Backend:**
```bash
cd backend
python main.py
```

**Terminal 2 - Desktop App:**
```bash
cd frontend
npm run electron:dev
```

---

## What's the Difference?

| Method | Opens In |
|--------|----------|
| `start-all` | Browser (website) |
| `start-desktop-app` | Desktop Window (app) |
| `start-electron` | Desktop Window (app) |

---

## Troubleshooting

### Desktop window doesn't open
- Make sure backend is running first
- Check terminal for errors
- Try: `cd frontend && npm run electron:dev`

### "Electron not found" error
```bash
cd frontend
npm install
```

### App opens but shows blank page
- Wait a few seconds for Vite to start
- Check that backend is on port 8000
- Look at Electron console (View → Toggle Developer Tools)

---

## Quick Reference

**To run as DESKTOP APP:**
- `Ctrl+Shift+P` → `Tasks: Run Task` → `start-desktop-app`

**To run as WEBSITE:**
- `Ctrl+Shift+P` → `Tasks: Run Task` → `start-all`

---

**The desktop app will open in a native window, not a browser!** 🎉








