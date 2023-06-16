/**
 * 创建校验器
 * @param {SliderVerify} sliderVerify 
 * @returns 
 */
export function create(sliderVerify) {
    const imgs = sliderVerify.imgs
    if (!imgs || !imgs.length) {
        console.warn('img 为空')
        return
    }

    const verifyData = { value: null }

    eventHandle(verifyData, sliderVerify)
    refreshImg(verifyData, sliderVerify)
}

export let clearEvent = () => {}

/**
 * 添加canvas
 * @param {Element} img
 * @param {Object} verifyData
 * @param {Element} verifyDom
 * @param {SliderVerify} sliderVerify 
 */
function canvasInit(img, verifyData, verifyDom, sliderVerify) {
    const { c_w, c_h, accuracy } = sliderVerify

    const w = sliderVerify.b_w
    const r = sliderVerify.b_r

    const _b_w = w + r + accuracy * 2
    const x = Math.floor(Math.random() * (c_w - _b_w * 3) + _b_w * 1.5)
    const y = Math.floor(Math.random() * (c_h - _b_w * 1.5) + _b_w * .4)
    const PI = Math.PI
    const prefix = sliderVerify.prefix

    getCanvas(`${prefix}_bg_canvas`)
    getCanvas(`${prefix}_block_canvas`)

    verifyData.value = x

    function getCanvas(id) {
        let c = verifyDom.querySelector('#' + id)
        const width = sliderVerify.c_w,
            height = sliderVerify.c_h
        let ctx = c.getContext('2d', { willReadFrequently: true })
        ctx.clearRect(0, 0, width, height)
        if (id === `${prefix}_bg_canvas`) {
            // 背景
            ctx.drawImage(img, 0, 0, width, height)
            drawBlock(ctx)
        } else {
            // 滑块
            c.width = width
            drawBlock(ctx, 'clip')
            ctx.drawImage(img, 0, 0, width, height)
            blockHandle(ctx, c)
        }
    }

    function drawBlock(ctx, type) {
        let i = type === 'clip' ? -1 : 0
        const _w = w - i * 2
        const _x = x + i
        const _y = y + i
        ctx.beginPath()
        ctx.moveTo(_x, _y)
        ctx.lineTo(_x + _w / 2 - r, _y)
        ctx.arc(_x + _w / 2, _y, r, 1 * PI, 0)
        ctx.lineTo(_x + _w / 2 + r, _y)
        ctx.lineTo(_x + _w, _y)
        ctx.lineTo(_x + _w, _y + _w / 2 - r)
        ctx.arc(_x + _w, _y + _w / 2, r, 1.5 * PI, 0.5 * PI)
        ctx.lineTo(_x + _w, _y + _w / 2 + r)
        ctx.lineTo(_x + _w, _y + _w)
        ctx.lineTo(_x, _y + _w)
        ctx.lineTo(_x, _y + _w / 2 + r)
        ctx.arc(_x, _y + _w / 2, r, 0.5 * PI, 1.5 * PI, true)
        ctx.lineTo(_x, _y + _w / 2 - r)
        ctx.closePath()

        if (type === 'clip') {
            ctx.clip()
        }
        if (type !== 'border') {
            ctx.fillStyle = '#ffffffca'
            ctx.fill()
        }
        ctx.lineWidth = 2
        ctx.strokeStyle = '#ffa736ca'
        ctx.shadowBlur = 6
        ctx.shadowColor = '#ffa736'
        ctx.stroke()
    }

    function blockHandle(ctx, c) {
        drawBlock(ctx, 'border')
        // 重置block大小
        const _w = w + r + 2
        const _y = y - r - 2
        const imgData = ctx.getImageData(x, _y, _w, _w)
        c.width = _w
        ctx.putImageData(imgData, 0, _y)
    }
}

/**
 * 刷新图片
 * @param {Object} verifyData 
 * @param {SliderVerify} sliderVerify 
 */
