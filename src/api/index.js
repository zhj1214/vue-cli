/*
 * @Description:
 * @Version: 0.0.1
 * @example: api.getlist({subject: 1,model: "c1",key: "f8179153f5176ec2d6656a860ebb8dd7"});
 * @Autor: zhj1214
 * @Date: 2021-03-12 17:58:38
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-03-15 16:33:54
 */
import http from "../utils/http";
import * as coupon from "./coupon";
import * as home from "./home";

var objs = { ...home.api, ...coupon.api };
var apis = {};

/**
 * api析构
 * */
const destructorApi = url => {
  let apis = url.split("::");
  if (apis.length == 1) apis.unshift("GET");
  return {
    url: apis[1],
    method: apis[0]
  };
};

/**
 * @description: 注册函数
 * @param {*} APIS接口列表
 * @return {*} 请求函数
 * @author: zhj1214
 */
Object.keys(objs).forEach(key => {
  apis[key] = params => {
    let rUrl = destructorApi(objs[key]);
    if (rUrl.method == "GET") return http.get(rUrl.url, params);
    else return http.post(rUrl.url, params);
  };
});

export default apis;
