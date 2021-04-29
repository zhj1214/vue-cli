<template>
  <div>
    <h2 class="h2">
      <span>注销账号</span>
    </h2>
    <div class="account-cancel">
      <div class="cancel-form">
        <Form ref="cancelAccount" class="form-body" :model="cancelObj" :rules="cancelObjValid">
          <FormItem v-if="setup === 0" label="银泰商业账号">
            <div class="mos-item">
              <span class="area-code">{{ cancelObj.areaCode }}</span>
              <div class="phone-input">
                <span class="phone-span">{{ cancelObj.phone }}</span>
              </div>
            </div>
          </FormItem>

          <!--验证码-->
          <FormItem
            v-if="setup === 0"
            style="margin-top: 38px; margin-bottom: 10px;"
            prop="messageCode"
          >
            <div>
              <i-input
                v-model="cancelObj.messageCode"
                type="text"
                :maxlength="6"
                placeholder="请输入短信验证码"
              />
              <span class="send-valid is-active" :disabled="isSending" @click="onSendValid">{{
                countDownSecond === 60 ? '发送验证码' : countDownSecond + 's'
              }}</span>
            </div>
          </FormItem>

          <!--风险提示-->
          <div v-if="setup === 1" class="notify">
            <strong class="notify-strong"
              >您的账号 {{ cancelObj.areaCode }} {{ cancelObj.phone }} 注销后有以下风险</strong
            >
            <ul class="ul-item">
              <li>身份、帐号信息、会员权益等资产将清空且无法恢复</li>
              <li>帐号注销后视作你自动放弃所有权益</li>
              <li>交易记录、分销员身份及佣金将清空</li>
              <li>帐号一旦被注销将不可恢复，请在操作之前自行备份帐号相关的所有信息和数据</li>
              <li>帐号注销不代表注销前的帐号行为和相关责任得到豁免或减轻</li>
            </ul>

            <Checkbox v-model="cancelObj.isCheckBox">
              已阅读并同意
              <a href="javascript:alert('稍后呈现')"
                ><span class="is-active">《用户注销协议》</span></a
              >
            </Checkbox>
          </div>
        </Form>

        <Button
          style="height: 48px; margin-top: 60px;"
          long
          type="primary"
          :disabled="isDisabled"
          @click="onNextSetup"
        >
          {{ setup ? '已知晓并接受风险，确认注销' : '下一步' }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
  import LoginHallMixins from '../../../../mixins/mixinsLoginHall'

  export default {
    name: 'CancelAccount',
    mixins: [LoginHallMixins],
    props: {
      accountObj: {
        type: Object,
        default() {
          return {
            phone: '',
            areaCode: '',
            messageCode: '',
          }
        },
      },
    },
    data() {
      return {
        setup: 0,
        cancelObjValid: {
          messageCode: [
            { required: true, message: '请输入验证码', trigger: 'blur' },
            { len: 6, message: '验证码为6位', trigger: 'change' },
          ],
        },
        cancelObj: {
          phone: '',
          areaCode: '',
          messageCode: '',
        },
        isSending: false,
      }
    },
    computed: {
      isDisabled() {
        return this.setup === 1 && !this.cancelObj.isCheckBox
      },
    },
    created() {
      const { phone, areaCode, messageCode } = this.accountObj || {}
      this.cancelObj.phone = phone || localStorage.phone
      this.cancelObj.areaCode = areaCode || '+86'
      this.cancelObj.messageCode = messageCode
    },
    methods: {
      onSendValid() {
        if (this.countDownSecond < 60) {
          return
        }
        this.sendValid()
      },
      sendValid() {
        const { phone, areaCode } = this.cancelObj || {}
        if (!phone || !areaCode) return
        this.isSending = true
        this.$ajaxGet('/user-server/auth/getMessageCode', {
          phone,
          areaCode,
        }).then((res) => {
          if (res && res.code === 10000) {
            this.countDownTimer()
            if (res.data && res.data.flag === 2) {
              this.$Message.success('已发送，请注意查收')
            }
          }
          this.isSending = false
        })
      },

      onNextSetup() {
        if (!this.setup) {
          this.$refs['cancelAccount'].validate((valid) => {
            if (valid) this.checkNext()
          })
        } else this.cancelAccount()
      },
      checkNext() {
        const { phone, messageCode } = this.cancelObj
        if (!phone || !messageCode) {
          this.$Message.error('非法参数1')
          return
        }
        this.$ajaxPost('/user-server/auth/checkMessageCode', { phone, messageCode }).then((res) => {
          if (res && res.code === 10000) {
            this.setup = 1
          }
        })
      },
      cancelAccount() {
        const id = localStorage.getItem('userId')
        if (!id) {
          this.$Message.error('非法参数2')
          return
        }
        this.$ajaxPost('/user-server/auth/confirmCancellation', { id }).then((res) => {
          if (res && res.code === 10000) {
            this.$Message.success(res.message || '操作成功')
            setTimeout(() => {
              location.href = '/login.html'
            }, 1000)
          }
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  .account-cancel {
    min-height: 760px;
    padding-top: 30px;
    padding-bottom: 48px;
    background: #fff;
  }

  .cancel-form {
    width: 340px;
    margin: 0 auto;
  }

  .change-phone-input {
    float: right;
    width: 200px;
  }

  .send-valid {
    position: absolute;
    top: 6px;
    right: 3px;
    z-index: 1;
    display: inline-block;
    height: 24px;
    line-height: 24px;
    cursor: pointer;
    content: '';
  }

  .notify {
    .notify-strong {
      font-size: 16px;
    }

    .ul-item {
      margin-top: 24px;
      margin-bottom: 24px;

      li {
        margin-bottom: 8px;
        list-style-type: disc;
      }
    }
  }
</style>
