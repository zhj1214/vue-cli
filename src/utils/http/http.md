# 请求封装

> 起初只是想解决每次编写一个新的请求的时候，都要创建一个函数的繁琐配置。但深入了解后发现需要重构网络请求才行。

## 成果

1. 创建请求接口的更加`简单`

```js
const pointApi = {
  loginPhone: post('/yhqt-server/wechat-server/api/webchat/registerOrLoginV2') // 手机号登录
}
```

2. 增加了`请求头拦截`和请求`结果逻辑处理`
3. 增加了默认`请求头`
4. 扩展了根据 key 来切换请求`网关`
5. 为请求增加了`插件`功能（缓存、重试、错误记录、mock）

## 开发
