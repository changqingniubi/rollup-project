/*
 * @Description: 
 * @Author: changqing
 * @Date: 2021-05-14 10:01:19
 * @LastEditTime: 2021-07-07 14:38:22
 * @LastEditors: changqing
 * @Usage: 
 */
const path = require('path');
const rollup = require('./lib/rollup');
const entry  = path.resolve(__dirname,'src/index.js');
debugger
rollup(entry,'./dist/bundle.js');