// 除非用webpack编译一下，否则只能用require代替import
const { app, BrowserWindow, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const url = require('url');
const path = require('path');
// const MenuBuilder = require('./menu');

let mainWindow = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    // await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 725,
  });

  const fileUrl =
    process.env.NODE_ENV === 'development'
      ? `http://localhost:8000`
      : url.format({
          pathname: path.join(__dirname, '../', '../', 'dist', 'index.html'),
          protocol: 'file:',
          slashes: true,
        });
  mainWindow.loadURL(fileUrl);

  checkForUpdate();

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // const menuBuilder = new MenuBuilder(mainWindow);
  // menuBuilder.buildMenu();
});

const checkForUpdate = () => {
  // 当开始检查更新的时候触发
  autoUpdater.on('checking-for-update', () => {
    dialog.showMessageBox({
      title: 'checking-for-update',
    });
  });
  // 有可用更新时发出
  autoUpdater.on('update-available', info => {
    dialog.showMessageBox({
      title: 'Update available',
      message: info.version + info.releaseName + info.releaseNotes + info.releaseDate,
    });
  });
  // 没有可用更新时发出
  autoUpdater.on('update-not-available', info => {
    dialog.showMessageBox({
      title: 'Update not available',
      message: JSON.stringify(info),
    });
  });
  // 当更新发生错误的时候触发
  autoUpdater.on('error', error => {
    dialog.showMessageBox({
      title: 'Error',
      message: JSON.stringify(error),
    });
  });
  //
  autoUpdater.on('download-progress', function(progressObj) {
    let log_message = 'Download speed: ' + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')';
    // sendUpdateMessage('downloadProgress', log_message);
  });
  // 更新下载完成事件
  autoUpdater.on('update-downloaded', function(info) {
    const dialogOpts = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Application Update',
      detail: 'A new version has been downloaded. Restart the application to apply the updates.',
    };
    dialog.showMessageBox(dialogOpts, response => {
      if (response === 0) autoUpdater.quitAndInstall();
    });
  });
  // 向服务端查询现在是否有可用的更新
  autoUpdater.checkForUpdatesAndNotify();
};
