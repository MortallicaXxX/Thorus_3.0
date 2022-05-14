import { app, BrowserWindow , ipcMain , Menu , dialog } from 'electron';
import { Engine } from "./Engine";

export class Electron{

  #_app:typeof app;
  get app(){return this.#_app;}
  #_Engine:Engine;
  get Ipc():typeof ipcMain{return ipcMain}
  get dialog():typeof dialog{return dialog}

  constructor(engine:Engine){
    this.#_Engine = engine;
  }

  /** Retourne une promesse résolue l'orsque l'app a démarrer */
  CreateApp():Promise<void>{
    this.#_app = app;
    return this.app.whenReady();
  }


  NewWindow(options?:Electron.BrowserWindowConstructorOptions):BrowserWindow{
    return new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      },
      ...(options ? options : {})
    })
  }

  On(chanel:any,callback:()=>void){
    this.app.on(chanel,callback);
  }

}
