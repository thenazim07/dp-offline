// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('node:path')
const { exec } = require('child_process');
const http = require('http');

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
 // Function to check if Nuxt is ready (i.e., server is running)
 function checkNuxtReady() {
  http
    .get('http://localhost:3000', (res) => {
      if (res.statusCode === 200) {
        mainWindow.loadURL('http://localhost:3000');
      } else {
        setTimeout(checkNuxtReady, 1000); // Retry after 1 second
      }
    })
    .on('error', () => {
      setTimeout(checkNuxtReady, 1000); // Retry after 1 second if Nuxt is not ready
    });
}

// Start checking if Nuxt is ready
checkNuxtReady();


  const isDev = !app.isPackaged;

  // if (isDev) {
  //   // Development mode: load the Nuxt.js dev server
  //   // const startUrl = path.join(__dirname, 'client/dist/index.html')
  //   // const startUrl = path.join(__dirname, 'client/.output/public/index.html')
  //   // const startUrl = path.join(__dirname, '.output/public/index.html')
  //   const startUrl = 'http://localhost:3000'
  //   mainWindow.loadURL(startUrl);
  // } else {
  //   // Production mode: load the built Nuxt.js app
  //   // const startUrl = path.join(process.resourcesPath, '.output/public/index.html');
  //   // const startUrl = path.join(process.resourcesPath, 'index.html');
  //   const startUrl = 'http://localhost:3000'
  //   console.log('process path',startUrl)
  //   mainWindow.loadURL(startUrl);
  // }

// Open the DevTools (comment this out in production).
// mainWindow.webContents.openDevTools();

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  console.log('Directory name:', __dirname);
  console.log('Resources path:', process.resourcesPath);

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error(`Failed to load ${validatedURL}: ${errorDescription}`);
    console.log('Directory name:', __dirname);
    console.log('Resources path:', process.resourcesPath);
  });
  
  mainWindow.webContents.on('crashed', () => {
    console.error('The app has crashed.');
    console.log('Directory name:', __dirname);
  console.log('Resources path:', process.resourcesPath);
  });

  
  
}

function startNuxt() {
  exec('npx serve .output/public', (error, stdout, stderr) => {
    if (error) {
      console.error('Error starting Nuxt:', error);
      return;
    }
    console.log('Nuxt started:', stdout);
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  startNuxt();
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.