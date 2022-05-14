// const { app, BrowserWindow , ipcMain , Menu } = require('electron');
// const HtmlViewer = require('./HTMLViewer')

import { app, BrowserWindow , ipcMain , Menu } from 'electron';
import Debug from 'debug';
import {  HTMLView as HtmlViewer , CodeView} from './Viewer';
import { Models } from './Models';
import { Electron } from './Electron';
import { Projects } from './Projects';
import { Repertory } from './Repertory';
import { DialogsHandler } from './Dialogs';

/** Moteur de Thorus */
export class Engine{

  #_Electron:Electron = new Electron(this);
  /** Retourne Electon */
  get electron():Electron{return this.#_Electron;}
  #_Dialogs:DialogsHandler = new DialogsHandler(this);
  get dialog(){return this.#_Dialogs;}
  #_Manager:Projects.Manager = new Projects.Manager(this);
  /** Retourne le manager de projets */
  get manager():Projects.Manager{return this.#_Manager;}
  /** Retourne le projet courant/actif */
  get project():Projects.Project{return this.manager.project;}
  /** Retourne le document du projet courant/actif */
  get document():Projects.Structure{return this.project.document;}
  #_MainWindow:BrowserWindow|null = null;
  /** Retourne le BrowserWindow du projet courant/actif */
  get mainWindow():BrowserWindow|null{return this.#_MainWindow;}
  /** Retourne true | false si le projet courant/actif est déjà enregistrer comme projet */
  get isMainWindowActive():boolean{return (this.mainWindow ? true : false);}
  /** Gestionaire de communication fournis par Election */
  get Ipc():typeof ipcMain{return this.electron.Ipc}
  /**  */
  #_debug:typeof Debug = Debug('Thorus:Engine:⚒️');
  /**  */
  get debug(){return this.#_debug};

  constructor(){

  }

  /** Démarage de Thorus */
  Start(){
    const _this = this;
    this.debug('Lancement de engine');
    return new Promise(async function(next){
      await _this.electron.CreateApp();
      Models.Launcher.Validity()
      .then(function(result){
        next(true);
      });

    })
  }

  /** Extinction de Thorus */
  Exit(){

  }

  /** Création de la fenêtre principale Thorus */
  CreateMainWindow(){
    const _this:Engine = this;
    this.debug('CreateMainWindow');
    this.#_MainWindow = this.electron.NewWindow({
      icon: Repertory.Path.join(__dirname, `../../client/assets/icons/icon.png`),
    });
    // windows.AddWindow(viewName,win);
    this.mainWindow.loadFile(Repertory.Path.join(__dirname, `../../src/views/Main.View.html`));
    this.SetViewMenu('Main',this.mainWindow);

    this.mainWindow.once('close' , function(window){

      _this.project.CloseAllWindows();
      _this.dialog.CloseAllWindows();

    })
  }


  get AddWindow(){return this.project.AddWindow}
  get RemoveWindow(){return this.project.RemoveWindow}
  get IsWindowActive(){return this.project.IsWindowActive}
  get GetWindow(){return this.project.GetWindow}

  /** Création d'une window */
  get CreateWindow(){return function(option?:any , electron:Electron=this.electron){return electron.NewWindow(option)}}

  /** Définission du menu d'une window */
  SetViewMenu(viewName:string,win:BrowserWindow){
    this.debug('SetViewMenu');
    const template = require(Repertory.Path.join(__dirname, `../../src/views/${viewName}.View.Menu.js`))(this);
    const menu = Menu.buildFromTemplate(template)
    win.setMenu(menu);
  }
  //
  // Export(fileData:{filePath:string},windows:Models.Windows){
  //   const indexWindow = windows.GetWindow('index');
  //   indexWindow.webContents.send('get_arch',fileData.filePath);
  //   if(windows.IsWindowActive('codeview')){
  //     const codeWindow = windows.GetWindow('codeview');
  //     codeWindow.webContents.send('get_arch',fileData.filePath);
  //   }
  // }
  //
  // AddChanel(chanel:string,callback:(event:Electron.IpcMainEvent,message:string)=>void){
  //   this.electron.Ipc(chanel,callback);
  // }

}

/** Instance de l'engine Thorus */
export let engine = new Engine();
