"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manager = void 0;
var Manager;
(function (Manager) {
    let Project;
    (function (Project) {
        let Structure;
        (function (Structure) {
            class Data {
                constructor() {
                    this.app = new App;
                    this.css = new Css;
                    this.lib = new Lib;
                    this.workbench = new WorkBench;
                }
            }
            Structure.Data = Data;
            class App {
            }
            Structure.App = App;
            class Css {
            }
            Structure.Css = Css;
            class Lib {
            }
            Structure.Lib = Lib;
            class WorkBench {
                constructor() {
                    this.app = {
                        nodesBench: new NodeBench
                    };
                }
                /** Retourne le bench name portant le nom correspondant */
                GetBenchByName(name) {
                    return (name ? this[name] : console.error("bench name not correct"));
                }
                /** Définis un workbench */
                SetBench(benchName, template) {
                    this[benchName] = template;
                }
                /** Retourne tout les nom de workbench */
                GetAllBenchNames() {
                    return Object.keys(this);
                }
                /** Suppresion d'un workbench */
                RemoveBench(benchName) {
                    delete this[benchName];
                }
                /** Retourne tout les NodeBench d'un workbench */
                GetAllNodesBench(benchName) {
                    return this[benchName].nodesBench;
                }
                /** Retourne tout les nom de NodeBench d'un workbench */
                GetAllNodesBenchNames(benchName) {
                    return Object.keys(this[benchName].nodesBench);
                }
                /** Définis le NodeBench d'un workbench */
                SetNodeBench(benchName, componentName, componentTemplate) {
                    componentTemplate._id = this.SetNodeId();
                    this[benchName].nodesBench[componentName] = componentTemplate;
                    this[componentTemplate._id] = componentTemplate;
                }
                /** Suppression d'un nodebench de son workbench */
                RemoveNodeBench(benchName, componentName) {
                    const componentId = this[benchName][componentName].id;
                    delete this[benchName][componentName];
                    delete this[componentId];
                }
                SetNodeId() {
                    let hash = 0;
                    let keyString = String(Date.now());
                    for (let charIndex = 0; charIndex < keyString.length; ++charIndex) {
                        hash += keyString.charCodeAt(charIndex);
                        hash += hash << 10;
                        hash ^= hash >> 6;
                    }
                    hash += hash << 3;
                    hash ^= hash >> 11;
                    return (((hash + (hash << 15)) & 4294967295) >>> 0);
                }
            }
            Structure.WorkBench = WorkBench;
            class NodeBench {
            }
            Structure.NodeBench = NodeBench;
        })(Structure = Project.Structure || (Project.Structure = {}));
        class Model {
            constructor() {
                this.name = null;
                this.path = null;
                this.data = new Structure.Data;
            }
        }
        Project.Model = Model;
    })(Project = Manager.Project || (Manager.Project = {}));
    class ProjectManager {
        constructor() {
            this.project = new Project.Model;
        }
        set Data(project) { this.project = project; }
        get data() { return this.project.data; }
        get app() { return this.data.app; }
        get css() { return this.data.css; }
        get lib() { return this.data.lib; }
        get workBench() { return this.data.workbench; }
        get GetBenchByName() { return function (name, _this = this) { return _this.workBench.GetBenchByName(name); }; }
        get SetBench() { return function (benchName, template, _this = this) { return _this.workBench.SetBench(benchName, template); }; }
        get GetAllBenchNames() { return function (_this = this) { return _this.workBench.GetAllBenchNames(); }; }
        get RemoveBench() { return function (benchName, _this = this) { return _this.workBench.RemoveBench(benchName); }; }
        get GetAllNodesBenchNames() { return function (benchName, _this = this) { return _this.workBench.GetAllNodesBenchNames(benchName); }; }
        get SetNodeBench() { return function (benchName, componentName, componentTemplate, _this = this) { return _this.workBench.SetNodeBench(benchName, componentName, componentTemplate); }; }
        get RemoveNodeBench() { return function (benchName, componentName, _this = this) { return _this.workBench.RemoveNodeBench(benchName, componentName); }; }
    }
    Manager.ProjectManager = ProjectManager;
})(Manager = exports.Manager || (exports.Manager = {}));
//# sourceMappingURL=Project.js.map