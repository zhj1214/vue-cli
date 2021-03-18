<template>
  <view class="view">
    <navBar color="black" title="核销员绑定"></navBar>
    <view class="formcss">
      <u-form :model="form" ref="uForm" label-width="auto">
        <u-form-item label="真实姓名" prop="name" required>
          <u-input v-model="form.name" input-align="right" />
        </u-form-item>
        <u-form-item label="联系方式" prop="mobile" required>
          <u-input v-model="form.mobile" input-align="right" />
        </u-form-item>
        <u-form-item label="部门组织" prop="organ" required>
          <u-input v-model="form.organ" input-align="right" />
        </u-form-item>
        <u-form-item label="所属公司" required prop="type"
          ><u-input
            v-model="form.type"
            type="select"
            input-align="right"
            placeholder="请选择"
            @click="show = true"
          />
          <u-select
            v-model="show"
            value-name="id"
            label-name="name"
            :list="actionSheetList"
            @confirm="actionSheetCallback"
          ></u-select>
        </u-form-item>
      </u-form>
      <u-button @click="submit" type="error">提交</u-button>
    </view>
  </view>
</template>

<script>
const app = getApp(); //获取应用实例
export default {
  data() {
    return {
      show: false,
      actionSheetList: [],
      wxUserInfo: {},
      form: {
        name: "",
        mobile: "",
        organ: "",
        type: "",
      },
      id: "",
      openId: "",
      orgId: "",
      rules: {
        name: [
          {
            required: true,
            message: "请输入姓名",
            // 可以单个或者同时写两个触发验证方式
            trigger: ["change", "blur"],
          },
        ],
        organ: [
          {
            required: true,
            message: "请输入部门组织",
            // 可以单个或者同时写两个触发验证方式
            trigger: ["change", "blur"],
          },
        ],
        type: [
          {
            required: true,
            message: "请输入部门组织",
            // 可以单个或者同时写两个触发验证方式
            trigger: ["change", "blur"],
          },
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机号",
            trigger: ["change", "blur"],
          },
          {
            // 自定义验证函数，见上说明
            validator: (rule, value, callback) => {
              // 上面有说，返回true表示校验通过，返回false表示不通过
              // this.$u.test.mobile()就是返回true或者false的
              return this.$u.test.mobile(value);
            },
            message: "手机号码不正确",
            // 触发器可以同时用blur和change
            trigger: ["change", "blur"],
          },
        ],
      },
    };
  },
  onShow() {},

  onLoad(option) {
    this.isRequirements();
    const { scene } = option;
    const arr = scene && scene.split("_");
    if (arr && arr.length == 3) {
      this.setData({
        orgId: arr[1],
      });
      if (uni.$localStorage.getItem("orgId") !== arr[1]) {
        uni.$localStorage.setItem("orgId", arr[1]);
        // uni.$localStorage.remove("currentMall");
      }
      this.getSubCompany(arr[1]);
    }

    if (!uni.$localStorage.getItem("userOpenId")) {
      this.init();
    } else {
      this.openId = uni.$localStorage.getItem("userOpenId");
    }
  },
  onReady() {
    this.$refs.uForm.setRules(this.rules);
  },
  methods: {
    /**
     * @description 获取用户信息
     */
    getHomeMemberInfo() {
      if (uni.$localStorage.getItem("Token")) {
        var self = this;
        // 更新用户信息
        uni.$api
          .apiRequest("getUserInfo", {
            orgId: uni.$localStorage.getItem("orgId"),
          })
          .then((res) => {
            if (res.code == 10000 && res.data) {
              this.setData({
                wxUserInfo: res.data,
              });
              uni.$localStorage.setCurrentUser(res.data);
            }
          });
      }
    },
    // 判断是否有商场 然后是否登录
    isRequirements() {
      // if (!uni.$localStorage.getItem("currentMall")) {
      //   uni.navigateTo({
      //     url: "/pages/index/switchMall/switchMall",
      //   });
      //   return;
      // }
      if (!uni.$localStorage.getItem("Token")) {
        uni.switchTab({
          url: "/pages/index/index",
        });
        return;
      }
      if (!uni.$localStorage.getItem("wxUserInfo")) {
        this.getHomeMemberInfo();
      } else {
        this.setData({
          wxUserInfo: uni.$localStorage.getItem("wxUserInfo"),
        });
      }
    },
    actionSheetCallback(value) {
      this.form.type = value[0].label;
      this.id = value[0].value;
    },
    init() {
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
                app.globalData.userOpenId = response.data.openid;
                uni.$localStorage.setItem("userOpenId", response.data.openid);
                this.openId = response.data.openid;
              } else {
                response.data && uni.$alert.showToast(response.data.message);
              }
            });
        },
      });
    },
    getSubCompany(orgId) {
      uni.$api
        .apiRequest("getSubCompany", {
          orgId,
        })
        .then((res) => {
          if (res.code == 10000 && res.data) {
            this.actionSheetList = res.data;
          }
        });
    },
    submit() {
      this.$refs.uForm.validate((valid) => {
        if (valid) {
          uni.$api
            .apiRequest("saveVerifier", {
              openId: this.openId,
              writerName: this.form.name,
              telephone: this.form.mobile,
              orgId: this.id,
              department: this.form.organ,
              logo: this.wxUserInfo.headImg,
              nickName: this.wxUserInfo.nickName,
            })
            .then((res) => {
              if (res.code == 10000) {
                uni.navigateTo({
                  url: "/pages/verifier/bindSuccess",
                });
              }
            });
        } else {
          console.log("验证失败");
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.formcss {
  padding: 15px;
}
</style>
