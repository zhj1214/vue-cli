// import axios from 'axios'
const axios = require('axios');

let service = axios.create({
  baseURL: 'http://localhost:7001/api'
}) // 请求拦截

service.interceptors.request.use(
  (config) => {
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)
// 响应拦截
service.interceptors.response.use(
  async (response) => {
    let { data, config } = response
    return data
  },
  (err) => {
    return Promise.reject(err)
  }
)

// export const http = service;
module.exports = {
  http: service
}
