/*
 * @Description:
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-03-12 15:34:40
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-03-15 16:39:26
 */
// src/utils/http.js

import axios from "axios";
import md5 from "md5";
// import { Notice, Message } from "view-design";
// const getBaseUrl = (env) => {
//     let base = {
//         production: "/",
//         development: "https://www.baidu.com",
//         test: "http://localhost:3001",
//     }[env];
//     if (!base) {
//         base = "/";
//     }
//     return base;
// };
class NewAxios {
  constructor() {
    // this.baseURL = getBaseUrl(process.env.NODE_ENV);
    this.axiosManage = axios.create();
    this.timeout = 60000;
    this.withCredentials = true;
    // 初始化拦截器
    this.axiosManage && this.setInterceptors(this.axiosManage);
  }
  /**
   * @description: 劫持请求header/reponse
   * @param {*} instance 请求类实例对象
   * @param {*} url      请求地址
   */
  setInterceptors = instance => {
    instance.interceptors.request.use(
      req => {
        //增加一层请求头的加密，防止被恶意获取数据
        let req_data = "";
        try {
          req_data = JSON.stringify(Object.assign({}, req.data || {}));
        } catch (e) {
          req_data = "";
        }
        req.headers["Designed-By-Sl"] =
          md5(req_data).substring(0, 16) + md5("shuli").substring(16, 32);
        // 在这里添加loading
        // 配置token
        req.headers.token = localStorage.getItem("token") || "";
        req.headers.orgId = localStorage.getItem("orgId") || "";
        req.headers.uid = localStorage.getItem("userId") || "";
        return req;
      },
      err => Promise.reject(err)
    );

    instance.interceptors.response.use(
      response => {
        // 在这里移除loading
        // todo: 想根据业务需要，对响应结果预先处理的，都放在这里
        return response;
      },
      err => {
        if (err.response) {
          // 响应错误码处理
          switch (err.response.status) {
            case "403":
              // todo: handler server forbidden error
              break;
            // todo: handler other status code
            default:
              break;
          }
          return Promise.reject(err.response);
        }
        if (!window.navigator.online) {
          // 断网处理
          // todo: jump to offline page
          return -1;
        }
        return Promise.reject(err);
      }
    );
  };

  /**
   * 初始化场景
   * @return { Object } 当前场景单利
   * */
  getRequestManage() {
    if (this.axiosManage) return this.axiosManage;
    // 创建axios实例
    this.axiosManage = axios.create();
    // 配置拦截器
    this.setInterceptors(this.axiosManage);
  }

  async get(url, data = {}, msg = "接口异常", headers = {}) {
    return this.axiosManage
      .get(url, { params: data, headers: { ...headers } })
      .then(res => {
        let iRes = res && res.config ? res.data : res;
        if ((iRes && iRes.code === 10000) || iRes.code === "10000") {
          return Promise.resolve(iRes || {});
        } else if (iRes.code === 20004) {
          location.href = "/login?type=timeout";
          return Promise.reject(iRes || {});
        } else {
          // Notice.error({
          //     title: "提示",
          //     desc: iRes.message || "接口异常，请联系管理员！",
          // });
          return Promise.resolve(iRes || {});
        }
      })
      .catch(err => {
        console.info(err.message || msg);
      });
  }
  async post(url, data = {}, msg = "接口异常", headers = {}) {
    return this.axiosManage
      .post(url, data, { headers })
      .then(res => {
        let iRes = res && res.config ? res.data : res;
        if ((iRes && iRes.code === 10000) || iRes.code === "10000") {
          return Promise.resolve(iRes);
        } else if (iRes.code === 20004) {
          // Message.warning({
          //     content: iRes.message || "token失效，请重新登录！",
          //     duration: 2,
          //     onClose: () => {
          //         location.href = "/login.html";
          //     },
          // });
          return Promise.reject(iRes);
        } else {
          // Notice.error({
          //     title: "提示",
          //     desc: iRes.message || "接口异常，请联系管理员！",
          // });
          return Promise.resolve(iRes);
        }
      })
      .catch(err => {
        console.info(err.message || msg);
      });
  }
}

export default new NewAxios();
