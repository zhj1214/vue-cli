// import string from "./base/string";
/**
 * 小程序重启（更新情况）
 */

const reboot = function () {
  const updateManager = uni.getUpdateManager();
  updateManager.applyUpdate();
};
/**
 * @description 公共方法定义文件，需要使用时可以在js文件中按需引入
 */

const formatTime = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return (
    [year, month, day].map(formatNumber).join("/") +
    " " +
    [hour, minute, second].map(formatNumber).join(":")
  );
};

const formatNumber = (n) => {
  n = n.toString();
  return n[1] ? n : "0" + n;
};
/**
 * 深拷贝
 * 例子： wx.$util.mutableCopy({k:'zhj'})
 */

const mutableCopy = function (templateData) {
  let a = {};
  a = JSON.parse(JSON.stringify(templateData));
  return a;
};
/**
 * 官方提供的 版本号对比方法
 * 例子： compareVersion('1.11.0', '1.9.9') // 1
 */

const compareVersion = function compareVersion(v1, v2) {
  v1 = v1.split(".");
  v2 = v2.split(".");
  const len = Math.max(v1.length, v2.length);

  while (v1.length < len) {
    v1.push("0");
  }

  while (v2.length < len) {
    v2.push("0");
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i]);
    const num2 = parseInt(v2[i]);

    if (num1 > num2) {
      return 1;
    } else if (num1 < num2) {
      return -1;
    }
  }

  return 0;
};
// 获取元素在数组的下标
// Array.prototype.indexOf = function (val) {
//   for (var i = 0; i < this.length; i++) {
//     if (this[i] == val) {
//       return i;
//     }
//   }
//   return -1;
// };
// //根据数组的下标，删除该下标的元素
// Array.prototype.remove = function (val) {
//   var index = this.indexOf(val);

//   if (index < 0) {
//     this.splice(index, 1);
//   }
// };
/**
 * @description 判断一个变量是否是数组;
 *  -1 value是数组
 *  1 value是对象
 *  0 value不是数组也不是对象
 * */

const isObjArr = function (val) {
  if (Object.prototype.toString.call(val) === "[object Array]") {
    return -1;
  } else if (Object.prototype.toString.call(val) === "[object Object]") {
    return 1;
  } else {
    return 0;
  }
};
/**
 * @description 对象去重
 * @param var x ={a:'2'}
 * @param var b ={a:'1'}
 * @example this.$Util.objectEquals(x, y) // false
 */

const objectEquals = function (x, y) {
  let f1 = x instanceof Object;
  let f2 = y instanceof Object;

  if (!f1 || !f2) {
    return x === y;
  }

  if (Object.keys(x).length !== Object.keys(y).length) {
    return false;
  }

  let newX = Object.keys(x);

  for (let p in newX) {
    p = newX[p];
    let a = x[p] instanceof Object;
    let b = y[p] instanceof Object;

    if (a && b) {
      let equal = objectEquals(x[p], y[p]);

      if (!equal) {
        return equal;
      }
    } else if (x[p] !== y[p]) {
      return false;
    }
  }

  return true;
};
/**
 * @description 数组去重
 * @param var arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{},{a:'1',b:undefined,c:1,d:false,e:[{a:1,B:'1'}]},{a:'1',b:undefined,c:1,d:false,e:[{a:1,B:'1'}]}];
 * @example console.log(this.$Util.arrayUnique(arr));
 */

/*eslint no-extend-native: ["error", { "exceptions": ["Array,Date"] }]*/

const arrayUnique = function (arr) {
  function unique(x, y) {
    if (isObjArr(x) === -1) {
      let f = false;
      x.forEach((item) => {
        objectEquals(item, y) ? (f = true) : false;
      });

      if (f) {
        return x;
      } else {
        let xx = x;
        let yy = isObjArr(y) === -1 ? y : [y];
        return [...xx, ...yy];
      }
    } else {
      if (objectEquals(x, y)) {
        return isObjArr(x) === -1 ? x : [x];
      } else {
        let xx = isObjArr(x) === -1 ? x : [x];
        let yy = isObjArr(y) === -1 ? y : [y];
        return [...xx, ...yy];
      }
    }
  }

  let a = [...new Set(arr)];
  let c = [];
  let b = a.filter((item) => {
    if (typeof item !== "object") {
      c.push(item);
    }

    return item ? typeof item === "object" : false;
  });
  let d = undefined;

  if (b.length > 0) {
    b.reduce(unique);
  }

  return !c ? d : !d ? c : [...c, ...d];
};

