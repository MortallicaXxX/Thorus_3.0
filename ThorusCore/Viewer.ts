import { Projects } from './Projects';

export class HTMLView{

  static IsActive(project:Projects.Project){
    return project.IsWindowActive('HTML');
  }

  static AddScript(project:Projects.Project){

  }

  static CssInjection(project:Projects.Project,css:string){
    if(HTMLView.IsActive(project)){
      const htmlWindow = project.GetWindow('HTML');
      htmlWindow.webContents.insertCSS(css);
    }
  }

  static JsInjection(project:Projects.Project,js:string){
    if(HTMLView.IsActive(project)){
      const htmlWindow = project.GetWindow('HTML');
      htmlWindow.webContents.executeJavaScript(js);
    }
  }

}

export class CodeView{

  static CssInjection(project:Projects.Project,css:string){
    HTMLView.CssInjection(project,css);
  }

}
