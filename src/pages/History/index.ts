import { Component } from 'nefbl'
import xhtml from '@hai2007/browser/xhtml'

import style from './index.scss'
import template from './index.html'

import stringToTemplate from '../../tool/stringToTemplate'

@Component({
    template,
    styles: [style]
})
export default class {

    quit() {
        globalThis.nodeRequire('electron').ipcRenderer.send('quit-history')
    }

    minimize() {
        globalThis.nodeRequire('electron').ipcRenderer.send('minimize-history')
    }

    $mounted() {

        // 初始化同步信息
        let info = globalThis.nodeRequire("electron").ipcRenderer.sendSync("history-init")

        let navEl = document.createElement('nav')
        document.getElementById('history-view').appendChild(navEl)

        let contentEl = document.createElement('div')
        document.getElementById('history-view').appendChild(contentEl)

        let btns = []
        let initBtn
        for (let index = 0; index < info.list.length; index++) {
            let itemEl = document.createElement('span');

            let name = info.list[index].name
            if (name.length > 10) name = name.substr(0, 10) + "..."

            itemEl.innerText = name + "(" + info.list[index].ip + ")"
            btns.push(itemEl)

            navEl.appendChild(itemEl)

            xhtml.bind(itemEl, 'click', () => {

                for (let k = 0; k < btns.length; k++) {
                    btns[k].setAttribute('active', 'no')
                }
                itemEl.setAttribute('active', 'yes')

                let history = globalThis.nodeRequire("electron").ipcRenderer.sendSync("get-talker", info.list[index].mac)

                let template = "<h2>与 " + info.list[index].name + " 的聊天记录（IP:" + info.list[index].ip + "）</h2>"

                for (let k = 0; k < history.length; k++) {

                    // 聊天内容先只考虑文字，后续有空再慢慢丰富

                    let date = new Date(history[k].time)

                    let hour = date.getHours() + "";
                    let minute = date.getMinutes() + "";
                    let second = date.getSeconds() + "";

                    if (+hour <= 9) { hour = "0" + hour; }
                    if (+minute <= 9) { minute = "0" + minute; }
                    if (+second <= 9) { second = "0" + second; }

                    let msgTemplate;
                    if (history[k].type == 'string') {
                        msgTemplate = stringToTemplate(history[k].content || "")
                    } else if (history[k].type == 'image@base64') {
                        msgTemplate = `<img style='max-width:240px;padding-top:10px;' src="${history[k].content}" />`
                    }

                    template += `<div style='text-align:${history[k].align}'>
                            <div class='msg'>${msgTemplate}</div>
                            <div class='time'>
                            ${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日
                            ${hour}:${minute}:${second}
                            </div>
                    </div>`

                }

                contentEl.innerHTML = template
            })

            if (info.list[index].mac == info.mac) {
                initBtn = itemEl
            }

        }

        //  初始化点击打开聊天窗口的记录
        initBtn.click()
    }
}
