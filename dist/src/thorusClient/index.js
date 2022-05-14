/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => {
    /******/ var __webpack_modules__ = ({
        /***/ "./src/Project.ts": 
        /*!************************!*\
          !*** ./src/Project.ts ***!
          \************************/
        /***/ ((module, exports, __webpack_require__) => {
            eval("var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {\n    \"use strict\";\n    Object.defineProperty(exports, \"__esModule\", ({ value: true }));\n    exports.Manager = void 0;\n    var Manager;\n    (function (Manager) {\n        let Project;\n        (function (Project) {\n            let Structure;\n            (function (Structure) {\n                class Data {\n                    constructor() {\n                        this.app = new App;\n                        this.css = new Css;\n                        this.lib = new Lib;\n                        this.workbench = new WorkBench;\n                    }\n                }\n                Structure.Data = Data;\n                class App {\n                }\n                Structure.App = App;\n                class Css {\n                }\n                Structure.Css = Css;\n                class Lib {\n                }\n                Structure.Lib = Lib;\n                class WorkBench {\n                    constructor() {\n                        this.app = {\n                            nodesBench: new NodeBench\n                        };\n                    }\n                    GetBenchByName(name) {\n                        return (name ? this[name] : console.error(\"bench name not correct\"));\n                    }\n                    SetBench(benchName, template) {\n                        this[benchName] = template;\n                    }\n                    GetAllBenchNames() {\n                        return Object.keys(this);\n                    }\n                    RemoveBench(benchName) {\n                        delete this[benchName];\n                    }\n                    GetAllNodesBench(benchName) {\n                        return this[benchName].nodesBench;\n                    }\n                    GetAllNodesBenchNames(benchName) {\n                        return Object.keys(this[benchName].nodesBench);\n                    }\n                    SetNodeBench(benchName, componentName, componentTemplate) {\n                        componentTemplate._id = this.SetNodeId();\n                        this[benchName].nodesBench[componentName] = componentTemplate;\n                        this[componentTemplate._id] = componentTemplate;\n                    }\n                    RemoveNodeBench(benchName, componentName) {\n                        const componentId = this[benchName][componentName].id;\n                        delete this[benchName][componentName];\n                        delete this[componentId];\n                    }\n                    SetNodeId() {\n                        let hash = 0;\n                        let keyString = String(Date.now());\n                        for (let charIndex = 0; charIndex < keyString.length; ++charIndex) {\n                            hash += keyString.charCodeAt(charIndex);\n                            hash += hash << 10;\n                            hash ^= hash >> 6;\n                        }\n                        hash += hash << 3;\n                        hash ^= hash >> 11;\n                        return (((hash + (hash << 15)) & 4294967295) >>> 0);\n                    }\n                }\n                Structure.WorkBench = WorkBench;\n                class NodeBench {\n                }\n                Structure.NodeBench = NodeBench;\n            })(Structure = Project.Structure || (Project.Structure = {}));\n            class Model {\n                constructor() {\n                    this.name = null;\n                    this.path = null;\n                    this.data = new Structure.Data;\n                }\n            }\n            Project.Model = Model;\n        })(Project = Manager.Project || (Manager.Project = {}));\n        class ProjectManager {\n            constructor() {\n                this.project = new Project.Model;\n            }\n            set Data(project) { this.project = project; }\n            get data() { return this.project.data; }\n            get app() { return this.data.app; }\n            get css() { return this.data.css; }\n            get lib() { return this.data.lib; }\n            get workBench() { return this.data.workbench; }\n            get GetBenchByName() { return function (name, _this = this) { return _this.workBench.GetBenchByName(name); }; }\n            get SetBench() { return function (benchName, template, _this = this) { return _this.workBench.SetBench(benchName, template); }; }\n            get GetAllBenchNames() { return function (_this = this) { return _this.workBench.GetAllBenchNames(); }; }\n            get RemoveBench() { return function (benchName, _this = this) { return _this.workBench.RemoveBench(benchName); }; }\n            get GetAllNodesBenchNames() { return function (benchName, _this = this) { return _this.workBench.GetAllNodesBenchNames(benchName); }; }\n            get SetNodeBench() { return function (benchName, componentName, componentTemplate, _this = this) { return _this.workBench.SetNodeBench(benchName, componentName, componentTemplate); }; }\n            get RemoveNodeBench() { return function (benchName, componentName, _this = this) { return _this.workBench.RemoveNodeBench(benchName, componentName); }; }\n        }\n        Manager.ProjectManager = ProjectManager;\n    })(Manager = exports.Manager || (exports.Manager = {}));\n}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),\n\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));\n\n\n//# sourceURL=webpack://thorusclient/./src/Project.ts?");
            /***/ 
        }),
        /***/ "./src/index.ts": 
        /*!**********************!*\
          !*** ./src/index.ts ***!
          \**********************/
        /***/ ((module, exports, __webpack_require__) => {
            eval("var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ./Project */ \"./src/Project.ts\")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Project_1) {\n    \"use strict\";\n    Object.defineProperty(exports, \"__esModule\", ({ value: true }));\n    exports.t = exports.Thorus = void 0;\n    class Thorus {\n        constructor() {\n            this.manager = new Project_1.Manager.ProjectManager;\n        }\n        get File() {\n            return new class File {\n                get ipcRenderer() {\n                    const w = window;\n                    return w.ipcRenderer;\n                }\n                constructor() { }\n                NewProject() { this.ipcRenderer.send('client-<Files>-new-project', null); }\n                OpenProject() { this.ipcRenderer.send('client-<Files>-open-project', null); }\n                SaveProject() { this.ipcRenderer.send('client-<Files>-save-project', null); }\n                SaveProjectAs() { this.ipcRenderer.send('client-<Files>-save-project-as', null); }\n                ExportAll() { this.ipcRenderer.send('client-<Files>-export-all', null); }\n                ExportHTML() { this.ipcRenderer.send('client-<Files>-export-html', null); }\n                ExportCSS() { this.ipcRenderer.send('client-<Files>-export-css', null); }\n                Exit() { }\n            }();\n        }\n        get Edit() {\n            return new class Edit {\n                constructor() { }\n                get Libraries() {\n                    return new class {\n                        constructor() { }\n                        get ipcRenderer() {\n                            const w = window;\n                            return w.ipcRenderer;\n                        }\n                        OpenManager() { this.ipcRenderer.send('client-<Edit>-open-libraries-manager', null); }\n                        AddExternal() { this.ipcRenderer.send('client-<Edit>-add-libraries-external', null); }\n                        AddLocal() { this.ipcRenderer.send('client-<Edit>-add-libraries-local', null); }\n                    }();\n                }\n            }();\n        }\n        get app() {\n            const w = window;\n            const t = w.thorium;\n            return t.app;\n        }\n        get WorkGroupView() {\n            const w = window;\n            const t = w.thorium;\n            return new class WorkGroupView {\n                constructor(element) {\n                    this.element = element;\n                }\n            }(t.app.WorkGroupView);\n        }\n        get GroupView() {\n            const w = window;\n            const t = w.thorium;\n            return new class GroupView {\n                constructor(element) {\n                    this.element = element;\n                }\n                OpenView(viewName) { return this.element.OpenView(viewName); }\n                OpenCodeView(viewName, option) { return this.element.OpenCodeView(viewName, option); }\n                CloseView(viewName) { return this.element.CloseView(viewName); }\n                CloseAllViews() { return this.element.CloseAllViews(); }\n                ShowView(viewName) { return this.element.ShowView(viewName); }\n                GetActiveView() { return this.element.getActiveView(); }\n                GetViewByName(viewName) { return this.element.getViewByName(viewName); }\n                TurnViewActive() { return this.element.activeView(); }\n                TurnViewByNameActive(viewName) { return this.element.activeViewByName(viewName); }\n                TurnViewUnActive() { return this.element.unactiveView(); }\n            }(t.app.WorkGroupView.GroupView);\n        }\n        get GroupMenu() {\n            const w = window;\n            const t = w.thorium;\n            return t.app.WorkGroupView.GroupView.GroupMenu;\n        }\n        get Menu() {\n            const w = window;\n            const t = w.thorium;\n            return new class Menu {\n                constructor(element) {\n                    this.element = t.app.menu;\n                    this.element = element;\n                }\n                Open() { if (!this.element.isActive)\n                    this.element.turnActive(); }\n                Close() {\n                    if (!Array.from(this.element.children, function (item, i) {\n                        return item.isActive;\n                    }).includes(true))\n                        this.element.turnActive();\n                }\n                OpenSection(sectionName) {\n                    try {\n                        const section = this.element.querySelectorAll(`section[name=${sectionName}]`)[0];\n                        if (!section)\n                            throw new Error('Wrong section name');\n                        this.Open();\n                        if (!section.isActive)\n                            section.turnActive();\n                    }\n                    catch (err) {\n                        console.warn(err);\n                    }\n                }\n                CloseSection(sectionName) {\n                    try {\n                        const section = this.element.querySelectorAll(`section[name=${sectionName}]`)[0];\n                        if (!section)\n                            throw new Error('Wrong section name');\n                        this.Close();\n                        if (section.isActive)\n                            section.turnActive();\n                    }\n                    catch (err) {\n                        console.warn(err);\n                    }\n                }\n            }(t.app.menu);\n        }\n        get View() {\n            return null;\n        }\n    }\n    exports.Thorus = Thorus;\n    const w = window;\n    w.thorus = new Thorus();\n    exports.t = w.thorus;\n}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),\n\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));\n\n\n//# sourceURL=webpack://thorusclient/./src/index.ts?");
            /***/ 
        })
        /******/ 
    });
    /************************************************************************/
    /******/ // The module cache
    /******/ var __webpack_module_cache__ = {};
    /******/
    /******/ // The require function
    /******/ function __webpack_require__(moduleId) {
        /******/ // Check if module is in cache
        /******/ var cachedModule = __webpack_module_cache__[moduleId];
        /******/ if (cachedModule !== undefined) {
            /******/ return cachedModule.exports;
            /******/ }
        /******/ // Create a new module (and put it into the cache)
        /******/ var module = __webpack_module_cache__[moduleId] = {
            /******/ // no module.id needed
            /******/ // no module.loaded needed
            /******/ exports: {}
            /******/ 
        };
        /******/
        /******/ // Execute the module function
        /******/ __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
        /******/
        /******/ // Return the exports of the module
        /******/ return module.exports;
        /******/ 
    }
    /******/
    /************************************************************************/
    /******/
    /******/ // startup
    /******/ // Load entry module and return exports
    /******/ // This entry module can't be inlined because the eval devtool is used.
    /******/ var __webpack_exports__ = __webpack_require__("./src/index.ts");
    /******/
    /******/ 
})();
//# sourceMappingURL=index.js.map