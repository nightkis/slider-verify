# slider-verify
js滑动拼图校验

使用

```
// import { sequence, createVerify } from '../dist/sverify.es.js'
import { sequence, createVerify } from '../src/main.js'

const verify = createVerify({
    imgs: [
        './assets/verify_2.png',
        './assets/verify_1.png'
    ],
    success: (time) => {
        console.log('校验成功', `耗时${time}s`)
    }
})

// 关闭
// verify.clear()
```
