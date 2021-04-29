<!--
 * @Description: 公众号管理入口
 * @Author: sam.xutao
 * @Date: 2020-06-18 10:19:17
 * @LastEditTime: 2020-07-07 15:52:58
 * @LastEditors: sam.xutao
-->
<template>
  <div>
    <!-- 获取授权之后要么授权成功，要么授权失败 -->
    <CompleteInfo
      v-if="complete.visible"
      :complete="complete"
      c-type="account"
      @confirmComplete="confirmComplete"
      @retryComplete="retryComplete"
    />
    <section v-else>
      <NoSign v-if="!hasSign" :auth-url="authUrl" />
      <component
        :is="pathPage[curRouter] + ''"
        v-else
        :auth-data="accountAuthData"
        :pre-auth="preAuthInfo"
      />
    </section>
    <Modal v-model="authModal" footer-hide :mask-closable="false" @on-cancel="onAuthFail">
      <div class="clear" style="padding: 24px;">
        <i
          style="position: relative; top: -5px; float: left; color: #f8d98f;"
          class="icon iconfont iconWarning"
        />
        <div style="margin-left: 40px;">
          <h3 style="font-size: 18px;"> 微信公众号授权提示 </h3>
          <p style="line-height: 40px;"> 请在微信确认授权是否成功 </p>
        </div>
      </div>

      <div style="text-align: right;">
        <Button class="mr-10" type="default" @click="onAuthFail"> 授权失败 </Button>
        <Button type="primary" :loading="btnLoading" @click="onAuthSuccess"> 授权成功 </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import NoSign from './components/NoAsign' // 未绑定公众号
  import AccountSetting from './AccountSetting' // 公众号设置
  import SelfMenu from './SelfMenu' // 自定义菜单
  import AccountMixins from './accountMixins'
  import CompleteInfo from '../CompleteInfo.vue'

  export default {
    components: {
      NoSign,
      AccountSetting,
      SelfMenu,
      CompleteInfo,
    },
    mixins: [AccountMixins],
    data() {
      return {
        curRouter: 'setting',
        pathPage: {
          setting: 'AccountSetting',
          menu: 'SelfMenu',
        },
        authModal: false,
        btnLoading: false,
        complete: {
          visible: false, // 授权成功后状态提示可见版块
          account: '', // 绑定后的公众号,
          status: '', // 1.授权成功 2 没有开发平台账户管理权限 3 已授权其他商铺 4 个人小程序 5 获取授权信息失败
          isComplete: false, // 是否授权成功
        },
      }
    },
    computed: {
      // 绑定授权链接
      authUrl() {
        return `https://mp.weixin.qq.com/cgi-bin/componentloginpage?component_appid=${this.preAuthInfo['componentAppid']}&auth_type=1&pre_auth_code=${this.preAuthInfo['preAuthCode']}&redirect_uri=${this.signResultUrl}?type=success`
        // return `https://mp.weixin.qq.com/cgi-bin/componentloginpage?component_appid=wx8bea7cbf451c0503&auth_type=3&pre_auth_code=preauthcode@@@nD7_8MIJ5qMQ-CYcEhvFsHcxJWdlnQBi2gnBi28WgHB7c2yfxroehUD4TNj010_3&redirect_uri=http://mostest.data4truth.com:8081/channel/miniProgram/base`;
      },
      // 授权成后返回页面链接 auth_code
      authCode() {
        return this.$route.query.auth_code || ''
      },
    },
    watch: {
      '$route.name'(newValue, oldValue) {
        let iRouter = newValue.split('-')
        this.curRouter = iRouter[iRouter.length - 1]
        if (newValue != oldValue) {
          this.checkSign()
        }
      },
    },
    mounted() {
      let iRouter = this.$route.name.split('-')
      this.curRouter = iRouter[iRouter.length - 1]
      // 授权后回调到平台页面
      const { type, auth_code, expires_in } = this.$route.query || {}
      if ((type === 'success' || expires_in) && auth_code) {
        this.authModal = true
      }
    },
    methods: {
      onAuthFail() {
        this.authModal = false
        this.$router.replace('/channel/officeAccount/setting')
      },
      // 授权绑定
      async onAuthSuccess() {
        this.btnLoading = true
        const { code, data } = await this.$ajaxPost(this.api.BIND_AUTH_INFO, {
          orgId: this.originOrgId,
          authCode: this.authCode,
        })
        this.btnLoading = false
        if (code && code === 10000 && data) {
          // 1.授权成功 2 没有开发平台账户管理权限 3 已授权其他商铺 4 个人小程序 5 获取授权信息失败
          if (data.status === 1) {
            this.complete.account = data.appName || ''
            this.complete.isComplete = true
          }
          // 授权完成后，不管是否成功，先显示绑定信息
          this.complete.status = data.status
          this.complete.visible = true

          this.authModal = false
          // this.checkSign();
        }
      },
      // 确认授权成功，则拉取公众号信息
      confirmComplete() {
        this.complete.visible = false
        window.location.href = window.origin + '/channel/officeAccount/setting'
      },
      // 重新授权则重新拉取授权信息
      retryComplete() {
        // 重试时再次跳转到微信扫码授权
        window.location.href = this.authUrl
        // this.onAuthSuccess();
      },
    },
  }
</script>

<style lang="scss" scoped></style>
