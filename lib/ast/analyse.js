/*
 * @Description: 
 * @Author: changqing
 * @Date: 2021-05-14 10:01:19
 * @LastEditTime: 2021-07-07 11:27:01
 * @LastEditors: changqing
 * @Usage: 
 */
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
          _dependsOwnOn:{value:{}},//当前模块定义的变量 当前节点依赖了哪些内部变量
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
        let  definingScope = scope.findDefiningScope(node.name);
        if(!definingScope){//如果找不到定义的作用域
          //包含当前模块声明的，和外部依赖过来的全部变量
          statement._dependsOn[node.name]=true;//添加标识符依赖 依赖了哪些外部变量
        }else{
          statement._dependsOwnOn[node.name]=true;//添加标识符依赖 依赖了哪些内部变量
        }
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