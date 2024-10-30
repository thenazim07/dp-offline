// main.js

const { app, BrowserWindow } = require('electron');
const { exec } = require('child_process');
const path = require('path');
const express = require('express');
const http = require('http');
const serveStatic = require('serve-static');

let mainWindow;

// Function to create the main application window
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
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
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error(`Failed to load ${validatedURL}: ${errorDescription}`);
  });

  mainWindow.webContents.on('crashed', () => {
    console.error('The app has crashed.');
  });
};

function startLaravelServer() {
  const phpPath = path.join(__dirname, 'resources/php/php.exe'); // Updated to use Linux binary

  const laravelCommand = `${phpPath} -S localhost:8000 -t ${path.join(__dirname, 'server/public')}`;
  
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
