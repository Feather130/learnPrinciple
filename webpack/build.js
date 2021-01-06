const fs = require('fs');
const path = require('path');
const {parse} = require("@babel/parser");
const traverse = require("@babel/traverse").default;

// 获取模块的所有依赖
// const getDependencies = function (fileContent) {
//     let reg = /require\(['"](.+?)['"]\)/g;
//     let result = null;
//     let dependencies = [];
//     while ((result = reg.exec(fileContent))) {
//         dependencies.push(result[1]);
//     }
//     return dependencies;
// }

// 获取模块的所有依赖
const getDependencies = function (filePath) {
    let result = null;
    let dependencies = [];

    const fileContent = fs.readFileSync(filePath).toString();
    // parse
    const ast = parse(fileContent, {sourceType: "CommonJs"});
    // transform
    traverse(ast, {
        enter: (item) => {
            if (
                item.node.type === "CallExpression" &&
                item.node.callee.name === "require"
            ) {
                const dirname = path.dirname(filePath);
                dependencies.push(path.join(dirname, item.node.arguments[0].value));
            }
        },
    });
    return dependencies;
}

// 将文件转化成模块对象
const fileToModule = function (path) {
    const fileContent = fs.readFileSync(path, 'utf8').toString();
    return {
        id: path,                             // 这里以路径作为模块id
        dependencies: getDependencies(path),   // 新增模块信息
        code: `function(require,exports){     // 这里加壳了
            ${fileContent.toString()};
        }`,
    };
}

// 将所有模块以及他们的依赖转化成模块对象
const createGraph = function (filename) {
    let module = fileToModule(filename);
    let queue = [module];
    for (let module of queue) {
        const dirname = path.dirname(module.id);
        module.dependencies.forEach((relativePath) => {
            const absolutePath = path.join(dirname, relativePath);
            const result = queue.every((item) => {
                return item.id !== absolutePath;
            });
            if (result) {
                const child = fileToModule(absolutePath);
                queue.push(child);
            } else {
                return false;
            }
        });
    }
    // 上面得到的是一个数组。转化成对象
    let modules = {}
    queue.forEach((item) => {
        modules[item.id] = item.code;
    })
    return modules;
}

let modules = createGraph("./index.js");

function createBundle(modules) {
    let __modules = "";
    for (let attr in modules) {
        __modules += `"${attr}":${modules[attr]},`;
    }
    const result = `(function(){
        const modules = {${__modules}};
        // 执行模块函数
        const exec = function (moduleId) {
          const fn = modules[moduleId];
          let exports = {};
          const require = function (filename) {
            const dirname = path.dirname(moduleId);
            const absolutePath = path.join(dirname, filename);
            return exec(absolutePath);
          };
          fn(require, exports);
          return exports;
        };
        exec("./index.js");
    })()`;
    fs.writeFileSync("./dist/bundle3.js", result);
}

createBundle(modules)
