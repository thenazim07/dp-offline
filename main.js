// main.js

const { app, BrowserWindow } = require('electron');
const { spawn, exec } = require('child_process');
const path = require('path');
const os = require('os');
const express = require('express');
const http = require('http');
const serveStatic = require('serve-static');
const { KeepAlive } = require('vue');

let mainWindow;

// Function to create the main application window
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true, // or false, depending on your setup
      enableRemoteModule: true, // if needed
      preload: path.join(__dirname, 'preload.js')
    }
  });

  

  // Check if Nuxt is ready, then load it in the window
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

  checkNuxtReady();

  const isDev = !app.isPackaged;

  // Open DevTools only in development
  // if (isDev) {
  //   mainWindow.webContents.openDevTools();
  // }
   // Open DevTools after the window loads
   mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.openDevTools();
});

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error(`Failed to load ${validatedURL}: ${errorDescription}`);
  });

  mainWindow.webContents.on('crashed', () => {
    console.error('The app has crashed.');
  });
};
let phpServer;
function startPhpServer(phpPath) {
  // Adjust the command as needed for your environment
  phpServer = spawn(phpPath, ['-S', 'localhost:8001']); // Change port as needed

  phpServer.stdout.on('data', (data) => {
      console.log(`PHP Server: ${data}`);
  });

  phpServer.stderr.on('data', (data) => {
      console.error(`PHP Server Error: ${data}`);
  });

  phpServer.on('close', (code) => {
      console.log(`PHP server exited with code ${code}`);
  });
}


function stopPhpServer() {
  if (phpServer) {
      phpServer.kill(); // Stop the server
      phpServer = null; // Reset the reference
  }
}
function restartPhpServer() {
  stopPhpServer(); // Stop the server
  setTimeout(() => {
      startPhpServer(); // Restart the server after a brief pause
  }, 1000); // Adjust timeout as necessary
}
function startLaravelServer() {

  let executionPath;
  const osType = os.type();
  console.log('os', osType);
  if (osType == 'Linux') {
    executionPath = 'resources/php/php';
  }
  if (osType == 'Darwin') {
    executionPath = 'resources/php/php';
  }
  if (osType == 'Windows_NT') {
    executionPath = 'executables/php/win-php/php.exe';
  }
  const phpPath = path.join(process.resourcesPath, executionPath); // Updated to use Linux binary

  // startPhpServer(phpPath);
  

  const laravelCommand = `${phpPath} -S localhost:8888 -t ${path.join(__dirname, 'server/public')}`;
  
  // exec(laravelCommand, {env}, (error, stdout, stderr) => {
  exec(laravelCommand, (error, stdout, stderr) => {
    if (error) {
      console.error('Error starting Laravel:', error);
      return;
    }
    console.log('Laravel server started:', stdout);
  });
}

// Start Express server to serve Nuxt files
function startNuxtServer() {
  const expressApp = express();
  const nuxtPath = path.join(__dirname, '.output/public')
  expressApp.use(serveStatic(nuxtPath));
  expressApp.listen(3000, () => {
    console.log('Nuxt server is running at http://localhost:3000');
  });
}

// App is ready, start server and create window
app.whenReady().then(() => {
  // restartPhpServer();
  startLaravelServer();
  startNuxtServer();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
