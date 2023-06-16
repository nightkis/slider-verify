/**
 * 重组b站下载的 用于校验的图片
 * @param {String | Element} img 图片路径 | img dom
 */
export function sequence(img) {
    // piece排列顺序
    const pieceOrder = [
        39, 38, 48, 49, 41, 40, 46, 47, 35, 34, 50, 51, 33, 32, 28, 29, 27, 26,
        36, 37, 31, 30, 44, 45, 43, 42, 12, 13, 23, 22, 14, 15, 21, 20, 8, 9,
        25, 24, 6, 7, 3, 2, 0, 1, 11, 10, 4, 5, 19, 18, 16, 17,
    ]

    // 图片长宽
    const imgW = 312
    const imgH = 160
    // 每一片长宽
    const pieceW = 12
    const pieceH = 80

    return new Promise((resolve, reject) => {
        if (typeof img === 'string') {
            const image = new Image()
            image.onload = () => {
                resolve(draw(image))
            }
            image.onerror = err => {
                reject('[sequence]', err)
            }
            image.src = img
            image.crossOrigin = 'Anonymous'
            return
        }
        resolve(draw(img))
    })
    

    function initPos() {
        let array = []
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
                }
                array.push(temp)
            }
        }
        return array
    }

    function draw(image) {
        let c = document.createElement('canvas')
        let ctx = c.getContext('2d')
        let pieceList = initPos()
        ctx.width = imgW
        ctx.height = imgH
        pieceOrder.forEach((e, i) => {
            let item = { ...pieceList[i] }
            item.sx = pieceList[e].sx
            item.sy = pieceList[e].sy
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
            )
        })
        return c.toDataURL()
    }
}
