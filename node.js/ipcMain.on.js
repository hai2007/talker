const { ipcMain, app } = require('electron');
const dgram = require("dgram");

module.exports = function (win) {

    // 最小化
    ipcMain.on('minimize', () => { win.minimize(); });

    // 退出系统
    ipcMain.on('quit', () => { app.exit(); });

    // 发送信息
    ipcMain.on('send-msg', function (event, data) {
        let socket = dgram.createSocket("udp4");
        socket.bind(function () {
            socket.setBroadcast(true);
        });
        let message = Buffer.from(data);
        socket.send(message, 0, message.length, 50000, '255.255.255.255', function (err, bytes) {
            socket.close();
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
    });

    server.bind(50000);

};
