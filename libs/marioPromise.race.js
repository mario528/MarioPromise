const MarioPromise = require('./marioPromise.base')
MarioPromise.race = function (promiseTotalizer) {
    let promises = Array.from(promiseTotalizer)
    return new MarioPromise((reslove, reject) => {
        promises.forEach((item) => {
            Promise.reslove(item).then(reslove).catch(reject)
        })
    })
}