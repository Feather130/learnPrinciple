Function.prototype.apply2 = function (context, arr) {
    let contextTemp = context || window;
    contextTemp.fn = this
    let result
    if (!arr) {
        result = contextTemp.fn();
    } else {
        result = contextTemp.fn(...arr);

        // let args = [];
        // for (let i = 0; i < arr.length; i++) {
        //     args.push('arr[' + i + ']');
        // }
        // result = eval('contextTemp.fn(' + args + ')');
    }
    delete contextTemp.fn
    return result
}
