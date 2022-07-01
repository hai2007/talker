const os = require('os');
const fs = require('fs');
const nodejs = require('@hai2007/nodejs');

let rootFolder = nodejs.fullPath("./talker", os.homedir());

exports.initRootFolder = function () {

    // 如果根文件夹不存在
    if (!fs.existsSync(rootFolder)) {

        fs.mkdirSync(rootFolder);

        fs.mkdirSync(nodejs.fullPath("./download", rootFolder)); // 存放传输中下载的东西
        fs.mkdirSync(nodejs.fullPath("./cache", rootFolder)); // 存放传输中的聊天缓冲文件

        fs.writeFileSync(nodejs.fullPath('./config.json', rootFolder), JSON.stringify({

            /**
             * 这里的版本用于确定电脑本地存储的历史旧数据如何处理
             * 例如数据版本号：x.y.z
             *
             * 1.如果x不一样，直接删除重置（记得提醒用户是否继续）
             * 2.如果x一样，y不一样，使用数据前需要对数据进行修改校对
             * 3.如果x和y都一样，z不一样，可以直接使用，运行的时候会自动适配
             */

            version: "1.0.0",
            name: os.hostname(),
            history: {}
        }, null, 2), 'utf-8');

    }

};

exports.fullPath = function (param) {
    return nodejs.fullPath(param, rootFolder);
};
