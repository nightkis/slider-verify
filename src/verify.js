import { ui } from './ui.js'
import { create, clearEvent } from './create.js'

class SliderVerify {
    constructor({
        imgs = [],
        // 图片宽高
        c_w = 300,
        c_h = 150,
        // 截取图片的宽度
        b_w = 36,
        // 凸出半径
        b_r = 8,
        // 校验误差
        accuracy = 5,
        // 渲染节点
        panelDom = () => { return document.querySelector('body') },
        success = () => {},
        fail = () => {},
    } = {}) {
        this.imgs = imgs
        this.c_w = c_w
        this.c_h = c_h
        this.b_w = b_w
        this.b_r = b_r
        this.accuracy = accuracy
        this.panelDom = panelDom
        this.success = success
        this.fail = fail

        this.prefix = 'my-slider-verify'
    }

    init() {
        ui(this)
        create(this)
    }

    clear() {
        // 移除校验器
        if (this.dom) {
            this.dom.parentNode.removeChild(this.dom)
            // this.dom = null
        }
        if (this.style) {
            this.style.parentNode.removeChild(this.style)
            // this.style = null
        }
        clearEvent()
    }

    destroy() {

    }
}

export function createVerify(params) {
    const verfiy = new SliderVerify(params)
    verfiy.init()
    return verfiy
}