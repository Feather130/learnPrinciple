Function.prototype.apply2 = function (context, arr) {
    let contextTemp = context || window;
    contextTemp.fn = this
    let result
    if (!arr) {
        result = contextTemp.fn();
    } else {
        result = contextTemp.fn(arr);
    }
    delete contextTemp.fn
    return result
}
