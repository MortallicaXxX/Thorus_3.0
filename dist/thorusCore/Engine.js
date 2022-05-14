"use strict";
// const { app, BrowserWindow , ipcMain , Menu } = require('electron');
// const HtmlViewer = require('./HTMLViewer')
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Engine__Electron, _Engine__Dialogs, _Engine__Manager, _Engine__MainWindow, _Engine__debug;
Object.defineProperty(exports, "__esModule", { value: true });
exports.engine = exports.Engine = void 0;
const electron_1 = require("electron");
const debug_1 = require("debug");
const Models_1 = require("./Models");
const Electron_1 = require("./Electron");
const Projects_1 = require("./Projects");
const Repertory_1 = require("./Repertory");
const Dialogs_1 = require("./Dialogs");
/** Moteur de Thorus */
class Engine {
    constructor() {
        _Engine__Electron.set(this, new Electron_1.Electron(this));
        _Engine__Dialogs.set(this, new Dialogs_1.DialogsHandler(this));
        _Engine__Manager.set(this, new Projects_1.Projects.Manager(this));
        _Engine__MainWindow.set(this, null);
        /**  */
        _Engine__debug.set(this, (0, debug_1.default)('Thorus:Engine:⚒️'));
    }
    /** Retourne Electon */
    get electron() { return __classPrivateFieldGet(this, _Engine__Electron, "f"); }
    get dialog() { return __classPrivateFieldGet(this, _Engine__Dialogs, "f"); }
    /** Retourne le manager de projets */
    get manager() { return __classPrivateFieldGet(this, _Engine__Manager, "f"); }
    /** Retourne le projet courant/actif */
    get project() { return this.manager.project; }
    /** Retourne le document du projet courant/actif */
    get document() { return this.project.document; }
    /** Retourne le BrowserWindow du projet courant/actif */
    get mainWindow() { return __classPrivateFieldGet(this, _Engine__MainWindow, "f"); }
    /** Retourne true | false si le projet courant/actif est déjà enregistrer comme projet */
    get isMainWindowActive() { return (this.mainWindow ? true : false); }
    /** Gestionaire de communication fournis par Election */
    get Ipc() { return this.electron.Ipc; }
    /**  */
    get debug() { return __classPrivateFieldGet(this, _Engine__debug, "f"); }
    ;
    /** Démarage de Thorus */
    Start() {
        const _this = this;
        this.debug('Lancement de engine');
        return new Promise(function (next) {
            return __awaiter(this, void 0, void 0, function* () {
                yield _this.electron.CreateApp();
                Models_1.Models.Launcher.Validity()
                    .then(function (result) {
                    next(true);
                });
            });
        });
    }
    /** Extinction de Thorus */
    Exit() {
    }
    /** Création de la fenêtre principale Thorus */
    CreateMainWindow() {
        const _this = this;
        this.debug('CreateMainWindow');
        __classPrivateFieldSet(this, _Engine__MainWindow, this.electron.NewWindow({
            icon: Repertory_1.Repertory.Path.join(__dirname, `../../client/assets/icons/icon.png`),
        }), "f");
        // windows.AddWindow(viewName,win);
        this.mainWindow.loadFile(Repertory_1.Repertory.Path.join(__dirname, `../../src/views/Main.View.html`));
        this.SetViewMenu('Main', this.mainWindow);
        this.mainWindow.once('close', function (window) {
            _this.project.CloseAllWindows();
            _this.dialog.CloseAllWindows();
        });
    }
    get AddWindow() { return this.project.AddWindow; }
    get RemoveWindow() { return this.project.RemoveWindow; }
    get IsWindowActive() { return this.project.IsWindowActive; }
    get GetWindow() { return this.project.GetWindow; }
    /** Création d'une window */
    get CreateWindow() { return function (option, electron = this.electron) { return electron.NewWindow(option); }; }
    /** Définission du menu d'une window */
    SetViewMenu(viewName, win) {
        this.debug('SetViewMenu');
        const template = require(Repertory_1.Repertory.Path.join(__dirname, `../../src/views/${viewName}.View.Menu.js`))(this);
        const menu = electron_1.Menu.buildFromTemplate(template);
        win.setMenu(menu);
    }
}
exports.Engine = Engine;
_Engine__Electron = new WeakMap(), _Engine__Dialogs = new WeakMap(), _Engine__Manager = new WeakMap(), _Engine__MainWindow = new WeakMap(), _Engine__debug = new WeakMap();
/** Instance de l'engine Thorus */
exports.engine = new Engine();
//# sourceMappingURL=Engine.js.map