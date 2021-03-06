const nodeTemplate = {
  "app" : {input : 0 , output : 1},
  "main" : {input : 1 , output : 1},
  "nav" : {input : 1 , output : 1},
  "article" : {input : 1 , output : 1},
  "section" : {input : 1 , output : 1},
  "aside" : {input : 1 , output : 1},
  "text" : {input : 1 , output : 0},
  "h1" : {input : 1 , output : 0},
  "dialog" : {input : 1 , output : 1},
  "div" : {input : 1 , output : 1},
  "container" : {input : 1 , output : 1},
  "form" : {input : 1 , output : 1},
  "button" : {input : 1 , output : 0},
  "input" : {input : 1 , output : 0},
  "textarea" : {input : 1 , output : 0},
  "select" : {input : 1 , output : 1},
  "option" : {input : 1 , output : 1},
  "optgroupe" : {input : 1 , output : 1},
}

class NodeUI{

  /** Sur base de la class da la connection , retourne l'id du node recevant la connection */
  static getNodeInID(connection){
    const x = connection.classList;
    const z = x[1];
    const y = z.split('_')[z.split('_').length - 1];
    return y.split('-')[y.split('-').length - 1];
  }

  /** Sur base de la class da la connection , retourne l'id du node fesant sortir la connection */
  static getNodeOutID(connection){
    const x = connection.classList;
    const z = x[2];
    const y = z.split('_')[z.split('_').length - 1];
    return y.split('-')[y.split('-').length - 1];
  }

  static getOutputId(connection){
    const x = connection.classList;
    const z = x[3];
    return z.split('_')[z.split('_').length - 1];
  }

  static getNode(id){
    const view = thorium.app.children.WorkGroupView.children.GroupView.children.view.th;
    return view.GetNode(id).parentNode;
  }

  static getNodeId(src){
    return src.children[0].id;
  }

  static toObject(view,src){
    return new Promise(async function(resolve,reject){
      const object = { childrens : [] };
      const nodeID = NodeUI.getNodeId(src);
      object.type = src.children[0].classList[1];
      object.prop = (function(src){
        const props = {};
        const x = src.querySelectorAll('div[name=prop]')[0];
        if(x) for(const e of x.children){
          const fields = e.th;
          const values = fields.GetValues();
          if(values){
            props[values[0]] = values[1];
          }
        }
        return props;
      })(src);
      object.proto = (function(src){
        const protos = {};
        const x = src.querySelectorAll('div[name=proto]')[0];
        if(x) for(const e of x.children){
          const fields = e.th;
          const values = fields.GetValues();
          if(values){
            // if(values[1].includes('function'))protos[values[0]] = eval(`(${values[1]})`);
            // else protos[values[0]] = values[1];
            protos[values[0]] = values[1];
          }
        }
        return protos;
      })(src);

      const nodeOutputs = view.querySelectorAll(`svg.connection.node_out_${nodeID}`);
      for await(const e of nodeOutputs){
        const nodeIn = NodeUI.getNodeInID(e);
        const nodeOut = NodeUI.getNodeOutID(e);
        const childrenID = NodeUI.getOutputId(e) - 1;
        object.childrens[childrenID] = await NodeUI.toObject(view,NodeUI.getNode(nodeIn));
      }

      resolve(object);
    })
  }
}

class NodeValidity{
  static isAppPresent(componentsList){
    return componentsList.includes("app");
  }
  static isUniqueApp(componentsList){
    return (Array.from(componentsList,function(x,i){
      if(x == "app")return true;
      else return null;
    }).filter((x,i)=>x).length > 1 ? false : true)
  }
  static isAppPresentAndUnique(componentsList){
    return (NodeValidity.isAppPresent(componentsList) && NodeValidity.isUniqueApp(componentsList) ? true : false);
  }
}

class App extends thorium.Components.App{

