<!--
 * @Description: 公众号设置
 * @Author: sam.xutao
 * @Date: 2020-06-18 11:19:23
 * @LastEditTime: 2020-07-07 16:15:22
 * @LastEditors: sam.xutao
-->
<template>
  <div>
    <section class="top-desc padding-box">
      <div>
        <img :src="authData['headImg'] || NosignAccountPic" alt="默认图片" />
        <aside>
          <h3>{{ authData['nickName'] || '-' }}</h3>
          <p v-if="authData['alias']"> 公众微信号：{{ authData['alias'] }} </p>
          <p v-else> 你的公众号暂未设置微信号，可设置并重新授权 </p>
        </aside>
      </div>
      <a href="https://mp.weixin.qq.com" target="_blank" class="right-desc">前往设置</a>
    </section>
    <Form
      ref="accoutSetting"
      :model="accoutSetting"
      :label-width="180"
      class="padding-box account-form"
    >
      <h4>基本信息</h4>
      <FormItem label="公众号授权状态：">
        <div class="infor-formitem">
          <aside>
            <p>已授权</p>
            <p
              >您的商户已获得该公众号的所有接口权限，可以正常对接微信；如果使用中发现接口异常，请重新授权</p
            >
          </aside>
          <aside>
            <a :href="authUrl">重新授权</a> <Divider type="vertical" />
            <a href="###" @click.stop="openRealseBind">解除绑定</a>
          </aside>
        </div>
      </FormItem>
      <FormItem label="微信账号类型：">
        <div class="infor-formitem">
          <aside>
            <!-- 1未认证订阅号2已认证订阅号3未认证服务号4已认证服务号 -->
            <p>{{ typeMatch[accoutSetting.authType] }}</p>
            <p>若您的账号已升级，请重新授权</p>
          </aside>
        </div>
      </FormItem>
      <!-- <FormItem label="公众号昵称：">{{accoutSetting.nickName || '-'}}</FormItem> -->
      <FormItem label="主体信息：">
        <div class="infor-formitem">
          <aside
            ><p>{{ accoutSetting.principalName || '-' }}</p></aside
          >
        </div>
      </FormItem>
      <FormItem label="关联小程序：">
        <div class="infor-formitem">
          <aside>
            <p v-if="miniProgram"> 已关联{{ miniProgram }}个小程序 </p>
            <p v-else style="color: #b5b5be;"> 未关联小程序 </p>
            <p>支持关联到授权给MOS的公众号，关联后小程序可出现在公众号自定义菜单页中</p>
          </aside>
          <aside>
            <a href="https://mp.weixin.qq.com/?token=&lang=zh_CN" target="_blank">关联设置</a>
          </aside>
        </div>
      </FormItem>
      <h4>账号信息</h4>
      <FormItem label="已授权权限：">
        <div class="infor-formitem" style="border: none;">
          <aside>
            <p>MOS 平台可使用已授权公众号的权限集</p>
            <p>为保证您在 MOS 平台的各项功能使用正常，请保证您已将所有权限集授权给 MOS</p>
          </aside>
          <aside>
            <a href="###" @click.stop="viewAuthList">查看权限</a>
          </aside>
        </div>
      </FormItem>
    </Form>
    <!-- 解除绑定弹窗 -->
    <Modal
      v-model="bindInfo.visible"
      title="解除绑定"
      :mask-closable="false"
      :footer-hide="true"
      :width="648"
    >
      <div v-if="bindInfo.visible" class="bind-box">
        <p class="auth-title">
          <Icon type="ios-information-circle-outline" />
          解除绑定微信公众号，会造成当前组织部分功能的正常使用（包括公众号自定义菜单、公众号粉丝列表、公众号消息推送等功能）请谨慎操作。
        </p>
        <section v-if="false" class="mes-code">
          <span> <label>*</label> 短信验证码：</span>
          <Input v-model="bindInfo.code" style="width: 248px;" placeholder="请输入短信验证码" />
          <Button style="margin-left: 8px; color: #696974;" @click="sendValidCode">
            {{ countDownSecond === 60 ? '发送验证码' : countDownSecond + 's' }}
          </Button>
        </section>
        <p v-if="false" class="auth-desc">
          验证码短信将发送到你绑定的手机：{{ creatorPhone }}，请注意查收
        </p>
        <p v-if="false" class="auth-check">
          <Checkbox v-model="bindInfo.agree"> 已知晓解除绑定的风险，确认解绑 </Checkbox>
        </p>
        <footer style="padding-top: 12px; text-align: right; border-top: solid 1px #f0f0f0;">
          <Button style="margin-right: 10px;" @click="cancelRelease"> 取消 </Button>
          <!-- :disabled="!bindInfo.agree||!bindInfo.code" -->
          <Button :loading="bindInfo.loading" type="primary" @click="confirmRelease">
            解除绑定
          </Button>
        </footer>
      </div>
    </Modal>
    <!-- 权限列表 -->
    <Modal
      v-model="authVisible"
      title="授权权限列表"
      :width="648"
      :mask-closable="false"
      :footer-hide="true"
    >
      <p class="auth-title">
        <Icon type="ios-information-circle-outline" />如果全部显示未授权，请重新授权同步授权信息
      </p>
      <div class="auth-list-table">
        <BaseTable :no-page="true" :list="authList" :col="authCol" />
      </div>
      <p style="text-align: right;">
        <Button @click="authVisible = false"> 关闭 </Button>
      </p>
    </Modal>
  </div>
