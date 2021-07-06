/*
 * @Description: 
 * @Author: changqing
 * @Date: 2021-05-14 10:01:19
 * @LastEditTime: 2021-07-05 17:54:32
 * @LastEditors: changqing
 * @Usage: 
 */
let MagicString = require('magic-string');
let magicString = new MagicString(`export var name = "jack"`);
//snip是一个方法，用来返回原来的magicString的克隆对象，删除原始字符串开头和结尾 字符串之间的所有内容
console.log(magicString.snip(7,10).toString());//substr
//从开始到结束 字符串删除
console.log(magicString.remove(0,7).toString());
//集合，源代码的集合
let bundleString  = new MagicString.Bundle();
bundleString.addSource({
    content:'var a = 1',
    separator:'\n'
});
bundleString.addSource({
    content:'var b = 2',
    separator:'\n'
});

console.log(bundleString.toString());