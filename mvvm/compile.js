function Compile(el, vm) {
    this.$vm = vm
    this.$el = this.isElementNode(el) ? el : document.querySelector(el)
    if (this.$el) {
        this.$fragment = this.node2Fragment(this.$el)
        this.init();
        this.$el.appendChild(this.$fragment);
    }
}

Compile.prototype = {
    init: function () {
        this.compileElement(this.$fragment);
    },
    isElementNode: function (node) {
        return node.nodeType === 1
    },
    isTextNode: function (node) {
        return node.nodeType === 3;
    },
    node2Fragment: function (el) {
        var fragment = document.createDocumentFragment()
        var child
        while (child = el.firstChild) {
            fragment.appendChild(child)
        }
        return fragment
    },
    compileElement: function (el) {
        var childNodes = Array.prototype.slice.call(el.childNodes)
        var that = this
        childNodes.forEach(function (node) {
            var text = node.textContent;
            var reg = /\{\{(.*)\}\}/;
            if (that.isElementNode(node)) {
                // that.compile(node);
            } else if (that.isTextNode(node) && reg.test(text)) {
                that.compileText(node, RegExp.$1);
            }
            if (node.childNodes && node.childNodes.length) {
                that.compileElement(node);
            }
        })
    },
    compile: function (node) {
        var nodeAttrs = Array.prototype.slice.call(node.attributes)
        var that = this
        nodeAttrs.forEach(function (attr) {
            console.log(attr)
        })
    },
    compileText: function (node, exp) {
        compileUtil.text(node, this.$vm, exp);
    }
}

var compileUtil = {
    text: function (node, vm, exp) {
        this.bind(node, vm, exp, 'text');
    },
    bind: function (node, vm, exp, dir) {
        var updaterFn = updater[dir + 'Updater'];
        updaterFn && updaterFn(node, vm[exp]);
        new Watcher(vm, exp, function (value, oldValue) {
            updaterFn && updaterFn(node, value, oldValue);
        });
    }
}

var updater = {
    textUpdater: function (node, value) {
        node.textContent = typeof value == 'undefined' ? '' : value;
    }
};
