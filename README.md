
### 1.1 背景
- webpack打包非常繁琐，打包体积比较大
- rollup主要是用来打包JS库的
- vue/react/angular都在用rollup作为打包工具

### 1.2 安装依赖
```javascript
cnpm i @babel/core @babel/preset-env  @rollup/plugin-commonjs @rollup/plugin-node-resolve @rollup/plugin-typescript lodash rollup rollup-plugin-babel postcss rollup-plugin-postcss rollup-plugin-terser tslib typescript rollup-plugin-serve rollup-plugin-livereload -D
```

### 1.3 初次使用
#### 1.3.1 rollup.config.js

- Asynchronous Module Definition异步模块定义
- ES6 module是es6提出了新的模块化方案
- IIFE(Immediately Invoked Function Expression)即立即执行函数表达式，所谓立即执行，就是声明一个函数，声明完了立即执行
- UMD全称为Universal Module Definition,也就是通用模块定义
- cjs是nodejs采用的模块化标准，commonjs使用方法require来引入模块,这里require()接收的参数是模块名或者是模块文件的路径

rollup.config.js

```javascript
export default {
    input:'src/main.js',
    output:{
        file:'dist/bundle.cjs.js',//输出文件的路径和名称
        format:'cjs',//五种输出格式：amd/es6/iife/umd/cjs
        name:'bundleName'//当format为iife和umd时必须提供，将作为全局变量挂在window下
    }
}
```

#### 1.3.2 src\main.js
```javascript
console.log('hello');
```
#### 1.3.3 package.json
```javascript
{
 "scripts": {
    "build": "rollup --config"
  },
}
```
#### 1.3.4 dist\index.html 

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>rollup</title>
</head>
<body>
    <script src="bundle.cjs.js"></script>
</body>
</html>
```
### 1.4 支持babel 

为了使用新的语法，可以使用babel来进行编译输出

#### 1.4.1 安装依赖
- @babel/core是babel的核心包
- @babel/preset-env是预设
- rollup-plugin-babel是babel插件

```javascript
cnpm install rollup-plugin-babel @babel/core @babel/preset-env --save-dev
```
#### 1.4.2 src\main.js
```javascript
let sum = (a,b)=>{
    return a+b;
}
let result = sum(1,2);
console.log(result);
```
#### 1.4.3 .babelrc
```javascript
{
    "presets": [
       [
        "@babel/env",
        {
            "modules":false
        }
       ]
    ]
}
```
#### 1.4.4 rollup.config.js
```javascript
+import babel from 'rollup-plugin-babel';
export default {
    input:'src/main.js',
    output:{
        file:'dist/bundle.cjs.js',//输出文件的路径和名称
        format:'cjs',//五种输出格式：amd/es6/iife/umd/cjs
        name:'bundleName'//当format为iife和umd时必须提供，将作为全局变量挂在window下
    },
+   plugins:[
+       babel({
+           exclude:"node_modules/**"
+       })
+   ]
}

