/*
 * @Description: 
 * @Author: changqing
 * @Date: 2021-05-14 10:01:19
 * @LastEditTime: 2021-07-06 17:39:37
 * @LastEditors: changqing
 * @Usage: 
 */


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