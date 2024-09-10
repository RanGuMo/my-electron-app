
## 0.node版本
v18.12.2

## 1.项目启动
```bash
npm install
npm run start
```
## 2.项目打包
```bash
npm run build
```

## 3.安装asar 
```bash
npm install -g asar
```
## 4.解压asar包
来到 my-electron-app\dist\win-unpacked\resources 这个目录 会有一个 app.asar 文件
```bash
asar extract app.asar ./
```
