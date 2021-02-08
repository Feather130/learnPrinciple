function observer(data) {
    if (!data || typeof data !== 'object') return
    Object.keys(data).forEach(function (key, index) {
        defineReactive(data, key, data[key])
    })
}

function defineReactive(data, key, value) {
    var dep = new Dep();
    observer(value)
    Object.defineProperty(data, key, {
        get: function () {
            Dep.target && dep.addSub(Dep.target)
            return value
        },
        set: function (newValue) {
            observer(newValue)
            value = newValue
            dep.notify()
        }
    })
}
