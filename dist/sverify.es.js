/**
 * 重组b站下载的 用于校验的图片
 * @param {String | Element} img 图片路径 | img dom
 */
function sequence(img) {
    // piece排列顺序
    const pieceOrder = [
        39, 38, 48, 49, 41, 40, 46, 47, 35, 34, 50, 51, 33, 32, 28, 29, 27, 26,
        36, 37, 31, 30, 44, 45, 43, 42, 12, 13, 23, 22, 14, 15, 21, 20, 8, 9,
        25, 24, 6, 7, 3, 2, 0, 1, 11, 10, 4, 5, 19, 18, 16, 17,
    ];

    // 图片长宽
    const imgW = 312;
    const imgH = 160;
    // 每一片长宽
    const pieceW = 12;
    const pieceH = 80;

    return new Promise((resolve, reject) => {
        if (typeof img === 'string') {
            const image = new Image();
            image.onload = () => {
                resolve(draw(image));
            };
            image.onerror = err => {
                reject('[sequence]', err);
            };
            image.src = img;
            image.crossOrigin = 'Anonymous';
            return
        }
        resolve(draw(img));
    })
    

    function initPos() {
        let array = [];
        for (let i = 0; i < imgH / pieceH; i++) {
            for (let j = 0; j < imgW / pieceW; j++) {
                let temp = {
                    num: j + i * (imgW / pieceW),
                    id: [j, i],
                    sw: pieceW - 2,
                    sh: pieceH,
                    sx: j * pieceW + 0.5,
                    sy: i * pieceH,
                    w: pieceW,
                    h: pieceH,
                    x: j * pieceW,
                    y: i * pieceH,
                };
                array.push(temp);
            }
        }
        return array
    }

    function draw(image) {
        let c = document.createElement('canvas');
        let ctx = c.getContext('2d');
        let pieceList = initPos();
        ctx.width = imgW;
        ctx.height = imgH;
        pieceOrder.forEach((e, i) => {
            let item = { ...pieceList[i] };
            item.sx = pieceList[e].sx;
            item.sy = pieceList[e].sy;
            ctx.drawImage(
                image,
                item.sx,
                item.sy,
                item.sw,
                item.sh,
                item.x,
                item.y,
                item.w,
                item.h
            );
        });
        return c.toDataURL()
    }
}

/**
 * 绘制ui
 * @param {SliderVerify} sliderVerify 
 * @returns 
 */
function ui(sliderVerify) {
    const prefix = sliderVerify.prefix;
    const dom = sliderVerify.dom;
    const styleDom = sliderVerify.style;
    const width = sliderVerify.c_w;
    const height = sliderVerify.c_h;
    const panelDom = sliderVerify.panelDom();

    if (!dom) {
        sliderVerify.dom = template(prefix, width, height, panelDom);  
    } else {
        if (!panelDom.querySelector(`#${prefix}`)) {
            panelDom.querySelector('body').appendChild(sliderVerify.dom);
        }
    }
    if (!styleDom) {
        sliderVerify.style = style(prefix);
    } else {
        if (!panelDom.querySelector(`#${prefix}_class`)) {
            panelDom.querySelector('head').appendChild(sliderVerify.style);
        }
    }
}

function template(prefix, width, height, panelDom) {
    // 刷新按键
    const refresh = document.createElement('div');
    refresh.classList.add(`${prefix}-bt-pointer`, `${prefix}-refresh`);
    refresh.setAttribute('id', `${prefix}_refresh_bt`);
    refresh.innerHTML = `
        <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"
        data-v-ea893728=""><path fill="currentColor"
        d="M784.512 230.272v-50.56a32 32 0 1 1 64 0v149.056a32 32 0 0 1-32 32H667.52a32 32 0 1 1 0-64h92.992A320 320 0 1 0 524.8 833.152a320 320 0 0 0 320-320h64a384 384 0 0 1-384 384 384 384 0 0 1-384-384 384 384 0 0 1 643.712-282.88z"></path></svg>
    `;
    const panel = document.createElement('div');
    panel.setAttribute('class', prefix);
    panel.setAttribute('id', prefix);
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
    `;
    panelDom.appendChild(panel);
    return panel
}

function style(prefix) {
    const dom = document.createElement('style');
    dom.setAttribute('id', `${prefix}_class`);
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
    `;
    document.querySelector('head').appendChild(dom);
    return dom
}

