/**
 * 绘制ui
 * @param {SliderVerify} sliderVerify 
 * @returns 
 */
export function ui(sliderVerify) {
    const prefix = sliderVerify.prefix
    const dom = sliderVerify.dom
    const styleDom = sliderVerify.style
    const width = sliderVerify.c_w
    const height = sliderVerify.c_h
    const panelDom = sliderVerify.panelDom()

    if (!dom) {
        sliderVerify.dom = template(prefix, width, height, panelDom)  
    } else {
        if (!panelDom.querySelector(`#${prefix}`)) {
            panelDom.querySelector('body').appendChild(sliderVerify.dom)
        }
    }
    if (!styleDom) {
        sliderVerify.style = style(prefix)
    } else {
        if (!panelDom.querySelector(`#${prefix}_class`)) {
            panelDom.querySelector('head').appendChild(sliderVerify.style)
        }
    }
}

function template(prefix, width, height, panelDom) {
    // 刷新按键
    const refresh = document.createElement('div')
    refresh.classList.add(`${prefix}-bt-pointer`, `${prefix}-refresh`)
    refresh.setAttribute('id', `${prefix}_refresh_bt`)
    refresh.innerHTML = `
        <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"
        data-v-ea893728=""><path fill="currentColor"
        d="M784.512 230.272v-50.56a32 32 0 1 1 64 0v149.056a32 32 0 0 1-32 32H667.52a32 32 0 1 1 0-64h92.992A320 320 0 1 0 524.8 833.152a320 320 0 0 0 320-320h64a384 384 0 0 1-384 384 384 384 0 0 1-384-384 384 384 0 0 1 643.712-282.88z"></path></svg>
    `
    const panel = document.createElement('div')
    panel.setAttribute('class', prefix)
    panel.setAttribute('id', prefix)
    panel.innerHTML = `
        <div id="${prefix}_canvas_containe">
            <canvas id="${prefix}_bg_canvas" width="${width}" height="${height}"></canvas>
            <canvas id="${prefix}_block_canvas" width="${width}" height="${height}"></canvas>
            <div id="${prefix}_canvas_containe_loading">加载中...</div>
            <div id="${prefix}_result_info"></div>
        </div>
        <div class="${prefix}-slide-box">
            <span id="${prefix}_placehold">拖动滑块完成拼图</span>
            <span id="${prefix}_slide_bt">
                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"
                data-v-ea893728=""><path fill="currentColor"
                d="M452.864 149.312a29.12 29.12 0 0 1 41.728.064L826.24 489.664a32 32 0 0 1 0 44.672L494.592 874.624a29.12 29.12 0 0 1-41.728 0 30.592 30.592 0 0 1 0-42.752L764.736 512 452.864 192a30.592 30.592 0 0 1 0-42.688zm-256 0a29.12 29.12 0 0 1 41.728.064L570.24 489.664a32 32 0 0 1 0 44.672L238.592 874.624a29.12 29.12 0 0 1-41.728 0 30.592 30.592 0 0 1 0-42.752L508.736 512 196.864 192a30.592 30.592 0 0 1 0-42.688z"></path></svg>
            </span>
        </div>
        <div class="${prefix}-tool-box">
            ${refresh.outerHTML}
        </div>
    `
    panelDom.appendChild(panel)
    return panel
}

function style(prefix) {
    const dom = document.createElement('style')
    dom.setAttribute('id', `${prefix}_class`)
    dom.innerText = `
        .${prefix} {
            position: relative;
            display: inline-block;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 2px;
            background: #fff;
        }
        .${prefix} svg {
            width: 1em;
            height: 1em;
        }
        .${prefix}-bt-pointer {
            cursor: pointer;
        }
        .${prefix}-hide {
            display: none !important;
        }
        #${prefix}_canvas_containe {
            position: relative;
            display: inline-block;
            width: 300px;
            height: 150px;
        }
        #${prefix}_canvas_containe_loading {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;     
            color: #a3abb3;
            background: #fff; 
        }
        #${prefix}_block_canvas {
            position: absolute;
            top: 0;
            left: 0;
        }
        .${prefix}-slide-box {
            width: 100%;
            height: 40px;
            margin-top: 15px;
            border-radius: 20px;
            background: #dfe0e1;
            position: relative;
            color: #a3abb3;
            display: flex;
            align-items: center;
            justify-content: center;
            user-select: none;
        }
        #${prefix}_slide_bt {
            width: 50px;
            height: 50px;
            border-radius: 50px;
            position: absolute;
            left: 0;
            background: #fff;
            border: 1px solid #d0d0d0;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 30px;
            z-index: 4;
        }
        #${prefix}_placehold {
            transition: opacity .1s;
            user-select: none;
        }
        #${prefix}_result_info {
            width: 100%;
            position: absolute;
            left: 0;
            bottom: -1em;
            opacity: 0;
            transition: all .3s;
            text-align: center;
            background: #ffffffdd;
        }
        .${prefix}-result-success {
            color: green;
        }
        .${prefix}-result-failed {
            color: red;
        }
        .${prefix}-tool-box {
            position: absolute;
            top: 10px;
            right: 10px;
            display: none;
        }
        .${prefix}-refresh {
            display: inline-block;
            color: #888;
            font-size: 24px;
        }
    `
    document.querySelector('head').appendChild(dom)
    return dom
}
