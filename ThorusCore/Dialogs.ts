import { app, BrowserWindow , ipcMain , Menu , dialog } from 'electron';
import { Engine } from './Engine';
import { Repertory } from './Repertory';

export class Dialog{

  #_window: BrowserWindow;
  get window(){return this.#_window;}
  #_handler:DialogsHandler;
  get handler(){return this.#_handler;}
  #_name:string;
  get name(){return this.#_name;}

  #_onceClose:(event,message)=>void;
  #_onceValidate:(event,message)=>void;

  onceClose(callback:(event,message)=>void){this.#_onceClose = callback;}
  get onClose():(event,message)=>void{return this.#_onceClose;}
  onceValidate(callback:(event,message)=>void){this.#_onceValidate = callback;}
  get onValidate():(event,message)=>void{return this.#_onceValidate;}

  constructor(name:string,option:any = null,window:BrowserWindow,dialogshandler:DialogsHandler){
    const _this:Dialog = this;
    this.#_window = window;
    this.#_handler = dialogshandler;
    this.#_name = name;

    window.webContents.once('did-finish-load',function(){
      window.webContents.send('dialog-launcher',{name : _this.name , option : option});
    });

    window.once('close',function(){
      _this.handler.engine.Ipc.removeAllListeners(`dialog-${_this.name}-close`);
      _this.handler.engine.Ipc.removeAllListeners(`dialog-${_this.name}-validate`);
      _this.handler.Remove(_this.name);
    })

    this.handler.engine.Ipc.on(`dialog-${_this.name}-close`,function(event,message){
      if(_this.onClose) _this.onClose(event,message);
      window.close();
    })

    this.handler.engine.Ipc.on(`dialog-${_this.name}-validate`,function(event,message){
      if(_this.onValidate) _this.onValidate(event,message);
      window.close();
    })

  }

}

export class DialogsHandler{

  #_engine:Engine;
  get engine(){return this.#_engine}
  #_windows:any = {};
  get windows(){return this.#_windows;}
  #_onMessage:(event,message)=>void = null;
  set onMessage(callback:(event,message)=>void){this.#_onMessage = callback}
  get onMessage(){return this.#_onMessage;}

  constructor(engine:Engine){
    this.#_engine = engine;
  }

  Create(dialogName:string,option:any = null){
    // const _this:DialogsHandler = this;
    // console.log(this.isExist(dialogName));
    if(!this.isExist(dialogName)){
      const window = this.engine.CreateWindow({
        height : 200,
        width : 600,
        resizable : false,
        frame : false,
        roundedCorners : true,
      });
      window.loadFile(Repertory.Path.join(__dirname, `../../src/views/Dialogs.View.html`));

      this.windows[dialogName] = window;

      return new Dialog(dialogName,option,this.windows[dialogName],this);
    }
  }

  get DialogsNames(){
    return Object.keys(this.windows);
  }

  GetDialogByName(dialogName:string){
    return this.windows[dialogName];
  }

  isExist(dialogName:string){
    return this.DialogsNames.includes(dialogName);
  }

  Remove(dialogName:string){
    delete this.windows[dialogName];
  }

  CloseWindow(dialogName:string){
    this.windows[dialogName].close();
  }

  CloseAllWindows(){
    for(const windowKey of this.DialogsNames){
      this.CloseWindow(windowKey);
    }
  }

}
