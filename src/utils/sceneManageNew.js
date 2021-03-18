/**
 * 场景管理
 * 介绍：场景管理主要解决用户扫码、逻辑套餐跳转传值自动化过程。
 * 实现原理：初始化场景单利，合适时机执行场景步骤。通过埋点触发场景下一步机制。完成所有步骤。
 *
 * 1.没组织  2.有组织 没登录 2.有组织 已登录
 * @param {Array} scenePath 场景值枚举:1.Voucher 2.registChannel 3.turntableGame  ....
 * @description sceneManage 处理二维码中的参数，得到并保存参数,执行下一步操作
 *
 */

/**
 * ————————————————— 流程 ———————————————————
 * 用户通过扫描二维码打开商城，
 * 缓存scene值到localstorage，
 * 执行页面本身的业务逻辑
 * 解析场景值
 * 匹配获取场景值所有参数 // 其实是多余的，完全可以后台自己直接匹配
 * 执行场景逻辑
 */

const SCENE_KEY = "$_scene"; // 场景参数
const IS_IN_SCENEIS_KEY = "$_is_in_scene"; // 场景是否在ing
const SCENE_PARSE_KEY = "$_scene_parsed"; // 场景析构

/**
 * 配置场景规则
 * @param { Number } key 场景类型
 * @param { String } name 场景标识
 * @param { Function } render 初始化场景
 * @param {type} FN_PARAMS
 * */

