const { ipcRenderer , contextBridge } = require('electron');

// contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer)
contextBridge.exposeInMainWorld("electron", { ipcRenderer: { ...ipcRenderer, on: ipcRenderer.on } });
