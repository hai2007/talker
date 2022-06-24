const { ipcMain, app } = require('electron');

module.exports = function (win) {

    // 最小化
    ipcMain.on('minimize', () => { win.minimize(); });

    // 退出系统
    ipcMain.on('quit', () => { app.exit(); });


};
