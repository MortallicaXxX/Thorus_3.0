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
Object.defineProperty(exports, "__esModule", { value: true });
const Engine_1 = require("../thorusCore/Engine");
const Repertory_1 = require("../thorusCore/Repertory");
const Models_1 = require("../thorusCore/Models");
const debug_1 = require("debug");
const debug = (0, debug_1.default)('Thorus:Main');
const debugChanels = (0, debug_1.default)('Thorus:Chanels:✉️');
debug('Lancement de Thorus');
Engine_1.engine.Start().then(function () {
    debug('Création de la fenêtre modale');
    Engine_1.engine.CreateMainWindow();
});
/** INDEX VIEW CHANELS*/
Engine_1.engine.Ipc.on('CreateNewProject', function (event, message) {
    debugChanels(`CreateNewProject`);
    if (!message.projectPath)
        message.projectPath = `${process.env.INIT_CWD}/projects/`;
    Repertory_1.Repertory.FileExists(`${message.projectPath}/${message.projectName}.thproj`)
        .then(function (result) {
        event.returnValue = (!result ? {
            result: true,
            message: null,
            name: message.projectName,
            path: message.projectPath,
            projectPath: `${message.projectPath}/${message.projectName}.thproj`
        } : {
            result: false,
            message: "Un projet portant un nom similaire existe déjà.",
            name: message.projectName,
            path: message.projectPath,
            projectPath: `${message.projectPath}/${message.projectName}.thproj`
        });
    });
});
Engine_1.engine.Ipc.on('update-project-template', function (event, message) {
    debugChanels(`update-project-template`);
    Engine_1.engine.document.Update({
        app: message.app,
        workBench: message.workBench,
    });
    // Engine.document.UpdateApp(message.app);
    // Engine.document.UpdateWorkBench(message.workBench);
    if (Engine_1.engine.project.IsWindowActive('HTML')) {
        Engine_1.engine.project.HTML_VIEW_JsInjection(`
      (async function(){

        const App = await ObjectParser(${JSON.stringify(message.app)});

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
    event.returnValue = "";
});
Engine_1.engine.Ipc.on('get-components-models', function (event, message) {
    debugChanels(`get-components-models`);
    event.returnValue = Models_1.Components;
});
/** DIALOGS CHANELS*/
Engine_1.engine.Ipc.on('dialog-create', function (event, message) {
    return __awaiter(this, void 0, void 0, function* () {
        debugChanels(`dialog-create`);
        event.returnValue = yield new Promise(function (next) {
            const dialog = Engine_1.engine.dialog.Create(message);
            dialog.onceValidate(function (event, message) {
                next(message);
            });
        });
    });
});
/** CSS VIEW CHANELS*/
Engine_1.engine.Ipc.on('css-view-update', function (event, message) {
    debugChanels(`css-view-update`);
    Engine_1.engine.document.UpdateCSS(message);
    Engine_1.engine.project.HTML_VIEW_JsInjection(`
    (async function(){
      const cssFiles = ${JSON.stringify(message)};
      for(const key of Object.keys(cssFiles)){
        const y = document.getElementById(key);
        if(y)y.innerHTML = cssFiles[key];
        else{
          const z = document.createElement('style');
          z.id = key;
          z.innerHTML = cssFiles[key];
          document.head.appendChild(z);
        }
      }
    })()
  `);
    event.returnValue = true;
});
Engine_1.engine.Ipc.on('css-view-import', function (event, message) {
    debugChanels(`css-view-import`);
    event.returnValue = Engine_1.engine.project.Project.data.css;
});
/** HTML VIEW CHANELS*/
Engine_1.engine.Ipc.on('HTML-view-import', function (event, message) {
    debugChanels(`HTML-view-import`);
    event.returnValue = Engine_1.engine.project.Project.data;
});
/** CHANELS MENU MODAL */
Engine_1.engine.Ipc.on('client-<Files>-new-project', function (event, message) {
    debugChanels(`client-<Files>-new-project`);
    Engine_1.engine.manager.NewProject({ name: "", path: "" });
});
Engine_1.engine.Ipc.on('client-<Files>-open-project', function (event, message) {
    debugChanels(`client-<Files>-open-project`);
    Engine_1.engine.manager.LoadProject();
});
Engine_1.engine.Ipc.on('client-<Files>-save-project', function (event, message) {
    debugChanels(`client-<Files>-save-project`);
    Engine_1.engine.manager.SaveProject();
});
Engine_1.engine.Ipc.on('client-<Files>-save-project-as', function (event, message) {
    debugChanels(`client-<Files>-save-project-as`);
});
Engine_1.engine.Ipc.on('client-<Files>-export-all', function (event, message) {
    debugChanels(`client-<Files>-export-all`);
});
Engine_1.engine.Ipc.on('client-<Files>-export-html', function (event, message) {
    debugChanels(`client-<Files>-export-html`);
});
Engine_1.engine.Ipc.on('client-<Files>-export-css', function (event, message) {
    debugChanels(`client-<Files>-export-css`);
});
Engine_1.engine.Ipc.on('client-<Edit>-open-libraries-manager', function (event, message) {
    debugChanels(`client-<Edit>-open-libraries-manager`);
    Engine_1.engine.project.LibraryManager();
});
Engine_1.engine.Ipc.on('client-<Edit>-add-libraries-external', function (event, message) {
    debugChanels(`client-<Edit>-add-libraries-external`);
    Engine_1.engine.project.AddCDN();
});
Engine_1.engine.Ipc.on('client-<Edit>-add-libraries-local', function (event, message) {
    debugChanels(`client-<Edit>-add-libraries-local`);
    Engine_1.engine.project.AddLibrary();
});
//# sourceMappingURL=index.js.map