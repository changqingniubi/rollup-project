/* let name = './3.js';
require(name);
 */
fetch('/api/name').then(res=>res.json()).then(res=>{
    //编译阶段是不知道 这个模块是在哪个位置 运行时加载和确定
    require(res.name);
});