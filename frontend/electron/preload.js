// Preload script for Electron
// This runs in a context that has access to both DOM and Node.js APIs
// but is isolated from the main renderer process for security

const { contextBridge } = require('electron')

// Expose protected methods that allow the renderer process
// to use Node.js APIs without exposing the entire Node.js API
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron
  }
})

