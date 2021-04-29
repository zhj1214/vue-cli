<template>
  <div class="detail-base">
    <!--审核中-->
    <div
      v-if="versionData.versionState === '0'"
      class="delete-alert is-audit clear"
      style="height: auto; line-height: 2;"
    >
      <i style="color: #756cea;" class="icon iconfont iconWarning" />
      <span style="color: #171725;">
        {{ versionData.editionInfo.lastUpdateTime }} -
        {{ versionData.editionInfo.updateStateDesc }}，请耐心等待</span
      >
    </div>
    <!--可升级 -->
    <div
      v-if="versionData.updateState === '1'"
      class="delete-alert"
      style="height: auto; line-height: 2;"
    >
      <i style="color: #756cea;" class="icon iconfont iconInfo" />
      <span style="color: #171725;">
        已检测到小程序新版本{{ versionData.editionInfo.onlineVersionCode }},您可手动升级到最新版本
      </span>
      <span
        v-if="versionData.usageState !== '2'"
        style="position: relative; z-index: 1; float: right;"
        class="span-a"
        @click="onUpgrade"
        >升级</span
      >
      <!--被禁用情况-->
      <Tooltip
        v-if="versionData.usageState === '2'"
        style="float: right;"
        max-width="200"
        transfer
        content="当前小程序禁用中，请先将小程序启用后，再进行最新版本的升级。"
      >
        <span style="position: relative; z-index: 1; color: #b5b5be; cursor: pointer;">升级</span>
      </Tooltip>
    </div>

    <!--未通过-->
    <div
      v-if="versionData.versionState === '2'"
      class="delete-alert is-error"
      style="height: auto; line-height: 2;"
    >
      <i style="color: #756cea;" class="icon iconfont iconError" />
      <span style="color: #171725;">
        {{ versionData.editionInfo.lastUpdateTime }} -
        <span v-html="versionData.editionInfo.updateStateDesc" />
        请耐心等待</span
      >
      <span style="position: relative; z-index: 1; float: right;" class="span-a" @click="onUpgrade"
        >重新提交</span
      >
    </div>

    <!--version info-->
    <div class="version-info clear">
      <div class="left-img">
        <img :src="appDetail.headImg || defaultAppLogo" alt="" />
      </div>
      <div class="right-info">
        <h3 style="margin-bottom: 24px; font-size: 16px;">
          {{ appDetail.nickName }}
        </h3>

        <div v-if="versionData.versionState !== '3'">
          <div class="p-text">
            <div class="w300 inline-block"> 线上版本号 </div>
            <div v-if="versionData.usageState" class="w300 inline-block"> 小程序使用状态 </div>
          </div>
          <div style="margin-top: 4px;">
            <div class="w300 inline-block">
              {{ versionData.editionInfo.onlineVersionCode }}
            </div>
            <div
              v-if="versionData.versionState && versionData.versionState !== '-1'"
              class="w300 inline-block"
            >
              <span :class="usageStateClass[versionData.usageState]">
                {{ usageStateMap[versionData.usageState] }}
              </span>
              <span
                >|
                <span class="span-a" @click="onDisabled">
                  {{
                    versionData.usageState === '1'
                      ? '禁用'
                      : versionData.usageState === '2'
                      ? '启用'
                      : ''
                  }}
                </span>
                <Tooltip
                  :max-width="200"
                  :content="
                    versionData.usageState === '1'
                      ? '禁用小程序，您的小程序将显示「该商户已关闭」，导致您的用户无法正常访问；禁用后若再次重新使用，小程序数据将被保留。'
                      : '恢复正常使用小程序'
                  "
                >
                  <i
                    style="position: relative; top: -2px; color: #b9b9c2;"
                    class="icon iconfont iconTips"
                  />
                </Tooltip>
              </span>
            </div>
          </div>
          <p v-if="versionData.usageState" style="line-height: 48px;">
            小程序线上版本发布于
            {{ versionData.editionInfo.onlineVersionTime }}
          </p>

          <!--为发布过版本-->
          <p v-if="!versionData.usageState">
            您的微信小程序尚未发布
            <span style="color: #e2e2ea;">|</span>
            <span class="span-a ml-10" @click="onUpgrade">发布小程序</span>
          </p>
        </div>
        <!--完善信息-->
        <div v-if="versionData.versionState === '3'" class="clear">
          <span>您的微信小程序尚未完善基本信息，完善基本信息设置，即可发布小程序</span>
          <a href="https://mp.weixin.qq.com/" target="_blank">
            <span class="span-a" style="float: right;">完善信息</span>
          </a>
        </div>
      </div>
    </div>

    <!--base info-->
    <div class="base-info">
      <h3 style="margin-bottom: 24px;"> 基本信息 </h3>
      <div class="base-block">
        <div class="block">
          <div class="left"> 小程序授权状态： </div>
          <div class="right clear" style="padding-top: 8px;">
            <div class="clear" style="line-height: 24px; color: #171725;">
              已授权
              <span style="float: right; padding-left: 5px;" class="span-a" @click="onCancelBind"
                >解除绑定</span
              >
              <span style="float: right; color: #e2e2ea;">|</span>
              <span
                id="reAuth"
                style="float: right; padding-right: 5px;"
                class="span-a"
                @click.self="createReAuth"
                >重新授权</span
              >
            </div>
            <p>若账号信息更新时，请重新授权</p>
          </div>
        </div>
        <div class="block">
          <div class="left"> 服务类目： </div>
          <div class="right">
            {{ appDetail.categories || '-' }}
          </div>
        </div>
        <div class="block">
          <div class="left"> 主体信息： </div>
          <div class="right">
            {{ appDetail.principalName || '-' }}
          </div>
        </div>
        <div class="block">
          <div class="left"> 微信认证： </div>
          <div class="right">
            {{ verifyTypeMap[appDetail.verifyTypeInfo] || '-' }}
            <a href="https://mp.weixin.qq.com/" target="_blank">
              <span class="span-a float-right">前往认证</span>
            </a>
          </div>
        </div>
        <div class="block">
          <div class="left"> 微信支付： </div>
          <div class="right">
            <span>{{ appDetail.payType === 1 ? '微信支付' : '未设置' }}</span>
            <span class="span-a" style="float: right;" @click="onPaySetting">支付设置</span>
          </div>
        </div>
        <div v-if="relateAccount" class="block">
          <div class="left"> 关联公众号： </div>
          <div class="right">
            <div class="clear" style="color: #171725;">
              <span
                >{{ isRelateAccount ? '已' : '可' }}关联公众号 「{{
                  relateAccount.appName || ''
                }}」</span
              >
              <Poptip
                v-if="relateAccount && isRealteMenu"
                confirm
                transfer
                style="float: right;"
                width="260"
                placement="top-end"
                popper-class="weapp-pop"
                title="若解除与该公众号的关联，会导致公众号自定义菜单的跳转为无效，是否确认解除关联？"
                @on-ok="linkWeappToAccount"
              >
                <span class="span-a">{{ isRelateAccount ? '解除关联' : '关联' }}</span>
              </Poptip>
              <span v-else class="span-a" style="float: right;" @click="linkWeappToAccount">{{
                isRelateAccount ? '解除关联' : '关联'
              }}</span>
            </div>
            <p>支持关联到授权给银泰商业运营的公众号</p>
          </div>
        </div>
      </div>
      <h3 style="margin-bottom: 24px;"> 账号信息 </h3>

      <div class="account-block">
        <div class="block">
          <div class="left"> 小程序AppID： </div>
          <div class="right">
            {{ appDetail.authorizerAppid }}
          </div>
        </div>
        <div class="block">
          <div class="left"> 原始ID： </div>
          <div class="right">
            {{ appDetail.userName }}
          </div>
        </div>
        <div class="block">
          <div class="left"> 已授权权限： </div>
          <div class="right">
            <div class="">
              银泰商业运营平台可使用已授权小程序的权限集
              <span style="float: right;" class="span-a" @click="onSeeAuthList">查看权限</span>
            </div>
            <p style="color: #92929d;">
              为保证您在银泰商业运营平台的各项功能正常使用，请保证您已将所有权限集授权给银泰商业运营平台
            </p>
          </div>
        </div>
      </div>
    </div>

    <!--pay setting modal-->
    <Modal
      v-model="payModal"
      width="700"
      title="支付设置"
      :mask-closable="false"
      @@on-cancel="onCancelPay"
    >
      <Form ref="payData" :model="payData" :rules="payDataValid" :label-width="180">
        <FormItem label="配置渠道：">
          <p>微信小程序</p>
        </FormItem>
        <FormItem label="支付产品：">
          <p>微信支付</p>
        </FormItem>
        <FormItem label="支付模式：">
          <p>自由模式</p>
        </FormItem>
        <FormItem label="微信商户名称：">
          <i-input v-model="payData.merchName" placeholder="请输入微信商户名称" :maxlength="30" />
        </FormItem>
        <FormItem label="微信商户号：" prop="merchID">
          <i-input v-model="payData.merchID" placeholder="请输入微信商户号" :maxlength="50" />
        </FormItem>
        <FormItem label="AppID：">
          <p>{{ appDetail.authorizerAppid }}</p>
        </FormItem>
        <FormItem label="签名类型：">
          <p>MD5</p>
        </FormItem>
        <FormItem label="秘钥：" prop="key">
          <i-input v-model="payData.key" placeholder="请输入秘钥" :maxlength="100" />
        </FormItem>
        <FormItem label="证书密码：" prop="certPassword">
          <div class="cert-upload">
            <!--:on-remove="onRemovePassword"-->
            <Upload
              :action="$upload"
              class="upload-class"
              name="file"
              :format="['pem']"
              :max-size="1024"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              :on-success="uploadPassword"
              :default-file-list="passwordDefaultList"
              :headers="headers"
              :on-error="handlerError"
            >
              <Button>
                <i class="icon iconfont iconUpload" style="position: relative; top: -2px;" /> 上传
              </Button>
            </Upload>
            <p class="p-text"> 最多上传一个文件，请上传 .pem格式秘钥 </p>
          </div>
        </FormItem>
        <FormItem label="证书：" prop="certUrl">
          <div class="cert-upload">
            <!--:on-remove="onRemoveKey"-->
            <Upload
              :action="$upload"
              class="upload-class"
              name="file"
              :format="['p12']"
              :max-size="1024"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              :on-success="uploadKey"
              :default-file-list="certDefaultList"
              :headers="headers"
              :on-error="handlerError"
            >
              <Button>
                <i class="icon iconfont iconUpload" style="position: relative; top: -2px;" /> 上传
              </Button>
            </Upload>
            <p class="p-text"> 最多上传一个文件，请上传pkcs12格式证书 (apiclient_cert.p12) </p>
          </div>
        </FormItem>
        <FormItem label="支付授权目录填写说明：">
          <p>请直接复制下述链接，去微信官方填写：</p>
          <p v-for="(item, index) in payData.authList" :key="index" class="span-a">
            {{ item }}
          </p>
        </FormItem>
      </Form>

      <div slot="footer">
        <Button type="default" @click="onCancelPay"> 取消 </Button>
        <Button type="primary" :disabled="isPayCommit" @click="onCommitPay"> 提交 </Button>
      </div>
    </Modal>
    <!-- auth list modal -->
    <Modal v-model="authListModal" title="授权权限列表">
      <Table :data="tableList" :columns="tableCol" :height="500" />
      <div slot="footer">
        <Button @click="authListModal = false"> 关闭 </Button>
      </div>
    </Modal>

    <!--解除绑定-->
    <Modal
      v-model="cancelBindModal"
      width="700"
      title="解除绑定"
      :mask-closable="false"
      @on-cancel="onCancelBindModal"
    >
      <div>
        <div class="delete-alert clear" style="background-color: white; border: none;">
          <i style="color: #756cea;" class="icon iconfont iconInfo" />
          <span style="color: #171725;"
            >解除小程序授权后，如果有已经在运行的小程序将无法再继续使用，请谨慎操作。</span
          >
        </div>

        <Form
          v-if="false"
          ref="cancelForm"
          :model="cancelBindData"
          :label-width="150"
          :rules="cancelBindDataValid"
        >
          <FormItem label="短信验证码" prop="smsCode">
            <div style="display: inline-block;">
              <i-input
                v-model="cancelBindData.smsCode"
                style="width: 248px;"
                :maxlength="6"
                placeholder="请输入短信验证码"
              />
              <Button class="ml-10" :disabled="isSending" @click="onSendCode">
                {{ countDownSecond === 60 ? '发送验证码' : countDownSecond + 's' }}
              </Button>
            </div>
            <p style="font-size: 12px; color: #92929d;">
              验证码短信将发送到你的绑定的手机，{{ cancelBindData.phone }}，请注意查收
            </p>

            <Checkbox v-model="cancelBindData.isCheck">
              已知晓解除绑定的风险，确认解除绑定
            </Checkbox>
          </FormItem>
        </Form>
      </div>

      <div slot="footer">
        <Button type="default" @click="onCancelBindModal"> 取消 </Button>
        <!-- :disabled="isCheckDisabled||isCancelBinding" -->
        <Button type="primary" :loading="isCancelBinding" @click="onCommitCancelBind">
          解除绑定
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import mixinsLoginHall from '../../../../mixins/mixinsLoginHall'
  import mixinsUpload from '../../../../mixins/mixinsUpload'
  import defaultAppLogo from '../../../../assets/images/channel/default-app-logo.png'

  export default {
    name: 'DetailBase',
    mixins: [mixinsLoginHall, mixinsUpload],
    props: {
      appData: {
        type: Object,
        default() {
          return {
            appId: '',
          }
        },
      },
    },
    data() {
      return {
        authListModal: false,
        cancelBindModal: false,
        payModal: false,
        isSending: false,
        isCancelBinding: false,
        isPayCommit: false,
        defaultAppLogo,
        originOrgId: localStorage.getItem('originOrgId'),
        redirectUrl: location.origin + '/channel/miniProgram/base?type=reAuth',
        cancelBindData: {
          phone: localStorage.getItem('phone'),
          smsCode: '',
          isCheck: false,
        },
        cancelBindDataValid: {
          smsCode: [
            {
              required: true,
              message: '请输入短信验证码',
              trigger: 'change',
            },
          ],
        },
        payData: {
          merchName: '',
          merchID: '',
          key: '',
          certPassword: '',
          certUrl: '',
          authList: [],
        },
        payDataValid: {
          //微信商户号
          merchID: [
            {
              required: true,
              message: '请输入微信商户号',
              trigger: 'change',
            },
          ],
          // 秘钥
          key: [
            {
              required: true,
              message: '请输入秘钥',
              trigger: 'change',
            },
          ],
          // 证书密码
          certPassword: [
            {
              required: true,
              message: '请输入证书密码',
              trigger: 'change',
            },
          ],
          // 证书地址
          certUrl: [
            {
              required: true,
              message: '请上传证书',
              trigger: 'blur',
            },
          ],
        },
        versionData: {
          editionInfo: {},
        },
        appDetail: {},
        verifyTypeMap: {
          '-1': '未认证',
          0: '微信认证',
          1: '新浪微博认证',
          2: '腾讯微博认证',
          3: '已资质认证，名称未认证',
          4: '已资质认证，新浪微博认证',
          5: '已资质认证，腾讯微博认证',
          undefined: '未认证',
        },
        usageStateMap: {
          0: '已过期',
          1: '使用中',
          2: '已禁用',
        },
        usageStateClass: {
          0: 'is-disabled',
          1: 'is-usage',
          2: 'is-disabled',
        },
        tableList: [],
        tableCol: [
          {
            title: '权限项',
            key: 'limitName',
          },
          {
            title: '授权状态',
            render: (h, params) => {
              return h('i', {
                class: ['icon', 'iconfont', params.row.hasAuth ? 'iconSuccess' : 'iconError'],
                style: {
                  color: params.row.hasAuth ? '#3DD598' : '#FC5A5A',
                },
              })
            },
            filters: [
              { label: '已授权', value: true },
              { label: '未授权', value: false },
            ],
            filterMultiple: false,
            filterMethod: this.filterHasAuth,
          },
        ],
        isRelateAccount: false, // 是否关联了公众号
        relateAccount: null,
        isRealteMenu: false, // 小程序是否关联了自定义菜单
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
      isCheckDisabled() {
        return !(this.cancelBindData.isCheck && this.cancelBindData.smsCode)
      },
      authCode() {
        return this.$route.query.auth_code || ''
      },
      certDefaultList() {
        let url = this.payData.certUrl
        const name = (url || '').replace(/^.+(.+?)\//g, '')
        if (url) {
          return [
            {
              name,
              url,
            },
          ]
        }
        return []
      },
      passwordDefaultList() {
        let url = this.payData.certPassword
        const name = (url || '').replace(/^.+(.+?)\//g, '')
        if (url) {
          return [
            {
              name,
              url,
            },
          ]
        }
        return []
      },
    },
    created() {
      const { type } = this.$route.query || {}
      if (type === 'success' || !type) this.getAppDetail()

      // 获取当前平台授权的公众号
      this.getRelateAccount()
    },
    mounted() {
      this.getVersion()
      const { type } = this.$route.query || {}
      if (type === 'reAuth') {
        this.reBindAuth()
      }
    },
    methods: {
      // 判定公众号自定义菜单是否关联,用于判定解除关联时是否poptip提示文案
      async checkRelateMenu() {
        const { data } = await this.$ajaxGet(
          '/wechatplatform-server/api/mx/mp/menu/checkLinkWeapp',
          { appId: this.appDetail.authorizerAppid }
        )
        this.isRealteMenu = data // true 关联 false 没有关联
      },
      // 根据小程序原始ID校验是否关联了公众号
      async checkRelateAccount() {
        const { data } = await this.$ajaxGet(
          '/wechatplatform-server/api/edition/wx/app/link/status',
          {
            userName: this.appDetail.userName,
          }
        )
        if (data != null) {
          // 状态 0未关联 1关联 2关联中
          this.isRelateAccount = data === 1
        }
      },
      // 获取当前平台授权的公众号
      async getRelateAccount() {
        // appType 1公众号 2小程序
        const { data } = await this.$ajaxGet('/wechatplatform-server/api/edition/wx/platform/app', {
          appType: 1,
        })
        if (data) {
          this.relateAccount = data
        }
      },
      // 小程序关联或解除公众号
      async linkWeappToAccount() {
        const { code } = await this.$ajaxPost('/wechatplatform-server/api/edition/wx/app/link', {
          mpId: this.relateAccount.appId, // 微信公众号appId
          weappId: this.appDetail.authorizerAppid, // 小程序 APPID
          status: this.isRelateAccount ? 0 : 1, // 0解除关联 1关联
        })
        if (code && code === 10000) {
          this.$Message.success('操作成功')

          this.checkRelateAccount()

          // 弹窗提示用户去做解除绑定操作
          if (this.isRelateAccount) {
            this.showLinkAppModal()
          } else {
            // 如果之前是没有关联的，则弹窗提示
            this.$Modal.info({
              title: '提示',
              content: '已向公众号管理员微信发送关联邀请，若对方在24h内无应答，邀请失效',
            })
          }
        }
      },
      // 显示关联绑定弹窗
      showLinkAppModal() {
        this.$Modal.info({
          title: '提示',
          content: '<p>已向管理员发起解除绑定请求，待管理员确认解除关联操作</p>',
          onOk: () => {
            this.getAppDetail()
          },
          onCancel: () => {
            this.getAppDetail()
          },
        })
      },
      createReAuth() {
        this.$ajaxGet('/wechatplatform-server/api/auth/preAuthCode').then((res) => {
          if (res && res.code === 10000) {
            const { componentAppid, preAuthCode } = res.data || {}
            this.$nextTick(() => {
              const href =
                'https://mp.weixin.qq.com/cgi-bin/componentloginpage?component_appid=' +
                componentAppid +
                '&auth_type=2&pre_auth_code=' +
                preAuthCode +
                '&redirect_uri=' +
                this.redirectUrl
              const parentNode = document.querySelector('#reAuth')
              const aElement = document.createElement('a')
              aElement.setAttribute('href', href)
              parentNode.appendChild(aElement)
              aElement.click()
              document.body.removeChild(aElement)
            })
          }
        })
      },
      getAppDetail() {
        this.$ajaxGet('/wechatplatform-server/api/auth/getAuthInfo', {
          orgId: this.originOrgId,
          type: '2',
        }).then((res) => {
          if (res && res.code === 10000) {
            if (res.data) {
              this.$emit('whatComponent', { name: 'DetailBase' })
              this.appDetail = res.data || {}
              // 获取了小程序信息后，校验是否关联了公众号
              this.checkRelateAccount()
              // 校验公众号自定义菜单是否关联了小程序
              this.checkRelateMenu()
            } else {
              // 未配置基础信息过
              this.$emit('whatComponent', { name: 'InitBase' })
            }
          } else this.$emit('whatComponent', { name: 'InitBase' })
        })
      },
      filterHasAuth(value, row) {
        if (value === true) return row.hasAuth
        else if (value === false) return !row.hasAuth
      },
      onCancelPay() {
        this.payModal = false
      },
      onCommitPay() {
        this.$refs['payData'].validate((valid) => {
          if (valid) this.updatePaySetting()
        })
      },
      uploadPassword(res) {
        if (res && res.code === 10000) {
          this.$Message.success(res.message)
          this.$set(this.payData, 'certPassword', res.data)
        }
      },
      uploadKey(res) {
        if (res && res.code === 10000) {
          this.$Message.success(res.message)
          this.$set(this.payData, 'certUrl', res.data)
        }
      },
      getVersion() {
        this.$ajaxGet('/wechatplatform-server/api/edition/wx/versionInfo', {
          orgId: this.originOrgId,
        }).then((res) => {
          if (res && res.code === 10000) {
            this.versionData = { ...this.versionData, ...(res.data || {}) }
          }
        })
      },
      onSendCode() {
        if (this.countDownSecond < 60) {
          return
        }
        this.sendValidCode()
      },
      sendValidCode() {
        this.isSending = true
        this.$ajaxGet('/wechatplatform-server/api/auth/sendSmsCode').then((res) => {
          this.isSending = false
          if (res && res.code === 10000) {
            this.$Message.success(res.message || '操作成功')
            this.countDownTimer()
          }
        })
      },
      /**
       * @decs 发布、提交、升级
       * */
      onUpgrade() {
        this.$ajaxPost('/wechatplatform-server/api/edition/wx/release', {
          orgId: this.originOrgId,
        }).then((res) => {
          this.isSending = false
          if (res && res.code === 10000) {
            this.$Message.success(res.message || '操作成功')
            this.getVersion()
          }
        })
      },
      // 禁止、启用小程序
      onDisabled() {
        const type =
          this.versionData.usageState === '1' ? '2' : this.versionData.usageState === '2' ? '1' : ''
        if (!type) return
        this.$ajaxPost('/wechatplatform-server/api/edition/wx/modifyMiniProgramState', {
          type,
          orgId: this.originOrgId,
        }).then((res) => {
          this.isSending = false
          if (res && res.code === 10000) {
            this.$Message.success(res.message || '操作成功')
            this.getVersion()
          }
        })
      },
      onCancelBind() {
        this.cancelBindModal = true
      },
      onCancelBindModal() {
        this.cancelBindModal = false
        this.$refs['cancelForm'].resetFields()
        this.cancelBindData.isCheck = false
      },
      onPaySetting() {
        this.payModal = true
        this.getPaySetting()
      },
      onCommitCancelBind() {
        window.open('https://mp.weixin.qq.com/', '_blank')
        // this.$refs['cancelForm'].validate(valid => {
        // 	if (valid) {
        // 		this.cancelBind();
        // 	}
        // });
      },
      cancelBind() {
        this.isCancelBinding = true
        this.$ajaxGet('/wechatplatform-server/api/auth/cancelAuth', {
          authorizerAppid: this.appDetail.authorizerAppid,
          phone: this.cancelBindData.phone,
          smsCode: this.cancelBindData.smsCode,
        }).then((res) => {
          if (res && res.code === 10000) {
            this.$Message.success(res.message || '操作成功')
            this.onCancelBindModal()
            window.location.reload()
          }
          this.isCancelBinding = false
        })
      },
      /*
       * @desc 重新绑定
       * */
      reBindAuth() {
        this.$ajaxPost('/wechatplatform-server/api/auth/bindAuthInfo', {
          orgId: this.originOrgId,
          authCode: this.authCode,
        }).then((res) => {
          if (res && res.code === 10000) {
            this.getAppDetail()
          }
        })
      },
      onSeeAuthList() {
        this.authListModal = true
        this.getAuthList()
        this.getAllAuthList()
      },
      getAuthList() {
        this.$ajaxGet('/wechatplatform-server/api/auth/getFunctionLimit', {
          authorizerAppid: this.appDetail.authorizerAppid,
        }).then((res) => {
          if (res && res.code === 10000) {
            this.tableList = res.data || []
          }
        })
      },
      // 拉取微信所有开发权限列表
      getAllAuthList() {},
      getPaySetting() {
        this.$ajaxGet('/wechatplatform-server/api/auth/pay/getPaySet', {
          orgId: this.originOrgId,
          type: '2',
        }).then((res) => {
          if (res && res.code === 10000) {
            let { settingInfo, authList = [] } = res.data || {}
            if (!settingInfo) settingInfo = {}
            this.payData = { ...this.payData, ...settingInfo, authList }
          }
        })
      },
      updatePaySetting() {
        const { merchName, merchID, key, certPassword, certUrl } = this.payData || {}
        this.isPayCommit = true
        this.$ajaxPost('/wechatplatform-server/api/auth/pay/setPaySet', {
          orgId: this.originOrgId,
          type: '2',
          merchName,
          merchID,
          key,
          certPassword,
          certUrl,
        }).then((res) => {
          if (res && res.code === 10000) {
            this.$Message.success(res.message || '操作成功')
            this.payModal = false
          }
          this.isPayCommit = false
        })
      },
    },
  }
</script>
<style lang="scss">
  .weapp-pop {
    .ivu-poptip-body {
      .ivu-icon {
        &::before {
          content: '';
        }

        display: inline-block;
        width: 16px;
        height: 16px;
        margin-top: 3px;
        margin-left: -3px;
        background: url(../../../../assets/images/channel/warn-icon.png) center no-repeat;
      }

      .ivu-poptip-body-message {
        text-align: left;
      }
    }
  }
</style>
<style scoped lang="scss">
  .cert-upload {
    .upload-class {
      height: auto;
      line-height: 36px;
      text-align: left;
      background: #fff;
    }
  }

  .version-info {
    padding: 24px;
    margin-bottom: 24px;
    background: #fff;
    border-radius: 16px;

    .left-img {
      float: left;
      width: 56px;
      height: 56px;

      img {
        width: 56px;
        height: 56px;
        border-radius: 50%;
      }
    }

    .right-info {
      margin-left: 80px;

      > div {
        line-height: 24px;
      }
    }
  }

  .base-info {
    padding: 32px 40px;
    background: #fff;
  }

  .delete-alert {
    i {
      position: relative;
      top: -2px;
    }
  }

  .is-audit {
    background: #fff8e8;
    border: 1px solid #ffc542;
  }

  .is-error {
    background: #fff2f2;
    border: 1px solid #fc5a5a;
  }

  .is-usage {
    position: relative;

    &::before {
      position: relative;
      top: -2px;
      left: -4px;
      display: inline-block;
      width: 4px;
      height: 4px;
      vertical-align: middle;
      background: #50b5ff;
      border-radius: 50%;
      content: '';
    }
  }

  .is-disabled {
    position: relative;

    &::before {
      position: relative;
      top: -2px;
      left: -4px;
      display: inline-block;
      width: 4px;
      height: 4px;
      vertical-align: middle;
      background: #b5b5be;
      border-radius: 50%;
      content: '';
    }
  }

  .base-info {
    border-radius: 16px;
  }

  .block {
    line-height: 40px;

    &::after {
      display: block;
      clear: both;
      content: '';
    }

    .left {
      float: left;
      width: 140px;
      color: #696974;
      text-align: right;
    }

    .right {
      margin-left: 150px;
      color: #b5b5be;
    }
  }
</style>
