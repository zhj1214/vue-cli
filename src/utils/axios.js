/*
 * @Description:
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-03-18 21:51:18
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-03-19 00:01:18
 */

// import md5 from "md5";
// import { Notice, Message } from "view-design";

const getBaseUrl = (env) => {
  let base = {
    production: "https://crm.cntpy.com",
    development: "https://htmostest.data4truth.com",
    pord: "https://crmuat.cntpy.com", // 预发布
  }[env];

  if (!base) {
    base = "https://htmostest.data4truth.com";
  }
  return base;
};

class NewAxios {
  /**
   * @description: 构造函数
   * @author: zhj1214
   */

  constructor() {
    console.log("process.env.NODE_ENV___________", process.env.NODE_ENV);
    this.baseURL = getBaseUrl(process.env.NODE_ENV);
    this.timeout = 60000;
    this.one_t = getApp();
  }

  /**
   * @description: 配置请求头
   */
  setInterceptors = () => {
    let headerApp = getApp();
    return {
      rootOrgId:
        uni.$localStorage.getItem("rootOrgId") ||
        (headerApp.globalData ? headerApp.globalData.rootOrgId || "" : ""),
      orgId:
        uni.$localStorage.getItem("orgId") ||
        (headerApp.globalData ? headerApp.globalData.orgId || "" : ""),
      mToken: uni.$localStorage.getItem("Token") || "",
      uid: uni.$localStorage.getItem("memberId") || "1", // uid就是memberId
      "content-type": "application/json",
    };
  };

  /**
   * @description api请求封装
   * */
  request = (url, resolve, reject, data = {}, method, loading) => {
    if (!this.one_t) this.one_t = getApp();
    uni.request({
      url: this.baseURL + url,
      timeout: 120000,
      method: method,
      data: data,
      header: this.setInterceptors(),
      success: (res) => {
        const code = res.data.code;
        const msg = res.data.message || "";
        if (code == 10000 || code == 3003) {
          resolve(res.data);
        } else if (res.data.code == 50005) {
          uni.navigateTo({
            url: "/pages/index/switchMall/switchMall?showalert=1",
          });
        } else if (res.data.code == 30001) {
          this.reportErrlog(url, data, res.data);
          uni.reLaunch({
            url: "/pages/login/login",
          });
        } else if (res.data.code == 90000) {
          this.reportErrlog(url, data, res.data);
          this.show_error(msg || "服务异常，请重试");
        } else {
          this.reportErrlog(url, data, res.data);
          if (msg) this.show_error(msg);
          resolve(res.data);
        }
      },
      fail: (err) => {
        this.reportErrlog(url, data, "请求 TCP 建立失败");
        reject(err);
      },
      complete: (res) => {
        if (res.statusCode != 200) {
          console.error(res, "____error");
          this.show_error("当前页面访问人数过多，请稍后再试");
        }
      },
    });
  };

  /**
   * 云函数
   * */
  cloud = (apis, data, loadingText) => {
    return new Promise((resolve, reject) => {
      uni.$uniCloud.callFunction({
        name: apis[0],
        data: {
          ...data,
          ...{
            api: apis[1],
          },
        },
        success: (res) => {
          const code = res.result.code;
          const msg = res.result.msg;
          if (code == 10000 || code == 20000) {
            resolve(res.result);
          } else {
            resolve(res.data);
          }
        },
        fail: (err) => {
          reject(err);
        },
      });
    });
  };

  /**
   * 错误日志上报
   * */
  reportErrlog = (url, data, result) => {
    let userObj = uni.$localStorage.getCurrentUser() || {};
    this.one_t = getApp();
    if (!userObj.phone || !this.one_t.globalData.isEnableCloud) return;
    uni.$api.cloudRequest("cctvApi", {
      memberId: userObj.memberId,
      nickName: userObj.nickName,
      phone: userObj.phone,
      url: url,
      apiParam: data,
      apiResult: result,
    });
  };

  show_error = (msg) => {
    setTimeout(
      () => {
        uni.showToast({
          title: msg || "",
          icon: "none",
          duration: 3000,
          success: () => {
            setTimeout(() => {
              uni.hideLoading();
            }, 3000);
          },
        });
      },
      requestCount != 0 ? 300 : 0
    );
  };
}

export default new NewAxios();
