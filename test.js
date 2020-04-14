const MarioPromise = require('./libs/marioPromise.base')
let test = new MarioPromise((reslove, reject) => {
    console.log("now constructorFunc is running")
    setTimeout(() => {
        reslove('mario')
    }, 5000);
})
test.then(1)