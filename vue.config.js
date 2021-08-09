/*
 * @Description:
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-03-11 09:45:26
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-03-15 19:23:29
 */
module.exports = {
  pages: {
    index: {
      // page 的入口
      entry: 'src/main.js',
      template: 'public/index.html',
      title: '管理 - 解百集团',
    },
    login: {
      entry: 'src/login.js',
      title: '登录 - 解百集团',
    },
  },
  css: {
    loaderOptions: {
      // 向 CSS 相关的 loader 传递选项
      less: {
        javascriptEnabled: true,
      },
    },
  },
  productionSourceMap: false,
  devServer: {
    // 开发环境
    // proxy: 'http://36.133.91.226:8081/',
    // 测试环境
    proxy: 'http://36.134.58.176:8081/',
    // 预发布
    // proxy: 'https://crmuat.cntpy.com/',
  },
}