/**
 * @description 千分位
 */
const numberFormat = function numberFormat(num) {
  let reg = /\d{1,3}(?=(\d{3})+$)/g;
  return (num + "").replace(reg, "$&,");
};
/**
 * 校验手机号
 * @description https://github.com/VincentSit/ChinaMobilePhoneNumberRegex/blob/master/README-CN.md
 */

const validatePhone = function (num) {
  return /^1[3456789]\d{9}$/.test(num);
};
/**
 * 小程序禁用
 * */

const appletDisable = function () {
  uni.reLaunch({
    url: "/pages/agreement/appletDisable",
    success: () => {
      uni.$alert.showToast("小程序已被禁用");
    },
  });
};

/**
 * 必填字段 校验
 * */
const requiredInfo = function () {
  if (!uni.$localStorage.getItem("Token")) return;
  uni.$api
    .apiRequest("userRegistKey", {
      orgId: uni.$localStorage.getItem("userOrgId"),
      memberId: uni.$localStorage.getItem("memberId"),
    })
    .then((res) => {
      if (res.code === 10000 && res.data) {
        let isRequired = true;
        res.data.forEach((item) => {
          if (
            item.requiredFields === 1 &&
            item.value !== 0 &&
            (item.value === undefined || item.value === "")
          ) {
            console.log(item);
            isRequired = false;
          }
        });

        if (!isRequired) {
          uni.navigateTo({
            url: "/pages/login/registered/registerednew?isExchangeCoupon=1",
            success: () => {
              console.log("请先完善必填信息");
              uni.$alert.showToast("请先完善必填信息");
            },
          });
        }
      }
    });
};

/**
 * 获取省市区
 * @description
 */
const getAreaData = function (response) {
  uni.$api
    .apiRequest("getlocaltionSever", {
      isContainForeign: -1,
    })
    .then((res) => {
      if (res.code === 10000 && res.data) {
        response({
          province_list: res.data.provinceList,
          city_list: res.data.cityList,
          county_list: res.data.countyList,
        });
      }
    });
};
/**
 * @description 获取用户信息
 */

const getMemberInfo = function () {
  return new Promise((resolve) => {
    if (uni.$localStorage.getItem("Token")) {
      uni.$api.apiRequest("getHomeMemberInfo").then((res) => {
        if (res.code === 10000 && res.data) {
          // 更新本地用户信息
          uni.$localStorage.setCurrentUser(res.data);
          resolve(res.data);
        } else if (uni.$localStorage.getCurrentUser()) {
          resolve(uni.$localStorage.getCurrentUser());
        }
      });
    } else {
      resolve();
    }
  });
};

/**
 * 用户点亮
 * 场景
 */
const currentClockin = function () {
  const app = getApp().globalData;
  if (uni.$localStorage.getItem("memberId") && !app.isCurrentClockin)
    uni.$api.apiRequest("channelUpdate", {
      organizationId: uni.$localStorage.getItem("orgId"),
      id: uni.$localStorage.getItem("memberId"),
      registrationSource:
        app.registrationSource ||
        uni.$localStorage.getItem("currentMall").marketName,
      registrationOrg: uni.$localStorage.getItem("orgId"),
    });
};

/**
 * @description 广告位跳转
 */
