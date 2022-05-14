"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Models = exports.Components = exports.BrowserWindow = void 0;
const electron_1 = require("electron");
Object.defineProperty(exports, "BrowserWindow", { enumerable: true, get: function () { return electron_1.BrowserWindow; } });
const Repertory_1 = require("./Repertory");
const Components_1 = require("./Models/Components");
Object.defineProperty(exports, "Components", { enumerable: true, get: function () { return Components_1.Components; } });
var Models;
(function (Models) {
    /** Représente de gestionaire de BrowserWindow  */
    class WindowsHandlers {
        /** Création si n'existe pas d'un BrowserWindow et attribution d'un viewName à celui-ci */
        AddWindow(viewName) {
            const _this = this;
            if (!this.IsWindowActive(viewName)) {
                this[viewName] = new electron_1.BrowserWindow({
                    width: 800,
                    height: 600,
                    webPreferences: {
                        nodeIntegration: true,
                        contextIsolation: false
                    },
                    icon: Repertory_1.Repertory.Path.join(__dirname, `../../client/assets/icons/icon.png`),
                });
                this[viewName].loadFile(Repertory_1.Repertory.Path.join(__dirname, `../../src/views/${viewName}.View.html`));
                this[viewName].once('close', function () {
                    _this.RemoveWindow(viewName);
                });
            }
            return this[viewName];
        }
        ;
        /** Retourne les viewNames des BrowserWindow ouverts */
        GetViewNames() {
            return Object.keys(this);
        }
        ;
        /** Retourne true | false si le BrowserWindow attribuer au viewName */
        IsWindowActive(viewName) {
            return this.GetViewNames().includes(viewName);
        }
        ;
        /** Retourne le BrowserWindow attribuer au viewName */
        GetWindow(viewName) {
            return this[viewName];
        }
        ;
        /** Ferme le BrowserWindow de la même facon que par l'action d'un click sur le boutton `close` */
        CloseWindow(viewName) {
            const window = this.GetWindow(viewName);
            if (window)
                window.close();
        }
        ;
        /** Ferme tout les BrowserWindows de la même facon que par l'action d'un click sur le boutton `close` */
        CloseAllWindows() {
            for (const e of this.GetViewNames())
                this.CloseWindow(e);
        }
        ;
        /** Suppression et fermeture du BrowserWindow attribuer au viewName */
        RemoveWindow(viewName) {
            delete this[viewName];
        }
        ;
    }
    Models.WindowsHandlers = WindowsHandlers;
    /** Contient les processus utiliser l'ors du lancement de l'app */
    class Launcher {
        /** Processus de vérification général de validité des pré requis de l'app */
        static Validity() {
            return Promise.all([
                Launcher.ProjectFolderExist
            ]);
        }
        /** Vérification de la présence du folder `project` dans le directory de Thorus SI false , création de celui-ci */
        static get ProjectFolderExist() {
            return new Promise(function (next) {
                const path = `./projects/`;
                const isExist = Repertory_1.Repertory.DirectoryExists.sync(path);
                if (!isExist)
                    Repertory_1.Repertory.CreateDirectory(path);
                next(isExist);
            });
        }
    }
    Models.Launcher = Launcher;
    /** Contient les templates d'options de fenêtre de dialogue modale */
    let Dialog;
    (function (Dialog) {
        /** Template `NewProject` */
        class NewProject {
        }
        /** Titre */
        NewProject.title = "Create project file";
        /** Path par défaut */
        NewProject.defaultPath = `${process.env.INIT_CWD}/projects/`;
        /** Label du boutton */
        NewProject.buttonLabel = "Create";
        /** Filtre le fichier */
        NewProject.filters = [
            { name: 'Thorium project', extensions: ['thproj'] },
            { name: 'All Files', extensions: ['*'] }
        ];
        Dialog.NewProject = NewProject;
    })(Dialog = Models.Dialog || (Models.Dialog = {}));
})(Models = exports.Models || (exports.Models = {}));
//# sourceMappingURL=Models.js.map