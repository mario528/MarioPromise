const MarioPromise = require('./marioPromise.base')
MarioPromise.all = function (promiseTotalizer) {
    let promiseList = Array.from(promiseTotalizer)
    const resloveList = new Array(promiseList.length)
    let startIndex = 0
    return new MarioPromise((reslove, reject) => {
        promiseList.forEach((promiseItem, index) => {
            MarioPromise.reslove(promiseItem).then(value => {
                resloveList[index] = value
                if (++startIndex == promiseList.length) {
                    reslove(resloveList)
                }
            }).catch(reject)
        })
    })
}