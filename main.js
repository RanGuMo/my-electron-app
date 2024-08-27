// main.js运行在应用的主进程上，无法访问web相关API，主要负责：控制生命周期、显示界面
// 控制渲染进程等其他操作。

// 引入：app（整个应用）、BrowserWindow（用于创建窗口）、ipcMain（用于进程通信）
const { app, BrowserWindow, ipcMain } = require("electron");
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

// 1.创建浏览器窗口。
function createWindow() {
  // 1.1.创建浏览器窗口。
  mainWindow = new BrowserWindow({
    width: 800, // 宽度
    height: 600, // 高度
    autoHideMenuBar: true, // 自动隐藏菜单栏（默认是false）
    alwysOnTop: true, // 窗口置顶(类似z-index:9999，永远置于最高层) （默认是false）
    x: 0, // 窗口左上角x坐标
    y: 0, // 窗口左上角y坐标
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
    },
  });
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
