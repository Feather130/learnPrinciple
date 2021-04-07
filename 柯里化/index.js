function currying(fn, length) {
    length = length || fn.length
    return function () {
        let args = Array.from(arguments)

        if (args.length >= length) { // 当参数已经攒够fn所需的个数就执行fn
            return fn.apply(this, args)
        } else { // 参数不够继续递归
            return currying(fn.bind(this, ...args), length - args.length)
        }
    }
}

let fn = currying(function(a, b, c) {
    console.log([a, b, c]);
});

fn("a", "b", "c") // ["a", "b", "c"]
fn("a", "b")("c") // ["a", "b", "c"]
fn("a")("b")("c") // ["a", "b", "c"]
fn("a")("b")("c") // ["a", "b", "c"]