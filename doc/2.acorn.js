let acorn = require('acorn');
let walk = require('./walk');
//esprima estraverse
//babel babel/traverse
const ast = acorn.parse(`import $ from 'jquery';`,{
    locations:false,ranges:false,sourceType:'module',ecmaVersion:8
});
let ident = 0;
const padding = ()=>" ".repeat(ident);
ast.body.forEach(statement =>{
    //console.log(statement);
    //statement就是顶级语句，walk是以深度优先的方式遍历此节点
    walk(statement,{
        enter(node,parent){//进入 一个节点的时候的方法
            console.log(padding()+node.type);
            ident+=2;
        },
        leave(node,parent){//主开一个节点时的方法
            ident-=2;
            console.log(padding()+node.type);
        }
    });
});