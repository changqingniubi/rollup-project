/*
 * @Description: 
 * @Author: changqing
 * @Date: 2021-04-20 22:47:15
 * @LastEditTime: 2021-07-06 14:31:27
 * @LastEditors: changqing
 * @Usage: 
 */
import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import {terser} from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
export default {
    input:'./src/index.js',//入口文件
    output:{
        file:'./dist/rollup_bundle.js',//打包后的存放文件
        format:'iife',//输出格式 amd es6 iife umd cjs
        name:'bundleName',//如果iife,umd需要指定一个全局变量
        //sourcemap:true,
        globals:{
            lodash:'_', //告诉rollup全局变量_即是lodash
            jquery:'$' //告诉rollup全局变量$即是jquery
        }
    },
    plugins:[
        babel({
          exclude:"node_modules/**"
        }),
        resolve(),
        commonjs(),
        typescript(),
        //terser(),
        postcss()
    ],
    external:['lodash','jquery']

}