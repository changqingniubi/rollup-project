/*
 * @Description: 
 * @Author: changqing
 * @Date: 2021-05-14 10:01:19
 * @LastEditTime: 2021-07-05 16:48:49
 * @LastEditors: changqing
 * @Usage: 
 */
let Scope = require('./scope');
var a = 1;
function one(){
    var b = 2;
    function two(d){
        var c = 3;
        console.log(a,b,c,d);
    }
    two('d');
}
one();
let globalScope = new Scope({name:'globalScope'});
globalScope.add('a');
let oneScope = new Scope({name:'oneScope',parent:globalScope});
oneScope.add('b');
oneScope.add('two');
let twoScope = new Scope({name:'twoScope',parent:oneScope,params:['d']});
twoScope.add('c');

console.log(twoScope.findDefiningScope('a').name);
console.log(twoScope.findDefiningScope('b').name);
console.log(twoScope.findDefiningScope('c').name);
console.log(twoScope.findDefiningScope('d').name);

