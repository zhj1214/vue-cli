# 基于vue cli3.0 构建的通用vue技术栈方案

## 项目结构
```txt
+-- dist/                                   ---打包之后的dist目录
+-- public/                                 ---静态目录,/xx 直接饮用，不需要public
|   --- index.html                          ---首页入口html文件
|   --- favicon.ico                         ---网页图标
+-- src/
+   ---/components/                         ---组件目录
+   ---assets/                              --- 资源文件
|   ---main.js                              ---入口文件
|   ---App.vue                              ---总vue-route入口
--- babel.config.js                         ---babel配置文件
--- README.md                               ---Readme
--- package-lock.json                            ---依赖包
--- package.json                            ---依赖包
--- vue.config.js                           ---配置vue脚手架的文件，包含本地跨域、base url更改等
```
##  技术栈
- vue
- axios
- vuex
- iview
- vue-router
## i18n