import { t as Thorus } from './index';

export namespace Manager{

  export namespace Project{

    export namespace Structure{

      export class Data{
        app = new App;
        css = new Css;
        lib = new Lib;
        workbench = new WorkBench;
      }

      export class App{

      }

      export class Css{

      }

      export class Lib{

      }

      export class WorkBench{

        app:object = {
          nodesBench : new NodeBench
        }

        /** Retourne le bench name portant le nom correspondant */
        GetBenchByName(name:string){
          return (name ? this[name] : console.error("bench name not correct"))
        }

        /** Définis un workbench */
        SetBench(benchName:string,template:object){
          this[benchName] = template;
        }

        /** Retourne tout les nom de workbench */
        GetAllBenchNames(){
          return Object.keys(this);
        }

        /** Suppresion d'un workbench */
        RemoveBench(benchName:string){
          delete this[benchName];
        }

        /** Retourne tout les NodeBench d'un workbench */
        GetAllNodesBench(benchName:string){
          return this[benchName].nodesBench;
        }

        /** Retourne tout les nom de NodeBench d'un workbench */
        GetAllNodesBenchNames(benchName:string){
          return Object.keys(this[benchName].nodesBench);
        }

        /** Définis le NodeBench d'un workbench */
        SetNodeBench(benchName:string,componentName:string,componentTemplate:any){
          componentTemplate._id = this.SetNodeId();
          this[benchName].nodesBench[componentName] = componentTemplate;
          this[componentTemplate._id] = componentTemplate;
        }

        /** Suppression d'un nodebench de son workbench */
        RemoveNodeBench(benchName:string,componentName:string){
          const componentId =  this[benchName][componentName].id;
          delete this[benchName][componentName];
          delete this[componentId];
        }

        SetNodeId(){
            let hash = 0;
            let keyString = String(Date.now());
            for (let charIndex = 0; charIndex < keyString.length; ++charIndex)
            {
              hash += keyString.charCodeAt(charIndex);
              hash += hash << 10;
              hash ^= hash >> 6;
            }
            hash += hash << 3;
            hash ^= hash >> 11;
            return (((hash + (hash << 15)) & 4294967295) >>> 0);
        }

      }

      export class NodeBench{

      }

    }

    export class Model{

      name = null;
      path = null;
      data = new Structure.Data;

  }

  }

  export class ProjectManager{

    project = new Project.Model;

    set Data(project:Project.Model){this.project = project}
    get data():Project.Structure.Data{return this.project.data}
    get app():Project.Structure.App{return this.data.app}
    get css():Project.Structure.Css{return this.data.css}
    get lib():Project.Structure.Lib{return this.data.lib}
    get workBench():Project.Structure.WorkBench{return this.data.workbench}

    get GetBenchByName(){return function(name:string,_this:ProjectManager = this){return _this.workBench.GetBenchByName(name)}}
    get SetBench(){return function(benchName:string,template:any,_this:ProjectManager = this){return _this.workBench.SetBench(benchName,template)}}
    get GetAllBenchNames(){return function(_this:ProjectManager = this){return _this.workBench.GetAllBenchNames()}}
    get RemoveBench(){return function(benchName:string,_this:ProjectManager = this){return _this.workBench.RemoveBench(benchName)}}
    get GetAllNodesBenchNames(){return function(benchName:string,_this:ProjectManager = this){return _this.workBench.GetAllNodesBenchNames(benchName)}}
    get SetNodeBench(){return function(benchName:string,componentName:string,componentTemplate:object,_this:ProjectManager = this){return _this.workBench.SetNodeBench(benchName,componentName,componentTemplate)}}
    get RemoveNodeBench(){return function(benchName:string,componentName:string,_this:ProjectManager = this){return _this.workBench.RemoveNodeBench(benchName,componentName)}}

  }

}
