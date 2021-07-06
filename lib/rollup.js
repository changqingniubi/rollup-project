/*
 * @Description: 
 * @Author: changqing
 * @Date: 2021-05-14 10:01:19
 * @LastEditTime: 2021-07-06 17:46:10
 * @LastEditors: changqing
 * @Usage: 
 */

const Bundle = require('./bundle');
/**
 * @param {*} entry 入口文件
 * @param {*} filename 文件名
 */
function rollup(entry,filename){
    //根据entry创建bundle
   let bundle = new Bundle({entry});
   //编译入口文件，得到输出结果 写入文件里去
   bundle.build(filename);
}

module.exports = rollup;