/*
 * @Description:
 * @Author: sam.xutao
 * @Date: 2020-02-20 11:00:58
 * @LastEditTime: 2021-02-04 16:57:52
 * @LastEditors: zhj1214
 */
/***********************
 * @name JS
 * @author Jo.gel
 * @date 2019/3/20 0020
 ***********************/
import axios from "axios";
import { Notice, Message } from "view-design";
import md5 from "js-md5";

const axiosIns = axios.create({});
axios.defaults.timeout = 600000;
// req 拦截器
axiosIns.interceptors.request.use(
  req => {
    if (!req.url) {
      console.info("请检查，url为空：" + req.url);
    }
    //增加一层请求头的加密，防止被恶意获取数据
    let req_data = "";
    try {
      req_data = JSON.stringify(Object.assign({}, req.data || {}));
    } catch (e) {
      req_data = "";
    }
    req.headers["Designed-By-Sl"] =
      md5(req_data).substring(0, 16) + md5("shuli").substring(16, 32);
    //admin mange发起的请求才增加token
    // if((/^\/manage/.test(req.url))){}
    req.headers.token = localStorage.getItem("token") || "";
    req.headers.orgId = localStorage.getItem("orgId") || "";
    req.headers.uid = localStorage.getItem("userId") || "";
    // if (req.url&&(req.url.startsWith('/goods-plus-server') || req.url.startsWith('/mall-plus-server'))) {
    //   req.headers.uName = localStorage.getItem("name") || ""; // 后端（赵正阳）需要加当前操作人姓名
    // }
    req.headers.menuId = localStorage.getItem("menuId"); //menuId，用于记录日志
    req.headers.pageId = localStorage.getItem("pageId"); //pageId，用于记录日志
    return req;
  },
  err => {
    return Promise.reject(err.request);
  }
);

// res 拦截器
axiosIns.interceptors.response.use(
  res => {
    if (res && res.data) {
      return Promise.resolve(res.data);
    }
    return res.data;
  },
  err => {
    return Promise.resolve(err.response);
  }
);

export const axios_get = async (
  url,
  data = {},
  msg = "接口异常",
  headers = {}
) => {
  return axiosIns
    .get(url, { params: data, headers: { ...headers } })
    .then(res => {
      let iRes = res && res.config ? res.data : res;
      if ((iRes && iRes.code === 10000) || iRes.code === "10000") {
        return Promise.resolve(iRes || {});
      } else if (iRes.code === 20004) {
        location.href = "/login?type=timeout";
        return Promise.reject(iRes || {});
      } else {
        Notice.error({
          title: "提示",
          desc: iRes.message || "接口异常，请联系管理员！"
        });
        return Promise.resolve(iRes || {});
      }
    })
    .catch(err => {
      console.info(err.message || msg);
    });
};
export const axios_post = async (
  url,
  data = {},
  msg = "接口异常",
  headers = {}
) => {
  return axiosIns
    .post(url, data, { headers })
    .then(res => {
      let iRes = res && res.config ? res.data : res;
      if ((iRes && iRes.code === 10000) || iRes.code === "10000") {
        return Promise.resolve(iRes);
      } else if (iRes.code === 20004) {
        Message.warning({
          content: iRes.message || "token失效，请重新登录！",
          duration: 2,
          onClose: () => {
            location.href = "/login.html";
          }
        });
        return Promise.reject(iRes);
      } else {
        Notice.error({
          title: "提示",
          desc: iRes.message || "接口异常，请联系管理员！"
        });
        return Promise.resolve(iRes);
      }
    })
    .catch(err => {
      console.info(err.message || msg);
    });
};

export let proxy = "";

if (process.env.NODE_ENV === "development") {
  proxy = "";
} else {
  proxy = "";
}

axiosIns.defaults.baseURL = proxy;

export default axiosIns;
