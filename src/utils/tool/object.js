/*
 * @Description: 关于对象的方法
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-08-10 11:42:45
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-09-04 09:52:25
 */
export default {
  /**
   * @description 对象去重
   * @param var x ={a:'2'}
   * @param var b ={a:'1'}
   * @example this.$Util.objectEquals(x, y) // false
   */
  objectEquals(x, y) {
    var f1 = x instanceof Object
    var f2 = y instanceof Object
    if (!f1 || !f2) {
      return x === y
    }
    if (Object.keys(x).length !== Object.keys(y).length) {
      return false
    }
    var newX = Object.keys(x)
    for (var p in newX) {
      p = newX[p]
      var a = x[p] instanceof Object
      var b = y[p] instanceof Object
      if (a && b) {
        const equal = objectEquals(x[p], y[p])
        if (!equal) {
          return equal
        }
      } else if (x[p] != y[p]) {
        return false
      }
    }
    return true
  },

  /**
   * @description 数组去重
   * @param var arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{},{a:'1',b:undefined,c:1,d:false,e:[{a:1,B:'1'}]},{a:'1',b:undefined,c:1,d:false,e:[{a:1,B:'1'}]}];
   * @example console.log(this.$Util.arrayUnique(arr));
   */
  /*eslint no-extend-native: ["error", { "exceptions": ["Array,Date"] }]*/
  arrayUnique(arr) {
    function unique(x, y) {
      if (isObjArr(x) == -1) {
        let f = false
        x.forEach((item) => {
          objectEquals(item, y) ? (f = true) : false
        })
        if (f) {
          return x
        } else {
          const xx = x
          const yy = isObjArr(y) == -1 ? y : [y]
          return [...xx, ...yy]
        }
      } else {
        if (objectEquals(x, y)) {
          return isObjArr(x) == -1 ? x : [x]
        } else {
          const xx = isObjArr(x) == -1 ? x : [x]
          const yy = isObjArr(y) == -1 ? y : [y]
          return [...xx, ...yy]
        }
      }
    }

    var a = [...new Set(arr)]
    var c = []
    var b = a.filter((item) => {
      if (typeof item !== 'object') {
        c.push(item)
      }
      return item ? typeof item === 'object' : false
    })
    var d = b.reduce(unique)
    return !c ? d : !d ? c : [...c, ...d]
  },

  /**
   * @description 深拷贝 templateData 是要复制的数组或对象，这样的数组或者对象就是指向新的地址的
   */
  copyDeep(templateData) {
    return JSON.parse(JSON.stringify(templateData))
  },
  /**
   * @description 判断一个变量是否是数组;
   *  -1 value是数组
   *  1 value是对象
   *  0 value不是数组也不是对象
   * */
  isObjArr(value) {
    if (Object.prototype.toString.call(value) === '[object Array]') {
      return -1
    } else if (Object.prototype.toString.call(value) === '[object Object]') {
      return 1
    } else {
      return 0
    }
  },
}