  static CodeDialog = class extends thorium.Components.Div{

    static Menu = class extends thorium.Components.Div{

      static Buttons = class {

        static Resize = class extends thorium.Components.Button{
          constructor(){
            super({
              prop : {
                name : "resize"
              }
            });
          }
        }

        static Validate = class extends thorium.Components.Button{
          constructor(){
            super({
              prop : {
                name : "validate"
              }
            });
          }
        }

        static Close = class extends thorium.Components.Button{
          constructor(src){
            super({
              prop : {
                name : "close"
              },
              proto : {
                src : src,
                onMouseDown : function(){
                  src.value = this.parent.parent.parent.children.editor.editor.getValue();
                  src.element.value = src.value;
                  src.onChange();
                  this.parent.parent.parent.element.remove();
                }
              }
            });
          }
        }

        static Container = class extends thorium.Components.Container{
          constructor(src){
            super({
              prop : {
                name : "ButtonContainer",
                class : "ButtonContainer"
              },
              childrens : [
                new App.CodeDialog.Menu.Buttons.Resize(),
                new App.CodeDialog.Menu.Buttons.Validate(),
                new App.CodeDialog.Menu.Buttons.Close(src)
              ]
            });
          }
        }

      }

      static Title = class extends thorium.Components.Text{
        constructor(title){
          super({
            text : title,
            class : 'title'
          })
        }
      }

      constructor(src,title){
        super({
          prop : {
            name : "codeMenu",
            class : "codeMenu"
          },
          childrens : [
            new App.CodeDialog.Menu.Title(title),
            new App.CodeDialog.Menu.Buttons.Container(src)
          ]
        });
      }
    }

    static Editor = class extends thorium.Components.Textarea{
      constructor(src){
        super({
          prop : {
            name : "editor"
          },
          proto : {
            src : src,
            editor : null,
            onInitialise : function(){
              this.editor = this.editor = CodeMirror.fromTextArea(this.element, {
                lineNumbers: true,
                mode: "javascript"
              });

              if(src.value)this.editor.setValue(src.value);
            }
          }
        });
      }
    }

    constructor(src,title){
      super({
        prop : {
          name : "codeDialog",
          class : "codeDialog"
        },
        childrens : [
          new App.CodeDialog.Menu(src,title),
          new App.CodeDialog.Editor(src)
        ],
      });
    }
  }

