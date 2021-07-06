/*
 * @Description: 
 * @Author: changqing
 * @Date: 2021-05-14 10:01:19
 * @LastEditTime: 2021-07-05 19:23:05
 * @LastEditors: changqing
 * @Usage: 
 */
const path = require('path');
const rollup = require('./lib/rollup');
const entry  = path.resolve(__dirname,'src/index.js');
rollup(entry,'./dist/bundle.js');