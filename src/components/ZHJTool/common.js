const CryptoJS = require("crypto-js"); //引用AES源码js
const commonObject = {
  //随机颜色，十六进制方法；方法一
  isIntegral: "cz",
  organization: "jb",
  // PIWEBREPOTRKEY/
  aesPrivateKey: "UElXRUJSRVBPVFJL",
  // jb  hd  qc
  getUserIdertify(currentType) {
    if (currentType) {
      switch (currentType) {
        case 1:
          this.organization = "jb";
          break;
        case 2:
          this.organization = "hd";
          break;
        case 3:
          this.organization = "qc";
          break;
        default:
          break;
      }
    }
    return this.organization;
  },
  // 是积分(jf)还是 成长值(cz)
  getOperationType(str) {
    if (str) {
      this.isIntegral = str;
    }
    return this.isIntegral;
  },
  // 深拷贝
  copyDeep(templateData) {
    // templateData 是要复制的数组或对象，这样的数组或者对象就是指向新的地址的
    return JSON.parse(JSON.stringify(templateData));
  },
  // 判断 是不是数组
  isArrayFn(o) {
    return Object.prototype.toString.call(o) === "[object Array]";
  },
  // 时间转换
  format(shijianchuo) {
    function add0(m) {
      return m < 10 ? "0" + m : m;
    }
    //shijianchuo是整数，否则要parseInt转换
    var time = new Date(shijianchuo);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return (
      y +
      "-" +
      add0(m) +
      "-" +
      add0(d) +
      " " +
      add0(h) +
      ":" +
      add0(mm) +
      ":" +
      add0(s)
    );
  },
  // 数组去重
  uniq(array) {
    var temp = []; //一个新的临时数组
    for (var i = 0; i < array.length; i++) {
      if (temp.indexOf(array[i]) == -1) {
        temp.push(array[i]);
      }
    }
    return temp;
  },
  // 正则表达式  判断是否为正整数
  checkRate(nubmer) {
      var res = /^[0-9]+[0-9]*]*$/;
      nubmer = Number(nubmer);
      return res.test(nubmer);
  },
  // 判断是否是数字
  checkisNumber(nubmer) {
    var re = /^[0-9]+.?[0-9]*$/;
    return re.test(nubmer);
  },
  // 字符串不包含表情
  isEmojiCharacter(substring) {
    for (var i = 0; i < substring.length; i++) {
      var hs = substring.charCodeAt(i);
      if (0xd800 <= hs && hs <= 0xdbff) {
        if (substring.length > 1) {
          var ls = substring.charCodeAt(i + 1);
          var uc = (hs - 0xd800) * 0x400 + (ls - 0xdc00) + 0x10000;
          if (0x1d000 <= uc && uc <= 0x1f77f) {
            return true;
          }
        }
      } else if (substring.length > 1) {
        var lss = substring.charCodeAt(i + 1);
        if (lss == 0x20e3) {
          return true;
        }
      } else {
        if (0x2100 <= hs && hs <= 0x27ff) {
          return true;
        } else if (0x2b05 <= hs && hs <= 0x2b07) {
          return true;
        } else if (0x2934 <= hs && hs <= 0x2935) {
          return true;
        } else if (0x3297 <= hs && hs <= 0x3299) {
          return true;
        } else if (
          hs == 0xa9 ||
          hs == 0xae ||
          hs == 0x303d ||
          hs == 0x3030 ||
          hs == 0x2b55 ||
          hs == 0x2b1c ||
          hs == 0x2b1b ||
          hs == 0x2b50
        ) {
          return true;
        }
      }
    }
  },
  /**
   * 数字转大写
   */
  toChinesNum(num) {
    let changeNum = [
      "零",
      "一",
      "二",
      "三",
      "四",
      "五",
      "六",
      "七",
      "八",
      "九"
    ];
    let unit = ["", "十", "百", "千", "万"];
    num = parseInt(num);
    let getWan = temp => {
      let strArr = temp
        .toString()
        .split("")
        .reverse();
      let newNum = "";
      for (var i = 0; i < strArr.length; i++) {
        newNum =
          (i == 0 && strArr[i] == 0
            ? ""
            : i > 0 && strArr[i] == 0 && strArr[i - 1] == 0
            ? ""
            : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i])) +
          newNum;
      }
      return newNum;
    };
    let overWan = Math.floor(num / 10000);
    let noWan = num % 10000;
    if (noWan.toString().length < 4) {
      noWan = "0" + noWan;
    }
    return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);
  },
  //阿拉伯数字转换为简写汉字
  Arabia_To_SimplifiedChinese(Num) {
    var i = 0;
    for (i = Num.length - 1; i >= 0; i--) {
      Num = Num.replace(",", ""); //替换Num中的“,”
      Num = Num.replace(" ", ""); //替换Num中的空格
    }
    if (isNaN(Num)) {
      //验证输入的字符是否为数字
      //alert("请检查小写金额是否正确");
      return;
    }
    //字符处理完毕后开始转换，采用前后两部分分别转换
    var part = String(Num).split(".");
    var newchar = "";
    //小数点前进行转化
    for (i = part[0].length - 1; i >= 0; i--) {
      if (part[0].length > 10) {
        //alert("位数过大，无法计算");
        return "";
      } //若数量超过拾亿单位，提示
      var tmpnewchar = "";
      var perchar = part[0].charAt(i);
      switch (perchar) {
        case "0":
          tmpnewchar = "零" + tmpnewchar;
          break;
        case "1":
          tmpnewchar = "一" + tmpnewchar;
          break;
        case "2":
          tmpnewchar = "二" + tmpnewchar;
          break;
        case "3":
          tmpnewchar = "三" + tmpnewchar;
          break;
        case "4":
          tmpnewchar = "四" + tmpnewchar;
          break;
        case "5":
          tmpnewchar = "五" + tmpnewchar;
          break;
        case "6":
          tmpnewchar = "六" + tmpnewchar;
          break;
        case "7":
          tmpnewchar = "七" + tmpnewchar;
          break;
        case "8":
          tmpnewchar = "八" + tmpnewchar;
          break;
        case "9":
          tmpnewchar = "九" + tmpnewchar;
          break;
      }
      switch (part[0].length - i - 1) {
        case 0:
          // tmpnewchar = tmpnewchar;
          break;
        case 1:
          if (perchar != 0) tmpnewchar = tmpnewchar + "十";
          break;
        case 2:
          if (perchar != 0) tmpnewchar = tmpnewchar + "百";
          break;
        case 3:
          if (perchar != 0) tmpnewchar = tmpnewchar + "千";
          break;
        case 4:
          tmpnewchar = tmpnewchar + "万";
          break;
        case 5:
          if (perchar != 0) tmpnewchar = tmpnewchar + "十";
          break;
        case 6:
          if (perchar != 0) tmpnewchar = tmpnewchar + "百";
          break;
        case 7:
          if (perchar != 0) tmpnewchar = tmpnewchar + "千";
          break;
        case 8:
          tmpnewchar = tmpnewchar + "亿";
          break;
        case 9:
          tmpnewchar = tmpnewchar + "十";
          break;
      }
      newchar = tmpnewchar + newchar;
    }
    //替换所有无用汉字，直到没有此类无用的数字为止
    while (
      newchar.search("零零") != -1 ||
      newchar.search("零亿") != -1 ||
      newchar.search("亿万") != -1 ||
      newchar.search("零万") != -1
    ) {
      newchar = newchar.replace("零亿", "亿");
      newchar = newchar.replace("亿万", "亿");
      newchar = newchar.replace("零万", "万");
      newchar = newchar.replace("零零", "零");
    }
    //替换以“一十”开头的，为“十”
    if (newchar.indexOf("一十") == 0) {
      newchar = newchar.substr(1);
    }
    //替换以“零”结尾的，为“”
    if (newchar.lastIndexOf("零") == newchar.length - 1) {
      newchar = newchar.substr(0, newchar.length - 1);
    }
    return newchar;
  },
  /**
   * AES 加密
   * @param encryptString 要加密的字符串
   * @returns {string} 加密后的字符串
   */
  aesEncrypt: function(encryptString) {
    var key = CryptoJS.enc.Utf8.parse(this.aesPrivateKey);
    var srcs = CryptoJS.enc.Utf8.parse(encryptString);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  },
  /**
   * AES 解密
   * @param decryptString 要解密的字符串
   * @returns {string} 解密后的字符串
   */
  aesDecrypt: function(decryptString) {
    var key = CryptoJS.enc.Utf8.parse(this.aesPrivateKey);
    var decrypt = CryptoJS.AES.decrypt(decryptString, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
  },
  /** 
   * 数组和并 并替换 相同kek的item
   * array: 数据源
   * list： 给数据源进行替换的数组
  */
 arrayItemReplaceSameItem(array,list,key){
  return array.map(
    item => {
      list.forEach(
        obj => {
          if (item[key] == obj[key]) {
            item = { ...item, ...obj };
          }
        }
      );
      return item;
    }
  );
 },
  /**
   * 搜索
   * @param searchText 要搜索的内容
   * @param searchKey  用于搜索字段 key
   * @param searchArr  用于搜索的数据源
   * @returns Obejct      返回搜索后的数组 与 key
   */

  remoteMethod: function(searchText, searchKey, searchArr) {
    // 当前状态
    var status = 0;
    // 重置搜索
    if (this.queryData) {
      status = 1;
    }

    console.log("搜索字段   " + searchText);
    console.log("当前tab      状态" + status);

    if (status == 0) {
      // localStorage.setItem('remoteMethod') = this.copyDeep(searchArr);
    } else if (status == 1) {
      searchArr = this.copyDeep(this.queryData);
    }

    var self = this;
    if (searchText && searchText != "") {
      var optionsArray = searchArr.filter(item => {
        item[searchKey] == searchText;
      });
      if (optionsArray.length > 0) {
        searchArr = optionsArray;
      } else {
        self.$Message.info("没有匹配的结果");
      }
    } else {
      searchArr = self.queryData;
      self.$Message.info("请输入搜索内容");
    }
  },
  dataForDataFor() {}
};

export default commonObject;
