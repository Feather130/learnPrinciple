function Watcher(vm, exp, cb) {
    this.cb = cb;
    this.vm = vm;
    this.exp = exp;

    this.value = this.get()
}

Watcher.prototype = {
    update: function () {
        this.run();
    },
    run: function () {
        var value = this.get(); // 取到最新值
        var oldVal = this.value;
        if (value !== oldVal) {
            this.value = value;
            this.cb.call(this.vm, value, oldVal); // 执行Compile中绑定的回调，更新视图
        }
    },
    get: function () {
        Dep.target = this
        var value = this.vm[this.exp];
        Dep.target = null
        return value
    }
}
