/*
 * @Description: 
 * @Author: changqing
 * @Date: 2021-05-14 10:01:19
 * @LastEditTime: 2021-07-06 17:37:31
 * @LastEditors: changqing
 * @Usage: 
 */
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