</template>

<script>
  import NosignAccountPic from '@/assets/images/channel/account-nosign.png'
  import mixinsLoginHall from '@/mixins/mixinsLoginHall'

  import BaseTable from '@/pageview/base/BaseTable'

  export default {
    components: {
      BaseTable,
    },
    mixins: [mixinsLoginHall],
    props: {
      authData: { type: Object },
      preAuth: { type: Object },
    },
    data() {
      return {
        accoutSetting: this.authData || { type: 1 },
        NosignAccountPic,
        typeMatch: {
          1: '未认证订阅号',
          2: '认证订阅号',
          3: '未认证服务号',
          4: '认证服务号',
        },
        creatorPhone: localStorage.creatorPhone || '-',
        // 解除绑定相关信息
        bindInfo: {
          code: '', // 短信验证码
          agree: false, // 是否知晓风险
          visible: false, // 解除绑定弹窗可见性
          btnLoading: false, // 解除绑定按钮 loading
        },
        authVisible: false, // 权限列表弹窗显隐
        authList: [], // 授权列表
        miniProgram: 0, // 关联的小程序个数
        API: {
          RELATE_MINIAPP: '/wechatplatform-server/api/mx/mp/weapp/link/count', // 公众号关联的小程序个数
          AUTH_LIST: '/wechatplatform-server/api/auth/getFunctionLimit', // 授权权限集
          SEND_VALID_CODE: '/wechatplatform-server/api/auth/sendSmsCode', // 发送验证码
          RELEASE_BIND: '/wechatplatform-server/api/auth/cancelAuth', // 取消绑定
        },
      }
    },
    computed: {
      // 绑定授权链接
      authUrl() {
        return `https://mp.weixin.qq.com/cgi-bin/componentloginpage?component_appid=${
          this.preAuth['componentAppid']
        }&auth_type=1&pre_auth_code=${this.preAuth['preAuthCode']}&redirect_uri=${
          location.origin + '/channel/officeAccount/setting'
        }`
      },
      // 授权表格
      authCol() {
        return [
          { key: 'limitName', title: '权限项' },
          {
            key: 'hasAuth',
            title: '授权状态',
            filters: [
              { label: '授权', value: true },
              { label: '未授权', value: false },
            ],
            filterMultiple: false,
            filterMethod(value, row) {
              return row.hasAuth === value
            },
            render(h, params) {
              return h('Icon', {
                props: {
                  type: params.row.hasAuth
                    ? 'ios-checkmark-circle-outline'
                    : 'ios-close-circle-outline',
                  size: '20',
                  color: params.row.hasAuth ? '#50D9A2' : '#FD7C7C',
                },
                style: {
                  fontWeight: 'bold',
                  paddingLeft: '20px',
                },
              })
            },
          },
        ]
      },
    },
    mounted() {
      this.loadRelateMini() // 拉取商户公众号关联的小程序
    },
    methods: {
      sendValidCode() {
        this.isSending = true
        this.$ajaxGet(this.API.SEND_VALID_CODE).then((res) => {
          this.isSending = false
          if (res && res.code === 10000) {
            this.$Message.success(res.message || '操作成功')
            this.countDownTimer()
          }
        })
      },
      // 拉取商户公众号关联的小程序
      async loadRelateMini() {
        const { data } = await this.$ajaxGet(this.API.RELATE_MINIAPP)
        if (data) {
          this.miniProgram = data
        }
      },
      // 获取公众号授权权限列表
      async viewAuthList() {
        const { data } = await this.$ajaxGet(this.API.AUTH_LIST, {
          authorizerAppid: this.accoutSetting['authorizerAppid'],
        })
        if (data) {
          this.authList = data
          this.authVisible = true
        }
      },
      // 打开解除绑定弹窗
      openRealseBind() {
        this.bindInfo.visible = true
      },
      cancelRelease() {
        this.bindInfo = {
          code: '', // 短信验证码
          agree: false, // 是否知晓风险
          visible: false, // 解除绑定弹窗可见性
          btnLoading: false, // 解除绑定按钮 loading
        }
      },
      // 确认解除绑定
      async confirmRelease() {
        window.open('https://mp.weixin.qq.com/', '_blank')
        // return
        // this.bindInfo.btnLoading = true;
        // const {code} = await this.$ajaxGet(this.API.RELEASE_BIND,{
        //   smsCode:this.bindInfo.code,phone:localStorage.creatorPhone,
        //   authorizerAppid:this.accoutSetting['authorizerAppid']
        // });
        // if(code && code ===10000){
        //   this.bindInfo.btnLoading = false;
        //   this.$Message.success("操作成功");
        //   this.cancelRelease();
        //   this.$parent.checkSign()
        //   // this.$router.push("/officeAccount/setting")
        // }
      },
    },
  }
