class Scope{
    constructor(options={}){
        this.name = options.name;
        this.parent = options.parent;//这个作用域的父作用域
        this.names = options.params||[];//存放着这个作用域内的声明的变量
    }
    //向当前的作用域内添加变量
    add(name){
        this.names.push(name);
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