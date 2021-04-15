function create(proto, object) {
  if (!arguments.length) {
    throw new Error("");
  }

  function F() {}

  F.prototype = proto;

  let obj = new F();

  if (object != undefined) {
    Object.defineProperties(obj, object);
  }

  return obj;
}
