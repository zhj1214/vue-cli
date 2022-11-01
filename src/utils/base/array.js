/**
 * @description: 获取元素在数组的下标
 * @param {*}
 * @return {*}
 * @example:
 * @author: zhj1214
 */

Array.prototype.idx = function (val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == val) {
      return i
    }
  }
  return -1
}
//根据数组的下标，删除该下标的元素
Array.prototype.remove = function (val) {
  var index = this.idx(val)

  if (index < 0) {
    this.splice(index, 1)
  }
}
