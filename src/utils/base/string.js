/**
 * @description: 时间格式字符串 为适配iOS 替换 * => /
 * @param {*} str
 * @return {*} 2021/03/18
 * @example: '2021-03-21 05:34:42'.dateFormat('YYYY.DD.MM')
 * @author: zhj1214
 */
 String.prototype.dateFormat = function (format) {
  if (!this.toString().includes('-')) return this.toString()
  const timeStr = this.toString().replace(/-/g, '/')
  if (format) return new Date(timeStr).Format(format)
  else return timeStr
}

/** 删除指定索引位置的字符，索引无效将不删除任何字符 **/
String.prototype.deleteCharAt = function (index) {
  if (index < 0 || index >= this.length) {
    return this.valueOf()
  } else if (index == 0) {
    return this.substring(1, this.length)
  } else if (index == this.length - 1) {
    return this.substring(0, this.length - 1)
  } else {
    return this.substring(0, index) + this.substring(index + 1)
  }
}
/**
 *  删除指定 索引 区间的字符串
 * var tt = '2019-07-31 11:07:22'；console.log(tt.deleteString(1, 2))
 * */

String.prototype.deleteString = function (start, end) {
  if (start == end) {
    return this.deleteCharAt(start)
  } else {
    if (start > end) {
      var temp = start
      start = end
      end = temp
    }

    if (start < 0) {
      start = 0
    }

    if (end > this.length - 1) {
      end = this.length - 1
    }

    return this.substring(0, start) + this.substring(end + 1, this.length)
  }
}