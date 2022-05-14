const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const Engine = new (require('./Engine'))();
const HtmlViewer = require('./HTMLViewer');
// const Engine = new (require('./src/Engine'))();
const fs = require('fs');
app.whenReady().then(() => {
    Engine.CreateWindow('index');
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            Engine.CreateWindow('index');
        }
    });
});
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
ipcMain.on('thorium_template', function (event, message) {
    if (Engine.IsWindowActive('htmlview')) {
        HtmlViewer.JsInjection(Engine, `
      (async function(){

        const App = await ObjectParser(${message});

        const view = class extends View{

          constructor(){
            super(App);
          }

        }

        document.body.innerHTML = '';

        thorium.Vue(view).Show();

      })()
    `);
    }
    event.returnValue = '';
});
ipcMain.on('css', function (event, message) {
    if (Engine.IsWindowActive('htmlview')) {
        HtmlViewer.CssInjection(Engine, message);
    }
    event.returnValue = '';
});
ipcMain.on('thorium_arch_template_export', function (event, message) {
    message = JSON.parse(message);
    fs.writeFile(`${message.filePath}.json`, JSON.stringify(message.template, null, 2), function (error, result) {
        if (error)
            event.returnValue = 'false';
        else
            event.returnValue = '';
    });
});
ipcMain.on('thorium_arch_css_export', function (event, message) {
    message = JSON.parse(message);
    fs.writeFile(`${message.filePath}.css`, message.template, function (error, result) {
        if (error)
            event.returnValue = 'false';
        else
            event.returnValue = '';
    });
});
//# sourceMappingURL=app.js.map