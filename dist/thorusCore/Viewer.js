"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeView = exports.HTMLView = void 0;
class HTMLView {
    static IsActive(project) {
        return project.IsWindowActive('HTML');
    }
    static AddScript(project) {
    }
    static CssInjection(project, css) {
        if (HTMLView.IsActive(project)) {
            const htmlWindow = project.GetWindow('HTML');
            htmlWindow.webContents.insertCSS(css);
        }
    }
    static JsInjection(project, js) {
        if (HTMLView.IsActive(project)) {
            const htmlWindow = project.GetWindow('HTML');
            htmlWindow.webContents.executeJavaScript(js);
        }
    }
}
exports.HTMLView = HTMLView;
class CodeView {
    static CssInjection(project, css) {
        HTMLView.CssInjection(project, css);
    }
}
exports.CodeView = CodeView;
//# sourceMappingURL=Viewer.js.map