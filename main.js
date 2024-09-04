// main.js运行在应用的主进程上，无法访问web相关API，主要负责：控制生命周期、显示界面
// 控制渲染进程等其他操作。

// 引入：app（整个应用）、BrowserWindow（用于创建窗口）、ipcMain（用于进程通信）
const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  MenuItem,
  Tray,
  dialog,
} = require("electron");
// 引入path模块
const path = require("path");
// 引入fs模块
const fs = require("fs");

// 保持对window对象的全局引用，如果不这么做的话，当JavaScript对象被
// 垃圾回收的时候，window对象将会自动的关闭
let mainWindow;

// 2.创建文件
function createFile(event, data) {
  fs.writeFileSync("D:/hello.txt", data);
}

// 3.读取文件,读取指定文件内容并返回字符串格式的结果
function readFile() {
  const res = fs.readFileSync("D:/hello.txt").toString();
  return res;
}
// 系统托盘
function tray() {
  const tray = new Tray("./pages/assets/logo.png");
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "关于",
      click: () => {
        alert("关于");
      },
    },
    {
      label: "帮助",
      click: () => {
        alert("帮助");
      },
    },
    {
      label: "设置",
      click: () => {
        alert("设置");
      },
    },
    {
      role: "mminize",
      label: "最小化",
      click: () => {
        mainWindow.minimize();
      },
    },
    {
      role: "togglefullscreen",
      label: "全屏",
      click: () => {
        mainWindow.setFullScreen(mainWindow.isFullScreen() !== true);
      },
    },
    {
      label: "退出",
      click: () => {
        app.quit();
      },
    },
  ]);
  tray.setToolTip(app.name);
  tray.on("right-click", () => {
    tray.popUpContextMenu(contextMenu);
  });
  tray.on("click", () => {
    mainWindow.show();
  });
}

// 应用菜单
function ApplicationMenu() {
  const isMac = process.platform === "darwin";

  const template = [
    // { role: 'appMenu' }
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: "about" },
              { type: "separator" },
              { role: "services" },
              { type: "separator" },
              { role: "hide" },
              { role: "hideOthers" },
              { role: "unhide" },
              { type: "separator" },
              { role: "quit" },
            ],
          },
        ]
      : []),
    // { role: 'fileMenu' }
    {
      label: "File",
      submenu: [isMac ? { role: "close" } : { role: "quit",label:'退出' }],
    },
    // { role: 'editMenu' }
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        ...(isMac
          ? [
              { role: "pasteAndMatchStyle" },
              { role: "delete" },
              { role: "selectAll" },
              { type: "separator" },
              {
                label: "Speech",
                submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }],
              },
            ]
          : [{ role: "delete" }, { type: "separator" }, { role: "selectAll" }]),
      ],
    },
    // { role: 'viewMenu' }
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    // { role: 'windowMenu' }
    {
      label: "Window",
      submenu: [
        { role: "minimize" },
        { role: "zoom" },
        ...(isMac
          ? [
              { type: "separator" },
              { role: "front" },
              { type: "separator" },
              { role: "window" },
            ]
          : [{ role: "close" }]),
      ],
    },
    {
      role: "help",
      submenu: [
        {
          label: "Learn More",
          click: async () => {
            const { shell } = require("electron");
            await shell.openExternal("https://electronjs.org");
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// 文件浏览对话框
function createDialog(mainWindow){
  dialog.showOpenDialog(mainWindow,{
    title: "请选择文件",
    properties: ["openFile"],
    filters: [
      { name: "Images", extensions: ["jpg", "png", "gif"] },
      { name: "Movies", extensions: ["mkv", "avi", "mp4"] },
      { name: "Custom File Type", extensions: ["as"] },
      { name: "All Files", extensions: ["*"] },
    ]
  }).then(result => {
    // result.canceled 为true表示取消选择，false为选择成功
    // result.filePaths 为选择的文件路径数组
    // console.log(result);
    if (!result.canceled) {
      // 获取文件路径
      const filePath = result.filePaths[0];
      // 获取文件名
      const fileName = path.basename(filePath);
      // 获取文件后缀
      const fileExt = path.extname(filePath);
      // 获取文件大小
      const fileSize = fs.statSync(filePath).size;
      console.log(`文件名：${fileName},文件后缀：${fileExt},文件大小：${fileSize}字节`);
    }
  }).catch(err => {
    console.log(err);
  });
}

// 1.创建浏览器窗口。
function createWindow() {
  // 1.1.创建浏览器窗口。
  mainWindow = new BrowserWindow({
    width: 800, // 宽度
    height: 600, // 高度
    autoHideMenuBar: false, // 自动隐藏菜单栏（默认是false）
    alwysOnTop: true, // 窗口置顶(类似z-index:9999，永远置于最高层) （默认是false）
    x: 0, // 窗口左上角x坐标
    y: 0, // 窗口左上角y坐标
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
    },
  });
  // 文件对话框
  createDialog(mainWindow)
  // 2.1.主进程注册对应的事件
  ipcMain.on("create-file", createFile);

  // 3.1.处理 'file-read' IPC 事件，调用 readFile 函数处理，并返回结果
  ipcMain.handle("file-read", readFile);

  // 1.2.加载一个远程的页面
  // mainWindow.loadURL("http://www.baidu.com");
  // 1.2.加载一个本地的页面
  mainWindow.loadFile("./pages/index.html");

  // 创建⼀个定时器
  setTimeout(() => {
    mainWindow.webContents.send("message", "你好啊！");
  }, 6000);
}

// 1.3.当 window 被加载，就执行创建窗口这个函数
app.on("ready", () => {
  createWindow();
  // 右键菜单
  const menu = new Menu();
  menu.append(new MenuItem({ label: "复制", role: "copy" }));
  menu.append(new MenuItem({ label: "粘贴", role: "paste" }));
  menu.append(new MenuItem({ label: "全选", role: "selectall" }));
  menu.append(new MenuItem({ label: "刷新", role: "reload" }));
  menu.append(new MenuItem({ label: "剪切", role: "cut" }));
  menu.append(new MenuItem({ label: "删除", role: "delete" }));
  menu.append(new MenuItem({ label: "撤销", role: "undo" }));
  menu.append(new MenuItem({ label: "重做", role: "redo" }));
  mainWindow.webContents.on("context-menu", (e, params) => {
    menu.popup({ window: mainWindow, x: params.x, y: params.y });
  });

  // 系统托盘
  tray();
  // 应用级菜单
  ApplicationMenu();
  // 1.6.在 mac上，点击 Dock 图标且没有其他窗口打开时，重新创建窗口
  // 当应用被激活时
  app.on("activate", () => {
    // 如果没有窗口打开，则创建一个窗口
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 1.4.当 window 被关闭，这个事件会被触发。
app.on("closed", function () {
  // 取消引用 window 对象，如果你的应用支持多窗口的话，
  // 通常会把多个 window 对象存放在一个数组里面，
  // 与此同时，你应该删除相应的元素。
  mainWindow = null;
});

// 1.5.当所有窗口都关闭时，自动退出应用，除非在 macOS 上
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
