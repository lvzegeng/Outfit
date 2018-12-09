// 除非用webpack编译一下，否则只能用require代替import
const { app, BrowserWindow, dialog, Tray, Menu } = require('electron');
const { autoUpdater } = require('electron-updater');
const url = require('url');
const path = require('path');
// const MenuBuilder = require('./menu');

// 保持window对象的全局引用，防止 window 在垃圾收集JavaScript对象时自动关闭
let mainWindow = null;
let tray = null;

// 将此应用设为单个实例应用。当试图启动第二个实例时，主窗口将被恢复并聚焦，而不是打开第二个窗口
// 不成为单个实例应用程序的话，直接 init()
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      if (!mainWindow.isVisible()) {
        mainWindow.show();
      }
      mainWindow.focus();
    }
  });
  init();
}

function init() {
  if (process.env.NODE_ENV === 'production') {
    const sourceMapSupport = require('source-map-support');
    sourceMapSupport.install();

    // 在登录时启动应用，通过 process.argv.includes(item==='--hidden') 判断是否隐藏窗口
    app.setLoginItemSettings({
      openAtLogin: true,
      args: [`--hidden`],
    });
  }

  app.on('ready', () => {
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

    mainWindow.once('ready-to-show', () => {
      mainWindow.show();
      mainWindow.focus();
      if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
        require('devtron').install();
      }
      // 添加图标和上下文菜单到系统通知区
      setTray();
      // 检查更新
      checkForUpdate();
    });

    mainWindow.on('closed', () => {
      mainWindow = null;
    });

    // const menuBuilder = new MenuBuilder(mainWindow);
    // menuBuilder.buildMenu();
  });

  app.on('window-all-closed', () => {
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // 在macOS上，当单击dock图标并且没有其他窗口打开时，通常在应用程序中重新创建一个窗口，重新执行 ready
    if (win === null) {
      // createWindow();
    }
  });
}

const setTray = () => {
  tray = new Tray(path.join(__dirname, 'tray.png'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '退出',
      click() {
        app.quit();
      },
    },
  ]);
  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });
  tray.setToolTip(`${app.getName()}  ${app.getVersion()}`);
  tray.setContextMenu(contextMenu);
};

const checkForUpdate = () => {
  // 当开始检查更新的时候触发
  autoUpdater.on('checking-for-update', () => {

  });
  // 有可用更新时发出
  autoUpdater.on('update-available', info => {
    /*dialog.showMessageBox({
      title: 'Update available',
      message: info.version + info.releaseName + info.releaseNotes + info.releaseDate,
    });*/
  });
  // 没有可用更新时发出
  autoUpdater.on('update-not-available', info => {

  });
  // 当更新发生错误的时候触发
  autoUpdater.on('error', error => {
    // 去掉任务栏的进度条
    mainWindow.setProgressBar(-1);
  });
  // 更新进度
  autoUpdater.on('download-progress', function(progressObj) {
    let log_message = 'Download speed: ' + progressObj.bytesPerSecond + ' - Downloaded ' + progressObj.percent + '%' + ' (' + progressObj.transferred + '/' + progressObj.total + ')';
    // 下载进度显示在任务栏的进度条
    mainWindow.setProgressBar(progressObj.percent / 100);
  });
  // 更新下载完成事件
  autoUpdater.on('update-downloaded', function(info) {
    const dialogOpts = {
      type: 'info',
      buttons: ['重启', '稍后'],
      title: '应用更新',
      detail: '已下载新版本，重新启动应用程序以应用更新？',
    };
    dialog.showMessageBox(dialogOpts, response => {
      if (response === 0) autoUpdater.quitAndInstall();
    });
    // 去掉任务栏的进度条
    mainWindow.setProgressBar(-1);
  });
  // 向服务端查询现在是否有可用的更新
  autoUpdater.checkForUpdatesAndNotify();
};
