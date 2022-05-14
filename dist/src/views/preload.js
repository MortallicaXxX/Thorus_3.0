const { ipcRenderer, contextBridge } = require('electron');
// contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer)
contextBridge.exposeInMainWorld("electron", { ipcRenderer: Object.assign(Object.assign({}, ipcRenderer), { on: ipcRenderer.on }) });
//# sourceMappingURL=preload.js.map