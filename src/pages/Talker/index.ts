import { Component, ref } from 'nefbl'
import getKeyString from '@hai2007/browser/getKeyString'
import animation from '@hai2007/tool/animation'

import style from './index.scss'
import template from './index.html'

import stringToTemplate from '../../tool/stringToTemplate'

let msgEl

@Component({
    template,
    styles: [style]
})
export default class {

    info: any
    content: any
    isSelf: boolean

    quit() {
        globalThis.nodeRequire('electron').ipcRenderer.send('quit-talker')
    }

    minimize() {
        globalThis.nodeRequire('electron').ipcRenderer.send('minimize-talker')
    }

    doKeydown(event) {
        switch (getKeyString(event)) {
            case "enter": {
                setTimeout(() => {
                    this.doSend()
                })
                break
            }
            case "shift+enter": {
                this.content += "\n"
                break
            }
        }

    }

    doScrollToBottom() {
        let msgEl = document.getElementById('msg')

        let scrollTop = msgEl.scrollTop
        animation(deep => {
            msgEl.scrollTop = (msgEl.scrollHeight - scrollTop) * deep + scrollTop
        }, 500)

    }

    // 发送图片
    sendImage(event) {
        let file = event.target.files[0]
        let reader = new FileReader()

        reader.onload = () => {

            let itemEl = document.createElement('div')
            itemEl.setAttribute('class', 'right item-talker')

            itemEl.innerHTML = `<span><img style='max-width:240px;padding-top:10px;' src="${reader.result}" /></span>`
            msgEl.appendChild(itemEl)

            this.doScrollToBottom()

            if (!this.isSelf) {
                globalThis.nodeRequire('electron').ipcRenderer.send('send-msg', JSON.stringify({
                    target: this.info.yourip,
                    data: {
                        type: "talker",
                        value: {
                            mac: this.info.mymac,
                            type: "image@base64",
                            content: reader.result
                        }
                    }
                }))
            }

            // 写入磁盘保存起来
            let history = globalThis.nodeRequire("electron").ipcRenderer.sendSync("get-talker", this.info.yourmac)
            history.push({
                time: new Date().valueOf(),
                content: reader.result,
                align: "right",
                type: "image@base64"
            })
            globalThis.nodeRequire('electron').ipcRenderer.send('set-talker', {
                mac: this.info.yourmac,
                value: history
            })

        }
        reader.readAsDataURL(file)
    }

    // 发送信息
    doSend() {
        if (this.content.trim() == "") {
            this.content = ""
            return
        }

        let itemEl = document.createElement('div')
        itemEl.setAttribute('class', 'right item-talker')

        itemEl.innerHTML = `<span>${stringToTemplate(this.content)}</span>`
        msgEl.appendChild(itemEl)

        this.doScrollToBottom()

        if (!this.isSelf) {
            globalThis.nodeRequire('electron').ipcRenderer.send('send-msg', JSON.stringify({
                target: this.info.yourip,
                data: {
                    type: "talker",
                    value: {
                        mac: this.info.mymac,
                        type: "string",
                        content: this.content
                    }
                }
            }))
        }

        // 写入磁盘保存起来
        let history = globalThis.nodeRequire("electron").ipcRenderer.sendSync("get-talker", this.info.yourmac)
        history.push({
            time: new Date().valueOf(),
            content: this.content,
            align: "right",
            type: "string"
        })
        globalThis.nodeRequire('electron').ipcRenderer.send('set-talker', {
            mac: this.info.yourmac,
            value: history
        })

        this.content = ""
    }

    isToMe(target) {

        // 如果是广播，接收
        if (target == '255.255.255.255') return true

        // 如果和目标ip一样，接收
        for (let index = 0; index < this.info.myip.length; index++) {
            if (this.info.myip[index] == target) return true
        }

        return false
    }

    $setup() {
        return {
            info: ref({
                yourname: "",
                yourip: "",
                mymac: "",
                myip: [],
                yourmac: ""
            }),
            content: ref(""),
            isSelf: ref(false)
        }
    }

    $mounted() {

        // 初始化同步信息
        this.info = globalThis.nodeRequire("electron").ipcRenderer.sendSync("init-info")

        // 判断是不是自己
        this.isSelf = this.info.mymac == this.info.yourmac

        msgEl = document.getElementById('msg')

        // 启动事件监听主进程
        globalThis.nodeRequire('electron').ipcRenderer

            // 监听别的软件发送来的信息
            .on("get-msg", (event, data) => {
                let msg = JSON.parse(decodeURIComponent(data.msg))

                if (msg.data.type == 'talker') {

                    if (this.isToMe(msg.target)) {

                        let itemEl = document.createElement('div')
                        itemEl.setAttribute('class', 'left item-talker')

                        if (msg.data.value.type == 'string') {
                            itemEl.innerHTML = `<span>${stringToTemplate(msg.data.value.content)}</span>`
                        } else if (msg.data.value.type == 'image@base64') {
                            itemEl.innerHTML = `<span><img style='max-width:240px;padding-top:10px;' src="${msg.data.value.content}" /></span>`
                        }

                        msgEl.appendChild(itemEl)

                        this.doScrollToBottom()
                    }

                }

            })

    }

    // 打开历史记录窗口
    openHistory() {
        globalThis.nodeRequire('electron').ipcRenderer.send('open-history', {
            mac: this.info.yourmac
        })
    }

}
