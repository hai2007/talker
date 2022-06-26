import { Component, ref } from 'nefbl'

import style from './index.scss'
import template from './index.html'

@Component({
    template,
    styles: [style]
})
export default class {

    ip: any

    $setup() {
        return {
            ip: ref(['192.0.0.1'])
        }
    }

    quit() {
        globalThis.nodeRequire('electron').ipcRenderer.send('quit')
    }

    minimize() {
        globalThis.nodeRequire('electron').ipcRenderer.send('minimize')
    }

    // 发送信息
    // target表示接收者的ip，如果是“255.255.255.255”，就是发送给所有的
    sendMsg() {
        let msg = {
            target: "255.255.255.255",
            data: {

            }
        }
        globalThis.nodeRequire('electron').ipcRenderer.send('send-msg', JSON.stringify(msg))
    }

    $mounted() {

        let WLAN = globalThis.nodeRequire('os').networkInterfaces().WLAN
        let ip = []
        for (let index = 0; index < WLAN.length; index++) {
            if (WLAN[index].family == 'IPv4') {
                // 虽然mac是唯一的，不过还是ip吧
                ip.push(WLAN[index].address)
            }
        }

        // 启动事件监听主进程
        globalThis.nodeRequire('electron').ipcRenderer

            // 监听别的软件发送来的信息
            .on("get-msg", (event, data) => {
                let msg = JSON.parse(data.msg)
                console.log(data.ip, msg)
            })
    }

}
