/*
 * @Description: 
 * @Author: changqing
 * @Date: 2021-04-20 22:47:15
 * @LastEditTime: 2021-05-03 23:11:15
 * @LastEditors: changqing
 * @Usage: 
 */

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