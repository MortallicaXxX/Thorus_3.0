"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Electron__app, _Electron__Engine;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Electron = void 0;
const electron_1 = require("electron");
class Electron {
    constructor(engine) {
        _Electron__app.set(this, void 0);
        _Electron__Engine.set(this, void 0);
        __classPrivateFieldSet(this, _Electron__Engine, engine, "f");
    }
    get app() { return __classPrivateFieldGet(this, _Electron__app, "f"); }
    get Ipc() { return electron_1.ipcMain; }
    get dialog() { return electron_1.dialog; }
    /** Retourne une promesse résolue l'orsque l'app a démarrer */
    CreateApp() {
        __classPrivateFieldSet(this, _Electron__app, electron_1.app, "f");
        return this.app.whenReady();
    }
    NewWindow(options) {
        return new electron_1.BrowserWindow(Object.assign({ width: 800, height: 600, webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            } }, (options ? options : {})));
    }
    On(chanel, callback) {
        this.app.on(chanel, callback);
    }
}
exports.Electron = Electron;
_Electron__app = new WeakMap(), _Electron__Engine = new WeakMap();
//# sourceMappingURL=Electron.js.map