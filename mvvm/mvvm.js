function MVVM(options) {
    this.$options = options
    var data = this._data = this.$options.data
    var that = this
    Object.keys(data).forEach(function (key) {
        that._proxy(key);
    });
    observer(data)
    this.$compile = new Compile(options.el || document.body, this)
}

MVVM.prototype = {
    _proxy: function (key) {
        var that = this;
        Object.defineProperty(that, key, {
            get: function () {
                return that._data[key];
            },
            set: function (newVal) {
                that._data[key] = newVal;
            }
        });
    }
}
