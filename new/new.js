function objectFactory() {
    let obj = {}
    let Constructor = [].shift.call(arguments)
    obj._proto_ = Constructor.prototype
    let ret = Constructor.apply(obj, arguments);
    return typeof ret === 'object' ? ret : obj;
}
