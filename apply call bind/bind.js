Function.prototype.bind2 = function (context) {
    const self = this
    const args = Array.prototype.slice.call(arguments, 1);
    var fNOP = function () {
    };
    var fbound = function () {
        const bindArgs = Array.prototype.slice.call(arguments);
        self.apply(this instanceof self ? this : context, args.concat(bindArgs))
    }
    fNOP.prototype = this.prototype;
    fbound.prototype = new fNOP()
    return fbound
}