</script>
<style lang="scss">
  .account-form {
    .ivu-form-item-label {
      font-family: SFUIDisplay-Light, SFUIDisplay;
      font-size: 14px;
      font-weight: 300;
      color: rgba(105, 105, 116, 1);
    }
  }

  .auth-list-table {
    .ivu-table-body {
      max-height: 480px;
      overflow: hidden;
      overflow-y: auto;
    }
  }
</style>
<style lang="scss" scoped>
  .top-desc {
    display: flex;
    justify-content: space-between;
    margin-bottom: 24px;

    > div {
      display: flex;

      h3 {
        font-family: SFUIDisplay-Medium, SFUIDisplay;
        font-size: 16px;
        font-weight: 500;
        color: rgba(23, 23, 37, 1);
      }

      p {
        margin-top: 10px;
        font-family: SFUIDisplay-Light, SFUIDisplay;
        font-size: 14px;
        font-weight: 300;
        color: rgba(105, 105, 116, 1);
      }

      img {
        width: 56px;
        height: 56px;
        margin-right: 24px;
        border-radius: 50%;
      }
    }

    a {
      align-self: flex-end;
    }
  }

  .infor-formitem {
    display: flex;
    justify-content: space-between;

    .ivu-divider {
      height: 0.6em;
      min-height: 14px;
    }

    p {
      font-family: SFUIDisplay-Light, SFUIDisplay;
      font-size: 12px;
      font-weight: 300;
      color: rgba(146, 146, 157, 1);
    }

    p:first-child {
      font-size: 14px;
      color: #171725;
    }

    padding-bottom: 20px;
    border-bottom: solid 1px #e2e2e9;
  }

  .account-form {
    h4 {
      height: 38px;
      padding: 8px 16px;
      margin-bottom: 40px;
      font-family: SFUIDisplay-Medium, SFUIDisplay;
      font-size: 12px;
      color: rgba(68, 68, 78, 1);
      background: rgba(250, 250, 251, 1);
      border-radius: 8px;
    }
  }

  .auth-title {
    padding: 12px 16px;
    // border:1px solid rgba(240,146,55,1);
    margin-bottom: 20px;
    // background:rgba(253,246,237,1);
    border-radius: 4px;

    .ivu-icon {
      margin-right: 8px;
      font-size: 16px;
      font-weight: bold;
      color: #ff951b;
    }
  }

  .bind-box {
    section.mes-code {
      display: flex;
      align-items: center;

      span {
        font-family: SFUIDisplay-Light, SFUIDisplay;
        font-size: 14px;
        font-weight: 300;
        color: rgba(68, 68, 79, 1);

        label {
          color: #f00;
        }
      }
    }
  }

  .auth-desc {
    margin: 8px 0 20px;
    font-size: 12px;
    color: #92929d;
    text-indent: 8em;
  }

  .auth-check {
    padding-left: 95px;
    margin-bottom: 40px;

    label {
      font-family: SFUIDisplay-Light, SFUIDisplay;
      font-size: 14px;
      font-weight: 300;
      color: rgba(68, 68, 79, 1);
    }
  }
</style>
