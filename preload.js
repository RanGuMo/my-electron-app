const { contextBridge, ipcRenderer } = require("electron");

// 暴露数据给渲染进程
contextBridge.exposeInMainWorld("myNodeVersion", {
  version: process.version,
});

contextBridge.exposeInMainWorld("myAPI", {
  saveFile(str) {
    //渲染进程给主进程发送消息事件,通过 IPC 发送 'file-save' 事件并传递数据
    ipcRenderer.send("create-file", str);
  },
  // 定义读取文件的方法，通过 IPC 调用 'file-read' 事件并返回 Promise 结果
  readFile: () => {
    return ipcRenderer.invoke("file-read");
  },
  getMessage:(callback)=>{
    return ipcRenderer.on("message",callback)
  }
});

// =============================创建通知========================
const NOTIFICATION_TITLE = '通知'
const NOTIFICATION_BODY =
  '通知内容'
const CLICK_MESSAGE = '我被点击了'

new Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY }).onclick =
  () => alert(CLICK_MESSAGE)


  if(window){
    ipcRenderer.on("change-view",(event,url)=>{
      window.location.href = url
    })
  }