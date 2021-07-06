/*
 * @Description: 
 * @Author: changqing
 * @Date: 2021-04-20 22:47:15
 * @LastEditTime: 2021-05-04 15:05:50
 * @LastEditors: changqing
 * @Usage: 
 */
const path = require('path');
const rollup = require('./lib/rollup');
//入口文件的绝对路径
let entry = path.resolve(__dirname,'src/main.js');
rollup(entry,'bundle.js');
