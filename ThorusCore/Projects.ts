import { Engine } from "./Engine";
import { BrowserWindow , Models } from './Models';
import { Repertory } from './Repertory';
import { HTMLView , CodeView } from "./Viewer";
import * as Path from 'path';
import * as Crypto from 'crypto';
import Axios , { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import Debug from 'debug';

/** Contient les librairies responsables de la gestion de projets */
export namespace Projects {

  export interface ILibJs{
    name:string;
    url:string;
    index?:number;
    data:string;
  }

  export class LibJs{

    constructor(data:any = {}){
      for(const key of Object.keys(data)){
        this[key] = data[key];
      }
    }

    Add(scriptData:ILibJs){
      this[scriptData.name] = {...scriptData , ...('index' in scriptData ? {} : { index : this.GetAllNames().length + 1 })};
    }
    Get(scriptName:string){
      if(this.isExist(scriptName))return this[scriptName];
    }
    Delete(scriptName:string){
      if(this.isExist(scriptName))delete this[scriptName];
    }
    DeleteAll(){
      for(const name of this.GetAllNames()){
        this.Delete(name);
      }
    }
    Update(scriptData:ILibJs){
      this[scriptData.name] = {...this[scriptData.name] , ...scriptData};
    }

    GetAllNames():string[]{return Object.keys(this);}
    isExist(scriptName:string){
      return this.GetAllNames().includes(scriptName);
    }

  }

  /** Représente toutes informations d'un projet */
  export class Info{
    /** nom du projet */
    name:string = null;
    /** path du projet */
    path:string = null;
    /** fullpath du projet */
    fullPath:string = null;
    /** extention du projet */
    ext:string = "thproj";

    /** Définission des donnée du projet */
    set data(data:{name:string,path:string,fullPath:string}){
      this.name = data.name;
      this.path = data.path;
      this.fullPath = data.fullPath;
    }

  }

  /** Représente les données du projet */
  export class Data{
    /** template de l'app */
    app:object = {};
    /** feuilles de style de l'app */
    css:object = {};
    /** librairies | cdn de l'app */
    lib:LibJs = new LibJs;
    drawFlow:object = {};
    components:object = {};
    subComponents:object = {};
    /** workBenchs du projet */
    workBench:any = {};

    constructor(data:any){
      this.app = ("app" in data ? data.app : {});
      this.css = ("css" in data ? data.css : {});
      this.lib = ("lib" in data ? new LibJs(data.lib) : new LibJs);
      this.drawFlow = ("drawFlow" in data ? data.drawFlow : {});
      this.components = ("components" in data ? data.components : {});
      this.subComponents = ("subComponents" in data ? data.subComponents : {});
      this.workBench = ("workBench" in data ? data.workBench : {});
    }

  }

  /** Représente la structure distribuable du projet*/
  export class Structure{
    /** nom du projet */
    name:string;
    /** path du projet */
    path:string;
    /** donnée du projet */
    data?:Data;
    /** */
    isSaved:boolean = true;

    constructor(data:any){
      this.name = data.name;
      this.path = data.path;
      if(data)this.data = new Projects.Data(data.data);
    }

    get allScriptsName(){return function(_this:Structure = this){return _this.data.lib.GetAllNames()}}
    get addScript(){return function(scriptData:ILibJs , _this:Structure = this){return _this.data.lib.Add(scriptData)}}
    get getScript(){return function(scriptName:string , _this:Structure = this){return _this.data.lib.Get(scriptName)}}
    get deleteScript(){return function(scriptName:string , _this:Structure = this){return _this.data.lib.Delete(scriptName)}}
    get deleteAllScripts(){return function( _this:Structure = this ){return _this.data.lib.DeleteAll()}}
    get updateScript(){return function(scriptData:ILibJs , _this:Structure = this){return _this.data.lib.Update(scriptData)}}
    get isExistScript(){return function(scriptName:string , _this:Structure = this){return _this.data.lib.isExist(scriptName)}}

    /** Update du document en fonction des propiétés renseignées */
    Update(data:{app?:object,workBench?:object,css?:object}){
      this.isSaved = false;
      if(data.app)this.UpdateApp(data.app);
      if(data.workBench)this.UpdateWorkBench(data.workBench);
      if(data.css)this.UpdateCSS(data.css);
    }

    /** update de app template du projet */
    UpdateApp(app:object){
      this.data.app = app;
    }

    /** update des feuiles de style du projet */
    UpdateCSS(css:object){
      this.data.css = css;
    }

    /** update des workBenchs du projet */
    UpdateWorkBench(workBench:object){
      this.data.workBench = workBench;
    }

    Save(){
      this.isSaved = true;
    }

  }

  /** Représente un projet Thorus */
  export class Project{

    /** Information du projet */
    ProjectInfo:Info = new Info;
    Windows:Models.WindowsHandlers = new Models.WindowsHandlers();
    Project:Structure;
    #_Manager:Manager;
    /**  */
    #_debug:typeof Debug = Debug('Thorus:Projects:Manager:Project:🚧');
    /**  */
    get debug(){return this.#_debug};
    get manager():Manager{return this.#_Manager;}
    get engine():Engine{return this.#_Manager.engine;}
    get mainWindow():BrowserWindow{return this.engine.mainWindow;}
    get document():Structure{return this.Project;}

    constructor(manager:Manager,data:{name:string,path:string,fullPath:string,data?:Structure}){
      this.#_Manager = manager;
      this.ProjectInfo.data = data;
      if(data.data)this.Project = data.data;
    }

    /** Retourne les informations du projet */
    get Info():Info{return this.ProjectInfo};
    /** Retourne le nom du projet */
    get name():string{return this.ProjectInfo.name}
    /** Retourne le path du projet */
    get path():string{return this.ProjectInfo.path}
    /** Retourne le fullPath du projet */
    get fullPath():string{return this.ProjectInfo.fullPath}

    get isSaved():boolean{return this.Project.isSaved}

    /** Ouverture d'une window ( BrowserWindow ) */
    get AddWindow(){return function(viewName:string,project:Project = this){return project.Windows.AddWindow(viewName)}}
    /** Fermeture d'une window */
    get RemoveWindow(){return function(viewName:string,project:Project = this){return project.Windows.RemoveWindow(viewName)}}
    /** Retourne les viewNames des BrowserWindow ouverts */
    get GetViewNames(){return function(project:Project = this){return project.Windows.GetViewNames()}}
    /** Retourne true | false si le BrowserWindow attribuer au viewName est actif */
    get IsWindowActive(){return function(viewName:string,project:Project = this){return project.Windows.IsWindowActive(viewName)}}
    /** Retourne le BrowserWindow attribuer au viewName */
    get GetWindow(){return function(viewName:string,project:Project = this){return project.Windows.GetWindow(viewName)}}
    /** Ferme le BrowserWindow de la même facon que par l'action d'un click sur le boutton `close` */
    get CloseWindow(){return function(viewName:string,project:Project = this){return project.Windows.CloseWindow(viewName)}}
    /** Ferme tout les BrowserWindows de la même facon que par l'action d'un click sur le boutton `close` */
    get CloseAllWindows(){return function(project:Project = this){return project.Windows.CloseAllWindows()}}

    /** Retourne true | false si le BrowserWindow HTML est actif */
    get HTML_VIEW_IsActive(){return HTMLView.IsActive(this)}
    /** Ajout de scripts exterieurs dans le BrowserWindow HTML */
    get HTML_VIEW_AddScript(){return HTMLView.AddScript(this)}
    /** Injection de CSS dans le BrowserWindow HTML si actif */
    get HTML_VIEW_CssInjection(){return function(css:string,project:Project = this){
      return HTMLView.CssInjection(project,css);
    }};
    /** Injection de javascript dans le BrowserWindow HTML si actif */
    get HTML_VIEW_JsInjection(){return function(js:string,project:Project = this){
      return HTMLView.JsInjection(project,js);
    }};

    /** Injection de javascript dans le BrowserWindow HTML si actif depuis le BrowserWindow CSS */
    get CSS_VIEW_CssInjection(){return function(css:string,project:Project = this){
      return CodeView.CssInjection(project,css);
    }}

    /**  */
    LibraryManager(){

      this.debug('LibraryManager');

      const _this:Project = this;
      const dialog = this.engine.dialog.Create("LIBRARY_MANAGER",this.document);

      if(dialog)dialog.onceValidate(async function(event,message){

        const actualsScriptsNames = _this.document.allScriptsName();

        if(Object.keys(message).length > 0)for(const key of Object.keys(message)){
          if(actualsScriptsNames.includes(key)){
            _this.document.updateScript(message[key]);
          }
          else _this.document.deleteScript(key);
        }
        else _this.document.deleteAllScripts();

        for(const name of actualsScriptsNames){
          if(!Object.keys(message).includes(name)) _this.document.deleteScript(name);
        }

      });

    }

    /**
    *Ajout d'un cdn au projet
    */
    AddCDN(){

      this.debug('AddCDN');

      const _this:Project = this;
      const dialog = this.engine.dialog.Create("LIBRARY_ADD_CDN",this.document);

      if(dialog)dialog.onceValidate(async function(event,message){

        const response = await Axios({
          method: 'get',
          url: message.url,
          responseType: 'text'
        });
        if(response.status === 200)_this.document.data.lib[message.name] = {
          name : message.name,
          url : message.url,
          data : response.data
        };

      });

    }

    /**
    *Ajout d'une librairie locale au projet
    */
    async AddLibrary(){

      this.debug('AddLibrary');

      const _this:Project = this;
      const x = await this.engine.electron.dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] });
      if(!x.canceled){
        for(const path of x.filePaths){
          Repertory.Fs.readFile(path, 'utf8', function (err,data) {
            if (data) _this.document.addScript({
              name:Repertory.Path.basename(Repertory.Path.basename(path),Repertory.Path.extname(path)),
              url:path,
              data:data
            })
          });
        }
      }

    }

    /**
    *Remove d'une librairie locale au projet
    */
    RemoveLibrary(){

    }

    /**
    *Création d'une librairie pour le projet
    */
    CreateLibrary(name:string){

    }

    /**
    *Export du projet courant
    */
    ExportProject(fileData:{filePath:string}){

      this.debug('ExportProject');

      const indexWindow = this.GetWindow('index');
      indexWindow.webContents.send('get_arch',fileData.filePath);
      if(this.Windows.IsWindowActive('codeview')){
        const codeWindow = this.GetWindow('codeview');
        codeWindow.webContents.send('get_arch',fileData.filePath);
      }
    }



  }

  /**
  @Description : Represente tout les projects Thorus actifs/courant
  @Explication : Un projet courant est un projet deja enregistrer alors que le projet actif non
  */
  export class Manager{

    /** Contient la list des projets actifs */
    projects : Project[] = [];
    #_CurentProject : Project;
    /** Retourne le projet courant/actif */
    get project(){return this.#_CurentProject;}
    /** Retourne le document du projet courant/actif */
    get document(){return this.project.Project;}
    /** Retourne true | false si le projet courant/actif est déjà enregistrer comme projet */
    get isAvailable():boolean { return (this.project ? true : false)}
    #_Engine:Engine;
    /** Retourne engine de Thorus */
    get engine():Engine{return this.#_Engine;}
    /** Retourne le BrowserWindow du projet courant/actif */
    get mainWindow():BrowserWindow{return this.engine.mainWindow}
    /**  */
    #_debug:typeof Debug = Debug('Thorus:Projects:Manager:💼');
    /**  */
    get debug(){return this.#_debug};

    constructor(engine:Engine){
      this.#_Engine = engine;
    }

    /** Processus de création d'un nouveau projet */
    async NewProject(project:{name:string,path:string},path?:string){

      this.debug('NewProject');

      try{

        if(this.#_CurentProject && !this.document.isSaved)throw {
          error : 1,
          title : 'Error while save',
          message : "Project Not Saved"
        };

        const result = (path ? {canceled : false , filePath : path} : await this.engine.electron.dialog.showSaveDialog(this.engine.mainWindow,Models.Dialog.NewProject));
        if(!result.canceled){
          await this.#_CreateEmptyFile({...result,...{name : Path.basename(result.filePath,'.thproj') , path : Path.dirname(result.filePath)}});
          await this.LoadProject(result.filePath);
        }

      }
      catch(err:any){

        console.log(err);

        this.engine.electron.dialog.showErrorBox(err.title,err.message);
      }

    }

    /** Processus de chargement de projet */
    async LoadProject(path?:string){

      this.debug('LoadProject');

      try{

        if(this.#_CurentProject && !this.document.isSaved)throw {
          error : 1,
          title : 'Error while save',
          message : "Project Not Saved"
        };

        const result = (path ? {canceled : false , filePaths : [path]} : await this.engine.electron.dialog.showOpenDialog(this.engine.mainWindow,Models.Dialog.NewProject));
        if(!result.canceled){
          if(this.project)this.project.CloseAllWindows();
          this.#_SetCurrentProject({
            filePath : result.filePaths[0] ,
            canceled : result.canceled ,
            // data:JSON.parse(this.#__Decrypt(await Repertory.LoadBufferFile(result.filePaths[0])).toString())
            data:JSON.parse((await Repertory.LoadBufferFile(result.filePaths[0])).toString())
          });
          this.OpenProject(this.project);
        }

      }
      catch(err:any){

        console.log(err);

        this.engine.electron.dialog.showErrorBox(err.title,err.message);
      }


    }

    /** Envois en front l'instruction de chargement de projet , envois le projet courant */
    OpenProject(project: Project){

      this.debug('OpenProject');

      this.mainWindow.webContents.send('manager-open-project',project);

    }

    /** Processus de sauvegarde du projet dans son fichier.thproj */
    SaveProject(data:object = this.document,path:string = this.project.fullPath){

      const _this:Manager = this;

      this.debug('SaveProject');

      return new Promise(function(next){
        Repertory.Fs.writeFile( path , JSON.stringify(data,null,"\t") , function(error){
          if(error)next(error);
          else {
            _this.document.Save();
            _this.mainWindow.webContents.send('manager-project-saved',true);
            next(true);
          }
        })
      })
    }

    SaveProjectAs(){

    }

    ExportProject(){

    }

    RemoveProject(){

    }

    /** Ajout d'un node component dans le projet */
    AddNodeComponent(componentName){

    }

    /** Définission du projet courant */
    #_SetCurrentProject(project:{filePath?:string,canceled:boolean,data?:any}){

      this.debug('SetCurrentProject');

      this.#_CurentProject = new Project(this,{
        name : Path.basename(project.filePath,'.thproj') ,
        path : Path.dirname(project.filePath) ,
        fullPath : project.filePath ,
        data : new Structure(project.data)
      });
    }

    /** Création du fichier.thproj vide représantant le projet */
    #_CreateEmptyFile(data:{name:string,path:string,filePath?:string,canceled:boolean}){

      this.debug('CreateEmptyFile');

      console.log(data);
      const _this = this;
      // return new Promise(function(next){
      //   Repertory.Fs.writeFile( path, _this.#__Encrypt(JSON.stringify(_this.project.Info,null,"\t")) , function(error){
      //     if(error)next(error);
      //     else next(true);
      //   })
      // })

      return new Promise(function(next){
        Repertory.Fs.writeFile( data.filePath, JSON.stringify({
          name : data.name,
          path : data.path,
          data : {
            /** contient l'architecture de l'app */
            app : {

            },
            /** contient les fichiers css */
            css : {

            },
            /** contient les librairies javascripts */
            lib : {

            },
            /** contient le projet DrawFlow */
            drawFlow : {

            },
            /** contient les components généraux custom */
            components : {

            },
            /** contient les sub components de chaque planche */
            subComponents : {

            },
            workBench : {

            }
          }
        },null,"\t") , function(error){
          if(error)next(error);
          else next(true);
        })
      })
    }

    /** Processus d'encryption d'un string */
    #__Encrypt(data:string){

      this.debug('Encrypt');

      const iv = Crypto.randomBytes(16);
      const key = Crypto.createHash('sha256').update('<KEY>').digest('base64').substr(0,32);
      const cipher = Crypto.createCipheriv('aes-256-ctr',key,iv);
      return Buffer.concat([iv,cipher.update(Buffer.from(data)),cipher.final()]);

    }

    /** Processus de decryption d'un buffer */
    #__Decrypt(data:Buffer){

      this.debug('Decrypt');

      const iv = data.slice(0,16);
      data = data.slice(16);
      const key = Crypto.createHash('sha256').update('<KEY>').digest('base64').substr(0,32);
      const decipher = Crypto.createDecipheriv('aes-256-ctr',key,iv);
      return Buffer.concat([decipher.update(data) , decipher.final()]);

    }

  }

}