const TYPE_MAP = {
  1: {
    name: "Voucher",
  },
  2: {
    name: "registChannel",
    async render(config) {
      try {
        // 获取场景值下的所有参数
        const res = await uni.$api.apiRequest("channelApi", {
          uuid: config.scene,
        });
        if (res.code == 10000 && res.data) {
          let mallInfo = {
            marketName: res.data.orgName,
            orgid: res.data.affiliationOrganizationId,
          };
          uni.$localStorage.setItem("currentMall", mallInfo);

          // 更新注册渠道
          await uni.$api.apiRequest("channelUpdate", {
            organizationId: res.data.affiliationOrganizationId,
            id: uni.$localStorage.getItem("memberId"),
            registrationSource: res.data.registrationSource,
            registrationOrg:
              res.data.type == 1
                ? res.data.affiliationOrganizationId
                : "外部组织",
            channelId: res.data.channelId,
          });

          console.log(getApp(), "getApp()getApp()getApp()");
          let a = getApp();
          a.globalData.registrationSource = res.data.registrationSource;
          a.globalData.registrationSourceChannelId = res.data.channelId;
          const pages = getCurrentPages();
          console.log(pages);

          if (pages[pages.length - 1].route != "pages/index/index") {
            uni.switchTab({
              url: "/pages/index/index",
            });
          }
        } else {
          uni.$alert.showModal("温馨提示", "服务异常，请重新扫码").then(() => {
            uni.switchTab({
              url: "/pages/index/index",
            });
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        return true;
      }
    },
  },
  3: {
    name: "turntableGame",
  },
  4: {
    name: "turntableGamePreview", // 游戏预览模式
  },
  10: {
    name: "landingPage", // 落地页
    async render(config) {
      try {
        //
        // if(!uni.$localStorage.getItem('orgId')){
        //   uni.navigateTo({
        //     url:"/pages/index/switchMall"
        //   })
        // }
      } catch (error) {
        console.error(error);
      } finally {
        return true;
      }
    },
  },
  11: {
    name: "scanReciiveCoupons", // 扫码领券
    async render(config) {
      try {
        // 判断状态
        var queue = [];
        if (
          !uni.$localStorage.getItem("orgId") ||
          uni.$localStorage.getItem("orgId") !=
            sceneManage[SCENE_PARSE_KEY].orgId
        ) {
          queue.push({
            name: "切换商场",
            type: "changeMall",
            isOk: false,
          });
        }
        if (!uni.$localStorage.getItem("Token")) {
          queue.push({
            name: "未登录",
            type: "login",
            isOk: false,
          });
        }
        if (queue.length > 0) {
          queue.push({
            name: "跳转到目标页面",
            type: "jump",
            path: "/pagesA/scanReciiveCoupons/index",
            isOk: false,
          });
        }
        sceneManage["queue"] = queue;
      } catch (error) {
        console.error(error);
      } finally {
        return true;
      }
    },
  },
};

/**
 * 初始化场景
 * @param { Object } sceneParam
 * @return { Object } 当前场景单利
 * */

var sceneManage = {}; // 场景对象
const getSceneManage = function() {
  return sceneManage;
};

export function setScene({ scene }) {
  if (!scene) return;
  sceneManage = {};
  sceneManage[IS_IN_SCENEIS_KEY] = true; // 如果本地没有场景值， 则返回false
  sceneManage[SCENE_KEY] = scene;
  sceneManage[SCENE_PARSE_KEY] = sceneParse(scene);
  fetchScene(); // 运行规则

  return getSceneManage();
}

/**
 * 解析 105_17503880_1 场景值
 */
function sceneParse(scene) {
  const arr = scene.split("_");
  // 全局存储解析的场景值
  // 解析长度为3时的情况
  if (arr.length == 3) {
    // // 若本地不存在orgId 则保存 商场orgId用于后续请求
    // app.orgId = arr[1];
    // if(!uni.$localStorage.getItem("orgId")){
    //     uni.$localStorage.setItem("orgId", arr[1]);
    // }

    // const currentMall = uni.$localStorage.getItem("currentMall");
    // // 如果是不同商场，把之前商场信息清除
    // if (currentMall.orgid !== arr[1]) {
    //   uni.$localStorage.remove("currentMall");
    // }
    return {
      type: arr[2],
      orgId: arr[1],
      paramsId: arr[0],
    };
  } else {
    return {
      type: "",
      orgId: "",
      paramsId: "",
    };
  }
}

export async function fetchScene(render) {
  if (!sceneManage[IS_IN_SCENEIS_KEY]) return false;
  render =
    render ||
    (TYPE_MAP[sceneManage[SCENE_PARSE_KEY].type] &&
      TYPE_MAP[sceneManage[SCENE_PARSE_KEY].type].render);

  const scene = sceneManage[SCENE_KEY];
  let isComplate;
  if (render) {
    // 约定场景执行完成后返回一个true，否则则认为未结束
    isComplate = await render({
      scene,
      sceneObj: sceneManage[SCENE_PARSE_KEY],
    });
  } else {
    isComplate = true;
  }
  if (isComplate) {
    sceneManage[IS_IN_SCENEIS_KEY] = false; // 消费完场景之后软清除
  }
}

/**
 * 执行任务队列
 * */
export async function nextScene() {
  if (!sceneManage.queue) return (sceneManage.done = true);
  let idx;
  sceneManage.queue.forEach((element, index) => {
    if (!element.isOk) {
      idx = index;
      break;
    }
  });
  if (!idx) return (sceneManage.done = true);
  // 获取任务并执行
  let task = sceneManage.queue[idx];
  if (task.type == "changeMall") {
  } else if (task.type == "login") {
  } else if (task.type == "jump") {
  }
}

/**
 * 获取场景值
 * @param {} scene
 */
export function getScene() {
  if (sceneManage[IS_IN_SCENEIS_KEY]) {
    return sceneManage[SCENE_KEY];
  } else {
    return false;
  }
}

/**
 * 获取解析后的场景值
 * @return {Object} 解析后的场景值
 */
export function getSceneParsed() {
  if (sceneManage[IS_IN_SCENEIS_KEY]) {
    return sceneManage[SCENE_PARSE_KEY];
  } else {
    return false;
  }
}

const sceneMng = {
  /**
   *
   * @param {*} scene 扫描二维码获取的 query string的scren
   */
  setScene: setScene,

  next: fetchScene,
};
/**
 * @description: 前往登录
 * @param {*}
 * @return {*}
 * @example:
 * @author: zhj1214
 */

export async function jumpLogin() {
  if (!uni.$localStorage.getItem("Token")) {
    uni.navigateTo({
      url: "/pages/login/login",
    });
  }
}
/**
 * 切换商场（把新的商场重新写入缓存）
 * 更新用户信息（积分、成长值）
 * */
export async function changeMall() {
  const app = getApp();
  if (!uni.$localStorage.getItem("orgId")) {
    app.globalData.orgId = sceneManage[SCENE_PARSE_KEY].orgId;
    uni.$localStorage.setItem("orgId", sceneManage[SCENE_PARSE_KEY].orgId);
  }
  uni.$api
    .apiRequest("getMallInfoUserServer", {
      orgId: sceneManage[SCENE_PARSE_KEY].orgId,
    })
    .then((res) => {
      if (res.code == 10000) {
        uni.$localStorage.setItem("currentMall", {
          marketName: res.data,
          orgId: orgId,
          orgid: orgId,
        });
      }
    });

  var self = this;
  uni.$util.getMemberInfo().then((res) => {
    if (res) {
      let u = { ...self.userInfo, ...res };
      app.globalData.integral = res.integral;
      uni.$localStorage.setCurrentUser(res);
      uni.$localStorage.setItem("memberId", res.memberId);
    }
  });
}

export default sceneMng;
