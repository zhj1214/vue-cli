# MOS 商用平台

> 基于 [vue cli3.0](https://cli.vuejs.org/zh/) 构建的通用 vue 技术栈方案

## 命名规范

- [x] 文件夹需要小写开头，小写驼峰
- [x] vue 组件名称，需要大写开头，大写驼峰形式

## 项目结构

```txt
+-- dist/                                   ---打包之后的dist目录
+-- public/                                 ---静态目录,/xx 直接饮用，不需要public
|   --- index.html                          ---首页入口html文件
|   --- favicon.ico                         ---网页图标
+-- src/
+   ---assets/                              --- 资源文件
+   | +---/font                             --- 图标字体
+   | +---/images                           --- 图片资源
+   | +---/scss                             --- 公共样式
+   ---/components/                         ---组件目录
+   | +---/base/                            ---基本组件
+   | +---/commons/                         ---公共组件包
+   | +---/layout/                          ---布局方案
+   | +---/mixins/                          ---mixins
+   | +---/**/**                            ---其他业务组件
+-- router/                                 ---路由文件
|   ---allRouter.js                        ---组件配置路由文件
|   ---fn.js                                ---根据权限动态生成路由的方法
|   ---index.js                             ---总路由配置入口
+-- store/                                  ---vuex 总 store 信息
|   +---module                              ---根据业务组件划分的状态
|   ---commAction.js                        ---通用方法
|   ---index.js                             ---总vuex状态配置信息
+-- utils/                                  ---vuex 总 store 信息
|   ---addressLinkage.js                    ---城市级联信息
|   ---axios.js                             ---通用axios方法
|   ---tools.js                             ---通用工具方法
+-- view/                                   ---多页面配置信息
|   ---Error.vue                            ---404页面
|   ---Login.vue                            ---登录页面
|   ---Welcome.vue                          ---欢迎页面
--- main.js                                 ---应用登录后入口文件
--- login.js                                ---登录页入口文件
--- App.vue                                 ---应用入口
--- babel.config.js                         ---babel配置文件
--- README.md                               ---Readme
--- package.json                            ---依赖包
--- vue.config.js                           ---配置vue脚手架的文件，包含本地跨域、base url更改等
```

## 技术栈

- [vue2.0](https://cn.vuejs.org/)
- [axios0.18.0](https://github.com/axios/axios)
- [vuex3.1.0](https://vuex.vuejs.org/zh/)
- UI 库 [iViewUI](https://www.iviewui.com/)
- [vue-router](https://router.vuejs.org/zh/)

## 本地开发说明

### 启动项目

0. 拉取项目文件 `git clone git@code.data4truth.com:pi/pi-web.git -b dev`
1. 安装 `npm install`
1. 运行 `npm run serve`
1. 部署

```
a.`git pull`部署之前需确保代码为最新，具体为同步 feature 和 dev 分支内容；
b.提交本地信息 `git add .`，`git commit -m msg`,`git push`。提交时会自动执行`npm lint`校验，故请保证代码语法正确
c. `npm run build` 打包部署

```

### 开发新页面流程

1. 是否已经配置过页面  
   a. 在 network 里查看接口 /user-server/auth/user/powers 的响应。
2. 配置过，将权限里的 value 用作 路由名称。
3. 没有配置过，找后端 user-server 开发（陈培松）添加。
4. 添加时，要告知后端，权限类型、权限字段名、对应的名称。需要添加的环境。  
   a. 权限类型：按钮权限、菜单权限。  
   b. 权限字段名：从父级菜单依次到当前节点。  
   c. 对应名称，要添加的菜单名或按钮名。

5. 🌰：我要在「会员中心」，「会员管理」下添加一个「会员查询」菜单。我给后端发的消息是这样的。  
   a. 培松，恒太开发环境，新增菜单 「会员查询」 member-manage-query。  
   b. 后端同学添加后，在接口 /user-server/auth/user/powers 中查看是否正确。

### 恒太权限管理

1. 恒太有三种权限：页面权限、按钮权限、真实业务权限。  
   a. 基本逻辑：有权限就显示，没有就隐藏。  
   b. 按钮权限依托于页面权限，配置了页面权限，才能有按钮权限。  
   c. 真实业务权限：只有对应的组织才能操作，根据接口来判断。  
   d. 项目的所有权限：https://shimo.im/sheets/PTVJyKpV9c93tj3c/JWJz0。
2. 每一个用户都对应一个角色，修改用户权限需要修改角色权限。
3. 配置角色权限步骤  
   a. 进入页面：平台管理：组织管理 -> 角色管理  
   b. 选择自己的角色，点击编辑，在分配权限下勾选需要的权限。
4. 权限配置找 user-server 开发（陈培松）
5. 不明确的权限先找产品确认清楚。如果是新页面，需要在每一个环境都配置一下。  
   a. 比如开发时配置了开发环境，提测时要提醒后端将权限同步到测试环境。

## UI 设计稿

> 具体参考[蓝湖设计稿平台](https://lanhuapp.com/web)

## 后台 API 交互（基于后台是微服务框架）

> 具体参考[小幺鸡后台文档](http://183.131.202.186:8080/xiaoyaoji/dashboard)

- 会员和用户相关前缀加 `/user-server`/xxx
- 优惠券相关前缀加 `/coupon-server`/xxx
- 标签相关前缀加 `/label-server`/xxx
- 商城相关前缀加 `/mall-server`/xxx
- 等级积分等 crm 相关前缀加 `/crm-server`/xxx
- 活动相关前缀加 `/marketing-server`/xxx
- 短信消息相关前缀加 `/message-server`/xxx

## 其他说明

#### `main.js` 文件里在 vue 原型上绑定里很多实用的方法，诸如

- axios 请求【$ajaxGet,$ajaxPost】
- loadash 方法【`$_`】
- 时间格式转化方法 【\$format(time,'自定义时间格式')】
- 一些工具方法【例如 $backIcon,$saveImage,\$filterPhone 等】

#### 规范

- 分支规范

由于该项目涉及板块较多，请务必遵循[分支规范](https://code.data4truth.com/FrontEnd/pub-material/blob/master/%E9%A1%B9%E7%9B%AE%E5%88%86%E6%94%AF%E7%AE%A1%E6%8E%A7%E8%AF%B4%E6%98%8E%EF%BC%88%E8%A7%A3%E7%99%BE%E9%9B%86%E5%9B%A2%E4%B8%BA%E4%BE%8B%EF%BC%89.md)进行开发

- [上线规范](https://code.data4truth.com/FrontEnd/pub-material/blob/master/%E5%89%8D%E7%AB%AF%E4%B8%8A%E7%BA%BF%E8%A7%84%E8%8C%83%EF%BC%88%E8%A7%A3%E7%99%BE%E4%B8%BA%E4%BE%8B%EF%BC%89.md)

#### 环境信息

- 13 环境

```
    服务器地址：-

    代码路径：-

    域名地址：-
```

- 154 环境

```
    服务器地址：-

    代码路径：-

    域名地址：-
```
