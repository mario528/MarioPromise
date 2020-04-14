const MarioPromise = require('./marioPromise.base')
MarioPromise.allSettled = function (promiseTotalizer) {
    let promises = Array.from(promiseTotalizer)
    let settledList = new Array(promises.length)
}