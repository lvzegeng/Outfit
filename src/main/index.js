// 除非用webpack编译一下，否则只能用require代替import
const { app, BrowserWindow, dialog, Tray, Menu, shell } = require('electron');
const { autoUpdater } = require('electron-updater');
const url = require('url');
const path = require('path');

// 保持window对象的全局引用，防止 window 在垃圾收集JavaScript对象时自动关闭
let mainWindow = null;
let tray = null;
let rightMenu = null;

// 将此应用设为单个实例应用。当试图启动第二个实例时，主窗口将被恢复并聚焦，而不是打开第二个窗口
// 不成为单个实例应用程序的话，直接 init()
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, argv, workingDirectory) => {
    if (mainWindow) {
      // 将窗口从最小化状态恢复到以前的状态
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
  app.on('ready', () => {
    mainWindow = new BrowserWindow({
      width: 1024,
      height: 725,
      show: false,
      webPreferences: { webSecurity: false }, // 禁用同源策略
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
      if (!process.argv.includes('--hidden')) {
        mainWindow.show();
      }
      mainWindow.focus();
      setTray(); // 添加图标和上下文菜单到系统通知区
      setApplicationMenu();
      setRightClickMenu();

      if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
        require('devtron').install();
      } else {
        // 在登录时启动应用，通过 process.argv.includes('--hidden') 判断是否隐藏窗口
        app.setLoginItemSettings({
          openAtLogin: true,
          args: ['--hidden'],
        });
        checkForUpdate(); // 检查更新
      }
    });

    // 在窗口要关闭的时候触发，可以把关闭窗口改为隐藏窗口，所以关闭窗口只能使用 mainWindow.destroy(), app.exit()
    mainWindow.on('close', e => {
      // e.preventDefault();
      // mainWindow.hide()
    });

    mainWindow.on('closed', () => {
      mainWindow = null;
    });
  });

  app.on('window-all-closed', () => {
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // 在macOS上，当单击dock图标并且没有其他窗口打开时，通常在应用程序中重新创建一个窗口，重新执行 ready 事件的方法
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
  tray.setToolTip(`${app.getName()}  ${app.getVersion()}`); // 应用程序的名称  版本
  tray.setContextMenu(contextMenu);
};

const setRightClickMenu = () => {
  rightMenu = Menu.buildFromTemplate([
    {
      label: 'label 1',
      click: () => {},
    },
    { type: 'separator' },
    {
      label: 'label 2',
      click: () => {},
    },
  ]);

  mainWindow.webContents.on('context-menu', (event, params) => {
    rightMenu.popup(mainWindow);
  });
};

const setApplicationMenu = () => {
  const template = [
    {
      label: 'Tool',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          role: 'reload',
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
          role: 'toggledevtools',
        },
        { type: 'separator' },
        {
          label: 'Toggle Full Screen',
          accelerator: process.platform === 'darwin' ? 'Ctrl+Command+F' : 'F11',
          role: 'togglefullscreen',
        },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Learn More',
          click(menuItem, browserWindow, event) {
            shell.openExternal('http://electron.atom.io');
          },
        },
        {
          label: 'Services',
          submenu: [],
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

const checkForUpdate = () => {
  // 当开始检查更新的时候触发
  autoUpdater.on('checking-for-update', () => {});
  // 有可用更新时发出
  autoUpdater.on('update-available', info => {
    /*dialog.showMessageBox({
      title: 'Update available',
      message: info.version + info.releaseName + info.releaseNotes + info.releaseDate,
    });*/
  });
  // 没有可用更新时发出
  autoUpdater.on('update-not-available', info => {});
  // 当更新发生错误的时候触发
  autoUpdater.on('error', error => {
    mainWindow.setProgressBar(-1); // 去掉任务栏的进度条
  });
  // 更新进度
  autoUpdater.on('download-progress', progressObj => {
    // 'Download speed: ' + progressObj.bytesPerSecond + ' - Downloaded ' + progressObj.percent + '%' + ' (' + progressObj.transferred + '/' + progressObj.total + ')';
    // 下载进度显示在任务栏的进度条
    mainWindow.setProgressBar(progressObj.percent / 100);
  });
  // 更新下载完成事件
  autoUpdater.on('update-downloaded', info => {
    const dialogOpts = {
      type: 'info',
      buttons: ['重启', '稍后'],
      title: '应用更新',
      detail: '已下载新版本，重新启动应用程序以应用更新？',
    };
    dialog.showMessageBox(dialogOpts, response => {
      if (response === 0) autoUpdater.quitAndInstall();
    });
    mainWindow.setProgressBar(-1); // 去掉任务栏的进度条
  });
  // 向服务端查询现在是否有可用的更新
  autoUpdater.checkForUpdatesAndNotify();
};