const adJumpUrl = (linkAddress) => {
  let arr = linkAddress.split("appleht");
  if (linkAddress.indexOf("http") !== -1) {
    uni.navigateTo({
      url: "/pagesA/out/out?src=" + linkAddress,
    });
  } else if (arr.length === 2) {
    if (
      arr[1] === "/pages/all-goods/all-goods" ||
      arr[1] === "/pages/index/index" ||
      arr[1] === "/pages/cart/cart" ||
      arr[1] === "/pages/my/myPage"
    ) {
      uni.switchTab({
        url: arr[1],
      });
    } else {
      uni.navigateTo({
        url: arr[1],
      });
    }
  }
};

/**
 * @description 微信支付
 */

const weChatPay = function (param) {
  uni.requestPayment({
    timeStamp: param.timeStamp,
    nonceStr: param.nonceStr,
    package: param.packageInfo,
    signType: param.signType,
    paySign: param.paySign,
    success() {
      // 埋点 传入埋点类型  商品ids  页面路径 ADD_SHOPCART GOODS_EXCHANGE
      // const app = getApp().globalData;
      // uni.$sampling.sampling('GOODS_EXCHANGE', param.goodsIds, param.route);
      // uni.navigateTo({
      // 	url: '/pages/payment/pay-success/pay-success?payMoney=' + param.payMoney
      // });
      uni.reLaunch({
        url: "./settlementSuccess?isok=1",
      });
    },

    fail(err) {
      console.log(err);
      uni.reLaunch({
        url: "./settlementSuccess",
      });
    },
  });
};
/**
 * 保留两位小数
 * param： 数值
 * isRounding 是否四舍五入
 * RegExp 中 \ => \\
 * */

const decimalTwo = function (param, isRounding = false, digit = 2) {
  if (isRounding) {
    if (typeof param === "string") {
      param = Number(param);
    }

    return param.toFixed(digit);
  } else {
    let re = new RegExp("^\\d+(?:\\.\\d{0," + digit + "})?");

    if (typeof param === "number") {
      param = param.toString();
    }

    return Number(param.match(re));
  }
};
/**
 * 清楚本地缓存
 * 只保留openid 和orgid
 * */

const clearLocal = function () {
  let loacl = {
    orgId: uni.$localStorage.getItem("orgId"),
    appletId: uni.$localStorage.getItem("appletId"),
    userOrgId: uni.$localStorage.getItem("userOrgId"),
    userOpenId: uni.$localStorage.getItem("userOpenId"),
    myAuthority: uni.$localStorage.getItem("myAuthority"),
    ENV_CURRENT: uni.$localStorage.getItem("ENV_CURRENT"),
  };
  return new Promise((resolve) => {
    // console.log(loacl, "————清楚缓存之前");
    let keys = Object.keys(loacl);
    uni.clearStorage({
      success: () => {
        keys.forEach((item) => {
          if (loacl[item]) {
            uni.$localStorage.setItem(item, loacl[item]);
          }
        });
        resolve();
        // console.log("clearLocal———— 清楚缓存");
      },
    });
  });
};

/**
 * 当前系统是不是iOS
 * */
const getCurrentSystemiOS = function () {
  const app = getApp();
  return app.globalData.iphoneInfo.platform === "ios";
};
/**
 * 图片旋转
 * @param angle 角度
 * */
const pictureRotation = function (angle) {
  let animation = uni.createAnimation({
    duration: 1,
    timingFunction: "linear",
    // "linear","ease","ease-in","ease-in-out","ease-out","step-start","step-end"
    delay: 1,
    transformOrigin: "50% 50% 0",
  });
  animation.rotate(180 * angle).step();
  return animation;
}; //测试数据
// var insertAttaList = ['abs', 'dsf', , 'abc', 'sdf', 'fd'];
// insertAttaList.remove('abc');

/**
 * 后台获取的城市数据进行转换
 * 转换成可用的城市数据
 * */
