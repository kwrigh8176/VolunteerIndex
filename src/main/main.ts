import { app, BrowserWindow, BrowserWindowConstructorOptions as WindowOptions} from "electron";
import path, { join } from "path";

import { createFileRoute, createURLRoute } from 'electron-router-dom'


let mainWindow: Electron.BrowserWindow | null;

function createWindow(id: string, options: WindowOptions = {}) {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 700,
    backgroundColor: "#1f2120",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      //devTools: process.env.NODE_ENV !== "production",
      devTools: true,
    },
  });

  const devServerURL = createURLRoute('http://localhost:4000', id)

  
  const prodRoute = createFileRoute(join(__dirname, '../dist/renderer/index.html'),id)
  

  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL(devServerURL)
   
    
  } else {
    mainWindow.loadFile(...prodRoute);
  
  }


  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  return mainWindow
}

app.whenReady().then(() => {
  createWindow('main', {
    
    
  })


})



