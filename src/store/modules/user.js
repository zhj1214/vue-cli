/*
 * @Description: 用户信息模块
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-03-01 16:14:16
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-03-02 09:42:23
 */

export default {
  state: {
    userOpenId: "",
    memberId: "",
    growthValue: 0,
    headImg: "",
    integral: 0,
    levelName: "",
    maritalStatus: "",
    memberName: "",
    nickName: "",
    orgTotalScore: 0,
    phone: "",
    sex: "",
  },
  getters: {
    openId: (state) => {
      return (
        state.userOpenId ||
        getApp().globalData.userOpenId ||
        uni.$localStorage.getItem("userOpenId")
      );
    },
  },
  mutations: {
    setOpenId(state, payload) {
      getApp().globalData.userOpenId = payload;
      uni.$localStorage.setItem("userOpenId", payload);
      state.userOpenId = payload;
    },
    setUserInfo(state, payload) {
      state = { ...state, ...payload };
    },
  },
  actions: {
    /**
     * @description: 获取用户openId
     * @author: zhj1214
     */

    getOpenId(context) {
      uni.login({
        success: (res) => {
          console.log(res, "微信login成功");
          uni.$api
            .apiRequest("getOpenId", {
              code: res.code,
            })
            .then((response) => {
              if (
                response.code == 10000 &&
                response.data &&
                response.data.openid
              ) {
                context.commit("setOpenId", response.data.openid);
              } else {
                response.data && uni.$alert.showToast(response.data.message);
              }
            });
        },
      });
    },
  },
};
