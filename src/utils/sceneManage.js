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

const SCENE_KEY = "$_scene";
const IS_IN_SCENEIS_KEY = "$_is_in_scene";
const SCENE_PARSE_KEY = "$_scene_parsed";

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
  10: {
    name: 'landingPage', // 落地页
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
};

export function isInScene() {
  const app = getApp(); // 保存全局属性
  // 如果本地没有场景值， 则返回false
  const isInScene = app[IS_IN_SCENEIS_KEY];
  return isInScene;
}

export function setScene({ scene }) {
  if (!scene) return;
  const app = getApp(); // 保存全局属性
  // 如果本地没有场景值， 则返回false
  app[IS_IN_SCENEIS_KEY] = true;
  app[SCENE_KEY] = scene;
  app[SCENE_PARSE_KEY] = sceneParse(scene, app);
  return app[SCENE_KEY];
}

/**
 * 获取场景值
 * @param {} scene
 */
export function getScene() {
  const app = getApp(); // 保存全局属性
  if (app[IS_IN_SCENEIS_KEY]) {
    return app[SCENE_KEY];
  } else {
    return false;
  }
}

export function removeScene() {
  const app = getApp(); // 保存全局属性
  // 如果本地没有场景值， 则返回false
  app[IS_IN_SCENEIS_KEY] = false;
  return app[SCENE_KEY];
}

/**
 * 获取解析后的场景值
 * @param {} scene
 */
export function getSceneParsed() {
  const app = getApp(); // 保存全局属性
  if (app[IS_IN_SCENEIS_KEY]) {
    return app[SCENE_PARSE_KEY];
  } else {
    return false;
  }
}

/**
 * 解析场景值，
 * 保存当前场景的orgId
 */

function sceneParse(scene, app) {
  const arr = scene.split("_");
  // 全局存储解析的场景值
  // 解析长度为3时的情况
  if (arr.length == 3) {
    // 保存 商场orgId用于后续请求
    app.globalData.orgId = arr[1];
    uni.$localStorage.setItem("orgId", arr[1]);
    const currentMall = uni.$localStorage.getItem("currentMall");
    // 如果是不同商场，把之前商场信息清除
    if (currentMall.orgid !== arr[1]) {
      uni.$localStorage.remove("currentMall");
    }
    return {
      type: arr[2],
      orgId: arr[1],
      paramsId: arr[0],
    };
  }
}

export async function fetchScene(render) {
  const app = getApp(); // 保存全局属性
  if (!isInScene()) return false;

  render =
    render ||
    (TYPE_MAP[app[SCENE_PARSE_KEY].type] &&
      TYPE_MAP[app[SCENE_PARSE_KEY].type].render);

  const scene = app[SCENE_KEY];
  let isComplate;
  if (render) {
    // 约定场景执行完成后返回一个true，否则则认为未结束
    isComplate = await render({
      scene,
      sceneObj: app[SCENE_PARSE_KEY],
    });
  } else {
    isComplate = true;
  }
  if (isComplate) {
    // 消费完场景之后软清除
    removeScene();
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

export default sceneMng;
