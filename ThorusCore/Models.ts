import { app, BrowserWindow , ipcMain , Menu , dialog } from 'electron';
import { Repertory } from './Repertory';
import { Components } from "./Models/Components";

export {BrowserWindow};
export {Components};

export namespace Models{

  export interface Windows{
    index?:typeof BrowserWindow,
    htmlview?:typeof BrowserWindow,
    codeview?:typeof BrowserWindow,
    AddWindow(viewName:string):void,
    RemoveWindow(viewName:string):void,
    IsWindowActive(viewName:string):boolean,
    GetWindow(viewName:string):BrowserWindow
  }

  /** Représente de gestionaire de BrowserWindow  */
  export class WindowsHandlers{
    /** Création si n'existe pas d'un BrowserWindow et attribution d'un viewName à celui-ci */
    AddWindow(viewName:string){
      const _this:WindowsHandlers = this;
      if(!this.IsWindowActive(viewName)) {
        this[viewName] = new BrowserWindow({
          width: 800,
          height: 600,
          webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
          },
          icon: Repertory.Path.join(__dirname, `../../client/assets/icons/icon.png`),
        });
        this[viewName].loadFile(Repertory.Path.join(__dirname, `../../src/views/${viewName}.View.html`));
        this[viewName].once('close',function(){
          _this.RemoveWindow(viewName);
        })
      }
      return this[viewName];
    };
    /** Retourne les viewNames des BrowserWindow ouverts */
    GetViewNames():string[]{
      return Object.keys(this);
    };
    /** Retourne true | false si le BrowserWindow attribuer au viewName */
    IsWindowActive(viewName:string):boolean{
      return this.GetViewNames().includes(viewName);
    };
    /** Retourne le BrowserWindow attribuer au viewName */
    GetWindow(viewName:string):BrowserWindow{
      return this[viewName];
    };
    /** Ferme le BrowserWindow de la même facon que par l'action d'un click sur le boutton `close` */
    CloseWindow(viewName:string){
      const window:BrowserWindow = this.GetWindow(viewName);
      if(window)window.close();
    };
    /** Ferme tout les BrowserWindows de la même facon que par l'action d'un click sur le boutton `close` */
    CloseAllWindows(){
      for(const e of this.GetViewNames())this.CloseWindow(e);
    };
    /** Suppression et fermeture du BrowserWindow attribuer au viewName */
    RemoveWindow(viewName:string){
      delete this[viewName];
    };
  }

  /** Contient les processus utiliser l'ors du lancement de l'app */
  export class Launcher{

    /** Processus de vérification général de validité des pré requis de l'app */
    static Validity(){
      return Promise.all([
        Launcher.ProjectFolderExist
      ])
    }

    /** Vérification de la présence du folder `project` dans le directory de Thorus SI false , création de celui-ci */
    static get ProjectFolderExist(){
      return new Promise(function(next){
        const path = `./projects/`;
        const isExist = Repertory.DirectoryExists.sync(path);
        if(!isExist)Repertory.CreateDirectory(path);
        next(isExist);
      })
    }

  }

  /** Contient les templates d'options de fenêtre de dialogue modale */
  export namespace Dialog{

    /** Template `NewProject` */
    export class NewProject{
      /** Titre */
      static title:string = "Create project file";
      /** Path par défaut */
      static defaultPath:string = `${process.env.INIT_CWD}/projects/`;
      /** Label du boutton */
      static buttonLabel:string = "Create";
      /** Filtre le fichier */
      static filters:{name:string,extensions:string[]}[] = [
        {name: 'Thorium project', extensions: ['thproj']},
        {name: 'All Files', extensions: ['*']}
      ];

    }

  }

}
