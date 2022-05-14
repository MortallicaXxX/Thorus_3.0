"use strict";
// import { Manager } from './Project';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Thorus = void 0;
/** Client Thorus Front Side */
class Thorus {
    /** Manager de Projets */
    // manager:Manager.ProjectManager = new Manager.ProjectManager;
    /** Retourne l'app thorium */
    get app() {
        const w = window;
        const t = w.thorium;
        return t.app;
    }
}
exports.Thorus = Thorus;
const w = window;
w.thorus = new Thorus();
//# sourceMappingURL=thorus.js.map