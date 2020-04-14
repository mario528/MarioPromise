# MarioPromise
## what is MarioPromise
As we well know，Promise is a new solution for asynchronous programming. Promise can replace callback functions and events  programming method. this Library will achieve Promise container base on Promise/A+ rule.
## How to use
#### 1).install mario-promise
``` shell
npm install mario-promise
```
#### 2).require library and use
``` JavaScript
let MarioPromise = require('./libs/index')
let test = new MarioPromise((reslove, reject) => {
    setTimeout(function (params) {
        reslove(1)
    })
}).then(res => {
    console.log(res)
})
```