/**
 * 创建校验器
 * @param {SliderVerify} sliderVerify 
 * @returns 
 */
function create(sliderVerify) {
    const imgs = sliderVerify.imgs;
    if (!imgs || !imgs.length) {
        console.warn('img 为空');
        return
    }

    const verifyData = { value: null };

    eventHandle(verifyData, sliderVerify);
    refreshImg(verifyData, sliderVerify);
}

let clearEvent = () => {};

/**
 * 添加canvas
 * @param {Element} img
 * @param {Object} verifyData
 * @param {Element} verifyDom
 * @param {SliderVerify} sliderVerify 
 */
function canvasInit(img, verifyData, verifyDom, sliderVerify) {
    const { c_w, c_h, accuracy } = sliderVerify;

    const w = sliderVerify.b_w;
    const r = sliderVerify.b_r;

    const _b_w = w + r + accuracy * 2;
    const x = Math.floor(Math.random() * (c_w - _b_w * 3) + _b_w * 1.5);
    const y = Math.floor(Math.random() * (c_h - _b_w * 1.5) + _b_w * .4);
    const PI = Math.PI;
    const prefix = sliderVerify.prefix;

    getCanvas(`${prefix}_bg_canvas`);
    getCanvas(`${prefix}_block_canvas`);

    verifyData.value = x;

    function getCanvas(id) {
        let c = verifyDom.querySelector('#' + id);
        const width = sliderVerify.c_w,
            height = sliderVerify.c_h;
        let ctx = c.getContext('2d', { willReadFrequently: true });
        ctx.clearRect(0, 0, width, height);
        if (id === `${prefix}_bg_canvas`) {
            // 背景
            ctx.drawImage(img, 0, 0, width, height);
            drawBlock(ctx);
        } else {
            // 滑块
            c.width = width;
            drawBlock(ctx, 'clip');
            ctx.drawImage(img, 0, 0, width, height);
            blockHandle(ctx, c);
        }
    }

    function drawBlock(ctx, type) {
        let i = type === 'clip' ? -1 : 0;
        const _w = w - i * 2;
        const _x = x + i;
        const _y = y + i;
        ctx.beginPath();
        ctx.moveTo(_x, _y);
        ctx.lineTo(_x + _w / 2 - r, _y);
        ctx.arc(_x + _w / 2, _y, r, 1 * PI, 0);
        ctx.lineTo(_x + _w / 2 + r, _y);
        ctx.lineTo(_x + _w, _y);
        ctx.lineTo(_x + _w, _y + _w / 2 - r);
        ctx.arc(_x + _w, _y + _w / 2, r, 1.5 * PI, 0.5 * PI);
        ctx.lineTo(_x + _w, _y + _w / 2 + r);
        ctx.lineTo(_x + _w, _y + _w);
        ctx.lineTo(_x, _y + _w);
        ctx.lineTo(_x, _y + _w / 2 + r);
        ctx.arc(_x, _y + _w / 2, r, 0.5 * PI, 1.5 * PI, true);
        ctx.lineTo(_x, _y + _w / 2 - r);
        ctx.closePath();

        if (type === 'clip') {
            ctx.clip();
        }
        if (type !== 'border') {
            ctx.fillStyle = '#ffffffca';
            ctx.fill();
        }
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ffa736ca';
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#ffa736';
        ctx.stroke();
    }

    function blockHandle(ctx, c) {
        drawBlock(ctx, 'border');
        // 重置block大小
        const _w = w + r + 2;
        const _y = y - r - 2;
        const imgData = ctx.getImageData(x, _y, _w, _w);
        c.width = _w;
        ctx.putImageData(imgData, 0, _y);
    }
}

/**
 * 刷新图片
 * @param {Object} verifyData 
 * @param {SliderVerify} sliderVerify 
 */
function refreshImg(verifyData, sliderVerify) {
    const { dom: verifyDom, prefix, imgs } = sliderVerify;

    const loading = verifyDom.querySelector(`#${prefix}_canvas_containe_loading`);
    loading.classList.remove(`${prefix}-hide`);
    const random = Math.floor((Math.random() * imgs.length));
    loadImg(imgs[random]).then(img => {
        loading.classList.add(`${prefix}-hide`);
        canvasInit(img, verifyData, verifyDom, sliderVerify);
    });
}