```
### 1.5 tree-shaking
- Tree-shaking的本质是消除无用的js代码
- rollup只处理函数和顶层的import/export变量

#### 1.5.1 src\main.js
src\main.js

```javascript
import {name,age} from './msg';
console.log(name);
```
#### 1.5.2 src\msg.js
```javascript
export var name = 'beijing';
export var age = 12;
```
### 1.6 使用第三方模块
rollup.js编译源码中的模块引用默认只支持 ES6+的模块方式`import/export`

#### 1.6.1 安装依赖
```jaascript
cnpm install @rollup/plugin-node-resolve @rollup/plugin-commonjs lodash  --save-dev
```
#### 1.6.2 src\main.js
```javascript
import _ from 'lodash';
console.log(_);
```
#### 1.6.3 rollup.config.js
```javascript
import babel from 'rollup-plugin-babel';
+import resolve from '@rollup/plugin-node-resolve';
+import commonjs from '@rollup/plugin-commonjs';
export default {
    input:'src/main.js',
    output:{
        file:'dist/bundle.cjs.js',//输出文件的路径和名称
        format:'cjs',//五种输出格式：amd/es6/iife/umd/cjs
        name:'bundleName'//当format为iife和umd时必须提供，将作为全局变量挂在window下
    },
    plugins:[
        babel({
            exclude:"node_modules/**"
        }),
+       resolve(),
+       commonjs()
    ]
}
```
### 1.7 使用CDN
#### 1.7.1 src\main.js 
```javascript
import _ from 'lodash';
import $ from 'jquery';
console.log(_.concat([1,2,3],4,5));
console.log($);
export default 'main';
```
#### 1.7.2 dist\index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>rollup</title>
</head>
<body>
    <script src="https://cdn.jsdelivr.net/npm/lodash/lodash.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jquery/jquery.min.js"></script>
    <script src="bundle.cjs.js"></script>
</body>
</html>
```
#### 1.7.3 rollup.config.js
```javascript
import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
export default {
    input:'src/main.js',
    output:{
        file:'dist/bundle.cjs.js',//输出文件的路径和名称
+       format:'iife',//五种输出格式：amd/es6/iife/umd/cjs
+       name:'bundleName',//当format为iife和umd时必须提供，将作为全局变量挂在window下
+       globals:{
+           lodash:'_', //告诉rollup全局变量_即是lodash
+           jquery:'$' //告诉rollup全局变量$即是jquery
+       }
    },
    plugins:[
        babel({
            exclude:"node_modules/**"
        }),
        resolve(),
        commonjs()
    ],
+   external:['lodash','jquery']
}
```
### 1.8 使用typescript 
#### 1.8.1 安装
```javjascript
cnpm install tslib typescript @rollup/plugin-typescript --save-dev
```
#### 1.8.2 src\main.ts
```javascript
let myName:string = 'beijing';
let age:number=12;
console.log(myName,age);
```
### 1.8.3 rollup.config.js
```javascript
import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
+import typescript from '@rollup/plugin-typescript';
export default {
+   input:'src/main.ts',
    output:{
        file:'dist/bundle.cjs.js',//输出文件的路径和名称
        format:'iife',//五种输出格式：amd/es6/iife/umd/cjs
        name:'bundleName',//当format为iife和umd时必须提供，将作为全局变量挂在window下
        globals:{
            lodash:'_', //告诉rollup全局变量_即是lodash
            jquery:'$' //告诉rollup全局变量$即是jquery
        }
    },
    plugins:[
        babel({
            exclude:"node_modules/**"
        }),
        resolve(),
        commonjs(),
+       typescript()
    ],
    external:['lodash','jquery']
}
```
### 1.8.4 tsconfig.json
```javascript
{
  "compilerOptions": {  
    "target": "es5",                          
    "module": "ESNext",                     
    "strict": true,                         
    "skipLibCheck": true,                    
    "forceConsistentCasingInFileNames": true 
  }
}
```
### 1.9 压缩JS  
terser是支持ES6 +的JavaScript压缩器工具包
#### 1.9.1 安装
```javascript
cnpm install rollup-plugin-terser --save-dev
```
#### 1.9.2 rollup.config.js
```javascript
import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
+import {terser} from 'rollup-plugin-terser';
export default {
    input:'src/main.ts',
    output:{
        file:'dist/bundle.cjs.js',//输出文件的路径和名称
        format:'iife',//五种输出格式：amd/es6/iife/umd/cjs
        name:'bundleName',//当format为iife和umd时必须提供，将作为全局变量挂在window下
        globals:{
            lodash:'_', //告诉rollup全局变量_即是lodash
            jquery:'$' //告诉rollup全局变量$即是jquery
        }
    },
    plugins:[
        babel({
            exclude:"node_modules/**"
        }),
        resolve(),
        commonjs(),
        typescript(),
+       terser(),
    ],
    external:['lodash','jquery']
}
```
### 1.10 编译css
rollup-plugin-postcs 插件支持编译css
#### 1.10.1 安装
```javascript
cnpm install  postcss rollup-plugin-postcss --save-dev
```
#### 1.10.2 rollup.config.js 

```javascript
import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import {terser} from 'rollup-plugin-terser';
+import postcss from 'rollup-plugin-postcss';
export default {
    input:'src/main.js',
    output:{
        file:'dist/bundle.cjs.js',//输出文件的路径和名称
        format:'iife',//五种输出格式：amd/es6/iife/umd/cjs
        name:'bundleName',//当format为iife和umd时必须提供，将作为全局变量挂在window下
        globals:{
            lodash:'_', //告诉rollup全局变量_即是lodash
            jquery:'$' //告诉rollup全局变量$即是jquery
        }
    },
    plugins:[
        babel({
            exclude:"node_modules/**"
        }),
        resolve(),
        commonjs(),
        typescript(),
        //terser(),
+       postcss()
    ],
    external:['lodash','jquery']
}
```

