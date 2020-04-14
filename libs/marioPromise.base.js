// eg:
// let promise = new Promise((reslove, reject) => {

// }).then((res) => {
//     console.log(res)
// })

const Util = require('../Utils/utils')
// definition promise state constant pending,fulfilled,rejected
const PROMISE_STATUS_PENDING = Symbol('pending')
const PROMISE_STATUS_FULFILLED = Symbol('fulfilled')
const PROMISE_STATUS_REJECTED = Symbol('rejected')
// MarioPromise is a library to realize Promise in JavaScript
function MarioPromise(constructorFunc) {
    // exception handling
    if (!Util.isFunction(constructorFunc)) {
        throw new Error(`MarioPromise resolver ${constructorFunc} is not a function`)
    }
    // init MarioPromise state
    this.state = PROMISE_STATUS_PENDING
    this._successValue = undefined
    this._errorValue = undefined
    this.successMissionList = []
    this.errorMissionList = []
    // padding -> rejected
    function reslove(value) {
        if (this.state === PROMISE_STATUS_PENDING) {
            this.state = PROMISE_STATUS_FULFILLED
            this._successValue = value
            this.successMissionList.forEach(item => item(this._successValue))
        }
    }
    // padding -> fulfilled
    function reject(errMsg) {
        if (this.state === PROMISE_STATUS_PENDING) {
            this.state = PROMISE_STATUS_REJECTED
            this._errorValue = errMsg
            this.errorMissionList.forEach(item => item(this._errorValue))
        }
    }
    try {
        constructorFunc(reslove.bind(this), reject.bind(this))
    } catch (error) {
        reject(error)
    }
}
// then is a method on MarioPromise prototype whitch will return a new MarioPromise instance
MarioPromise.prototype.then = function (onFulfilled, onRejected) {
    onFulfilled = Util.isFunction(onFulfilled) ? onFulfilled : (v) => {
        return v
    }
    onRejected = Util.isFunction(onRejected) ? onRejected : (err) => {
        throw err
    }
    //  Promise now state is FULFILLED
    if (this.state == PROMISE_STATUS_FULFILLED) {
        // it will be return a new MarioPromise instance
        return new MarioPromise((reslove, reject) => {
            try {
                const value = onFulfilled(this._successValue)
                if (value instanceof MarioPromise) {
                    value.then(reslove, reject)
                } else {
                    reslove(this._successValue)
                }
            } catch (error) {
                reject(error)
            }
        })

    }
    //  Promise now state is REJECTED
    if (this.state == PROMISE_STATUS_REJECTED) {
        // it will be return a new MarioPromise instance
        return new MarioPromise((reslove, reject) => {
            try {
                const value = onFulfilled(this._errorValue)
                if (value instanceof MarioPromise) {
                    value.then(reslove, reject)
                } else {
                    reslove(this._errorValue)
                }
            } catch (error) {
                reject(error)
            }
        })
    }
    //  Promise now state is PADDING
    if (this.state == PROMISE_STATUS_PENDING) {
        // it will be return a new MarioPromise instance
        return new Promise((reslove, reject) => {
            this.successMissionList.push(() => {
                try {
                    const value = onFulfilled(this._successValue)
                    if (value instanceof MarioPromise) {
                        value.then(reslove, reject)
                    } else {
                        reslove(this._successValue)
                    }
                } catch (error) {
                    reject(error)
                }
            })
            this.errorMissionList.push(() => {
                try {
                    const value = onFulfilled(this._errorValue)
                    if (value instanceof MarioPromise) {
                        value.then(reslove, reject)
                    } else {
                        reslove(this._errorValue)
                    }
                } catch (error) {
                    reject(error)
                }
            })
        })
    }
}
// catch is a function on MarioPromise prototype
MarioPromise.prototype.catch = (onRejected) => {
    return this.then(null, onRejected)
}
module.exports = MarioPromise