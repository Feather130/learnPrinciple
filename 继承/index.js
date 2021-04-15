// 寄生组合继承

function inheritProtoType(child, parent) {
  // 创建了父类原型的（副本）浅复制
  let prototype = Object.create(parent.prototype);
  // 把构造函数指回子类
  prototype.constructor = child;
  // 将子类的原型替换为父类原型的（副本）浅复制
  child.prototype = prototype;
}

function Parent(name) {
  this.id = name;
}

Parent.prototype.getName = function () {
  return this.id;
};

function Child(name, age) {
  // 借用父类构造函数
  Parent.call(this, name);
  this.age = age;
}

inheritProtoType(Child, Parent);

let child = new Child("xiaoming", 20);
// let parent = new Parent("id");

// console.log(parent.getName());

// console.log(parent.getterSex());
console.log(child.age);
console.log(child.getName());
