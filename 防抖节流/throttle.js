// 节流

// 时间戳写法 第一版 缺点 有头无尾（停止触发后不执行）
function throttle(fn, wait) {
  let pre = null;
  return function () {
    let now = +new Date();
    if (now - pre > wait) {
      pre = now;
      fn.apply(this, arguments);
    }
  };
}

// 计时器写法 第一版 缺点 无头有尾（停止触发后执行最后一次）

function throttle(fn, wait) {
  let timer = null;
  return function () {
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        fn.apply(this, arguments);
      }, wait);
    }
  };
}

// 合并 第二版 有头有尾 进阶

function throttle(fn, wait) {
  let pre = null;
  let timer = null;
  let context = null;
  let arg = null;

  function later() {
    pre = +new Date();
    timer = null;
    fn.apply(context, arg);
  }

  return function () {
    let now = +new Date();
    let remaining = wait - (now - pre); // 剩余时间
    context = this;
    arg = arguments;

    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      pre = now;
      fn.apply(context, arg);
    } else if (!timer) {
      timer = setTimeout(later, remaining);
    }
  };
}

// 合并 第三版 可配置 再次进阶

function throttle(fn, wait, option) {
  let pre = null;
  let timer = null;
  let context = null;
  let arg = null;

  function later() {
    // pre = +new Date();
    pre = options.leading === false ? 0 : new Date().getTime();
    timer = null;
    fn.apply(context, arg);
    if (!timer) {
      context = null;
      arg = null;
    }
  }

  return function () {
    // let now = +new Date();
    let now = new Date().getTime();
    if (!pre && options.leading === false) {
      pre = now;
    }
    let remaining = wait - (now - pre); // 剩余时间
    context = this;
    arg = arguments;

    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      pre = now;
      fn.apply(context, arg);
      if (!timer) {
        context = null;
        arg = null;
      }
    } else if (!timer && options.trailing !== false) {
      timer = setTimeout(later, remaining);
    }
  };
}
