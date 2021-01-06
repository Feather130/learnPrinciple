let promiseCount = 1;

class Promise1 {
    callbacks = []
    state = 'pending'
    value = null

    name = '';

    constructor(fn) {
        this.name = `Promse-${promiseCount++}`;
        // console.log('[%s]:constructor', this.name);
        fn(this._resolve.bind(this), this._reject.bind(this))
    }

    then(onFulfilled, onRejected) {
        // console.log('[%s]:then', this.name);
        return new Promise((resolve, reject) => {
            // console.log('[%s]:then_return', this.name);
            this._handle({
                onFulfilled: onFulfilled || null,
                onRejected: onRejected || null,
                resolve: resolve,
                reject: reject
            });
        })
    }

    catch(onError) {
        // console.log('[%s]:catch', this.name);
        return this.then(null, onError);
    }

    finally(onDone) {
        if (typeof onDone !== 'function') return this.then();
        let Promise = this.constructor;
        return this.then(
            value => Promise.resolve(onDone()).then(() => value),
            reason => Promise.resolve(onDone()).then(() => {
                throw reason
            })
        );
    }

    _handle(callback) {
        // console.log('[%s]:_handle', this.name, 'state=', this.state);

        if (this.state === 'pending') {
            this.callbacks.push(callback)
            // console.log('[%s]:_handle_pending', this.name, 'callbacks=', this.callbacks);
            return
        }

        let cb = this.state === 'fulfilled' ? callback.onFulfilled : callback.onRejected;

        if (!cb) {
            // console.log('[%s]:_handle_noCallback', this.name, 'callbacks=', this.callbacks);
            cb = this.state === 'fulfilled' ? callback.resolve : callback.reject;
            cb(this.value);
            return;
        }

        let ret
        try {
            ret = cb(this.value);
            cb = this.state === 'fulfilled' ? callback.resolve : callback.reject;
        } catch (error) {
            ret = error;
            cb = callback.reject
        } finally {
            cb(ret);
        }
    }

    _resolve(value) {
        // console.log('[%s]:_resolve', this.name, 'value=', value)

        if (value && (typeof value === 'object' || typeof value === 'function')) {
            // console.log('[%s]:_resolve_if', this.name, 'value= ', value)
            const then = value.then;
            if (typeof then === 'function') {
                then.call(value, this._resolve.bind(this));
                return;
            }
        }

        this.state = 'fulfilled'
        this.value = value
        this.callbacks.forEach(callback => this._handle(callback))
    }

    _reject(error) {
        // console.log('[%s]:_reject', this.name, 'error=', error)

        this.state = 'rejected';
        this.value = error;
        this.callbacks.forEach(callback => this._handle(callback));
    }

    static resolve(value) {
        if (value && value instanceof Promise) {
            return value;
        } else if (value && typeof value === 'object' && typeof value.then === 'function') {
            let then = value.then;
            return new Promise(resolve => {
                then(resolve);
            });

        } else if (value) {
            return new Promise(resolve => resolve(value));
        } else {
            return new Promise(resolve => resolve());
        }
    }

    static reject(value) {
        if (value && typeof value === 'object' && typeof value.then === 'function') {
            let then = value.then;
            return new Promise((resolve, reject) => {
                then(reject);
            });
        } else {
            return new Promise((resolve, reject) => reject(value));
        }
    }

    static all(promises) {
        return new Promise((resolve, reject) => {
            let fulfilledCount = 0
            const itemNum = promises.length
            const rets = Array.from({length: itemNum})
            promises.forEach((promise, index) => {
                Promise.resolve(promise).then(result => {
                    fulfilledCount++;
                    rets[index] = result;
                    if (fulfilledCount === itemNum) {
                        resolve(rets);
                    }
                }, reason => reject(reason));
            })
        })
    }

    static race(promises) {
        return new Promise(function (resolve, reject) {
            for (let i = 0; i < promises.length; i++) {
                Promise.resolve(promises[i]).then(function (value) {
                    return resolve(value)
                }, function (reason) {
                    return reject(reason)
                })
            }
        })
    }

    static allSettled(promises) {
        return new Promise(function (resolve) {
            let fulfilledCount = 0
            const itemNum = promises.length
            const rets = Array.from({length: itemNum})
            promises.forEach((promise, index) => {
                Promise.resolve(promise).then(value => {
                    fulfilledCount++;
                    rets[index] = {
                        status: 'fulfilled',
                        value
                    };
                    if (fulfilledCount === itemNum) {
                        resolve(rets);
                    }
                }).catch(reason => {
                    fulfilledCount++;
                    rets[index] = {
                        status: 'rejected',
                        reason
                    };
                    if (fulfilledCount === itemNum) {
                        resolve(rets);
                    }
                })
            })
        })
    }

    static any(promises) {
        return new Promise(function (resolve, reject) {
            let fulfilledCount = 0
            const itemNum = promises.length
            const rets = Array.from({length: itemNum})
            promises.forEach((promise, index) => {
                Promise.resolve(promise).then(value => resolve(value)).catch(reason => {
                    fulfilledCount++;
                    rets[index] = reason
                    if (fulfilledCount === itemNum) {
                        reject('AggregateError: All promises were rejected');
                    }
                })
            })
        })
    }
}

const pErr = new Promise((resolve, reject) => {
    reject('总是失败');
});

Promise.any([pErr]).catch((err) => {
    console.log(err);
})
// 期望输出: "AggregateError: No Promise in Promise.any was resolved"