const serveToCityData = function (area) {
  let ssqList = [];
  // 处理省份
  for (let k in area.province_list) {
    ssqList.push({
      value: k,
      label: area.province_list[k],
      children: [],
    });
  }
  // 处理城市
  ssqList.forEach((sf, index) => {
    let csList = [];
    if (index + 1 <= ssqList.length) {
      let sf_next;
      if (index + 1 < ssqList.length) {
        sf_next = ssqList[index + 1];
      }
      for (let k in area.city_list) {
        if (k >= sf.value && k <= (sf_next ? sf_next.value : k + 10000)) {
          csList.push({
            value: k,
            label: area.city_list[k],
            children: [],
          });
        }
      }
    }
    sf.children = csList;
  });
  // 处理地区
  ssqList.forEach((sf, sf_index) => {
    let cs_list = sf.children;
    let sf_next;
    if (sf_index + 1 < ssqList.length) {
      sf_next = ssqList[sf_index + 1];
    }
    cs_list.forEach((cs, cs_index) => {
      let dqList = [];
      if (cs_index + 1 <= cs_list.length) {
        let cs_next;
        if (cs_index + 1 < cs_list.length) {
          cs_next = cs_list[cs_index + 1];
        }
        for (let k in area.county_list) {
          if (
            k >= cs.value &&
            k < (cs_next ? cs_next.value : sf_next ? sf_next.value : k + 10000)
          ) {
            dqList.push({
              value: k,
              label: area.county_list[k],
            });
          }
        }
      }
      cs.children = dqList;
    });
  });
  // console.error(JSON.stringify(ssqList))
  return ssqList;
};

/**
 * 创建单利
 * */
// function Proxy(func) {
//   let instance;
//   let handler = {
//     construct(target, args) {
//       if (!instance) {
//         instance = Reflect.construct(func, args);
//       }
//       return instance;
//     },
//   };
//   return new Proxy(func, handler);
// }

/**
 * 优雅的处理 async/await
 * let [err,res] = await errorCaptured(asyncFunc)
 * */
// async function errorCaptured(asyncFunc) {
//   try {
//     let res = await asyncFunc();
//     return [null, res];
//   } catch (e) {
//     return [e, null];
//   }
// }

/**
 * @description 函数防抖
 * @param {Function} func -需要函数防抖的函数
 * @param {Number} time -延迟时间
 * @param {Options} options -配置项
 * @return {Function} -经过防抖处理的函数
 * 配置项
 * @typedef {Object} Options -配置项
 * @property {Boolean} leading -开始是否需要额外触发一次
 * @property {Boolean} trailing -结束后是否需要额外触发一次
 * @property {this} context -上下文
 **/

const debounce = (
  func,
  time = 17,
  options = {
    leading: true,
    context: null,
  }
) => {
  let timer;
  const _debounce = function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    if (options.leading && !timer) {
      timer = setTimeout(null, time);
      func.apply(options.context, args);
    } else {
      timer = setTimeout(() => {
        func.apply(options.context, args);
        timer = null;
      }, time);
    }
  };
  /**
   * @description 取消函数
   * @see https://juejin.im/post/5931561fa22b9d0058c5b87d
   **/
  _debounce.cancel = function () {
    clearTimeout(timer);
    timer = null;
  };
  return _debounce;
};

/**参数说明：
 * 根据长度截取先使用字符串，超长部分追加…
 * str 对象字符串
 * len 目标字节长度
 * 返回值： 处理结果字符串
 */
const cutString = function (str, len) {
  //length属性读出来的汉字长度为1
  if (str.length * 2 <= len) {
    return str;
  }
  let strlen = 0;
  let s = "";
  for (let i = 0; i < str.length; i++) {
    s = s + str.charAt(i);
    if (str.charCodeAt(i) > 128) {
      strlen = strlen + 2;
      if (strlen >= len) {
        return s.substring(0, s.length - 1) + "...";
      }
    } else {
      strlen = strlen + 1;
      if (strlen >= len) {
        return s.substring(0, s.length - 2) + "...";
      }
    }
  }
  return s;
};

/**
 *  @description url 参数解析
 */
const getUrlParams = function (names, urlSearch = location.href) {
  let URL = require("url");
  let urlFormat = require("querystring");
  let urlParam = URL.parse(urlSearch);
  let urlObj = urlFormat.parse(urlParam.query);
  if (!urlObj[names]) {
    let hashObj = urlFormat.parse(urlParam.hash);
    for (let idx in Object.keys(hashObj)) {
      let key = Object.keys(hashObj)[idx];
      if (typeof key === "string") {
        if (key.indexOf("?") !== -1) {
          if (key.split("?")[1] === names) {
            return hashObj[key];
          }
        }
      }
    }
    return hashObj[names];
  }
  return urlObj[names];
};

