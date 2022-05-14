import { Manager } from './Project';
export declare class Thorus {
    manager: Manager.ProjectManager;
    get File(): {
        readonly ipcRenderer: any;
        NewProject(): void;
        OpenProject(): void;
        SaveProject(): void;
        SaveProjectAs(): void;
        ExportAll(): void;
        ExportHTML(): void;
        ExportCSS(): void;
        Exit(): void;
    };
    get Edit(): {
        readonly Libraries: {
            readonly ipcRenderer: any;
            OpenManager(): void;
            AddExternal(): void;
            AddLocal(): void;
        };
    };
    get app(): HTMLElement | any;
    get WorkGroupView(): HTMLElement | any;
    get GroupView(): HTMLElement | any;
    get GroupMenu(): HTMLElement | any;
    get Menu(): {
        element: HTMLElement | any;
        Open(): void;
        Close(): void;
        OpenSection(sectionName: string): void;
        CloseSection(sectionName: string): void;
    };
    get View(): any;
}
export declare const t: any;
