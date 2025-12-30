const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const { spawn } = require('child_process')
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

let mainWindow
let backendProcess

// Start Python backend
function startBackend() {
  // In packaged app, backend location depends on packaging tool
  // electron-packager: backend should be in resources/app/backend or ../backend
  // In development, it's in ../../backend
  let backendPath
  if (app.isPackaged) {
    // Try multiple possible locations
    const possiblePaths = [
      path.join(process.resourcesPath, 'app', 'backend'),
      path.join(path.dirname(process.execPath), 'resources', 'app', 'backend'),
      path.join(path.dirname(process.execPath), 'backend'),
      path.join(process.resourcesPath, 'app', 'dist-electron', 'win-unpacked', 'backend'),
      path.join(__dirname, '../../backend') // Fallback to relative
    ]
    
    // Find the first path that exists
    for (const possiblePath of possiblePaths) {
      const mainPy = path.join(possiblePath, 'main.py')
      if (require('fs').existsSync(mainPy)) {
        backendPath = possiblePath
        break
      }
    }
    
    // If still not found, use relative path as last resort
    if (!backendPath) {
      backendPath = path.join(__dirname, '../../backend')
    }
  } else {
    backendPath = path.join(__dirname, '../../backend')
  }
  
  const pythonScript = path.join(backendPath, 'main.py')
  
  // Check if backend exists
  if (!require('fs').existsSync(pythonScript)) {
    console.error(`Backend not found at: ${pythonScript}`)
    console.error(`Tried backend path: ${backendPath}`)
    return
  }
  
  // In production, use the bundled Python or a packaged executable
  // For now, assume Python is available in PATH
  const pythonCmd = process.platform === 'win32' ? 'python' : 'python3'
  
  console.log(`Starting backend from: ${backendPath}`)
  console.log(`Python script: ${pythonScript}`)
  
  backendProcess = spawn(pythonCmd, [pythonScript], {
    cwd: backendPath,
    env: { ...process.env, PYTHONUNBUFFERED: '1' },
    shell: true
  })

  backendProcess.stdout.on('data', (data) => {
    const output = data.toString()
    console.log(`Backend: ${output}`)
    // Also log to window console if available
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.executeJavaScript(`console.log('Backend:', ${JSON.stringify(output)})`)
    }
  })

  backendProcess.stderr.on('data', (data) => {
    const error = data.toString()
    console.error(`Backend Error: ${error}`)
    // Also log to window console if available
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.executeJavaScript(`console.error('Backend Error:', ${JSON.stringify(error)})`)
    }
  })

  backendProcess.on('close', (code) => {
    console.log(`Backend process exited with code ${code}`)
  })
}

// Create the main window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    backgroundColor: '#F8FAFC',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    // icon: path.join(__dirname, 'icon.png'), // Icon disabled for now
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    show: false // Don't show until ready
  })

  // Load the app
  if (isDev) {
    // Development: Load from Vite dev server
    mainWindow.loadURL('http://localhost:5173')
    // Open DevTools in development
    mainWindow.webContents.openDevTools()
  } else {
    // Production: Load from built files
    // In packaged app (electron-packager), dist contents are in resources/app/
    let distPath
    if (app.isPackaged) {
      // electron-packager puts dist files directly in app folder
      distPath = path.join(process.resourcesPath, 'app', 'index.html')
      // Fallback: try relative to exe
      if (!require('fs').existsSync(distPath)) {
        distPath = path.join(path.dirname(process.execPath), 'resources', 'app', 'index.html')
      }
      // Another fallback: try dist subfolder
      if (!require('fs').existsSync(distPath)) {
        distPath = path.join(process.resourcesPath, 'app', 'dist', 'index.html')
      }
      if (!require('fs').existsSync(distPath)) {
        distPath = path.join(__dirname, '../dist/index.html')
      }
    } else {
      distPath = path.join(__dirname, '../dist/index.html')
    }
    
    console.log(`Loading app from: ${distPath}`)
    console.log(`File exists: ${require('fs').existsSync(distPath)}`)
    mainWindow.loadFile(distPath)
    
    // Open DevTools in production for debugging (remove in final release)
    mainWindow.webContents.openDevTools()
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    
    // Focus on window
    if (isDev) {
      mainWindow.focus()
    }
  })

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    require('electron').shell.openExternal(url)
    return { action: 'deny' }
  })
}

// Create application menu
function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Exit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit()
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo', label: 'Undo' },
        { role: 'redo', label: 'Redo' },
        { type: 'separator' },
        { role: 'cut', label: 'Cut' },
        { role: 'copy', label: 'Copy' },
        { role: 'paste', label: 'Paste' },
        { role: 'selectAll', label: 'Select All' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload', label: 'Reload' },
        { role: 'forceReload', label: 'Force Reload' },
        { role: 'toggleDevTools', label: 'Toggle Developer Tools' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Actual Size' },
        { role: 'zoomIn', label: 'Zoom In' },
        { role: 'zoomOut', label: 'Zoom Out' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Toggle Full Screen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize', label: 'Minimize' },
        { role: 'close', label: 'Close' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: () => {
            require('electron').dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About AI Trading Application',
              message: 'AI Trading Application',
              detail: 'Version 1.0.0\n\nA full-stack AI-powered trading simulator with backtesting and predictions.'
            })
          }
        }
      ]
    }
  ]

  // macOS specific menu adjustments
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about', label: 'About ' + app.getName() },
        { type: 'separator' },
        { role: 'services', label: 'Services' },
        { type: 'separator' },
        { role: 'hide', label: 'Hide ' + app.getName() },
        { role: 'hideOthers', label: 'Hide Others' },
        { role: 'unhide', label: 'Show All' },
        { type: 'separator' },
        { role: 'quit', label: 'Quit ' + app.getName() }
      ]
    })
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

// App event handlers
app.whenReady().then(() => {
  createWindow()
  createMenu()
  
  // Start backend server
  if (!isDev) {
    // In production, start the bundled backend
    startBackend()
  }
  // In development, assume backend is running separately

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  // Kill backend process
  if (backendProcess) {
    backendProcess.kill()
  }
  
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  // Ensure backend is killed
  if (backendProcess) {
    backendProcess.kill()
  }
})

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault()
    require('electron').shell.openExternal(navigationUrl)
  })
})

