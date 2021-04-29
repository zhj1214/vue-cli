/*
 * @Description: 公众号通用配置
 * @Author: sam.xutao
 * @Date: 2020-06-18 14:13:11
 * @LastEditTime: 2020-07-06 13:55:59
 * @LastEditors: sam.xutao
 */
export default {
  data() {
    return {
      hasSign: false, // 是否绑定公众号
      originOrgId: localStorage.getItem('orgId'),
      api: {
        CHECK_SIGN_ACCOUNT: '/wechatplatform-server/api/auth/getAuthInfo', // 根据获取授权信息校验是否绑定过公众号
        GET_AUTH_CODE: '/wechatplatform-server/api/auth/preAuthCode', // 获取预授权码
        BIND_AUTH_INFO: '/wechatplatform-server/api/auth/bindAuthInfo', // 微信同意授权后回调
      },
      accountAuthData: {}, // 公众号授权认证信息
      preAuthInfo: { componentAppid: '', preAuthCode: '' }, // 预授权码信息
      signResultUrl: window.origin + '/channel/officeAccount/setting',
    }
  },
  methods: {
    // 校验当前商户是否绑定过公众号
    async checkSign() {
      try {
        const { data } = await this.$ajaxGet(this.api.CHECK_SIGN_ACCOUNT, {
          orgId: this.originOrgId,
          type: 1,
        })
        if (data) {
          this.hasSign = data['authorizerAppid'] // 保存授权id
          this.accountAuthData = data // 保存授权信息
        } else {
          this.hasSign = false
        }
      } catch (error) {
        console.error(error)
      }
    },
    // 获取预授权码用于构建授权链接公众号绑定
    async getPreCode() {
      const { data } = await this.$ajaxGet(this.api.GET_AUTH_CODE)
      if (data) {
        this.preAuthInfo = data
      }
    },
  },
  mounted() {
    // 1.全局校验是否绑定公众号；
    // 2.未绑定公众号则公众号相关菜单均展示“未绑定”页面，绑定后才正常展示对应菜单
    this.checkSign()
    this.getPreCode()
  },
}
