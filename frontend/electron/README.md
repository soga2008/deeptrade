# Electron Desktop Application

This application can run as a desktop app using Electron.

## Development

### Option 1: Run Electron with Vite Dev Server (Recommended)
```bash
npm run electron:dev
```
This will:
1. Start the Vite dev server
2. Wait for it to be ready
3. Launch Electron

### Option 2: Run Separately
```bash
# Terminal 1: Start Vite dev server
npm run dev

# Terminal 2: Start Electron
npm run electron
```

## Building for Production

### Windows
```bash
npm run electron:build:win
```
Creates an installer in `dist-electron/`

### macOS
```bash
npm run electron:build:mac
```
Creates a DMG file in `dist-electron/`

### Linux
```bash
npm run electron:build:linux
```
Creates an AppImage in `dist-electron/`

## Backend Integration

The Electron app will automatically start the Python backend when running in production mode. In development, you should run the backend separately:

```bash
cd backend
python main.py
```

## Notes

- The app uses port 5173 for the frontend (Vite dev server)
- The backend runs on port 8000
- In production builds, the backend is bundled and started automatically

