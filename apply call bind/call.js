Function.prototype.call2 = function (context) {
    let contextTemp = context || window;
    contextTemp.fn = this

    let args = []
    for (let i = 1; i < arguments.length; i++) {
        args.push(`arguments[${i}]`)
    }
    const result = eval(`contextTemp.fn(${args})`)
    
    delete contextTemp.fn
    return result
}
