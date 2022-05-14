import { engine as Engine } from "../thorusCore/Engine";
import { Repertory } from "../thorusCore/Repertory";
import { Models , Components } from "../thorusCore/Models";
import Debug from 'debug';
const debug = Debug('Thorus:Main');
const debugChanels = Debug('Thorus:Chanels:✉️');

debug('Lancement de Thorus');
Engine.Start().then(function(){

  debug('Création de la fenêtre modale');

  Engine.CreateMainWindow();

});

/** INDEX VIEW CHANELS*/
Engine.Ipc.on('CreateNewProject',function(event:Electron.IpcMainEvent,message:any){

  debugChanels(`CreateNewProject`);

  if(!message.projectPath)message.projectPath = `${process.env.INIT_CWD}/projects/`;
  Repertory.FileExists(`${message.projectPath}/${message.projectName}.thproj`)
  .then(function(result:any){
    event.returnValue = (!result ? {
      result : true,
      message : null,
      name : message.projectName,
      path : message.projectPath,
      projectPath : `${message.projectPath}/${message.projectName}.thproj`
    } : {
      result : false,
      message : "Un projet portant un nom similaire existe déjà.",
      name : message.projectName,
      path : message.projectPath,
      projectPath : `${message.projectPath}/${message.projectName}.thproj`
    })
  })

});

Engine.Ipc.on('update-project-template',function(event:Electron.IpcMainEvent,message:any){

  debugChanels(`update-project-template`);

  Engine.document.Update({
    app : message.app,
    workBench : message.workBench,
  });
  // Engine.document.UpdateApp(message.app);
  // Engine.document.UpdateWorkBench(message.workBench);

  if(Engine.project.IsWindowActive('HTML')){
    Engine.project.HTML_VIEW_JsInjection(`
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
})

Engine.Ipc.on('get-components-models',function(event:Electron.IpcMainEvent,message:any){

  debugChanels(`get-components-models`);

  event.returnValue = Components;
})

/** DIALOGS CHANELS*/
Engine.Ipc.on('dialog-create',async function(event:Electron.IpcMainEvent,message:any){

  debugChanels(`dialog-create`);

  event.returnValue = await new Promise(function(next){
    const dialog = Engine.dialog.Create(message);

    dialog.onceValidate(function(event,message){
      next(message);
    });
  })

});

/** CSS VIEW CHANELS*/
Engine.Ipc.on('css-view-update',function(event:Electron.IpcMainEvent,message:any){

  debugChanels(`css-view-update`);

  Engine.document.UpdateCSS(message);

  Engine.project.HTML_VIEW_JsInjection(`
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
})

Engine.Ipc.on('css-view-import',function(event,message){

  debugChanels(`css-view-import`);

  event.returnValue = Engine.project.Project.data.css;
})

/** HTML VIEW CHANELS*/
Engine.Ipc.on('HTML-view-import',function(event,message){

  debugChanels(`HTML-view-import`);

  event.returnValue = Engine.project.Project.data;
})


/** CHANELS MENU MODAL */

Engine.Ipc.on('client-<Files>-new-project',function(event,message){

  debugChanels(`client-<Files>-new-project`);

  Engine.manager.NewProject({name:"",path:""});
})

Engine.Ipc.on('client-<Files>-open-project',function(event,message){

  debugChanels(`client-<Files>-open-project`);

  Engine.manager.LoadProject();
})

Engine.Ipc.on('client-<Files>-save-project',function(event,message){

  debugChanels(`client-<Files>-save-project`);

  Engine.manager.SaveProject();
})

Engine.Ipc.on('client-<Files>-save-project-as',function(event,message){

  debugChanels(`client-<Files>-save-project-as`);


})

Engine.Ipc.on('client-<Files>-export-all',function(event,message){

  debugChanels(`client-<Files>-export-all`);


})

Engine.Ipc.on('client-<Files>-export-html',function(event,message){

  debugChanels(`client-<Files>-export-html`);


})

Engine.Ipc.on('client-<Files>-export-css',function(event,message){

  debugChanels(`client-<Files>-export-css`);


})

Engine.Ipc.on('client-<Edit>-open-libraries-manager',function(event,message){

  debugChanels(`client-<Edit>-open-libraries-manager`);

  Engine.project.LibraryManager();
})

Engine.Ipc.on('client-<Edit>-add-libraries-external',function(event,message){

  debugChanels(`client-<Edit>-add-libraries-external`);

  Engine.project.AddCDN();
})

Engine.Ipc.on('client-<Edit>-add-libraries-local',function(event,message){

  debugChanels(`client-<Edit>-add-libraries-local`);

  Engine.project.AddLibrary();
})
