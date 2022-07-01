import { Component, ref } from 'nefbl'
import { isFunction } from "@hai2007/tool/type"

import style from './index.scss'
import template from './index.html'

import pages from '../pages/lazy-load'

@Component({
    selector: "app-root",
    template,
    styles: [style]
})
export default class {

    currentPage: any

    $setup() {
        return {
            currentPage: ref(null)
        }
    }

    $mounted() {

        // 获取当前页面
        let page = pages[globalThis.pagename]

        // 如果页面不存在
        if (!isFunction(page)) {

            // 如果地址错误，跳转到首页
            page = pages['Home']
        }

        // 打开页面
        page().then(data => {
            this.currentPage = data.default
        })

    }

}
