Object.defineProperty(Object, "assign1", {
  value: function (target) {
    if (target === null) {
      throw new Error("");
    }
    let to = Object(target);

    for (let i = 1; i < arguments.length; i++) {
      let nextSource = arguments[i];
      if (nextSource !== null) {
        for (let nextKey in nextSource) { // for in 可以遍历原型链上的
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) { // 判断是否不在原型链上
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }

    return to;
  },
  writable: true,
  configurable: true,
});
