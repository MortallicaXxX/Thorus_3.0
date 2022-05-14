const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const HtmlViewer = require('./HTMLViewer');
class Engine {
    constructor() {
        this.windows = {};
    }
    CreateWindow(viewName) {
        const _this = this;
        if (!this.IsWindowActive(viewName)) {
            const win = new BrowserWindow({
                width: 800,
                height: 600,
                webPreferences: {
                    // preload: `${__dirname}/views/preload.js`,
                    // nodeIntegration: true
                    nodeIntegration: true,
                    contextIsolation: false
                }
            });
            this.AddWindow(viewName, win);
            win.loadFile(`${__dirname}/views/${viewName}.html`);
            this.SetViewMenu(viewName, win);
            win.once('close', function (window) {
                _this.RemoveWindow(viewName);
            });
            if (viewName == 'htmlview') {
                win.once('ready-to-show', function (window) {
                    HtmlViewer.JsInjection(_this, `alert("c'est un test")`);
                });
            }
        }
    }
    SetViewMenu(viewName, win) {
        const template = require(`./views/${viewName}.menu.js`)(this);
        const menu = Menu.buildFromTemplate(template);
        win.setMenu(menu);
    }
    AddWindow(viewName, win) {
        this.windows[viewName] = win;
    }
    IsWindowActive(viewName) {
        return Object.keys(this.windows).includes(viewName);
    }
    GetWindow(viewName) {
        return this.windows[viewName];
    }
    RemoveWindow(viewName) {
        delete this.windows[viewName];
    }
    Export(fileData) {
        const indexWindow = this.GetWindow('index');
        indexWindow.webContents.send('get_arch', fileData.filePath);
        if (this.IsWindowActive('codeview')) {
            const codeWindow = this.GetWindow('codeview');
            codeWindow.webContents.send('get_arch', fileData.filePath);
        }
    }
}
module.exports = Engine;
//# sourceMappingURL=Engine.js.map