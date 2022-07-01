const { ipcMain, app, BrowserWindow } = require('electron');
const dgram = require("dgram");
const { fullPath } = require('./rootFolder');
const fs = require('fs');

// 记录打开的聊天窗口
let winTalker = null;

// 聊天记录窗口
let winHistory = null;

module.exports = function (win) {

    // 最小化
    ipcMain.on('minimize', () => { win.minimize(); });

    // 退出系统
    ipcMain.on('quit', () => { app.exit(); });

    // 最小化(聊天窗口)
    ipcMain.on('minimize-talker', () => { winTalker.minimize(); });

    // 退出系统（聊天窗口）
    ipcMain.on('quit-talker', () => {
        winTalker.close();
        winTalker = null;
    });

    // 最小化(历史窗口)
    ipcMain.on('minimize-history', () => { winHistory.minimize(); });

    // 退出系统（历史窗口）
    ipcMain.on('quit-history', () => {
        winHistory.close();
        winHistory = null;
    });

    // 获取本地配置信息
    ipcMain.on('get-config', function (event) {
        event.returnValue = JSON.parse(fs.readFileSync(fullPath('./config.json')));
    });

    // 设置本地配置信息
    ipcMain.on('set-config', function (event, config) {
        fs.writeFileSync(fullPath('./config.json'), JSON.stringify(config, null, 2), 'utf-8');
    });

    // 获取mac对应的聊天信息
    ipcMain.on('get-talker', function (event, mac) {
        event.returnValue = JSON.parse(fs.readFileSync(fullPath('./cache/' + (mac.replace(/\:/g, '-')) + '.json')));
    });

    // 设置mac对应的聊天信息
    ipcMain.on('set-talker', function (event, data) {
        fs.writeFileSync(fullPath('./cache/' + (data.mac.replace(/\:/g, '-')) + '.json'), JSON.stringify(data.value, null, 2), 'utf-8');
    });

    // 发送信息
    ipcMain.on('send-msg', function (event, data) {

        // 编码
        data = encodeURIComponent(data);

        let socket = dgram.createSocket("udp4");
        socket.bind(function () {
            socket.setBroadcast(true);
        });
        let message = Buffer.from(data);
        socket.send(message, 0, message.length, 50000, '255.255.255.255', function (err, bytes) {
            socket.close();
        });

    });

    // 打开或恢复历史窗口
    ipcMain.on('open-history', (event, info) => {

        if (winHistory) {
            winHistory.close();
        }

        winHistory = new BrowserWindow({
            width: (process.env.NODE_ENV + "").trim() == 'development' ? 1000 : 760,
            height: 600,
            resizable: false,
            frame: false,
            // alwaysOnTop: true,
            webPreferences: {
                nodeIntegration: true,
                webSecurity: false
            }
        });

        // 开发模式
        if ((process.env.NODE_ENV + "").trim() == 'development') {
            winHistory.loadURL('http://localhost:20000/history.html');
            winHistory.webContents.openDevTools();
        }

        // 生产模式
        else {
            winHistory.loadFile('./history.html');
        }

        // 监听窗口询问初始化数据
        ipcMain.on('history-init', function (event) {
            let configJson = JSON.parse(fs.readFileSync(fullPath('./config.json')))
            let historyList = [];
            for (let key in configJson.history) {
                historyList.push({
                    ...configJson.history[key],
                    mac: key
                });
            }
            event.returnValue = {
                list: historyList,
                mac: info.mac
            };

        });

    });


    // 打开或恢复聊天窗口
    ipcMain.on('open-talker', (event, info) => {

        if (winTalker) {
            winTalker.close();
        }

        winTalker = new BrowserWindow({
            width: (process.env.NODE_ENV + "").trim() == 'development' ? 900 : 660,
            height: 500,
            resizable: false,
            frame: false,
            // alwaysOnTop: true,
            webPreferences: {
                nodeIntegration: true,
                webSecurity: false
            }
        });

        // 开发模式
        if ((process.env.NODE_ENV + "").trim() == 'development') {
            winTalker.loadURL('http://localhost:20000/Talker.html');
            winTalker.webContents.openDevTools();
        }

        // 生产模式
        else {
            winTalker.loadFile('./talker.html');
        }

        // 监听窗口询问初始化数据
        ipcMain.on('init-info', function (event) {
            event.returnValue = info;
        });

    });


    /**
     * 监听广播
     * 监听到来自别的客户端的信息
     */
    let server = dgram.createSocket("udp4");

    server.on("error", function (err) {
        console.log("server error:" + err.stack);
        server.close();
    });

    server.on("message", function (msg, rinfo) {
        // Uint8Array转字符串
        let dataString = "";
        for (let i = 0; i < msg.length; i++) {
            dataString += String.fromCharCode(msg[i]);
        }
        win.webContents.send("get-msg", {
            ip: rinfo.address,
            msg: dataString
        });

        if (winTalker) {
            winTalker.webContents.send("get-msg", {
                ip: rinfo.address,
                msg: dataString
            });
        }
    });

    server.bind(50000);

};
