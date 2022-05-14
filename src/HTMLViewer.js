class HTMLView{

  static IsActive(engine){
    return engine.IsWindowActive('htmlview');
  }

  static AddScript(engine){

  }

  static CssInjection(engine,css){
    const htmlWindow = engine.GetWindow('htmlview');
    htmlWindow.webContents.insertCSS(css);
  }

  static JsInjection(engine,js){
    const htmlWindow = engine.GetWindow('htmlview');
    htmlWindow.webContents.executeJavaScript(js);
  }

}

class CodeView{

  static CssInjection(engine,css){
    HTMLView.CssInjection(engine,css);
  }

}

module.exports = HTMLView;
