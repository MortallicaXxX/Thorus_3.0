// import { Manager } from './Project';

/** Client Thorus Front Side */
export class Thorus{

  /** Manager de Projets */
  // manager:Manager.ProjectManager = new Manager.ProjectManager;
  /** Retourne l'app thorium */
  get app():HTMLElement {
    const w:any = window;
    const t:any = w.thorium;
    return t.app;
  }

}

const w:any = window;
w.thorus = new Thorus();
