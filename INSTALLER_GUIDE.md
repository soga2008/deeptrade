# 📦 How to Build an Installable App

## ✅ Quick Solution (WORKING!)

### Step 1: Build the App

```bash
cd frontend
npm run electron:package:win
```

This creates a portable app in `frontend/dist/AI Trading Application-win32-x64/` that you can:
- **Run directly** by double-clicking `AI Trading Application.exe`
- **Zip and share** - users can extract and run it
- **Create a shortcut** to the exe file

### Step 2: Test It

1. Navigate to `frontend/dist/AI Trading Application-win32-x64/`
2. Double-click `AI Trading Application.exe`
3. The app should launch!

### Step 3: Distribute It

1. Zip the entire `AI Trading Application-win32-x64` folder
2. Share the zip file
3. Users extract and run `AI Trading Application.exe`

---

## Alternative: Using electron-builder (Has Code Signing Issues)

If you want to try electron-builder (may require admin privileges):

---

## Alternative: Manual Packaging

If electron-builder has issues, you can manually package the app:

### Option 1: Portable App (Recommended)

1. **Build frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Copy files to a folder:**
   - Create folder: `AI-Trading-App`
   - Copy `frontend/dist-electron/win-unpacked/` contents to it
   - Copy `backend/` folder to it
   - Create a `start.bat` file:

   ```batch
   @echo off
   echo Starting AI Trading Application...
   start "" "AI Trading Application.exe"
   ```

3. **Zip the folder** and share it!

---

## Option 2: Use Electron Packager (Simpler)

Install electron-packager:
```bash
cd frontend
npm install --save-dev electron-packager
```

Build:
```bash
npx electron-packager . "AI Trading Application" --platform=win32 --arch=x64 --out=dist --overwrite
```

This creates a portable app in `frontend/dist/` that you can zip and distribute.

---

## Option 3: Fix Code Signing Issue

The build is failing because of code signing cache issues. To fix:

1. **Run PowerShell as Administrator**
2. **Clear the cache:**
   ```powershell
   Remove-Item -Recurse -Force "$env:LOCALAPPDATA\electron-builder\Cache\winCodeSign"
   ```
3. **Try building again:**
   ```bash
   cd frontend
   npx electron-builder --win portable --config.win.sign=false
   ```

---

## What Users Need

### For Unpacked/Portable Version:
- ✅ Windows 10/11
- ✅ Python 3.8+ installed
- ✅ Extract the zip file
- ✅ Run `AI Trading Application.exe`

### For Full Installer:
- ✅ Windows 10/11
- ✅ Python 3.8+ installed
- ✅ Run the installer
- ✅ App installs to Program Files

---

## Recommended Approach

**For now, use the unpacked version:**

```bash
cd frontend
npm run build
npx electron-builder --win --dir
```

Then zip `frontend/dist-electron/win-unpacked/` and share it. Users can:
1. Extract the zip
2. Double-click `AI Trading Application.exe`
3. Use the app!

---

## Next Steps

1. ✅ Build unpacked version: `npx electron-builder --win --dir`
2. ✅ Test it works
3. ✅ Zip the `win-unpacked` folder
4. ✅ Share with users!

The app will work perfectly - it just won't have a fancy installer. Users can create shortcuts manually if needed.

