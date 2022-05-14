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
var _Dialog__window, _Dialog__handler, _Dialog__name, _Dialog__onceClose, _Dialog__onceValidate, _DialogsHandler__engine, _DialogsHandler__windows, _DialogsHandler__onMessage;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogsHandler = exports.Dialog = void 0;
const Repertory_1 = require("./Repertory");
class Dialog {
    constructor(name, option = null, window, dialogshandler) {
        _Dialog__window.set(this, void 0);
        _Dialog__handler.set(this, void 0);
        _Dialog__name.set(this, void 0);
        _Dialog__onceClose.set(this, void 0);
        _Dialog__onceValidate.set(this, void 0);
        const _this = this;
        __classPrivateFieldSet(this, _Dialog__window, window, "f");
        __classPrivateFieldSet(this, _Dialog__handler, dialogshandler, "f");
        __classPrivateFieldSet(this, _Dialog__name, name, "f");
        window.webContents.once('did-finish-load', function () {
            window.webContents.send('dialog-launcher', { name: _this.name, option: option });
        });
        window.once('close', function () {
            _this.handler.engine.Ipc.removeAllListeners(`dialog-${_this.name}-close`);
            _this.handler.engine.Ipc.removeAllListeners(`dialog-${_this.name}-validate`);
            _this.handler.Remove(_this.name);
        });
        this.handler.engine.Ipc.on(`dialog-${_this.name}-close`, function (event, message) {
            if (_this.onClose)
                _this.onClose(event, message);
            window.close();
        });
        this.handler.engine.Ipc.on(`dialog-${_this.name}-validate`, function (event, message) {
            if (_this.onValidate)
                _this.onValidate(event, message);
            window.close();
        });
    }
    get window() { return __classPrivateFieldGet(this, _Dialog__window, "f"); }
    get handler() { return __classPrivateFieldGet(this, _Dialog__handler, "f"); }
    get name() { return __classPrivateFieldGet(this, _Dialog__name, "f"); }
    onceClose(callback) { __classPrivateFieldSet(this, _Dialog__onceClose, callback, "f"); }
    get onClose() { return __classPrivateFieldGet(this, _Dialog__onceClose, "f"); }
    onceValidate(callback) { __classPrivateFieldSet(this, _Dialog__onceValidate, callback, "f"); }
    get onValidate() { return __classPrivateFieldGet(this, _Dialog__onceValidate, "f"); }
}
exports.Dialog = Dialog;
_Dialog__window = new WeakMap(), _Dialog__handler = new WeakMap(), _Dialog__name = new WeakMap(), _Dialog__onceClose = new WeakMap(), _Dialog__onceValidate = new WeakMap();
class DialogsHandler {
    constructor(engine) {
        _DialogsHandler__engine.set(this, void 0);
        _DialogsHandler__windows.set(this, {});
        _DialogsHandler__onMessage.set(this, null);
        __classPrivateFieldSet(this, _DialogsHandler__engine, engine, "f");
    }
    get engine() { return __classPrivateFieldGet(this, _DialogsHandler__engine, "f"); }
    get windows() { return __classPrivateFieldGet(this, _DialogsHandler__windows, "f"); }
    set onMessage(callback) { __classPrivateFieldSet(this, _DialogsHandler__onMessage, callback, "f"); }
    get onMessage() { return __classPrivateFieldGet(this, _DialogsHandler__onMessage, "f"); }
    Create(dialogName, option = null) {
        // const _this:DialogsHandler = this;
        // console.log(this.isExist(dialogName));
        if (!this.isExist(dialogName)) {
            const window = this.engine.CreateWindow({
                height: 200,
                width: 600,
                resizable: false,
                frame: false,
                roundedCorners: true,
            });
            window.loadFile(Repertory_1.Repertory.Path.join(__dirname, `../../src/views/Dialogs.View.html`));
            this.windows[dialogName] = window;
            return new Dialog(dialogName, option, this.windows[dialogName], this);
        }
    }
    get DialogsNames() {
        return Object.keys(this.windows);
    }
    GetDialogByName(dialogName) {
        return this.windows[dialogName];
    }
    isExist(dialogName) {
        return this.DialogsNames.includes(dialogName);
    }
    Remove(dialogName) {
        delete this.windows[dialogName];
    }
    CloseWindow(dialogName) {
        this.windows[dialogName].close();
    }
    CloseAllWindows() {
        for (const windowKey of this.DialogsNames) {
            this.CloseWindow(windowKey);
        }
    }
}
exports.DialogsHandler = DialogsHandler;
_DialogsHandler__engine = new WeakMap(), _DialogsHandler__windows = new WeakMap(), _DialogsHandler__onMessage = new WeakMap();
//# sourceMappingURL=Dialogs.js.map