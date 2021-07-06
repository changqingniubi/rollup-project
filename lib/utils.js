

let walk = require('./ast/walk');
function has(obj,prop){
    return Object.prototype.hasOwnProperty.call(obj,prop);
}
function replaceIdentifiers(statement,source,replacements){
    walk(statement,{
        enter(node){
            if(node.type === 'Identifier'){
                //如果此标识符在replacements有这个属性的话，说明需要重命名 
                if(replacements[node.name]){
                    //进行重写
                    source.overwrite(node.start,node.end,replacements[node.name]);
                }
            }
        }
    });
}
module.exports = {
      has,
      replaceIdentifiers
}