  static Menu = class extends thorium.Components.Nav{

    static ButtonExpand = class extends thorium.Components.Button{
      constructor(){
        super({
          prop : {
            text : "&#8592;"
          },
          proto : {
            onMouseDown : function(){
              if(this.parent.isActive)this.parent.turnActive();
            }
          }
        })
      }
    }

    static Section = class extends thorium.Components.Section{

      static Title = class extends thorium.Components.Button{
        constructor(text){
          super({
            prop : {name : "title" , title : text , id : text},
            proto : {
              onMouseDown : function(){
                if(!this.parent.parent.isActive)this.parent.parent.turnActive();
                this.parent.turnActive();
              }
            }
          });
        }
      }

      static Container = class extends thorium.Components.Container{
        constructor(elements){
          super({
            prop : {
              name : "container"
            },
            childrens : elements
          });
        }
      }

      constructor(title,elements){
        super({
          prop : {
            name : title,
          },
          childrens : [
            new App.Menu.Section.Title(title),
            new App.Menu.Section.Container(elements)
          ]
        });
      }
    }

    static Nodes = class extends this.Section{

      static Node = class extends thorium.Components.Div{

        static DynamicPropsFields = class extends thorium.Components.Container{
          constructor(){
            super({
              prop : {
                name : "container",
                class : "fields"
              },
              childrens : [
                new thorium.Components.Input({
                  prop : {placeholder : "propName" , name : "propName"},
                  proto : {
                    onChange : function(){
                      this.parent.RemoveEmptyFields();
                    }
                  }
                }),
                new thorium.Components.Input({
                  prop : {placeholder : "propValue" , name : "propValue"},
                  proto : {
                    onChange : function(){
                      const view = thorium.app.children.WorkGroupView.children.GroupView.children.view.th;
                      if(!this.parent.IsCompleteEmpty())view.onNodeChange(this.parent.GetValues())
                      if(!this.parent.parent.getLastField().IsEmpty())this.parent.parent.addField();
                      this.parent.RemoveEmptyFields();
                    }
                  }
                }),
              ],
              proto : {
                GetValues : function(){
                  if(!this.IsCompleteEmpty())return [this.element.children[0].value,this.element.children[1].value]
                  else return null;
                },
                IsCompleteEmpty : function(){
                  return !Array.from(this.element.querySelectorAll('input'),function(x,i){
                    if(x.value != "")return false;
                    else return true;
                  }).includes(false);
                },
                IsEmpty : function(){
                  return Array.from(this.element.querySelectorAll('input'),function(x,i){
                    if(x.value != "")return false;
                    else return true;
                  }).includes(true);
                },
                RemoveEmptyFields : function(){
                  if(this.IsCompleteEmpty()  && this.parent.element.children.length > 1)this.element.remove();
                }
              }
            });
          }
        }

        static DynamicProtosFields = class extends thorium.Components.Container{
          constructor(){
            super({
              prop : {
                name : "container",
                class : "fields"
              },
              childrens : [
                new thorium.Components.Input({
                  prop : {placeholder : "protoName" , name : "protoName"},
                  proto : {
                    onChange : function(){
                      this.parent.RemoveEmptyFields();
                    }
                  }
                }),
                new thorium.Components.Input({
                  prop : {class : 'variable' , placeholder : "protoValue" , name : "protoValue"},
                  proto : {
                    value : null,
                    changeType : function(){
                      const value = this.element.value;
                      this.element.class = "variable";
                      if(!isNaN(Number(value)))this.element.classList.add("number");
                      else this.element.classList.add("string");
                      this.value = this.element.value;
                    },
                    onChange : function(){
                      this.changeType();
                      if(!this.parent.parent.getLastField().IsEmpty())this.parent.parent.addField();
                      this.parent.RemoveEmptyFields();
                    },
                    onMouseDown : function(){
                      const protoName = this.parent.children.protoName.element.value;
                      if(this.element.classList.contains('function') && protoName){
                        new thorium.UI.NodeUI([new App.CodeDialog(this,protoName)])
                        .BuildIn(document.body)
                        .then(function(dialogBox){
                          dialogBox.th.Initialise();
                        })
                      }
                    }
                  }
                }),
                new thorium.Components.Button({
                  text : "&#x222b;(x)",
                  prop : {
                    class : 'function',
                  },
                  proto : {
                    onMouseDown : function(){
                      this.turnActive();
                      this.parent.ChangeType();
                    },
                  }
                })
              ],
              proto : {
                GetValues : function(){
                  if(!this.IsCompleteEmpty())return [this.element.children[0].value,this.element.children[1].value]
                  else return null;
                },
                IsCompleteEmpty : function(){
                  return !Array.from(this.element.querySelectorAll('input'),function(x,i){
                    if(x.value != "")return false;
                    else return true;
                  }).includes(false);
                },
                IsEmpty : function(){
                  return Array.from(this.element.querySelectorAll('input'),function(x,i){
                    if(x.value != "")return false;
                    else return true;
                  }).includes(true);
                },
                RemoveEmptyFields : function(){
                  if(this.IsCompleteEmpty() && this.parent.element.children.length > 1)this.element.remove();
                },
                ChangeType : function(){
                  this.element.children[1].value = "";
                  this.element.children[1].th.value = "";
                  if(this.element.children[1].classList.contains('variable')){
                    this.element.children[1].classList.remove('variable');
                    this.element.children[1].classList.add('function');
                  }
                  else {
                    this.element.children[1].classList.remove('function');
                    this.element.children[1].classList.add('variable');
                  }
                }
              }
            });
          }
        }

        constructor(tag){
          super({
            prop : {
              name : "node",
              class : "node container"
            },
            childrens : [
              new thorium.Components.H1({prop : {text : tag}}),
              new thorium.Components.Div({
                prop : {name : "prop"},
                childrens : [new App.Menu.Nodes.Node.DynamicPropsFields()],
                proto : {
                  addField : function(){
                    new thorium.UI.NodeUI([new App.Menu.Nodes.Node.DynamicPropsFields()])
                    .BuildIn(this.element)
                    .then(function(result){
                      result.th.Initialise();
                    })
                  },
                  getLastField : function(){
                    return this.element.children[this.element.children.length - 1].th;
                  }
                }
              }),
              new thorium.Components.Div({
                prop : {
                  name : "childrens",
                  text : "childrens"
                },
                childrens : [
                  new thorium.Components.Button({
                    text : "&#x2b;",
                    prop : {class:"add"},
                    proto : {
                      onMouseDown : function(){
                        this.parent.parent.addNodeOutput();
                      }
                    }
                  }),
                  new thorium.Components.Button({
                    text : "&#x2212;",
                    prop : {class:"minus"},
                    proto : {
                      onMouseDown : function(){
                        this.parent.parent.removeNodeOutput();
                      }
                    }
                  }),
                ]
              }),
              new thorium.Components.Div({
                prop : {name : "proto"},
                childrens : [new App.Menu.Nodes.Node.DynamicProtosFields()],
                proto : {
                  addField : function(){
                    new thorium.UI.NodeUI([new App.Menu.Nodes.Node.DynamicProtosFields()])
                    .BuildIn(this.element)
                    .then(function(result){
                      result.th.Initialise();
                    })
                  },
                  getLastField : function(){
                    return this.element.children[this.element.children.length - 1].th;
                  }
                }
              })
            ],
            proto : {
              view : document.getElementById('view').th,
              getNodeID : function(){
                const x = this.element.parentNode.parentNode.id.split('-').filter((x,i)=>x);
                return x[x.length - 1];
              },
              addNodeOutput : function(){
                this.view.addNodeOutput(this.getNodeID());
              },
              removeNodeOutput : function(){
                this.view.removeNodeOutput(this.getNodeID());
              }
            }
          });
        }

      }

      static Buttons = Array.from(Object.keys(nodeTemplate), function(x,i){
        return new thorium.Themes.Default.Button.Icon({
          text : x,
          background : "blue",
          color : "white",
          proto : {
            tag : x,
            onMouseDown : function(){
              this.app.children.WorkGroupView.AddNode(this.tag);
            }
          }
        })
      })

      constructor(title){
        super("Nodes",App.Menu.Nodes.Buttons)
      }
    }

    constructor(){
      super({
        prop : {
          name : "menu"
        },
        childrens : [
          new App.Menu.ButtonExpand(),
          new App.Menu.Nodes()
        ],
        proto : {
          onActive : function(){

          },
          onUnActive : function(){
            this.TurnAllUnActive();
          },
          TurnAllUnActive : function(){
            for(const e of this.element.children){
              if(e.th.isActive)e.th.turnActive();
            }
          }
        }
      });
    }
  }