function refreshImg(verifyData, sliderVerify) {
    const { dom: verifyDom, prefix, imgs } = sliderVerify

    const loading = verifyDom.querySelector(`#${prefix}_canvas_containe_loading`)
    loading.classList.remove(`${prefix}-hide`)
    const random = Math.floor((Math.random() * imgs.length))
    loadImg(imgs[random]).then(img => {
        loading.classList.add(`${prefix}-hide`)
        canvasInit(img, verifyData, verifyDom, sliderVerify)
    })
}

/**
 * 加载图片
 * @param {String} src
 */
function loadImg(src) {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
            resolve(img)
        }
        img.onerror = err => {
            reject(err)
        }
        img.crossOrigin = 'Anonymous'
        img.src = src
    })
}

/**
 * dom添加事件
 * @param {Object} verifyData
 * @param {SliderVerify} sliderVerify 
 */
function eventHandle(verifyData, sliderVerify) {
    const { prefix, accuracy, dom: verifyDom, c_w, b_w, b_r } = sliderVerify

    const bt = verifyDom.querySelector(`#${prefix}_slide_bt`)
    const block = verifyDom.querySelector(`#${prefix}_block_canvas`)
    const refresh = verifyDom.querySelector(`#${prefix}_refresh_bt`)
    const placehold = verifyDom.querySelector(`#${prefix}_placehold`)

    let startTime = 0

    bt.addEventListener('mousedown', downHandle)
    refresh.addEventListener('click', onRefresh)

    // 拖拽处理
    let startX = 0,
        isTrusted = false
    placehold.style.opacity = 1

    function downHandle(event) {
        if (verifyData.value == null) return
        isTrusted = event.isTrusted
        if (event.isTrusted == undefined) {
            isTrusted = true
        }
        startX = event.clientX
        document.addEventListener('mousemove', slideHandle)
        document.addEventListener('mouseup', upHandle)
        startTime = +new Date()
    }

    function upHandle(event) {
        let distance = event.clientX - startX
        const verifyX = verifyData.value
        if (isTrusted &&
            distance > verifyX - accuracy &&
            distance < verifyX + accuracy) {
            console.log('校验通过')

            let takeTime = +new Date() - startTime
            takeTime = Math.round(takeTime / 10) / 100
            sliderVerify.success(takeTime)
            showResult(sliderVerify, 'success')
        } else {
            console.log('校验失败')
            sliderVerify.fail()
            showResult(sliderVerify, 'failed')
            setTimeout(() => {
                refreshImg(verifyData, sliderVerify)
                bt.style.left = 0 + 'px'
                block.style.left = 0 + 'px'
                startX = 0
                placehold.style.opacity = 1
            }, 500)
        }
        verifyData.value == null
        document.removeEventListener('mousemove', slideHandle)
        document.removeEventListener('mouseup', upHandle)
    }

    function slideHandle(event) {
        const max = c_w - b_w - b_r - accuracy
        let distance = event.clientX - startX
        if (distance > max || distance < 0) return
        bt.style.left = distance + 'px'
        block.style.left = distance + 'px'
        placehold.style.opacity = 1 - distance / verifyData.value
    }

    function onRefresh(e) {
        refreshImg(verifyData, sliderVerify)
    }

    clearEvent = () => {
        bt.removeEventListener('mousedown', downHandle)
        refresh.removeEventListener('click', onRefresh)
    }
}


function showResult(sliderVerify, result) {
    const { dom: verifyDom, prefix } = sliderVerify
    const dom = verifyDom.querySelector(`#${prefix}_result_info`)
    if (result === 'success') {
        dom.innerHTML = `
            <span class="${prefix}-result-success">验证通过</span>
        `
    } else {
        dom.innerHTML = `
            <span class="${prefix}-result-failed">验证失败</span>
        `
    }
    dom.style.bottom = 0
    dom.style.opacity = 1

    setTimeout(() => {
        dom.style.bottom = '-1em'
        dom.style.opacity = 0
    }, 1000)
}