/**
 * 加载图片
 * @param {String} src
 */
function loadImg(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            resolve(img);
        };
        img.onerror = err => {
            reject(err);
        };
        img.crossOrigin = 'Anonymous';
        img.src = src;
    })
}

/**
 * dom添加事件
 * @param {Object} verifyData
 * @param {SliderVerify} sliderVerify 
 */
function eventHandle(verifyData, sliderVerify) {
    const { prefix, accuracy, dom: verifyDom, c_w, b_w, b_r } = sliderVerify;

    const bt = verifyDom.querySelector(`#${prefix}_slide_bt`);
    const block = verifyDom.querySelector(`#${prefix}_block_canvas`);
    const refresh = verifyDom.querySelector(`#${prefix}_refresh_bt`);
    const placehold = verifyDom.querySelector(`#${prefix}_placehold`);

    let startTime = 0;

    bt.addEventListener('mousedown', downHandle);
    refresh.addEventListener('click', onRefresh);

    // 拖拽处理
    let startX = 0,
        isTrusted = false;
    placehold.style.opacity = 1;

    function downHandle(event) {
        if (verifyData.value == null) return
        isTrusted = event.isTrusted;
        if (event.isTrusted == undefined) {
            isTrusted = true;
        }
        startX = event.clientX;
        document.addEventListener('mousemove', slideHandle);
        document.addEventListener('mouseup', upHandle);
        startTime = +new Date();
    }

    function upHandle(event) {
        let distance = event.clientX - startX;
        const verifyX = verifyData.value;
        if (isTrusted &&
            distance > verifyX - accuracy &&
            distance < verifyX + accuracy) {
            console.log('校验通过');

            let takeTime = +new Date() - startTime;
            takeTime = Math.round(takeTime / 10) / 100;
            sliderVerify.success(takeTime);
            showResult(sliderVerify, 'success');
        } else {
            console.log('校验失败');
            sliderVerify.fail();
            showResult(sliderVerify, 'failed');
            setTimeout(() => {
                refreshImg(verifyData, sliderVerify);
                bt.style.left = 0 + 'px';
                block.style.left = 0 + 'px';
                startX = 0;
                placehold.style.opacity = 1;
            }, 500);
        }
        verifyData.value == null;
        document.removeEventListener('mousemove', slideHandle);
        document.removeEventListener('mouseup', upHandle);
    }

    function slideHandle(event) {
        const max = c_w - b_w - b_r - accuracy;
        let distance = event.clientX - startX;
        if (distance > max || distance < 0) return
        bt.style.left = distance + 'px';
        block.style.left = distance + 'px';
        placehold.style.opacity = 1 - distance / verifyData.value;
    }

    function onRefresh(e) {
        refreshImg(verifyData, sliderVerify);
    }

    clearEvent = () => {
        bt.removeEventListener('mousedown', downHandle);
        refresh.removeEventListener('click', onRefresh);
    };
}


function showResult(sliderVerify, result) {
    const { dom: verifyDom, prefix } = sliderVerify;
    const dom = verifyDom.querySelector(`#${prefix}_result_info`);
    if (result === 'success') {
        dom.innerHTML = `
            <span class="${prefix}-result-success">验证通过</span>
        `;
    } else {
        dom.innerHTML = `
            <span class="${prefix}-result-failed">验证失败</span>
        `;
    }
    dom.style.bottom = 0;
    dom.style.opacity = 1;

    setTimeout(() => {
        dom.style.bottom = '-1em';
        dom.style.opacity = 0;
    }, 1000);
}

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
        this.imgs = imgs;
        this.c_w = c_w;
        this.c_h = c_h;
        this.b_w = b_w;
        this.b_r = b_r;
        this.accuracy = accuracy;
        this.panelDom = panelDom;
        this.success = success;
        this.fail = fail;

        this.prefix = 'my-slider-verify';
    }

    init() {
        ui(this);
        create(this);
    }

    clear() {
        // 移除校验器
        if (this.dom) {
            this.dom.parentNode.removeChild(this.dom);
            // this.dom = null
        }
        if (this.style) {
            this.style.parentNode.removeChild(this.style);
            // this.style = null
        }
        clearEvent();
    }

    destroy() {

    }
}

function createVerify(params) {
    const verfiy = new SliderVerify(params);
    verfiy.init();
    return verfiy
}

export { createVerify, sequence };
