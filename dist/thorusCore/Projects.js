"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Projects = void 0;
const Models_1 = require("./Models");
const Repertory_1 = require("./Repertory");
const Viewer_1 = require("./Viewer");
const Path = require("path");
const Crypto = require("crypto");
const axios_1 = require("axios");
const debug_1 = require("debug");
/** Contient les librairies responsables de la gestion de projets */
var Projects;
(function (Projects) {
    var _Project__Manager, _Project__debug, _Manager_instances, _Manager__CurentProject, _Manager__Engine, _Manager__debug, _Manager__SetCurrentProject, _Manager__CreateEmptyFile, _Manager___Encrypt, _Manager___Decrypt;
    class LibJs {
        constructor(data = {}) {
            for (const key of Object.keys(data)) {
                this[key] = data[key];
            }
        }
        Add(scriptData) {
            this[scriptData.name] = Object.assign(Object.assign({}, scriptData), ('index' in scriptData ? {} : { index: this.GetAllNames().length + 1 }));
        }
        Get(scriptName) {
            if (this.isExist(scriptName))
                return this[scriptName];
        }
        Delete(scriptName) {
            if (this.isExist(scriptName))
                delete this[scriptName];
        }
        DeleteAll() {
            for (const name of this.GetAllNames()) {
                this.Delete(name);
            }
        }
        Update(scriptData) {
            this[scriptData.name] = Object.assign(Object.assign({}, this[scriptData.name]), scriptData);
        }
        GetAllNames() { return Object.keys(this); }
        isExist(scriptName) {
            return this.GetAllNames().includes(scriptName);
        }
    }
    Projects.LibJs = LibJs;
    /** Représente toutes informations d'un projet */
    class Info {
        constructor() {
            /** nom du projet */
            this.name = null;
            /** path du projet */
            this.path = null;
            /** fullpath du projet */
            this.fullPath = null;
            /** extention du projet */
            this.ext = "thproj";
        }
        /** Définission des donnée du projet */
        set data(data) {
            this.name = data.name;
            this.path = data.path;
            this.fullPath = data.fullPath;
        }
    }
    Projects.Info = Info;
    /** Représente les données du projet */
    class Data {
        constructor(data) {
            /** template de l'app */
            this.app = {};
            /** feuilles de style de l'app */
            this.css = {};
            /** librairies | cdn de l'app */
            this.lib = new LibJs;
            this.drawFlow = {};
            this.components = {};
            this.subComponents = {};
            /** workBenchs du projet */
            this.workBench = {};
            this.app = ("app" in data ? data.app : {});
            this.css = ("css" in data ? data.css : {});
            this.lib = ("lib" in data ? new LibJs(data.lib) : new LibJs);
            this.drawFlow = ("drawFlow" in data ? data.drawFlow : {});
            this.components = ("components" in data ? data.components : {});
            this.subComponents = ("subComponents" in data ? data.subComponents : {});
            this.workBench = ("workBench" in data ? data.workBench : {});
        }
    }
    Projects.Data = Data;
    /** Représente la structure distribuable du projet*/
    class Structure {
        constructor(data) {
            /** */
            this.isSaved = true;
            this.name = data.name;
            this.path = data.path;
            if (data)
                this.data = new Projects.Data(data.data);
        }
        get allScriptsName() { return function (_this = this) { return _this.data.lib.GetAllNames(); }; }
        get addScript() { return function (scriptData, _this = this) { return _this.data.lib.Add(scriptData); }; }
        get getScript() { return function (scriptName, _this = this) { return _this.data.lib.Get(scriptName); }; }
        get deleteScript() { return function (scriptName, _this = this) { return _this.data.lib.Delete(scriptName); }; }
        get deleteAllScripts() { return function (_this = this) { return _this.data.lib.DeleteAll(); }; }
        get updateScript() { return function (scriptData, _this = this) { return _this.data.lib.Update(scriptData); }; }
        get isExistScript() { return function (scriptName, _this = this) { return _this.data.lib.isExist(scriptName); }; }
        /** Update du document en fonction des propiétés renseignées */
        Update(data) {
            this.isSaved = false;
            if (data.app)
                this.UpdateApp(data.app);
            if (data.workBench)
                this.UpdateWorkBench(data.workBench);
            if (data.css)
                this.UpdateCSS(data.css);
        }
        /** update de app template du projet */
        UpdateApp(app) {
            this.data.app = app;
        }
        /** update des feuiles de style du projet */
        UpdateCSS(css) {
            this.data.css = css;
        }
        /** update des workBenchs du projet */
        UpdateWorkBench(workBench) {
            this.data.workBench = workBench;
        }
        Save() {
            this.isSaved = true;
        }
    }
    Projects.Structure = Structure;
    /** Représente un projet Thorus */
    class Project {
        constructor(manager, data) {
            /** Information du projet */
            this.ProjectInfo = new Info;
            this.Windows = new Models_1.Models.WindowsHandlers();
            _Project__Manager.set(this, void 0);
            /**  */
            _Project__debug.set(this, (0, debug_1.default)('Thorus:Projects:Manager:Project:🚧'));
            __classPrivateFieldSet(this, _Project__Manager, manager, "f");
            this.ProjectInfo.data = data;
            if (data.data)
                this.Project = data.data;
        }
        /**  */
        get debug() { return __classPrivateFieldGet(this, _Project__debug, "f"); }
        ;
        get manager() { return __classPrivateFieldGet(this, _Project__Manager, "f"); }
        get engine() { return __classPrivateFieldGet(this, _Project__Manager, "f").engine; }
        get mainWindow() { return this.engine.mainWindow; }
        get document() { return this.Project; }
        /** Retourne les informations du projet */
        get Info() { return this.ProjectInfo; }
        ;
        /** Retourne le nom du projet */
        get name() { return this.ProjectInfo.name; }
        /** Retourne le path du projet */
        get path() { return this.ProjectInfo.path; }
        /** Retourne le fullPath du projet */
        get fullPath() { return this.ProjectInfo.fullPath; }
        get isSaved() { return this.Project.isSaved; }
        /** Ouverture d'une window ( BrowserWindow ) */
        get AddWindow() { return function (viewName, project = this) { return project.Windows.AddWindow(viewName); }; }
        /** Fermeture d'une window */
        get RemoveWindow() { return function (viewName, project = this) { return project.Windows.RemoveWindow(viewName); }; }
        /** Retourne les viewNames des BrowserWindow ouverts */
        get GetViewNames() { return function (project = this) { return project.Windows.GetViewNames(); }; }
        /** Retourne true | false si le BrowserWindow attribuer au viewName est actif */
        get IsWindowActive() { return function (viewName, project = this) { return project.Windows.IsWindowActive(viewName); }; }
        /** Retourne le BrowserWindow attribuer au viewName */
        get GetWindow() { return function (viewName, project = this) { return project.Windows.GetWindow(viewName); }; }
        /** Ferme le BrowserWindow de la même facon que par l'action d'un click sur le boutton `close` */
        get CloseWindow() { return function (viewName, project = this) { return project.Windows.CloseWindow(viewName); }; }
        /** Ferme tout les BrowserWindows de la même facon que par l'action d'un click sur le boutton `close` */
        get CloseAllWindows() { return function (project = this) { return project.Windows.CloseAllWindows(); }; }
        /** Retourne true | false si le BrowserWindow HTML est actif */
        get HTML_VIEW_IsActive() { return Viewer_1.HTMLView.IsActive(this); }
        /** Ajout de scripts exterieurs dans le BrowserWindow HTML */
        get HTML_VIEW_AddScript() { return Viewer_1.HTMLView.AddScript(this); }
        /** Injection de CSS dans le BrowserWindow HTML si actif */
        get HTML_VIEW_CssInjection() {
            return function (css, project = this) {
                return Viewer_1.HTMLView.CssInjection(project, css);
            };
        }
        ;
        /** Injection de javascript dans le BrowserWindow HTML si actif */
        get HTML_VIEW_JsInjection() {
            return function (js, project = this) {
                return Viewer_1.HTMLView.JsInjection(project, js);
            };
        }
        ;
        /** Injection de javascript dans le BrowserWindow HTML si actif depuis le BrowserWindow CSS */
        get CSS_VIEW_CssInjection() {
            return function (css, project = this) {
                return Viewer_1.CodeView.CssInjection(project, css);
            };
        }
        /**  */
        LibraryManager() {
            this.debug('LibraryManager');
            const _this = this;
            const dialog = this.engine.dialog.Create("LIBRARY_MANAGER", this.document);
            if (dialog)
                dialog.onceValidate(function (event, message) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const actualsScriptsNames = _this.document.allScriptsName();
                        if (Object.keys(message).length > 0)
                            for (const key of Object.keys(message)) {
                                if (actualsScriptsNames.includes(key)) {
                                    _this.document.updateScript(message[key]);
                                }
                                else
                                    _this.document.deleteScript(key);
                            }
                        else
                            _this.document.deleteAllScripts();
                        for (const name of actualsScriptsNames) {
                            if (!Object.keys(message).includes(name))
                                _this.document.deleteScript(name);
                        }
                    });
                });
        }
        /**
        *Ajout d'un cdn au projet
        */
        AddCDN() {
            this.debug('AddCDN');
            const _this = this;
            const dialog = this.engine.dialog.Create("LIBRARY_ADD_CDN", this.document);
            if (dialog)
                dialog.onceValidate(function (event, message) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const response = yield (0, axios_1.default)({
                            method: 'get',
                            url: message.url,
                            responseType: 'text'
                        });
                        if (response.status === 200)
                            _this.document.data.lib[message.name] = {
                                name: message.name,
                                url: message.url,
                                data: response.data
                            };
                    });
                });
        }
        /**
        *Ajout d'une librairie locale au projet
        */
        AddLibrary() {
            return __awaiter(this, void 0, void 0, function* () {
                this.debug('AddLibrary');
                const _this = this;
                const x = yield this.engine.electron.dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] });
                if (!x.canceled) {
                    for (const path of x.filePaths) {
                        Repertory_1.Repertory.Fs.readFile(path, 'utf8', function (err, data) {
                            if (data)
                                _this.document.addScript({
                                    name: Repertory_1.Repertory.Path.basename(Repertory_1.Repertory.Path.basename(path), Repertory_1.Repertory.Path.extname(path)),
                                    url: path,
                                    data: data
                                });
                        });
                    }
                }
            });
        }
        /**
        *Remove d'une librairie locale au projet
        */
        RemoveLibrary() {
        }
        /**
        *Création d'une librairie pour le projet
        */
        CreateLibrary(name) {
        }
        /**
        *Export du projet courant
        */
        ExportProject(fileData) {
            this.debug('ExportProject');
            const indexWindow = this.GetWindow('index');
            indexWindow.webContents.send('get_arch', fileData.filePath);
            if (this.Windows.IsWindowActive('codeview')) {
                const codeWindow = this.GetWindow('codeview');
                codeWindow.webContents.send('get_arch', fileData.filePath);
            }
        }
    }
    _Project__Manager = new WeakMap(), _Project__debug = new WeakMap();
    Projects.Project = Project;
    /**
    @Description : Represente tout les projects Thorus actifs/courant
    @Explication : Un projet courant est un projet deja enregistrer alors que le projet actif non
    */
    class Manager {
        constructor(engine) {
            _Manager_instances.add(this);
            /** Contient la list des projets actifs */
            this.projects = [];
            _Manager__CurentProject.set(this, void 0);
            _Manager__Engine.set(this, void 0);
            /**  */
            _Manager__debug.set(this, (0, debug_1.default)('Thorus:Projects:Manager:💼'));
            __classPrivateFieldSet(this, _Manager__Engine, engine, "f");
        }
        /** Retourne le projet courant/actif */
        get project() { return __classPrivateFieldGet(this, _Manager__CurentProject, "f"); }
        /** Retourne le document du projet courant/actif */
        get document() { return this.project.Project; }
        /** Retourne true | false si le projet courant/actif est déjà enregistrer comme projet */
        get isAvailable() { return (this.project ? true : false); }
        /** Retourne engine de Thorus */
        get engine() { return __classPrivateFieldGet(this, _Manager__Engine, "f"); }
        /** Retourne le BrowserWindow du projet courant/actif */
        get mainWindow() { return this.engine.mainWindow; }
        /**  */
        get debug() { return __classPrivateFieldGet(this, _Manager__debug, "f"); }
        ;
        /** Processus de création d'un nouveau projet */
        NewProject(project, path) {
            return __awaiter(this, void 0, void 0, function* () {
                this.debug('NewProject');
                try {
                    if (__classPrivateFieldGet(this, _Manager__CurentProject, "f") && !this.document.isSaved)
                        throw {
                            error: 1,
                            title: 'Error while save',
                            message: "Project Not Saved"
                        };
                    const result = (path ? { canceled: false, filePath: path } : yield this.engine.electron.dialog.showSaveDialog(this.engine.mainWindow, Models_1.Models.Dialog.NewProject));
                    if (!result.canceled) {
                        yield __classPrivateFieldGet(this, _Manager_instances, "m", _Manager__CreateEmptyFile).call(this, Object.assign(Object.assign({}, result), { name: Path.basename(result.filePath, '.thproj'), path: Path.dirname(result.filePath) }));
                        yield this.LoadProject(result.filePath);
                    }
                }
                catch (err) {
                    console.log(err);
                    this.engine.electron.dialog.showErrorBox(err.title, err.message);
                }
            });
        }
        /** Processus de chargement de projet */
        LoadProject(path) {
            return __awaiter(this, void 0, void 0, function* () {
                this.debug('LoadProject');
                try {
                    if (__classPrivateFieldGet(this, _Manager__CurentProject, "f") && !this.document.isSaved)
                        throw {
                            error: 1,
                            title: 'Error while save',
                            message: "Project Not Saved"
                        };
                    const result = (path ? { canceled: false, filePaths: [path] } : yield this.engine.electron.dialog.showOpenDialog(this.engine.mainWindow, Models_1.Models.Dialog.NewProject));
                    if (!result.canceled) {
                        if (this.project)
                            this.project.CloseAllWindows();
                        __classPrivateFieldGet(this, _Manager_instances, "m", _Manager__SetCurrentProject).call(this, {
                            filePath: result.filePaths[0],
                            canceled: result.canceled,
                            // data:JSON.parse(this.#__Decrypt(await Repertory.LoadBufferFile(result.filePaths[0])).toString())
                            data: JSON.parse((yield Repertory_1.Repertory.LoadBufferFile(result.filePaths[0])).toString())
                        });
                        this.OpenProject(this.project);
                    }
                }
                catch (err) {
                    console.log(err);
                    this.engine.electron.dialog.showErrorBox(err.title, err.message);
                }
            });
        }
        /** Envois en front l'instruction de chargement de projet , envois le projet courant */
        OpenProject(project) {
            this.debug('OpenProject');
            this.mainWindow.webContents.send('manager-open-project', project);
        }
        /** Processus de sauvegarde du projet dans son fichier.thproj */
        SaveProject(data = this.document, path = this.project.fullPath) {
            const _this = this;
            this.debug('SaveProject');
            return new Promise(function (next) {
                Repertory_1.Repertory.Fs.writeFile(path, JSON.stringify(data, null, "\t"), function (error) {
                    if (error)
                        next(error);
                    else {
                        _this.document.Save();
                        _this.mainWindow.webContents.send('manager-project-saved', true);
                        next(true);
                    }
                });
            });
        }
        SaveProjectAs() {
        }
        ExportProject() {
        }
        RemoveProject() {
        }
        /** Ajout d'un node component dans le projet */
        AddNodeComponent(componentName) {
        }
    }
    _Manager__CurentProject = new WeakMap(), _Manager__Engine = new WeakMap(), _Manager__debug = new WeakMap(), _Manager_instances = new WeakSet(), _Manager__SetCurrentProject = function _Manager__SetCurrentProject(project) {
        this.debug('SetCurrentProject');
        __classPrivateFieldSet(this, _Manager__CurentProject, new Project(this, {
            name: Path.basename(project.filePath, '.thproj'),
            path: Path.dirname(project.filePath),
            fullPath: project.filePath,
            data: new Structure(project.data)
        }), "f");
    }, _Manager__CreateEmptyFile = function _Manager__CreateEmptyFile(data) {
        this.debug('CreateEmptyFile');
        console.log(data);
        const _this = this;
        // return new Promise(function(next){
        //   Repertory.Fs.writeFile( path, _this.#__Encrypt(JSON.stringify(_this.project.Info,null,"\t")) , function(error){
        //     if(error)next(error);
        //     else next(true);
        //   })
        // })
        return new Promise(function (next) {
            Repertory_1.Repertory.Fs.writeFile(data.filePath, JSON.stringify({
                name: data.name,
                path: data.path,
                data: {
                    /** contient l'architecture de l'app */
                    app: {},
                    /** contient les fichiers css */
                    css: {},
                    /** contient les librairies javascripts */
                    lib: {},
                    /** contient le projet DrawFlow */
                    drawFlow: {},
                    /** contient les components généraux custom */
                    components: {},
                    /** contient les sub components de chaque planche */
                    subComponents: {},
                    workBench: {}
                }
            }, null, "\t"), function (error) {
                if (error)
                    next(error);
                else
                    next(true);
            });
        });
    }, _Manager___Encrypt = function _Manager___Encrypt(data) {
        this.debug('Encrypt');
        const iv = Crypto.randomBytes(16);
        const key = Crypto.createHash('sha256').update('<KEY>').digest('base64').substr(0, 32);
        const cipher = Crypto.createCipheriv('aes-256-ctr', key, iv);
        return Buffer.concat([iv, cipher.update(Buffer.from(data)), cipher.final()]);
    }, _Manager___Decrypt = function _Manager___Decrypt(data) {
        this.debug('Decrypt');
        const iv = data.slice(0, 16);
        data = data.slice(16);
        const key = Crypto.createHash('sha256').update('<KEY>').digest('base64').substr(0, 32);
        const decipher = Crypto.createDecipheriv('aes-256-ctr', key, iv);
        return Buffer.concat([decipher.update(data), decipher.final()]);
    };
    Projects.Manager = Manager;
})(Projects = exports.Projects || (exports.Projects = {}));
//# sourceMappingURL=Projects.js.map