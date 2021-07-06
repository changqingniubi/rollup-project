/*
 * @Description: 
 * @Author: changqing
 * @Date: 2021-05-14 10:01:19
 * @LastEditTime: 2021-07-06 11:12:47
 * @LastEditors: changqing
 * @Usage: 
 */
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