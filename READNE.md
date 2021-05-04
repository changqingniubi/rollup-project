<!--
 * @Description: 
 * @Author: changqing
 * @Date: 2021-05-04 16:28:57
 * @LastEditTime: 2021-05-04 16:30:24
 * @LastEditors: changqing
 * @Usage: 
-->

## 1.rollup的常用基本使用
## 2.实现rollup的 treeshaking工能

## rollup实战
[rollup](https://rollupjs.org/guide/en/)是下一代ES模块捆绑器

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
doc/1.js
```javascript
var MagicString = require('magic-string');
var magicString = new MagicString('export var name = "beijing"');
//类似于截取字符串
console.log(magicString.snip(0,6).toString()); // export
//从开始到结束删除字符串(索引永远是基于原始的字符串，而非改变后的)
console.log(magicString.remove(0,7).toString()); // var name = "beijing"

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
    let childKeys = Object.keys(node).filter(key => typeof node[key] === 'object');
    childKeys.forEach(childKey => {//childKey=specifiers value=[]
        let value = node[childKey];
        if (Array.isArray(value)) {
            value.forEach((val) => visit(val, node, enter, leave));
        } else {
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
#### 2.3.2.2 ast.js
doc/useWZalk.js
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
作用域链是由当前执行环境与上层执行环境的一系列变量对象组成的，它保证了当前执行环境对符合访问权限的变量和函数的有序访问
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
doc/usescope.js
```javascript
let Scope = require('./scope');
let a = 1;
function one(){
    let b = 2;
    function two(age){
        let c = 3;
        console.log(a,b,c,age);
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
let twoScope = new Scope({
    name:'twoScope',params:['age'],parent:oneScope
});
twoScope.add('c');

let aScope =twoScope.findDefiningScope('a');
console.log(aScope.name); //globalScope

let bScope =twoScope.findDefiningScope('b');
console.log(bScope.name);//oneScope


let cScope =twoScope.findDefiningScope('c');
console.log(cScope.name);//twoScope


let ageScope =twoScope.findDefiningScope('age');
console.log(ageScope.name);//twoScope

let xxxScope =twoScope.findDefiningScope('xxx');
console.log(xxxScope);//null

//tree-shaking原理的核心就是基于这样的一个scope chain
```

## 3. 实现rollup
[rollup仓库地址](https://gitee.com/zhufengpeixun/rollup)
### 3.1 src\msg.js
```javascript
export var name = 'xiaoming';
export var age = 12;
```
### 3.2 src\main.js
```javascript
import {name,age} from './msg';
function say(){
    console.log('hello',name);
}
say();
```
打包结果
```javascript
var name = 'xiaoming';
function say(){
    console.log('hello',name);
}
say();
```


### 3.3 debugger.js 
```javascript
const path = require('path');
const rollup = require('./lib/rollup');
//入口文件的绝对路径
let entry = path.resolve(__dirname,'src/main.js');
rollup(entry,'bundle.js');
```
### 3.4 lib/rollup.js
```javascript
let Bundle = require('./bundle');
function rollup(entry,outputFileName){
    //Bundle就代表打包对象，里面会包含所有的模块信息
    const bundle = new Bundle({entry});
    //调用build方法开始进行编译
    bundle.build(outputFileName);
}
module.exports = rollup;
```
### 3.5 lib/bundle.js
```javascript
const fs = require('fs');
const path = require('path');
const { default: MagicString } = require('magic-string');
const Module = require('./module');
class Bundle{
    constructor(options){
        //入口文件的绝对路径，包括后缀
        this.entryPath = options.entry.replace(/\.js$/,'')+'.js';
        this.modules = {};//存放着所有模块 入口文件和它依赖的模块
    }
    build(outputFileName){
        //从入口文件的绝对路径出发找到它的模块定义
        let entryModule = this.fetchModule(this.entryPath);
        //把这个入口模块所有的语句进行展开，返回所有的语句组成的数组
        this.statements = entryModule.expandAllStatements();
        const {code} = this.generate();
        fs.writeFileSync(outputFileName,code,'utf8');
    }
    //获取模块信息
    fetchModule(importee,importer){
        let route;
        if(!importer){//如果没有模块导入此模块，说是这就是入口模块
            route=importee;
        }else{
            if(path.isAbsolute(importee)){//如果是绝对路径 
                route=importee;
            }else if(importee[0]=='.'){//如果相对路径
                route=path.resolve(path.dirname(importer),importee.replace(/\.js$/,'')+'.js');
            }
        }
        if(route){
            //从硬盘上读出此模块的源代码
            let code = fs.readFileSync(route,'utf8');
            let module = new Module({
                code,//模块的源代码
                path:route,//模块的绝对路径
                bundle:this//属于哪个Bundle
            });    
            return module;
        }
    }
    //把this.statements生成代码
    generate(){
        let magicString = new MagicString.Bundle();
        this.statements.forEach(statement=>{
            const source = statement._source;
            if(statement.type === 'ExportNamedDeclaration' && statement.declaration.type === 'VariableDeclaration'){
                source.remove(statement.start,statement.declaration.start);
            }
            // if (/export/.test(statement.type)) {
            //     if (statement.type === 'ExportNamedDeclaration' && statement.declaration.type === 'VariableDeclaration') {
            //       source.remove(statement.start, statement.declaration.start);
            //     }
            // }
            magicString.addSource({
                content:source,
                separator:'\n'
            });
        });
        return {code:magicString.toString()};
    }
}
module.exports = Bundle;
```
### 3.6 lib/module.js
```javascript
let MagicString = require('magic-string');
const {parse} = require('acorn');
const analyse = require('./ast/analyse');
//判断一下obj对象上是否有prop属性
function hasOwnProperty(obj,prop){
    return Object.prototype.hasOwnProperty.call(obj,prop);
}
/**
 * 每个文件都是一个模块，每个模块都会对应一个Module实例
 */
class Module{
    constructor({code,path,bundle}){
        this.code = new MagicString(code,{filename:path});
        this.path = path;//模块的路径
        this.bundle = bundle;//属于哪个bundle的实例
        this.ast = parse(code,{//把源代码转成抽象语法树
            ecmaVersion:7,
            sourceType:'module'
        });
        this.analyse();
    }
    analyse(){
        this.imports = {};//存放着当前模块所有的导入
        this.exports = {};//存放着当前模块所有的导出
        this.ast.body.forEach(node=>{
            if(node.type === 'ImportDeclaration'){//说明这是一个导入语句
                let source  = node.source.value;//./msg 从哪个模块进行的导入
                let specifiers = node.specifiers;
                specifiers.forEach(specifier=>{
                    const name = specifier.imported.name;//name
                    const localName = specifier.local.name;//name
                    //本地的哪个变量，是从哪个模块的的哪个变量导出的
                    //this.imports.age = {name:'age',localName:"age",source:'./msg'};
                    this.imports[localName]={name,localName,source}
                });
            //}else if(/^Export/.test(node.type)){
            }else if(node.type === 'ExportNamedDeclaration'){
                let declaration = node.declaration;//VariableDeclaration
                if(declaration.type === 'VariableDeclaration'){
                    let name = declaration.declarations[0].id.name;//age
                    //记录一下当前模块的导出 这个age通过哪个表达式创建的
                    //this.exports['age']={node,localName:age,expression}
                    this.exports[name] = {
                        node,localName:name,expression:declaration
                    }
                }
            }
        });
        analyse(this.ast,this.code,this);//找到了_defines 和 _dependsOn
        this.definitions = {};//存放着所有的全局变量的定义语句
        this.ast.body.forEach(statement=>{
            Object.keys(statement._defines).forEach(name=>{
                //key是全局变量名，值是定义这个全局变量的语句
                this.definitions[name]=statement;
            });
        });

    }
    //展开这个模块里的语句，把些语句中定义的变量的语句都放到结果里
    expandAllStatements(){
        let allStatements = [];
        this.ast.body.forEach(statement=>{
            if(statement.type === 'ImportDeclaration'){return}
            let statements = this.expandStatement(statement);
            allStatements.push(...statements);
        });
        return allStatements;
    }
    //展开一个节点
    //找到当前节点依赖的变量，它访问的变量，找到这些变量的声明语句。
    //这些语句可能是在当前模块声明的，也也可能是在导入的模块的声明的
    expandStatement(statement){
      let result = [];
      const dependencies = Object.keys(statement._dependsOn);//外部依赖 [name]
      dependencies.forEach(name=>{
          //找到定义这个变量的声明节点，这个节点可以有在当前模块内，也可能在依赖的模块里
          let definition = this.define(name);
          result.push(...definition);
      });
      if(!statement._included){
        statement._included = true;//表示这个节点已经确定被纳入结果 里了，以后就不需要重复添加了
        result.push(statement);
      } 
      return result;
    }
    define(name){
        //查找一下导入变量里有没有name
        if(hasOwnProperty(this.imports,name)){
            //this.imports.age = {name:'age',localName:"age",source:'./msg'};
            const importData = this.imports[name];
            //获取msg模块 exports imports msg模块
            const module = this.bundle.fetchModule(importData.source,this.path);
            //this.exports['age']={node,localName:age,expression}
            const exportData = module.exports[importData.name];
            //调用msg模块的define方法，参数是msg模块的本地变量名age,目的是为了返回定义age变量的语句
            return module.define(exportData.localName);
        }else{
            //definitions是对象,key当前模块的变量名，值是定义这个变量的语句
            let statement = this.definitions[name];
            if(statement && !statement._included){
                return this.expandStatement(statement);
            }else{
                return [];
            }
        }
    }
}
module.exports = Module;
```

### 3.7 analyse.js
lib\ast\analyse.js
```javascript
let Scope = require('./scope');
let walk = require('./walk');
/**
 * 找出当前模块使用到了哪些变量
 * 还要知道哪些变量时当前模块声明的，哪些变量是导入别的模块的变量
 * @param {*} ast 语法树
 * @param {*} magicString 源代码 
 * @param {*} module  属于哪个模块的
 */
function analyse(ast,magicString,module){
    let scope = new Scope();//先创建一个模块内的全局作用域
    //遍历当前的所有的语法树的所有的顶级节点
    ast.body.forEach(statement=>{
        //给作用域添加变量 var function const let 变量声明
        function addToScope(declaration){
            var name = declaration.id.name;//获得这个声明的变量
            scope.add(name);//把say这个变量添加到当前的全局作用域
            if(!scope.parent){//如果当前是全局作用域的话
                statement._defines[name]=true;//在全局作用域下声明一个全局的变量say
            }
        }
        Object.defineProperties(statement,{
            _defines:{value:{}},//存放当前模块定义的所有的全局变量
            _dependsOn:{value:{}},//当前模块没有定义但是使用到的变量，也就是依赖的外部变量
            _included:{value:false,writable:true},//此语句是否已经 被包含到打包结果中了
            //start指的是此节点在源代码中的起始索引,end就是结束索引
            //magicString.snip返回的还是magicString 实例clone
            _source:{value:magicString.snip(statement.start,statement.end)}
        });  
       //这一步在构建我们的作用域链
+      //收集每个statement上的定义的变量，创建作用域链
        walk(statement,{
            enter(node){
                let newScope;
                switch(node.type){
                    case 'FunctionDeclaration':
                        const params = node.params.map(x=>x.name);
                        if(node.type === 'FunctionDeclaration'){
                            addToScope(node);
                        }
                        //如果遍历到的是一个函数声明，我会创建一个新的作用域对象
                        newScope = new Scope({
                            parent:scope,//父作用域就是当前的作用域
                            params 
                        });
                        break;
                    case 'VariableDeclaration': //并不会生成一个新的作用域
                          node.declarations.forEach(addToScope);
                        break;
                }
                if(newScope){//当前节点声明一个新的作用域
                    //如果此节点生成一个新的作用域，那么会在这个节点放一个_scope，指向新的作用域
                    Object.defineProperty(node,'_scope',{value:newScope});
                    scope = newScope;
                }
            },
            leave(node){
                if(node._scope){//如果此节点产出了一个新的作用域，那等离开这个节点，scope回到父作用法域
                    scope = scope.parent;
                }
            }
        });
    });
    console.log('第一次遍历',scope);
    ast._scope = scope;
    //找出外部依赖_dependsOn
    ast.body.forEach(statement=>{
        walk(statement,{
            enter(node){
                if(node._scope ){
                    scope = node._scope;
                } //如果这个节点放有一个scope属笥，说明这个节点产生了一个新的作用域  
                if(node.type === 'Identifier'){
                    //从当前的作用域向上递归，找这个变量在哪个作用域中定义
                    const definingScope = scope.findDefiningScope(node.name);
                    if(!definingScope){
                        statement._dependsOn[node.name]=true;//表示这是一个外部依赖的变量
                    }
                }

            },
            leave(node){
                if(node._scope) {
                    scope = scope.parent;
                }
               
            }
        });
    });

}
module.exports = analyse;
```

### 3.7 scope.js
lib\ast\scope.js
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
### 3.8 walk.js 
lib\ast\walk.js 
```javascript
function walk(ast, { enter, leave }) {
    visit(ast, null, enter, leave);
}
/**
 * 访问此node节点
 * @param {*} node 遍历的节点
 * @param {*} parent 父节点
 * @param {*} enter 进入的方法
 * @param {*} leave 离开的方法
 */
function visit(node, parent, enter, leave) {
    if (enter) {//先执行此节点的enter方法
        enter(node, parent);//不关心this就可以这么写
        //enter.call(null,node,parent);//如果你想指定enter中的this
    }
    //再遍历子节点 找出那些是对象的子节点
    let childKeys = Object.keys(node).filter(key => typeof node[key] === 'object');
    childKeys.forEach(childKey => {//childKey=specifiers value=[]
        let value = node[childKey];
        if (Array.isArray(value)) {
            value.forEach((val) => visit(val, node, enter, leave));
        } else if(value && value.type) {//遍历的时候只遍历有type属性的对象节点必须存在，并且是一个有type的对象节点
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