/**
 * @description 手机号加密
 */
const phoneEncryption = function (phone) {
  return phone.replace(/(\d{3})\d*(\d{4})/, "$1****$2");
};

/**
 * @description 根据身份证号获取 生日
 */
const getBirthdayFromIdCard = function (idCard) {
  let birthday = "";
  if (idCard !== null && idCard !== "") {
    if (idCard.length === 15) {
      birthday = "19" + idCard.substr(6, 6);
    } else if (idCard.length === 18) {
      birthday = idCard.substr(6, 8);
    }
    birthday = birthday.replace(/(.{4})(.{2})/, "$1-$2-");
  }
  return birthday;
};
/**
 * @description 根据身份证号获取 性别
 */
const getSexFromIdCard = function (idCard) {
  if (idCard !== undefined && idCard !== "") {
    let sexIndex = idCard.substr(idCard.length - 2, 1);
    if (Number(sexIndex) % 2 === 0) {
      return "女";
    } else {
      return "男";
    }
  }
};
/**
 * @description 根据 生日 获取 年龄
 */
const getAgeFromBirthday = function (val) {
  if (val === null || val === "" || val === undefined) {
    return "";
  }
  const cDate = new Date(val);
  return new Date().getFullYear() - parseInt(cDate.getFullYear()) + "";
};

/**
 * @description 时间戳转时间
 * @param format 时间格式
 * @param date   时间戳 默认当前时间
 * @example (new Date()).Format("YYYY-MM-DD HH:mm:ss.S")
 * */
const getTimeFormat = function (format, date) {
  let time = date || new Date();
  return time.Format(format);
};

/**
 * 下载文件-h5
 * @param {fileName: string, fileLink: string} 
 */
const downLoadFile = ({ fileName, fileUrl } = {}) => {
  const downloadEl = document.createElement('a')
  downloadEl.download = fileName
  downloadEl.href = fileUrl
  document.body.appendChild(downloadEl)
  downloadEl.click()
  downloadEl.remove()
}

/**
 * 是否是图片链接
 * @param {string} imgUrl 
 * @returns 
 */
const isImgUrl = (imgUrl) => {
  const imgArr = ['png', 'jpg', 'jpeg', 'gif']
  return imgArr.includes(imgUrl.slice(imgUrl.lastIndexOf('.') + 1).toLowerCase())
};

/**
 * 是否是身份证
 * @param {*} params 
 * @returns 
 */
const isIDCard = (params) => {
  return /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/.test(params)
};


module.exports = {
  currentClockin: currentClockin,
  getTimeFormat: getTimeFormat,
  getAgeFromBirthday: getAgeFromBirthday,
  getSexFromIdCard: getSexFromIdCard,
  getBirthdayFromIdCard: getBirthdayFromIdCard,
  phoneEncryption: phoneEncryption,
  adJumpUrl: adJumpUrl,
  getUrlParams: getUrlParams,
  cutString: cutString,
  debounce: debounce,
  formatTime: formatTime,
  mutableCopy: mutableCopy,
  compareVersion: compareVersion,
  numberFormat: numberFormat,
  log: console.log.bind(console),
  validatePhone: validatePhone,
  weChatPay: weChatPay,
  decimalTwo: decimalTwo,
  getMemberInfo: getMemberInfo,
  getAreaData: getAreaData,
  requiredInfo: requiredInfo,
  appletDisable: appletDisable,
  clearLocal: clearLocal,
  getCurrentSystemiOS: getCurrentSystemiOS,
  arrayUnique: arrayUnique,
  pictureRotation: pictureRotation,
  reboot: reboot,
  serveToCityData: serveToCityData,
  downLoadFile,
  isImgUrl,
  isIDCard
};
