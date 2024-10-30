const { app, BrowserWindow } = require('electron');
const path = require('node:path');

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  const isDev = !app.isPackaged;

  if (isDev) {
    // Development mode: load the Nuxt.js dev server
    // const startUrl = path.join(__dirname, 'client/dist/index.html')
    const startUrl = path.join(__dirname, 'index.html')
    console.log(startUrl)
  } else {
    // Production mode: load the built Nuxt.js app from resources
    // const startUrl = path.join(process.resourcesPath, 'dist/index.html');
    const startUrl = path.join(process.resourcesPath, '.output/public/index.html');
    console.log('Loading file from:', startUrl);
    mainWindow.loadFile(startUrl);  // No need for `file://` prefix
  }

  // Open the DevTools only in development
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Handle errors when the window fails to load
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
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
