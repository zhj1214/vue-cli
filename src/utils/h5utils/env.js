/**
 * @author zhj
 * @description 不同环境下的域名地址配置
 * @param baseUrl 当前公众号域名
 * @param baseHost 域名 host
 * @param thirdHost 对接第三方域名，此域名需要链接后面传参openid
 * @param loginPath 登录页面路由地址
 * @param appId 当前公众号 appid
 * @param isLocalTest 是否开启本地账号调试
 * @param ticketUrl 卡券地址
 */

var debuggerMode = function(isDebugger = envList[currentEnv].isLocalTest) {
  if (process.env.NODE_ENV != "production" && isDebugger) {
    switch (currentEnv) {
      case "slcs":
        // localStorage.setItem("userLoginPhone", 17521091214);
        // localStorage.setItem("uToken", "6f448af26a66e6e4f974e6abdcc7dbd8");
        // localStorage.setItem("openId", "oYt2Us774PJ1thOKsr1fzJPlwLec");
        // localStorage.setItem("orgId", "AABBCCDDEEFFGGHH66");
        break;

      case "slzt":
        // zhj
        break;

      case "prod":
        break;

      default:
        break;
    }
  }
};
const envList = {
  // 测试环境  杭州商旅在线技术有限公司
  slcs: {
    baseUrl: "http://slzxtest.zjbdos.com",
    baseHost: "slzxtest.zjbdos.com",
    thirdHost: "member.jiebai.com",
    appId: "wx64e39fa5499e47dd",
    ticketUrl: "http://kqtest.zjbdos.com/#/myTickets",
    loginPath: "http://slzxtest.zjbdos.com/#/login",
    isLocalTest: true,
    debuggerMode: debuggerMode
  },
  // 预发布环境  杭州商旅在线公司
  slzt: {
    baseUrl: "http://slzx.zjbdos.com",
    baseHost: "slzx.zjbdos.com",
    thirdHost: "member.jiebai.com",
    ticketUrl: "http://kq.zjbdos.com/#/myTickets",
    appId: "wx5fd3648055886bc1",
    loginPath: "http://slzx.zjbdos.com/#/login",
    isLocalTest: true,
    debuggerMode: debuggerMode
  },
  // 正式  杭商旅超级会员
  prod: {
  }
};
const currentEnv = "slcs";
// debuggerMode()
// export default envList[currentEnv];
module.exports = envList[currentEnv];
// export default Object.assign(envList[currentEnv], { currentEnv: currentEnv }); // 之前npm包依赖
