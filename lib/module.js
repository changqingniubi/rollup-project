/*
 * @Description: 
 * @Author: changqing
 * @Date: 2021-05-14 10:01:19
 * @LastEditTime: 2021-07-07 18:39:48
 * @LastEditors: changqing
 * @Usage: 
 */
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
           if(statement.type === 'FunctionDeclaration') return;//如果是变量声明的，也不需要了
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
    const dependenciesOwn = Object.keys(statement._dependsOwnOn);//[age]
    dependenciesOwn.forEach(name=>{
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