// main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');

app.disableHardwareAcceleration();

const isDev = !app.isPackaged;
let autoUpdater;
try { ({ autoUpdater } = require('electron-updater')); } catch { /* optional in dev */ }

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    show: false,
    backgroundColor: '#ffffff',
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      devTools: isDev
    }
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (isDev) mainWindow.webContents.openDevTools({ mode: 'detach' });
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  if (!isDev) mainWindow.removeMenu();

  mainWindow.on('closed', () => { mainWindow = null; });
}

function initAutoUpdate() {
  if (!autoUpdater || isDev) return;
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.on('error', err => console.error('AutoUpdater error:', err));
  autoUpdater.on('update-available', () => console.log('Update available'));
  autoUpdater.on('update-downloaded', () => console.log('Update downloaded'));
  autoUpdater.checkForUpdatesAndNotify();
}

// single-instance
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    if (process.platform === 'win32') {
      app.setAppUserModelId('com.dg.savings-app');
    }
    createWindow();
    initAutoUpdate();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
