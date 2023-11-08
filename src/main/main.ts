import { app, BrowserWindow, BrowserWindowConstructorOptions as WindowOptions} from "electron";
import path, { join } from "path";
import * as url from "url";
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

  var newPath = path.join(__dirname, "../../dist/index.html")

  const fileRoute = createFileRoute(
    newPath,
    id)

  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL(createURLRoute('http://localhost:4000', id))
 
    
  } else {
    mainWindow.loadURL(createURLRoute(newPath,id));
  }


  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  return mainWindow
}

app.whenReady().then(() => {
  createWindow('main', {
    
    webPreferences: {
      sandbox: false
    },
  })


})