#### 1.10.3 src\main.js
```javascript
import './main.css';
```
#### 1.10.4 src\main.css
```javascript
body{
    background-color: green;
}
```
### 1.11 本地服务器
#### 1.11.1 安装
```javascript
cnpm install rollup-plugin-serve --save-dev
```
#### 1.11.2 rollup.config.dev.js
```javascript
import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
+import serve from 'rollup-plugin-serve';
export default {
    input:'src/main.js',
    output:{
        file:'dist/bundle.cjs.js',//输出文件的路径和名称
        format:'iife',//五种输出格式：amd/es6/iife/umd/cjs
        name:'bundleName',//当format为iife和umd时必须提供，将作为全局变量挂在window下
        sourcemap:true,
        globals:{
            lodash:'_', //告诉rollup全局变量_即是lodash
            jquery:'$' //告诉rollup全局变量$即是jquery
        }
    },
    plugins:[
        babel({
            exclude:"node_modules/**"
        }),
        resolve(),
        commonjs(),
        typescript(),
        postcss(),
+       serve({
+           open:true,
+           port:8080,
+           contentBase:'./dist'
+       })
    ],
    external:['lodash','jquery']
}
```
#### 1.11.3 package.json
```javascript
{
  "scripts": {
    "build": "rollup --config rollup.config.build.js",
    "dev": "rollup --config rollup.config.dev.js -w"
  },
}
```

