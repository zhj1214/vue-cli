<template>
  <div>
    <CompleteInfo
      v-if="complete.visible"
      :complete="complete"
      c-type="miniprogram"
      @confirmComplete="confirmComplete"
      @retryComplete="retryComplete"
    />
    <div v-else class="main-body init-base">
      <div style="font-size: 28px; text-align: center;"> 微信小程序绑定商户 </div>

      <div class="bind-body clear">
        <div class="bind-row">
          <img src="../../../../assets/images/channel/has-mini-program.png" alt="" />
          <a :href="authUrl">
            <Button type="primary" style="margin-bottom: 20px;">已有小程序，立即绑定</Button>
          </a>
          <p>为保证所有功能的正常使用</p>
          <p>请将所有权限授权给银泰商业运营平台</p>
        </div>
        <div class="bind-row">
          <img src="../../../../assets/images/channel/no-mini-program.png" alt="" />
          <a href="https://mp.weixin.qq.com/cgi-bin/registermidpage?action=index" target="_blank">
            <Button type="primary" ghost style="margin-bottom: 20px;">没有小程序，立即申请</Button>
          </a>
          <p>在微信平台申请</p>
          <p>完成后回到银泰商业运营平台进行绑定</p>
        </div>
      </div>
      <div class="bind-footer">
        <h4 style="margin-bottom: 36px; font-size: 16px;"> 常见问题 </h4>
        <div style="color: #171725;">
          <!--target="_blank"-->
          <div class="row-a">
            <a href="javascript:void(alert('稍后'))" style="color: #171725;">小程序绑定程序</a>
            <i class="icon iconfont iconRight" />
          </div>
          <div class="row-a">
            <a href="javascript:void(alert('稍后'))" style="color: #171725;">绑定注意事项</a>
            <i class="icon iconfont iconRight" />
          </div>
          <div class="row-a">
            <a href="javascript:void(alert('稍后'))" style="color: #171725;">小程序类型区别</a>
            <i class="icon iconfont iconRight" />
          </div>
        </div>
      </div>

      <Modal v-model="authModal" footer-hide :mask-closable="false" @on-cancel="onAuthFail">
        <div class="clear" style="padding: 24px;">
          <i
            style="position: relative; top: -5px; float: left; color: #f8d98f;"
            class="icon iconfont iconWarning"
          />
          <div style="margin-left: 40px;">
            <h3 style="font-size: 18px;"> 微信小程序授权提示 </h3>
            <p style="line-height: 40px;"> 请在新打开的窗口中完成授权 </p>
          </div>
        </div>

        <div style="text-align: right;">
          <Button class="mr-10" type="default" @click="onAuthFail"> 授权失败 </Button>
          <Button type="primary" @click="onAuthSuccess"> 授权成功 </Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
  import CompleteInfo from '../../CompleteInfo.vue'
  export default {
    name: 'InitBase',
    components: {
      CompleteInfo,
    },
    props: {
      appData: {
        type: Object,
        default() {
          return {
            componentAppid: '',
            preAuthCode: '',
          }
        },
      },
    },
    data() {
      return {
        authModal: false,
        redirectUrl: location.origin + '/channel/miniProgram/base?type=success',
        originOrgId: localStorage.getItem('originOrgId'),

        complete: {
          visible: false, // 授权成功后状态提示可见版块
          account: '', // 绑定后的小程序名称,
          status: '', // 1.授权成功 2 没有开发平台账户管理权限 3 已授权其他商铺 4 个人小程序 5 获取授权信息失败
          isComplete: false, // 是否授权成功
        },
      }
    },
    computed: {
      authUrl() {
        return (
          'https://mp.weixin.qq.com/cgi-bin/componentloginpage?component_appid=' +
          this.appData.componentAppid +
          '&auth_type=2&pre_auth_code=' +
          this.appData.preAuthCode +
          '&redirect_uri=' +
          this.redirectUrl
        )
      },
      authCode() {
        return this.$route.query.auth_code || ''
      },
    },
    mounted() {
      const { type, auth_code } = this.$route.query || {}
      if (type === 'success' && auth_code) {
        this.authModal = true
      }
    },
    methods: {
      onAuthFail() {
        this.authModal = false
        // location.href = '/channel/miniProgram/base';
        this.$router.replace('/channel/miniProgram/base')
      },
      onAuthSuccess() {
        this.$ajaxPost('/wechatplatform-server/api/auth/bindAuthInfo', {
          orgId: this.originOrgId,
          authCode: this.authCode,
        }).then((res) => {
          if (res && res.code === 10000 && res.data) {
            // 1.授权成功 2 没有开发平台账户管理权限 3 已授权其他商铺 4 个人小程序 5 获取授权信息失败
            if (res.data.status === 1) {
              this.complete.account = res.data.appName || ''
              this.complete.isComplete = true
            }
            // 授权完成后，不管是否成功，先显示绑定信息
            this.complete.status = res.data.status
            this.complete.visible = true

            this.authModal = false
          }
        })
      },

      // 确认授权成功，则拉取小程序信息
      confirmComplete() {
        this.complete.visible = false
        this.$emit('whatComponent', { name: 'DetailBase' })
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

<style scoped lang="scss">
  .init-base {
    padding-top: 40px;
  }

  .bind-body {
    width: 750px;
    height: 100%;
    padding-bottom: 40px;
    margin: 0 auto 24px;
    border-bottom: 1px solid #e2e2ea;
  }

  .bind-row {
    float: left;
    width: 360px;
    height: 350px;
    text-align: center;

    p {
      color: #696974;
    }

    & + .bind-row {
      margin-left: 24px;
    }
  }

  .bind-footer {
    margin-bottom: 48px;
    text-align: center;
  }

  .row-a {
    display: inline-block;
    padding-right: 40px;

    i {
      margin-left: 36px;
    }
  }
</style>