  static WorkGroupView = class extends thorium.Components.Container{

    static GroupMenu = class extends thorium.Components.Nav{
      constructor(){
        super({
          prop : {
            class : "GroupMenu",
            name : "GroupMenu"
          }
        });
      }
    }

    static GroupView = class extends thorium.Components.Div{

      static View = class extends thorium.Components.Div{
        constructor(){
          super({
            prop : {
              id : 'view',
              name : "view"
            },
            proto : {
              editor : null,
              get_arch : null,
              onInitialise : function(){
                this.editor = new Drawflow(this.element);

                this.editor.on('nodeCreated', this.nodeCreated );
                this.editor.on('nodeRemoved', this.nodeRemoved );
                this.editor.on('connectionCreated', this.connectionCreated );
                this.editor.on('zoom' , this.onZoom );

                this.get_arch = ipcRenderer.on('get_arch', this.ExportTemplate);

                this.editor.start();
              },
              // Retourne le node en fonction de son id
              GetNode : function(id){
                return this.element.querySelectorAll(`div#node-${id}`)[0];
              },
              // Ajout d'un node ?? la planche
              AddNode : function(tag){

                const _this = this;

                var data = { "name": '' };
                const nodeId = _this.editor.addNode(tag, nodeTemplate[tag].input , nodeTemplate[tag].output , 150, 300, tag, data , "");
                const node = this.GetNode(nodeId);
                new thorium.UI.NodeUI([new App.Menu.Nodes.Node(tag)])
                .BuildIn(node.querySelectorAll(".drawflow_content_node")[0])
                .then(function(result){
                  result.th.Initialise();
                })

              },
              getAllComponents : function(){

                const parent_node = this.querySelector(".parent-node");
                return Array.from(parent_node , function(x,i){
                  return x.children[0].classList[1];
                })

              },
              getAppComponent : function(){
                const parent_node = this.querySelector(".parent-node");
                return Array.from(parent_node , function(x,i){
                  if(x.children[0].classList.contains('app'))return x;
                }).filter((x,i)=>x)[0];
              },
              RemoveAllEmptyParentsNode : function(){
                const parent_node = this.querySelector(".parent-node");
                for(const e of parent_node){if(e.children.length == 0)e.remove()}
              },
              BuildTemplate : function(){
                const _this = this;
                const app = this.getAppComponent();
                return NodeUI.toObject(this.element,app)
                // .then(function(result){
                //   console.log(result);
                //   ipcRenderer.sendSync('thorium_template', JSON.stringify(result));
                // });
              },
              // Event IPC
              ExportTemplate : async function(event,filePath){
                const view = thorium.app.children.WorkGroupView.children.GroupView.children.view.th;
                const template = await view.BuildTemplate()
                ipcRenderer.sendSync('thorium_arch_template_export', JSON.stringify({filePath : filePath ,template : template}));
              },
              SendTemplate : async function(){
                const template = await this.BuildTemplate()
                ipcRenderer.sendSync('thorium_template', JSON.stringify(template));
              },
              /// EDITOR
              addNodeOutput : function(id){
                this.editor.addNodeOutput(id);
              },
              removeNodeOutput : function(id){
                const node = this.GetNode(id);
                const outputs = node.querySelectorAll('.output');
                if(outputs.length > 1){
                  const lastOutput = outputs[outputs.length - 1].classList[1];
                  this.editor.removeNodeOutput(id,lastOutput);
                }
              },
              nodeCreated : function(id){
                const view = thorium.app.children.WorkGroupView.children.GroupView.children.view.th;
                const components = view.getAllComponents();
                if(!NodeValidity.isAppPresentAndUnique(components)){
                  if(!NodeValidity.isAppPresent(components))alert("??? App not present ???");
                  if(!NodeValidity.isUniqueApp(components))alert("??? App not unique ???");
                }
                else{
                  view.SendTemplate();
                }
              },
              nodeRemoved : function(id){
                const view = thorium.app.children.WorkGroupView.children.GroupView.children.view.th;
                view.RemoveAllEmptyParentsNode();
              },
              connectionCreated : function({ output_id, input_id, output_class, input_class }){
                const view = thorium.app.children.WorkGroupView.children.GroupView.children.view.th;
                const linksInput = view.element.querySelectorAll(`svg.node_in_node-${input_id}.${input_class}`);
                const linksOutput = view.element.querySelectorAll(`svg.node_out_node-${output_id}.${output_class}`);

                if(linksInput.length > 1 || linksOutput.length > 1){
                  if(linksInput.length > 1)alert("??? This component is already use ???");
                  if(linksOutput.length > 1)alert("??? This children's slot is already use ???");
                  view.editor.removeSingleConnection(output_id, input_id, output_class, input_class);
                }
                else{
                  view.SendTemplate();
                }
              },
              onZoom : function(zoom_level){
                const view = thorium.app.children.WorkGroupView.children.GroupView.children.view.th;
                view.element.style.backgroundSize = `${zoom_level + 1}rem ${zoom_level + 1}rem`;
              },
              // Custom Event
              onNodeChange : function(){
                this.SendTemplate();
              }
            }
          });
        }
      }

      static HTMLView = class extends thorium.UI.ElementUI{
        constructor(){
          super({
            type : "iframe",
            prop : {
              id : "HTMLview",
              name : "HTMLview",
              style : Style.Css({
                height: "100%",
                width: "100%"
              })
            },
            proto : {
              onInitialise : function(){
                this.AddScript("thorium","../lib/thorium.js");
              },
              AddScript : function(id,url){
                const script = this.element.contentDocument.createElement('script');
                script.id = id;
                script.src = url;
                script.type = "text/javascript";
                this.element.contentDocument.head.appendChild(script);
              },
              AddCss : function(){

              },
              Clear : function(){
                this.element.contentDocument.body.innerHTML = "";
              },
              BuildTemplate : function(T){
                console.log(T);
                this.Clear();
                new this.element.contentWindow.thorium.UI.NodeUI([T])
                .BuildIn(this.element.contentDocument.body)
                .then(function(element){
                  element.th.Initialise();
                })
              }
            }
          })
        }
      }

      constructor(){
        super({
          prop : {
            id : "GroupView",
            name : "GroupView"
          },
          childrens : [
            new App.WorkGroupView.GroupView.View()
          ]
        });
      }

    }

    constructor(){
      super({
        prop : {
          name : "WorkGroupView",
        },
        childrens : [
          new App.WorkGroupView.GroupMenu(),
          new App.WorkGroupView.GroupView()
        ],
        proto : {
          AddNode : function(tag){
            this.children.GroupView.children.view.AddNode(tag);
          }
        }
      });
    }

  }

  static Footer = class extends thorium.Components.Container{
    constructor(){
      super({
        prop : {
          name : "footer"
        }
      });
    }
  }

  constructor(){
    super({
      childrens : [
        new App.Menu(),
        new App.WorkGroupView(),
        new App.Footer()
      ]
    })
  }
}

class view extends View{

  constructor(){
    super(new App());
  }

}
