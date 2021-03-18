/** 删除指定索引位置的字符，索引无效将不删除任何字符 **/
String.prototype.deleteCharAt = function (index) {
  if (index < 0 || index >= this.length) {
    return this.valueOf();
  } else if (index == 0) {
    return this.substring(1, this.length);
  } else if (index == this.length - 1) {
    return this.substring(0, this.length - 1);
  } else {
    return this.substring(0, index) + this.substring(index + 1);
  }
};
/**
 *  删除指定 索引 区间的字符串 
 * var tt = '2019-07-31 11:07:22'；console.log(tt.deleteString(1, 2))
 * */


String.prototype.deleteString = function (start, end) {
  if (start == end) {
    return this.deleteCharAt(start);
  } else {
    if (start > end) {
      var temp = start;
      start = end;
      end = temp;
    }

    if (start < 0) {
      start = 0;
    }

    if (end > this.length - 1) {
      end = this.length - 1;
    }

    return this.substring(0, start) + this.substring(end + 1, this.length);
  }
};

/**
 * 时间转换
 * 例子： var rr = new Date(1561914309000)
 *  console.log(rr.Format('YYYY-MM-DD HH:mm:ss'))
 */


// Date.prototype.Format = function (format) {
//   function add0(m) {
//     return m < 10 ? "0" + m : m;
//   }

//   var o = {
//     "Y+": this.getFullYear(),
//     "M+": add0(this.getMonth() + 1),
//     //月份           
//     "D+": add0(this.getDate()),
//     //日           
//     "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12,
//     //小时           
//     "H+": this.getHours(),
//     //小时           
//     "m+": this.getMinutes(),
//     //分           
//     "s+": this.getSeconds(),
//     //秒           
//     "q+": Math.floor((this.getMonth() + 3) / 3),
//     //季度           
//     "S": this.getMilliseconds() //毫秒           

//   };
//   var week = {
//     "0": "\u65e5",
//     "1": "\u4e00",
//     "2": "\u4e8c",
//     "3": "\u4e09",
//     "4": "\u56db",
//     "5": "\u4e94",
//     "6": "\u516d"
//   };

//   if (/(y+)/.test(format)) {
//     format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
//   }

//   if (/(E+)/.test(format)) {
//     format = format.replace(RegExp.$1, (RegExp.$1.length > 1 ? RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468" : "") + week[this.getDay() + ""]);
//   }

//   for (var k in o) {
//     if (new RegExp("(" + k + ")").test(format)) {
//       format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
//     }
//   }

//   return format;
// };