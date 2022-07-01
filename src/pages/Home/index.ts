import { Component, ref } from 'nefbl'
import getKeyString from '@hai2007/browser/getKeyString'
import xhtml from '@hai2007/browser/xhtml'

import style from './index.scss'
import template from './index.html'

let config = globalThis.nodeRequire("electron").ipcRenderer.sendSync("get-config")
let mac = []

@Component({
    template,
    styles: [style]
})
export default class {

    ip: any
    name: any

    $setup() {
        return {
            ip: ref(['127.0.0.1']),
            name: ref(config.name)
        }
    }

    doKeydown(event) {
        if (getKeyString(event) == 'enter') {
            alert('非常抱歉，好友搜索功能未开发~')
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
    sendMsg(data, target = "255.255.255.255") {
        let msg = {
            target,
            data
        }
        globalThis.nodeRequire('electron').ipcRenderer.send('send-msg', JSON.stringify(msg))
    }

    // 发送同步好友列表的请求
    doSync() {
        /**
         * 同步的流程：
         * 1.先清空自己的好友列表，
         * 2、然后发送信息告诉所有人，
         * 3.收到信息的人会在自己的列表检查是否包含发送请求的人，如果不存在就加进去
         * 4.收到信息的再发送一个专门的请求告诉请求同步的自己可以被添加到列表中去
         */
        document.getElementById('address-list').innerHTML = ""
        this.sendMsg({
            type: "sync",
            name: this.name,
            mac: mac[0]
        })
    }

    isToMe(target) {

        // 如果是广播，接收
        if (target == '255.255.255.255') return true

        // 如果和目标ip一样，接收
        for (let index = 0; index < this.ip.length; index++) {
            if (this.ip[index] == target) return true
        }

        return false
    }

    $mounted() {

        let networks = globalThis.nodeRequire('os').networkInterfaces()
        let ip = []

        for (let typeName in networks) {
            let network = networks[typeName]
            for (let index = 0; index < network.length; index++) {
                if (network[index].family == 'IPv4' && network[index].address != '127.0.0.1') {
                    ip.push(network[index].address)
                    mac.push(network[index].mac)
                }
            }
        }

        // 启动的时候，自动触发列表同步
        this.doSync()


        this.ip = ip

        // 启动事件监听主进程
        globalThis.nodeRequire('electron').ipcRenderer

            // 监听别的软件发送来的信息
            .on("get-msg", (event, data) => {
                let msg = JSON.parse(decodeURIComponent(data.msg))

                if (this.isToMe(msg.target)) {

                    // 如果是同步信息
                    if (msg.data.type == 'sync') {

                        // 如果列表中不存在，添加
                        if (!document.getElementById(data.ip)) {
                            let itemEl = document.createElement('div')
                            itemEl.setAttribute('id', data.ip)
                            itemEl.innerHTML = `
                            <span></span>
                            ${(function (_name) {
                                    if (_name.length > 10) {
                                        return _name.substr(0, 10) + "..."
                                    } else {
                                        return _name
                                    }
                                })(msg.data.name)}
                            <i>(${data.ip})</i>
                            `

                            xhtml.bind(itemEl, 'click', () => {

                                let _mac = msg.data.mac

                                // 如果已经打开了，应该恢复最前面而不是重新打开
                                /**
                                 * 信息都保存着主界面的sessionStorage里面
                                 * 聊天界面在打开的时候，同步信息，后续有了新信息，推送给他
                                 */
                                globalThis.nodeRequire('electron').ipcRenderer.send('open-talker', {
                                    yourip: data.ip,
                                    yourname: msg.data.name,
                                    mymac: mac[0],
                                    myip: this.ip,
                                    yourmac: _mac
                                })

                                if (!config.history[_mac]) {
                                    config.history[_mac] = {
                                        ip: data.ip,
                                        name: msg.data.name
                                    }
                                    globalThis.nodeRequire('electron').ipcRenderer.send('set-config', config)
                                    globalThis.nodeRequire('electron').ipcRenderer.send('set-talker', {
                                        mac: _mac,
                                        value: []
                                    })
                                }

                            })

                            document.getElementById('address-list').appendChild(itemEl)
                        }

                        // 如果是广播，还需要反馈对方
                        if (msg.target == '255.255.255.255') {

                            this.sendMsg({
                                type: "sync",
                                name: this.name,
                                mac: mac[0]
                            }, data.ip)

                        }

                    }

                    // 如果是接收到的聊天信息
                    else if (msg.data.type == 'talker') {

                        let _mac = msg.data.value.mac

                        // 把信息保存起来作为历史记录

                        let content
                        if (msg.data.value.type == 'string') {
                            content = msg.data.value.content
                        }

                        // 写入磁盘保存起来
                        let history = globalThis.nodeRequire("electron").ipcRenderer.sendSync("get-talker", _mac)
                        history.push({
                            time: new Date().valueOf(),
                            content,
                            align: "left",
                            type: "string"
                        })
                        globalThis.nodeRequire('electron').ipcRenderer.send('set-talker', {
                            mac: _mac,
                            value: history
                        })

                    }

                }
            })
    }

}
