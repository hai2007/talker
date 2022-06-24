import { Component, ref } from 'nefbl'

import style from './index.scss'
import template from './index.html'

@Component({
    template,
    styles: [style]
})
export default class {

    quit() {
        globalThis.nodeRequire('electron').ipcRenderer.send('quit')
    }

    minimize() {
        globalThis.nodeRequire('electron').ipcRenderer.send('minimize')
    }

}
