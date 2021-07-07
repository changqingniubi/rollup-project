/*
 * @Description: 
 * @Author: changqing
 * @Date: 2021-05-14 10:01:19
 * @LastEditTime: 2021-07-07 14:49:27
 * @LastEditors: changqing
 * @Usage: 
 */

import {name,age} from './msg';
let name2 ='1'
function say(){
    console.log('hello',name);
}
say();
console.log('hello',name2);
import {age1} from './age1';
import {age2} from './age2';
import {age3} from './age3';
console.log(age1,age2,age3);


if(true){
  var age4 = 12;
}
console.log(age4);


var name5 = 'xiaoqiang';
var age5 = 12;
console.log(age5);

// 输出
// hello xiaominghello
// hello 1
// 111 122 133
// 12
// 12