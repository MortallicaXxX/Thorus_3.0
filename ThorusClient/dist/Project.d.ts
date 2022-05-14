export declare namespace Manager {
    namespace Project {
        namespace Structure {
            class Data {
                app: App;
                css: Css;
                lib: Lib;
                workbench: WorkBench;
            }
            class App {
            }
            class Css {
            }
            class Lib {
            }
            class WorkBench {
                app: object;
                GetBenchByName(name: string): any;
                SetBench(benchName: string, template: object): void;
                GetAllBenchNames(): string[];
                RemoveBench(benchName: string): void;
                GetAllNodesBench(benchName: string): any;
                GetAllNodesBenchNames(benchName: string): string[];
                SetNodeBench(benchName: string, componentName: string, componentTemplate: any): void;
                RemoveNodeBench(benchName: string, componentName: string): void;
                SetNodeId(): number;
            }
            class NodeBench {
            }
        }
        class Model {
            name: any;
            path: any;
            data: Structure.Data;
        }
    }
    class ProjectManager {
        project: Project.Model;
        set Data(project: Project.Model);
        get data(): Project.Structure.Data;
        get app(): Project.Structure.App;
        get css(): Project.Structure.Css;
        get lib(): Project.Structure.Lib;
        get workBench(): Project.Structure.WorkBench;
        get GetBenchByName(): (name: string, _this?: ProjectManager) => any;
        get SetBench(): (benchName: string, template: any, _this?: ProjectManager) => void;
        get GetAllBenchNames(): (_this?: ProjectManager) => string[];
        get RemoveBench(): (benchName: string, _this?: ProjectManager) => void;
        get GetAllNodesBenchNames(): (benchName: string, _this?: ProjectManager) => string[];
        get SetNodeBench(): (benchName: string, componentName: string, componentTemplate: object, _this?: ProjectManager) => void;
        get RemoveNodeBench(): (benchName: string, componentName: string, _this?: ProjectManager) => void;
    }
}