## 2.前置知识
### 2.1. 初始化项目
```javascript
cnpm install magic-string acorn --save
```
### 2.2. magic-string 
[magic-string](https://www.npmjs.com/package/magic-string)是一个操作字符串和生成source-map的工具
doc/1.magicString.js
```javascript
var MagicString = require('magic-string');
var magicString = new MagicString('export var name = "beijing"');
//类似于截取字符串
console.log(magicString.snip(0,6).toString()); // export
//从开始到结束删除字符串(索引永远是基于原始的字符串，而非改变后的)
console.log(magicString.remove(0,7).toString()); // var name = "beijing"
//使用MagicString.Bundle可以联合多个源代码
//很多模块，把它们打包在一个文件里，需要把很多文件的源代码合并在一起
let bundleString = new MagicString.Bundle();
bundleString.addSource({
    content:'var a = 1;',
    separator:'\n'
});
bundleString.addSource({
    content:'var b = 2;',
    separator:'\n'
});
/* let str = '';
str += 'var a = 1;\n'
str += 'var b = 2;\n'
console.log(str); */
console.log(bundleString.toString());
// var a = 1;
//var b = 2;
```
### 2.3. AST
通过JavaScript Parser可以把代码转化为一颗抽象语法树AST,这颗树定义了代码的结构，通过操纵这颗树，我们可以精准的定位到声明语句、赋值语句、运算语句等等，实现对代码的分析、优化、变更等操作
 ![](https://gitee.com/changqing2/blog-image/raw/main/4.px2rem/ast.jpg)
### 2.3.1 AST工作流
- Parse(解析) 将源代码转换成抽象语法树，树上有很多的estree节点
- Transform(转换) 对抽象语法树进行转换
- Generate(代码生成) 将上一步经过转换过的抽象语法树生成新的代码
![](https://gitee.com/changqing2/blog-image/raw/main/4.px2rem/ast-compiler-flow.jpg)
### 2.3.2 acorn
- [astexplorer](https://astexplorer.net/)可以把代码转成语法树

- acorn 解析结果符合The Estree Spec规范

import $ from 'jquery 的 ast 如下图
![](https://gitee.com/changqing2/blog-image/raw/main/5.rollup/1.jpg)

#### 2.3.2.1 walk.js
doc/walk.js
```javascript
/**
 * 
 * @param {*} ast 要遍历的语法树
 * @param {*} param1 配置对象
 */
function walk(ast, { enter, leave }) {
    visit(ast, null, enter, leave);
}
/**
 * 访问此node节点
 * @param {*} node 
 * @param {*} parent 
 * @param {*} enter 
 * @param {*} leave 
 */
function visit(node, parent, enter, leave) {
    if (enter) {//先执行此节点的enter方法
        enter(node, parent);//不关心this就可以这么写
        //enter.call(null,node,parent);//如果你想指定enter中的this
    }
    //再遍历子节点 找出那些是对象的子节点
    let keys = Object.keys(node).filter(key => typeof node[key] === 'object');
    keys.forEach(key => {//key=specifiers value=[]
        let value = node[key];
        if (Array.isArray(value)) {
            value.forEach((val) => visit(val, node, enter, leave));
        } else if(value && value.type){
            visit(value, node, enter, leave)
        }
    });
    //再执行离开方法
    if (leave) {
        leave(node, parent);
    }
}
module.exports = walk;
```
#### 2.3.2.2 acorn.js测试walk.js
doc/acorn.js
```javascript
//在webpack里和 rollup都是使用acorn模块把源代码转成抽象语法树AST
let acorn = require('acorn');
let walk = require('./walk');
//parse方法把源代码转成一个抽象语法树
let astTree = acorn.parse(`import $ from 'jquery';`,{
    locations:true,ranges:true,sourceType:'module',ecmaVersion:8
});
let ident = 0;
const padding = ()=>" ".repeat(ident);
//console.log(astTree.body);
//遍历语法树中每一条语句
astTree.body.forEach(statement=>{
    //每一条语句传递给walk方法，由walk遍历这条语句子元素
    //采用是深度优先的方法进行遍历
    walk(statement,{
        enter(node){
            if(node.type){
                console.log(padding()+node.type+'进入');
                ident+=2;
            } 
        },
        leave(node){
            if(node.type){
                ident-=2;
                console.log(padding()+node.type+'离开');
            }
        }
    });
});
```
深度遍历如图
![](https://gitee.com/changqing2/blog-image/raw/main/5.rollup/2.jpg)
打印结果
```javascript
ImportDeclaration进入
  ImportDefaultSpecifier进入
    Identifier进入
    Identifier离开
  ImportDefaultSpecifier离开
  Literal进入
  Literal离开
ImportDeclaration离开
```
### 2.4 作用域
#### 2.4.1 作用域
在JS中，作用域是用来规定变量访问范围的规则
```javascript
function one() {
  var a = 1;
}
console.log(a);
```

#### 2.4.2 作用域链
作用域链是由当前执行环境与上层执行环境的一系列变量对象组成的，它保证了当前执行环境对符合访问权限的变量和函数的有序访问
2.4.2.1 scope.js
doc/scope.js
```javascript
class Scope{
  constructor(options = {}){
    this.name = options.name;//作用域起个名字，没有什么用，只是帮助 大家认识的
    this.parent = options.parent;//父作用域
    this.names = options.params||[];//此作用内有哪些变量
  }
  add(name){
    this.names.push(name);
  }
  findDefiningScope(name){
    if(this.names.includes(name)){
        return this;
    }
    if(this.parent){
        return this.parent.findDefiningScope(name);
    }
    return null;
  }
}
module.exports = Scope;
```

#### 2.4.2.2 useScope.js
doc/usescope.js
```javascript
let Scope = require('./scope');
let a = 1;
function one(d){
    let b = 2;
    function two(d){
        let c = 3;
        console.log(a,b,c,d);
    }
    two();
}
one();
let globalScope = new Scope({
    name:'globalScope',params:[],parent:null
});
globalScope.add('a');
let oneScope = new Scope({
    name:'oneScope',params:[],parent:globalScope
});
oneScope.add('b');
oneScope.add('two');
let twoScope = new Scope({
    name:'twoScope',params:['d'],parent:oneScope
});
twoScope.add('c');

console.log(twoScope.findDefiningScope('a').name);//globalScope
console.log(twoScope.findDefiningScope('b').name);//oneScope
console.log(twoScope.findDefiningScope('c').name);//twoScope
console.log(twoScope.findDefiningScope('d').name);//twoScope

//tree-shaking原理的核心就是基于这样的一个scope chain
```

## 3. 实现rollup
[rollup仓库地址](https://github.com/rollup/rollup)
### 3.0 目录结构
```javascript
.
├── package.json
├── README.md
├── lib
    ├── ast
    │   ├── analyse.js //分析AST节点的作用域和依赖项
    │   ├── Scope.js //有些语句会创建新的作用域实例
    │   └── walk.js //提供了递归遍历AST语法树的功能
    ├── bundle.js//打包工具，在打包的时候会生成一个Bundle实例，并收集其它模块，最后把所有代码打包在一起输出 
    ├── module.js//每个文件都是一个模块
    ├── rollup.js //打包的入口模块
    └── utils
 ```  
### 3.1 src\msg.js
```javascript
export let name = 'xiaoming';
export let age = 12;
name+='hello';
```
### 3.2 src\index.js
```javascript
import {name,age} from './msg';
var name2 ='1'
function say(){
    console.log('hello',name);
}
say();

import {age1} from './age1';
import {age2} from './age2';
import {age3} from './age3';
console.log(age1,age2,age3);


if(true){
  var age4 = 12;
}
console.log(age4);


var name5 = 'xiaoqiang';
var age5 = 12;
console.log(age5);
```
打包结果
```javascript
let name = 'xiaoming';
name+='hello';
function say(){
    console.log('hello',name);
}
say();
const age = 11;
const age1 = age + '1';
const age$1 = 12;
const age2 = age$1 + '2';
const age$2 = 13;
const age3 = age$2 + '3';
console.log(age1,age2,age3);
if(true){
  var age4 = 12;
}
console.log(age4);
var age5 = 12;
console.log(age5);
```


### 3.3 debug.js 
```javascript
const path = require('path');
const rollup = require('./lib/rollup');
//入口文件的绝对路径
let entry = path.resolve(__dirname,'src/index.js');
rollup(entry,'bundle.js');
```
### 3.4 lib/rollup.js
```javascript
const Bundle = require('./bundle');
/**
 * @param {*} entry 入口文件
 * @param {*} filename 文件名
 */
function rollup(entry,filename){
    //根据entry创建bundle
   let bundle = new Bundle({entry});
   //编译入口文件，得到输出结果 写入文件里去
   bundle.build(filename);
}

module.exports = rollup;
```
### 3.5 lib/bundle.js
```javascript
let fs = require('fs');
let MagicString = require('magic-string');
let path = require('path');
const Module = require('./module');
let {has,replaceIdentifiers} = require('./utils');
class Bundle{
    constructor(options){
        //entryPath一定是绝对的
        //入口文件数据
        this.entryPath = path.resolve(options.entry.replace(/\.js$/,'')+'.js');//入口文件的绝对路径
        //this.modules = {};//里面放着的有的模块
    }
    /**
     * 编译入口模块和它依赖的模块
     * @param {*} filename 输出的文件路径
     */
    build(filename){
        //每个文件都是一个模块
       let entryModule = this.fetchModule(this.entryPath);
       //从入口模块出发，展开所有的语句，赋给bundle.statements
       this.statements = entryModule.expandAllStatements();
       this.deConflict();//处理变量名的冲突
       const {code } = this.generate();//根据this.statements语句生成最终源代码
       fs.writeFileSync(filename,code);
    }
    deConflict(){
      const defines = {};//变量定义
      const conflicts = {};//命名冲突
      this.statements.forEach(statement=>{
        //遍历所有的语句声明的所有的变量
        Object.keys(statement._defines).forEach(name=>{//age
          if(has(defines,name)){
            conflicts[name]=true;//conflict.age = true;//多个模块内包含了 age这个变量
          }else{
            defines[name]=[];//第一次的肯定没有定义过，赋一个空数组
          }
          //定义变量的对象，key是变量名，值是定义这个变量的模块的数组
          defines[name].push(statement._module);//把此语句对应模块放进去
        });
      });
      // [age1,age2,age3]
      Object.keys(conflicts).forEach(name=>{
        const modules = defines[name];
        modules.shift();
        modules.forEach((module,index)=>{
          const replaceName = name + '$'+(index+1) ;
          module.rename(name,replaceName);
        });
      });
    }
    /**
     * 获取这个路径对应的模块实例
     * @param {*} importee 文件路径 可以是相路径，也可以是绝对路径 子模块
     * @param {*} importer 导入importee的模块 父模块
     */
    fetchModule(importee,importer){
      let route;
      if(!importer){//如果你是入口文件要传绝对路径
        route=importee;
      }else{
        if(path.isAbsolute(importee)){
          route=importee;
        }else{//如果相对的
          route = path.resolve(path.dirname(importer),importee.replace(/\.js$/,'')+'.js');
        }
      }
      if(route){
        let code = fs.readFileSync(route,'utf8');
        const module = new Module({
            code,//源代码
            path:importee,//文件路径
            bundle:this//属于哪个bundle实例
        });
        return module;
      }
    }
    generate(){
      let magicStringBundle = new MagicString.Bundle();
      this.statements.forEach(statement=>{
        //在生成代码之前，我们要先处理变量的替换
        let replacements = {};//变量的名的替换
        //取到所有的依赖的变量和定义的变量
        Object.keys(statement._dependsOn).concat(Object.keys(statement._defines))
        .forEach(name=>{
          //获取真正的名称 规范的名称，或者是重命名后的名称 age=>age$1 age=>age$2
          const canonicalName = statement._module.getCanonicalName(name);
          if(name !== canonicalName)replacements[name]=canonicalName;
        });

        const source = statement._source.clone();
        if(/^Export/.test(statement.type)){
          source.remove(statement.start,statement.declaration.start);
        }
        //用新名字替换掉老名字
        replaceIdentifiers(statement,source,replacements);
        magicStringBundle.addSource({
          content:source,
          separator:'\n'
        });
      });
      return {code:magicStringBundle.toString()}
    }
}
module.exports = Bundle;
```
### 3.6 lib/module.js
```javascript
const MagicString = require('magic-string');
const {parse} = require('acorn');
const analyse = require('./ast/analyse');
const path = require('path');
const {has} = require('./utils');
const SYSTEM_VARIABLES = ['console','log'];
class Module{
   constructor({code,path,bundle}){
      this.code = new MagicString(code,{filename:path});
      this.path = path;
      this.bundle = bundle;
      this.canonicalNames = {};
      this.ast = parse(code,{
        ecmaVersion:7,
        sourceType:'module'
      });
      this.analyse();
   }
   analyse(){
     //获得分析出来此模块导入或者 说导出了哪些变量
     this.imports = {};//导入
     this.exports = {};//导出
    
     this.ast.body.forEach(node=>{
       if(node.type === 'ImportDeclaration'){//说明这是一个导入语句
          let source = node.source.value;//"./msg" 导入了哪个模块
          node.specifiers.forEach(specifier=>{
            const localName = specifier.local.name;//本地的变量名 age
            const name = specifier.imported.name;//导入的变量名 age
            //当前模块内有一个导入的变量变量叫age,它是从./msg这个模块导入的age变量
            //从哪个模块导入了哪个变量，本地变量叫什么
            // this.imports.age = {source:"./msg",name: 'age',localName:'age'};
            this.imports[localName]={source,name,localName};
          });
       }else if(node.type === 'ExportNamedDeclaration'){
          const variableDeclaration = node.declaration;
          let name = variableDeclaration.declarations[0].id.name;//age
          //记录本模块导出了哪些变量，是哪个节点导出的
          //导出了哪个变量，通过哪个变量声明声明的，叫什么名字,导出节点是什么
          //this.exports.age = {node,localName:'age',expression:variableDeclaration};
          this.exports[name]={node,localName:name,expression:variableDeclaration};
       }
     });

     analyse(this.ast,this.code,this);//把当前的模块的实例传给analyse
     //在当前模块内定义一个变量definitions 存放着所有的变量定义语句
     this.definitions = {};//定义变量的语句
     this.modifications = {};//包含所有修改语句
     this.ast.body.forEach(statement=>{
       Object.keys(statement._defines).forEach(name=>{
         //此模块内定义的全局变量名，值是定义此全局变量的语句
         this.definitions[name]=statement;
       });
       Object.keys(statement._modifies).forEach(name=>{
        //此语句修改的变量名
        if(!has(this.modifications,name)){
          this.modifications[name]=[];
        }
        this.modifications[name].push(statement);
      });
      //我们把所有的修改语句都放到了module.modifications上去了
     });

   }
   expandAllStatements(){
       let allStatements = [];//当前模块展开后所有的语句
       this.ast.body.forEach(statement=>{
           if(statement.type === 'ImportDeclaration') return;//不再需要把import 语句放到结果里
           if(statement.type === 'VariableDeclaration') return;//如果是变量声明的，也不需要了
           let statements = this.expendStatement(statement);
           allStatements.push(...statements);
       });
       return allStatements;
   }
   expendStatement(statement){
    statement._include = true;//把这个statement标准为已经 包含到输出结果 
    let result = [];
    //1.包含依赖的变量定义
    const dependencies = Object.keys(statement._dependsOn);//[age]
    dependencies.forEach(name=>{
      let definition = this.define(name);//找到age变量的定义语句，然后返回
      result.push(...definition);
    });
    //2.添加自己的语句
    result.push(statement);
    //3.获取或者 说添加修改的语句
    //获取当前语句定义的变量
    const defines = Object.keys(statement._defines);//['age']
    defines.forEach(name=>{
      //module.modifications里面放着所有的修改语句 key变量 值 就是修改的语句的数且
      const modifications = has(this.modifications,name)&&this.modifications[name];
      if(modifications){
        modifications.forEach(statement=>{
          if(!statement._include){//为了防止 重复包含，判断statement是否已经 被包含到输出结果 了
            let statements = this.expendStatement(statement);
            result.push(...statements);
          }
        });
      }
    });

    return result;
   }
   //找到此变量的定义语句并包含进来
   define(name){
     //先判断这个变量是不是导入的变量
     //this.imports[localName]={source,name,localName};
    if(has(this.imports,name)){
        const importDeclaration = this.imports[name];
        //创建依赖的模块 source ./msg
        let module = this.bundle.fetchModule(importDeclaration.source,this.path);
        //module.exports.name = {node,localName:'name',expression:variableDeclaration};
        const exportDeclaration = module.exports[importDeclaration.name];
        return module.define(exportDeclaration.localName);
    }else{
      //获取当前的模块内定义的变量，以及定义语句
      let statement = this.definitions[name];
      if(statement){//如果有定义，
        if(statement._include){//是否包含过了，如果包含过了，直接返回空数组
          return [];
        }else{
          return this.expendStatement(statement);//展开返回的结果 
        }
      }else if(SYSTEM_VARIABLES.includes(name)){//是系统变量
        return [];
      }else{
        throw new Error(`变量${name}既没有从外部导入，也没有在当前的模块内声明`);
      }
    }
   }
   //重命名
   rename(localName,replaceName){
    this.canonicalNames[localName]=replaceName;
   }
   getCanonicalName(localName){
    //return localName;
    //this.canonicalNames存放着所有的命名的对应关系
    if(!has(this.canonicalNames,localName)){
      this.canonicalNames[localName]=localName;//默认值 
    }
    return this.canonicalNames[localName];
   }
}

module.exports = Module;
```

### 3.7 analyse.js
lib\ast\analyse.js
```javascript
let walk = require('./walk');
let Scope = require('./scope');
/**
 *  对模块的代码语法树进行分析
 * 当前的模块内有哪些作用域，这些使用域有哪些变量，然后才能知道 哪些是外部导入的变量，哪些是模块内声明的变量
 * @param {*} ast 模块对应的语法树
 * @param {*} code 源代码 MagicString类的实例
 */
function analyse(ast,code,module){
  let scope = new Scope();//模块内的全局作用域对象
  ast.body.forEach(statement=>{
     //添加变量声明到当前的作用域内
      function addToScope(declarator,isBlockDeclaration=false){
        var name = declarator.id.name;// 声明的变量名 age
        ///age的有的作用域是一个块级作用域，但是age是一个全局变量，添加全局域下了
        scope.add(name,isBlockDeclaration);//把此变量名添加到scope里
        //statement 就是顶级节点或者说一级节点
        if(!scope.parent || (!isBlockDeclaration)){//没有父作用域 //如果没有低级作用作用域说明是模块内的顶级作用域
          statement._defines[name]=true;// 如果是顶级作用域 的话，它声明的变量就顶级作用变量了
        }
      }

      Object.defineProperties(statement,{
          _module:{value:module},
          _defines:{value:{}},//当前的节点声明的变量 home
          _modifies:{value:{}},//修改的语句
          _dependsOn:{value:{}},//当前模块没有定义的变量 当前节点依赖了哪些外部变量 name
          _included:{value:false,writable:true},//此语句是已经包含到输出语句里了
          _source:{value:code.snip(statement.start,statement.end)}
      })
      //遍历语句，构建scopeChain
      //收集每个statement上的定义的变量，创建作用域链
      walk(statement,{
        enter(node){
          let newScope;
          switch(node.type){
            case 'FunctionDeclaration':
              addToScope(node);
              //函数声明，会创建一个新的作用域对象
              const params = node.params.map(item=>item.name);//['amount']
              newScope = new Scope({
                parent:scope,
                params,
                block:false
              });
              break;
            case 'BlockStatement':
              newScope = new Scope({
                parent:scope,
                block:true //这就是一个块级作用域了 
              });
              break;
            case 'VariableDeclaration':
              node.declarations.forEach((variableDeclarator)=>{
                if(node.kind === 'let' || node.kind === 'const'){
                  addToScope(variableDeclarator,true);//这是一个块级声明
                }else{
                  addToScope(variableDeclarator);
                }
              });
              break;
          }
          if(newScope){//说明此节点创建了新的作用域
            Object.defineProperty(node,'_scope',{value:newScope});
            scope = newScope;//当前的作用域等于新的作用域
          }
        },
        leave(node){
          if(node._scope){//如果说当前的节点创建了新的作用域
            scope = scope.parent;//回到父作用域 
          }
        }
      })
  });
  //找出当前模块依赖了哪些外部变量
  ast.body.forEach(statement=>{
    //查看当前的语句读取了哪些标识符
    function checkForReads(node){
      if(node.type === 'Identifier'){
        //如果是标识符，说明使用到或者说读到了这个变量了
        //let  definingScope = scope.findDefiningScope(node.name);
        // if(!definingScope){//如果找不到定义的作用域
        //包含当前模块声明的，和外部依赖过来的全部变量
        statement._dependsOn[node.name]=true;//添加标识符依赖 依赖了哪些变量
        // }
      }
    }
    function checkForWrites(node){
      function addNode(node){
        //当前的语句修改了age这个变量 statement._modifies.name=true
        //这个地方只是标识修改的哪些变量，但是并不存放语句
        statement._modifies[node.name]=true;
      }
      //如果当前的节点是一个赋值表达式的话，
      if(node.type === 'AssignmentExpression'){
        addNode(node.left,true);
      }else if(node.type === 'UpdateExpression'){
        addNode(node.argument,true);
      }
    }
    walk(statement,{
      enter(node){
        if(node._scope) scope = node._scope;
        checkForReads(node);//查看读取的标识符
        checkForWrites(node);//查看修改哪些标识符
       
      },
      leave(node){
        if(node._scope) scope = scope.parent;
      }
    });
  })
}
module.exports = analyse;
```

### 3.7 scope.js
lib\ast\scope.js
```javascript
class Scope{
    constructor(options={}){
        this.name = options.name;
        this.parent = options.parent;//这个作用域的父作用域
        this.names = options.params||[];//存放着这个作用域内的声明的变量
        this.isBlockScope = !!options.block;//标志 着当前的作用域是否是一个块级作用域 
    }
    /**
     * @param {*} name 添加的变量
     * @param {*} isBlockDeclaration  这个变量是否是块级声明 let const
     * var 不是块级声明
     */
    add(name,isBlockDeclaration){
        //{}   var
        //当前的作用域是一个块级作用域，而当前的声明的变量不是块级声明的变量
        if(!isBlockDeclaration && this.isBlockScope){
            //这是一个var或者函数声明，并且这是一个块级作用域，所以我们需要向上提升
            //添加到父作用域中去
            this.parent.add(name,isBlockDeclaration);
        }else{
            this.names.push(name);
        }
        
    }
    //找到定义这个变量的作用域
    findDefiningScope(name){
        if(this.names.includes(name)){//先看看自己作用域内有没有这个变量
            return this;
        }else if(this.parent){//如果当前这个作用域有父作用域，那么交由它父作用域查找
            return this.parent.findDefiningScope(name);
        }
        return null;
    }
}
module.exports = Scope;
```
### 3.8 walk.js 
lib\ast\walk.js 
```javascript
function walk(ast, { enter, leave }) {
    visit(ast, null, enter, leave);
}

function visit(node, parent, enter, leave) {
    if (enter) {//如果提供了enter方法，就执行enter方法，参数就是当前的节点
        enter(node, parent);
    }
    let childKeys = Object.keys(node).filter(key => typeof node[key] === 'object');
    childKeys.forEach(key => {
        let value = node[key];
        if (Array.isArray(value)) {
            value.forEach(value => {
                visit(value, node, enter, leave);
            });
        } else if (value && value.type) {
            visit(value, node, enter, leave);
        }
    });
    if (leave) {
        leave(node, parent);
    }
}

module.exports = walk;
```

[仓库地址](https://github.com/changqingniubi/rollup-project)