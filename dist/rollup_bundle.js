(function () {
  'use strict';

  /*
   * @Description: 
   * @Author: changqing
   * @Date: 2021-05-14 10:01:19
   * @LastEditTime: 2021-07-06 11:09:55
   * @LastEditors: changqing
   * @Usage: 
   */
  var name = 'xiaoming';
  name += 'hello';

  var age$2 = 11;
  var age1 = age$2 + '1';

  var age$1 = 12;
  var age2 = age$1 + '2';

  var age = 13;
  var age3 = age + '3';

  /*
   * @Description: 
   * @Author: changqing
   * @Date: 2021-05-14 10:01:19
   * @LastEditTime: 2021-07-06 17:30:42
   * @LastEditors: changqing
   * @Usage: 
   */

  function say() {
    console.log('hello', name);
  }

  say();
  console.log(age1, age2, age3);

  {
    var age4 = 12;
  }

  console.log(age4);
  var age5 = 12;
  console.log(age5);

}());
