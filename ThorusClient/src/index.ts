import { Manager } from './Project';

/** Client Thorus Front Side */
export class Thorus{

  /** Manager de Projets */
  manager:Manager.ProjectManager = new Manager.ProjectManager;
  /** Retourne l'app thorium */

  get File(){

    return new class File{

      get ipcRenderer(){
        const w:any = window;
        return w.ipcRenderer;
      }

      constructor(){}

      NewProject(){this.ipcRenderer.send('client-<Files>-new-project',null);}
      OpenProject(){this.ipcRenderer.send('client-<Files>-open-project',null);}
      SaveProject(){this.ipcRenderer.send('client-<Files>-save-project',null);}
      SaveProjectAs(){this.ipcRenderer.send('client-<Files>-save-project-as',null);}
      ExportAll(){this.ipcRenderer.send('client-<Files>-export-all',null);}
      ExportHTML(){this.ipcRenderer.send('client-<Files>-export-html',null);}
      ExportCSS(){this.ipcRenderer.send('client-<Files>-export-css',null);}
      Exit(){}

    }()

  }
  get Edit(){

    return new class Edit{

      constructor(){}

      get Libraries(){

        return new class
        {

          constructor(){}

          get ipcRenderer(){
            const w:any = window;
            return w.ipcRenderer;
          }

          OpenManager(){this.ipcRenderer.send('client-<Edit>-open-libraries-manager',null);}
          AddExternal(){this.ipcRenderer.send('client-<Edit>-add-libraries-external',null);}
          AddLocal(){this.ipcRenderer.send('client-<Edit>-add-libraries-local',null);}

        }()

      }

    }()

  }

  get app():HTMLElement|any {
    const w:any = window;
    const t:any = w.thorium;
    return t.app;
  }
  get WorkGroupView():HTMLElement|any {
    const w:any = window;
    const t:any = w.thorium;

    return new class WorkGroupView{

      element:HTMLElement|any;

      constructor(element:HTMLElement|any){
        this.element = element;
      }

    }(t.app.WorkGroupView)

  }
  get GroupView():HTMLElement|any {
    const w:any = window;
    const t:any = w.thorium;

    return new class GroupView{

      element:HTMLElement|any;

      constructor(element:HTMLElement|any){
        this.element = element;
      }

      OpenView(viewName:string){return this.element.OpenView(viewName)}
      OpenCodeView(viewName:string,option:[]){return this.element.OpenCodeView(viewName,option)}
      CloseView(viewName:string){return this.element.CloseView(viewName)}
      CloseAllViews(){return this.element.CloseAllViews()}
      ShowView(viewName:string){return this.element.ShowView(viewName)}
      GetActiveView(){return this.element.getActiveView()}
      GetViewByName(viewName:string){return this.element.getViewByName(viewName)}
      TurnViewActive(){return this.element.activeView()}
      TurnViewByNameActive(viewName:string){return this.element.activeViewByName(viewName)}
      TurnViewUnActive(){return this.element.unactiveView()}

    }(t.app.WorkGroupView.GroupView)

  }
  get GroupMenu():HTMLElement|any {
    const w:any = window;
    const t:any = w.thorium;
    return t.app.WorkGroupView.GroupView.GroupMenu;
  }

  /** Retourne une class Menu contenant l'élément Menu_HTML en plus de fonctionalitée lui étant propres */
  get Menu(){

    const w:any = window;
    const t:any = w.thorium;

    return new class Menu{

      element:HTMLElement|any = t.app.menu;

      constructor(element:HTMLElement|any){
        this.element = element;
      }

      /** Ouverture du menu de thorus */
      Open(){if(!this.element.isActive)this.element.turnActive();}
      /** Fermeture du menu de thorus */
      Close(){
        if(!Array.from(this.element.children,function(item:any,i){
          return item.isActive;
        }).includes(true))this.element.turnActive();
      }
      /** Ouverture de la section du menu de thorus portant le même nom que le parametre */
      OpenSection(sectionName:string){
        try{
          const section = this.element.querySelectorAll(`section[name=${sectionName}]`)[0];
          if(!section)throw new Error('Wrong section name');
          this.Open();
          if(!section.isActive)section.turnActive();
        }catch(err){
          console.warn(err);
        }
      }
      /** Fermeture de la section du menu de thorus portant le même nom que le parametre */
      CloseSection(sectionName:string){
        try{
          const section = this.element.querySelectorAll(`section[name=${sectionName}]`)[0];
          if(!section)throw new Error('Wrong section name');
          this.Close();
          if(section.isActive)section.turnActive();
        }catch(err){
          console.warn(err);
        }
      }

    }(t.app.menu)

  }

  get View(){

    return null;

  }

}

const w:any = window;
w.thorus = new Thorus();

/** Instance de Thorus */
export const t = w.thorus;
