// 防抖

function debounce(fn, wait, first) {
  let timer = null;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }

    if (first && !timer) {  // 进阶 非必须 是否首次触发
      fn.apply(this, arguments);
    }

    timer = setTimeout(() => fn.apply(this, arguments), wait);
  };
}
