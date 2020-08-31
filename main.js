// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, Menu, shell, dialog, protocol } = require('electron')
const path = require('path')
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('data.sqlite');
const isMac = process.platform === 'darwin'
const bcrypt = require('bcrypt');
const ejs = require('ejs');
const gotTheLock = app.requestSingleInstanceLock()
let username, password, mainWindow, dialogOpen = false

function createWindow() {
  console.log("Ready to create windows...")
  console.log("Setting up custom ejs protocols...")

  protocol.registerFileProtocol('base', (request, callback) => {
    const url = request.url.substr(6)
    const file = { path: path.normalize(`${__dirname}/${url}`) }
    callback(file)
  })

  // create a new `splash`-Window 
  const splash = new BrowserWindow({
    width: 500,
    height: 300,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      worldSafeExecuteJavaScript: true
    },
    show: false
  })

  splash.loadFile("splash.html")

  splash.once('ready-to-show', () => {
    console.log("Splash ready...")
    splash.show()
    // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        worldSafeExecuteJavaScript: true,
        preload: path.join(__dirname, 'preload.js')
      },
      show: false
    })

    const about = new BrowserWindow({
      width: 300,
      height: 400,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        worldSafeExecuteJavaScript: true,
        preload: path.join(__dirname, 'preload.js')
      },
      show: false,
      parent: mainWindow,
      modal: true
    })
    const menu = Menu.buildFromTemplate([
      // { role: 'appMenu' }
      ...(isMac ? [{
        label: app.name,
        submenu: [
          {
            label: 'about',
            click: async () => {
              about.show()
            }
          },
          { type: 'separator' },
          { role: 'services' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideothers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      }] : []),
      // { role: 'fileMenu' }
      {
        label: 'File',
        submenu: [
          isMac ? { role: 'close' } : { role: 'quit' }
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
          ...(isMac ? [
            { role: 'pasteAndMatchStyle' },
            { role: 'delete' },
            { role: 'selectAll' },
            { type: 'separator' },
            {
              label: 'Speech',
              submenu: [
                { role: 'startspeaking' },
                { role: 'stopspeaking' }
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
          { role: 'resetzoom' },
          { role: 'zoomin' },
          { role: 'zoomout' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
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
              await shell.openExternal('https://futurelucas4502.github.io/index.html?page=fusion_services')
            }
          },
          {
            label: 'About',
            click: async () => {
              about.show()
            }
          },
        ]
      }
    ])
    Menu.setApplicationMenu(menu)
    about.setMenu(null)
    ejsWrapper("views/about.ejs", about, {
      appName: app.getName(),
      appVersion: app.getVersion(),
      chromeVersion: process.versions['chrome'],
      nodeVersion: process.versions['node'],
      electronVersion: process.versions['electron']
    })
    about.on('close', function (event) {
      event.preventDefault();
      about.hide();
      if (isMac) {
        app.dock.hide()
      }
    });
    // and load the login page of the app.
    ejsWrapper("views/login.ejs", mainWindow)



    // if main window is ready to show, then destroy the splash window and show up the main window
    mainWindow.once('ready-to-show', () => {
      console.log("Main ready. Waiting 3 seconds for splash...")
      setTimeout(() => {
        console.log("3 Seconds over killing splash and loading main...")
        splash.destroy()
        mainWindow.hide() // If we do show on its own it shows but in the background so we have to do hide first it seems to be an issue withing electron on how the new browserwindows are created
        mainWindow.show()
        // Open the DevTools.
        mainWindow.webContents.openDevTools()
      }, 3000);
    });
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
if (!gotTheLock) {
  log.info('App already running switching to app now...');
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    win.show()
    if (process.platform === 'darwin') {
      app.dock.show()
    }
    // Someone tried to run a second instance, we should focus our window.
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })
  app.whenReady().then(() => {
    createWindow()
    // Fixes notifications and probably other things:
    app.setAppUserModelId("Fusion Services Home Help - Finance Manager")

    app.on('activate', function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on('window-all-closed', function () {
    if (!isMac) {
      db.close()
      app.quit()
    }
  })
}
console.log("Setting up ejs rendering wrapper...")
// Start setup of ejs

function ejsWrapper(path, window, data) {
  if(typeof data == undefined || data == undefined || data == null || data == ""){
    data = "{}"
  }
  ejs.renderFile(path, data, (err, str) => {
    window.loadURL('data:text/html;charset=UTF-8,' + encodeURIComponent(str), {
      baseURLForDataURL: 'base:/' // have to use this as `file://${__dirname}` is broken see here: https://github.com/electron/electron/issues/20700#issuecomment-573847842
    })
  })
}

// End setup of ejs

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// ipcMain.on("page-ready", (event, arg) => {
//   console.log(arg) // prints "ping"
//   event.reply('reply', 'pong')
// })

function authCheck (){
  db.get(`SELECT * FROM users WHERE username = (?)`, username, function (err, row) {
    if (err) {
      console.log(err)
    }
    if (typeof row == undefined || row == undefined || row == null || row == "") {
      return logout(true)
    }
    bcrypt.compare(password, row.password, function (err, result) {
      if (!result) {
        return logout(true)
      }
      return true
    });
  });
}

function logout(authFail) {
  ejsWrapper("views/login.ejs", mainWindow)
  username = null
  password = null
  mainWindow.webContents.on('did-finish-load', () => {
    if (authFail == true) {
      if (!dialogOpen) {
        dialogOpen = true
        dialog.showMessageBox(mainWindow, { type: 'error', buttons: ['OK'], title: 'Error', message: 'Unauthorised Access!' }).then(response => {
          dialogOpen = false
          authFail = false
        });
      }
    }
  })
}

ipcMain.on("login", (event, arg) => {
  username = arg.username
  password = arg.password
  db.get(`SELECT * FROM users WHERE username = (?)`, arg.username, function (err, row) {
    if (err) {
      console.log(err)
    }
    if (typeof row == undefined || row == undefined || row == null || row == "") {
      if (!dialogOpen) {
        dialogOpen = true
        return dialog.showMessageBox(mainWindow, { type: 'error', buttons: ['OK'], title: 'Login Failed', message: 'Incorrect username or password.\nPlease try again.' }).then(response => {
          dialogOpen = false
        });
      }
    }
    bcrypt.compare(arg.password, row.password, function (err, result) {
      if (!result) {
        if (!dialogOpen) {
          dialogOpen = true
          return dialog.showMessageBox(mainWindow, { type: 'error', buttons: ['OK'], title: 'Login Failed', message: 'Incorrect username or password.\nPlease try again.' }).then(response => {
            dialogOpen = false
          });
        }
      }
      ejsWrapper("views/index.ejs", mainWindow)
    });
  });
})
