const { dialog } = require('electron');

module.exports = function(Engine){
  const isMac = process.platform === 'darwin';
  return template = [
    // { role: 'appMenu' }
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),
    // { role: 'fileMenu' }
    {
      label: 'File',
      submenu: [
        {
          label : 'New Project',
          click : function(){Engine.manager.NewProject();}
        },
        {
          label : 'Open Project' ,
          click : function(){Engine.manager.LoadProject();}
        },
        { type: 'separator' },
        {
          label : 'Save',
          click : function(){Engine.manager.SaveProject();}
        },
        { label : 'SaveAs' },
        { type: 'separator' },
        { label : 'ExportAll' },
        { label : 'ExportHTML' },
        { label : 'ExportCSS' },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit' },
      ]
    },
    // { role: 'editMenu' }
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        {
          label : 'Components' ,
          submenu: [
            {
              label: 'Add' ,
              submenu : [
                { label : "app" , click : function(){Engine.project.AddNodeComponent('app')} }
              ]
            }
          ]
        },
        {
          label : 'Librairies' ,
          submenu: [
            { label : "Manager" , click : function(){Engine.project.LibraryManager()}},
            { type: 'separator' },
            { label : "Add CDN" , click : function(){Engine.project.AddCDN()}},
            { type: 'separator' },
            { label : "Add Library" , click : function(){Engine.project.AddLibrary()}},
          ]
        },
        ...(isMac ? [
          { role: 'pasteAndMatchStyle' },
          { role: 'delete' },
          { role: 'selectAll' },
          { type: 'separator' },
          {
            label: 'Speech',
            submenu: [
              { role: 'startSpeaking' },
              { role: 'stopSpeaking' }
            ]
          }
        ] : [
          { role: 'delete' },
          { type: 'separator' },
          { role: 'selectAll' }
        ])
      ]
    },
    // { role: 'viewMenu' }
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
        {
          label : 'HTML',
          click(){
            Engine.project.AddWindow('HTML');
          }
        },
        {
          label : 'CSS',
          click(){
            Engine.project.AddWindow('CSS');
          }
        }
      ]
    },
    // { role: 'windowMenu' }
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac ? [
          { type: 'separator' },
          { role: 'front' },
          { type: 'separator' },
          { role: 'window' }
        ] : [
          { role: 'close' }
        ])
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            const { shell } = require('electron')
            await shell.openExternal('https://electronjs.org')
          }
        }
      ]
    }
  ]
}
