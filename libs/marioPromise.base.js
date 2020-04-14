const Util = require('../Utils/utils')
// definition promise status constant pending,fulfilled,rejected
const PROMISE_STATUS_PENDING = Symbol('pending')
const PROMISE_STATUS_FULFILLED = Symbol('fulfilled')
const PROMISE_STATUS_REJECTED = Symbol('rejected')
// MarioPromise is a library to realize Promise in JavaScript
function MarioPromise(constructorFunc) {
    if (!Util.isFunction(constructorFunc)) {
        throw new Error('the MarioPromise must input a function')
    }
    // init MarioPromise status
    this.state = PROMISE_STATUS_PENDING
    this._successValue = undefined
    this._errorValue = undefined
    this.successMissionList = []
    this.errorMissionList = []
    this.self = this

    function reslove(value) {
        if (this.state === PROMISE_STATUS_PENDING) {
            this.state = PROMISE_STATUS_FULFILLED
            this._successValue = value
            this.successMissionList.forEach(item => item(this._successValue))
        }
    }

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
// then is a function on MarioPromise prototype whitch return a new MarioPromise instance
MarioPromise.prototype.then = function (onFulfilled, onRejected) {
    onFulfilled = Util.isFunction(onFulfilled) ? onFulfilled : (v) => {
        return v
    }
    onRejected = Util.isFunction(onRejected) ? onRejected : (err) => {
        throw err
    }
    //  Promise now state is FULFILLED
    if (this.state == PROMISE_STATUS_FULFILLED) {
        return new MarioPromise((reslove, reject) => {
            const value = onFulfilled(this._successValue)
            if (value instanceof MarioPromise) {
                value.then(reslove, reject)
            } else {
                reslove(value)
            }
        })
    }
    //  Promise now state is REJECTED
    if (this.state == PROMISE_STATUS_REJECTED) {
        return new MarioPromise((reslove, reject) => {
            const errorValue = onRejected(this._errorValue)
            if (errorValue instanceof MarioPromise) {
                errorValue.then(reslove, reject)
            } else {
                reject(value)
            }
        })
    }
    //  Promise now state is PADDING
    if (this.state == PROMISE_STATUS_PENDING) {
        return new MarioPromise((reslove, reject) => {
            if (onFulfilled) {
                this.successMissionList.push(() => {
                    try {
                        const value = onFulfilled(this._successValue)
                        if (value instanceof MarioPromise) {
                            value.then(reslove, reject)
                        } else {
                            reslove(value)
                        }
                    } catch (error) {
                        reject(error)
                    }
                })
            } else {
                this.errorMissionList.push(() => {
                    try {
                        const value = onFulfilled(this._errorValue)
                        if (value instanceof MarioPromise) {
                            value.then(reslove, reject)
                        } else {
                            reject(value)
                        }
                    } catch (error) {
                        reject(error)
                    }
                })
            }
        })
    }
}
// catch is a function on MarioPromise prototype
MarioPromise.prototype.catch = (onRejected) => {
    return this.then(null, onRejected)
}
module.exports = MarioPromise