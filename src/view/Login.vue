<!--
@desc 登录 / 注册 / 忘记密码
-->
<template>
  <div class="login">
    <Timeout v-if="isTimeout" />
    <div v-else class="login-wrap">
      <div class="login-body clear">
        <div class="left-banner">
          <div class="login-banner" />
        </div>
        <div class="right-form">
          <!-- <div class="login-type" v-if="actionsType==='login'">
												<span :class="!loginType?'is-active':'is-normal'">密码登录</span>
												<i-switch v-model="loginType" @on-change="switchLoginType"
												          true-color="#FFF7EA"
												          style="border: 1px solid #FFDDB5"
												          false-color="#FFF7EA">
												
												</i-switch>
												<span :class="loginType?'is-active':'is-normal'">验证码登录</span>
										</div> -->
          <Form ref="loginForm" class="form-body" :model="userData" :rules="loginRule">
            <h2>{{ actionsHeaderMap[actionsType] }}</h2>
            <!--手机账号-->
            <FormItem prop="phone" style="margin-top: 38px;">
              <div class="left-phoneArea phone-icon">
                <Dropdown @on-click="onClickArea">
                  <span class="phone-prefix">
                    {{ userData.areaCode }}
                  </span>
                  <Icon type="ios-arrow-down" />
                  <DropdownMenu slot="list">
                    <DropdownItem
                      v-for="item in countryAreaList"
                      :key="item.prefix"
                      :name="item.prefix"
                    >
                      {{ item.name + ' ' + item.prefix }}
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
              <i-input
                v-model="userData.phone"
                type="text"
                :maxlength="11"
                class="phone-input"
                placeholder="注册时填写的手机号"
                @keyup.enter.native="login"
              />
            </FormItem>

            <!--验证码-->
            <FormItem
              v-if="actionsType !== 'login' || loginType"
              style="margin-top: 38px; margin-bottom: 10px;"
              prop="messageCode"
            >
              <div class="valid-input">
                <i-input
                  v-model="userData.messageCode"
                  class=""
                  type="text"
                  :maxlength="6"
                  placeholder="填写短信验证码"
                  @keyup.enter.native="login"
                />
                <span class="send-valid is-active" :disabled="isSending" @click="onSendValid">{{
                  countDownSecond === 60 ? '发送验证码' : countDownSecond + 's'
                }}</span>
              </div>
            </FormItem>

            <!--密码-->
            <FormItem
              v-if="!loginType || actionsType === 'forget' || actionsType === 'register'"
              style="margin-top: 38px; margin-bottom: 10px;"
              prop="password"
            >
              <div class="password-input">
                <i-input
                  v-if="!isShowPassword['1']"
                  v-model="userData.password"
                  type="password"
                  :maxlength="16"
                  :placeholder="
                    actionsType === 'login' ? '请输入密码' : '设置密码，8-16位字符，包含字母和数字'
                  "
                  @keyup.enter.native="login"
                />
                <i-input
                  v-else
                  v-model="userData.password"
                  :maxlength="16"
                  :placeholder="
                    actionsType === 'login' ? '请输入密码' : '设置密码，8-16位字符，包含字母和数字'
                  "
                  @keyup.enter.native="login"
                />
                <span v-if="!isShowPassword['1']" class="show-password" @click="showPassword(1)" />
                <span v-else class="close-password" @click="showPassword(1)" />
              </div>
            </FormItem>

            <!--确认密码--->
            <FormItem
              v-if="actionsType !== 'login'"
              style="margin-top: 38px; margin-bottom: 10px;"
              prop="confirmPassword"
            >
              <div class="password-input">
                <i-input
                  v-if="!isShowPassword['2']"
                  v-model="userData.confirmPassword"
                  type="password"
                  :maxlength="16"
                  placeholder="请再次输入新密码"
                  @keyup.enter.native="login"
                />
                <i-input
                  v-else
                  v-model="userData.confirmPassword"
                  :maxlength="16"
                  placeholder="请再次输入新密码"
                  @keyup.enter.native="login"
                />
                <span v-if="!isShowPassword['2']" class="show-password" @click="showPassword(2)" />
                <span v-else class="close-password" @click="showPassword(2)" />
              </div>
            </FormItem>

            <p v-show="actionsType === 'login'" style="text-align: right;">
              <span class="forget-password" @click="onForgetPassword">忘记密码?</span>
            </p>

            <div v-if="actionsType === 'register'" style="margin-top: 38px; text-align: left;">
              <Checkbox v-model="userData.isCheckBox">
                已阅读并同意
                <a href="javascript:alert('稍后呈现')"
                  ><span class="is-active">《用户使用协议》</span></a
                >
              </Checkbox>
            </div>
            <div class="login-button">
              <Button
                id="loginBtn"
                class="btn-login"
                :loading="loading"
                :disabled="isAgree"
                type="primary"
                long
                @keyup.enter.native="login"
                @click="login"
              >
                {{ actionsLoginMap[actionsType] }}
              </Button>

              <!--														v-if="actionsType!=='register'"-->
              <span
                v-if="actionsType !== 'login'"
                class="is-active pointer"
                @click="onRegisterOrBackLogin"
              >
                {{ actionsFooterMap[actionsType] }}
              </span>
            </div>
          </Form>
        </div>
      </div>
    </div>
    <Copyright />
  </div>
</template>

<script>
  import md5 from 'js-md5'
  import Copyright from '../layout/Copyright'
  import LoginHallMixins from '../mixins/mixinsLoginHall'
  import { isPassword } from '../utils/tools'
  import Timeout from './Timeout'

  export default {
    name: 'Login',
    components: {
      Copyright,
      Timeout,
    },
    mixins: [LoginHallMixins],
    data() {
      const checkPw = (rule, value, callback) => {
        // 如果是注册
        if (this.actionsType !== 'login') {
          if (!value) {
            callback(new Error('请输入密码8-16位密码'))
          } else {
            if (!isPassword(value)) {
              callback(new Error('需包含数字和字母，8-16位'))
            }
            callback()
          }
        } else callback()
      }
      const checkPwConfirm = (rule, val, callback) => {
        if (this.actionsType !== 'login') {
          if (!val) {
            callback(new Error('再次确认密码'))
          } else {
            if (!isPassword(val)) {
              callback(new Error('需包含数字和字母，8-16位'))
            } else {
              if (val !== this.userData.password) {
                callback(new Error('两次密码不一致'))
              }
              callback()
            }
          }
        } else callback()
      }
      return {
        loading: false,
        loginType: false,
        isSending: false,
        isShowPassword: {
          1: false,
          2: false,
        },
        actionsType: 'login', // login、forget、register
        actionsHeaderMap: {
          login: '登录您的账号',
          forget: '忘记密码',
          register: '注册您的账号',
        },
        actionsLoginMap: {
          login: '登 录',
          forget: '重设密码',
          register: '注 册',
        },
        actionsFooterMap: {
          login: '免费注册',
          forget: '返回登录',
          register: '立即登录',
        },
        userData: {
          areaCode: '+86',
          phone: '',
          password: '',
          confirmPassword: '',
          messageCode: '',
          isCheckBox: true,
        },
        loginRule: {
          phone: [
            { required: true, message: '账号不能为空', trigger: 'blur' },
            { len: 11, message: '手机号格式不对', trigger: 'blue' },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { required: true, validator: checkPw, trigger: 'blur' },
          ],
          confirmPassword: [
            { required: true, message: '请再次确认密码', trigger: 'blur' },
            { required: true, validator: checkPwConfirm, trigger: 'blur' },
          ],
          messageCode: [
            { required: true, message: '请输入验证码', trigger: 'blur' },
            { len: 6, message: '验证码为6位', trigger: 'change' },
          ],
        },
      }
    },
    computed: {
      isAgree() {
        return this.actionsType === 'register' && !this.userData.isCheckBox
      },
      isTimeout() {
        return this.$route.query.type || ''
      },
    },
    mounted() {
      localStorage.clear()
      sessionStorage.clear()
      document.querySelector('#loginBtn') && document.querySelector('#loginBtn').focus()
    },
    methods: {
      onSendValid() {
        if (this.countDownSecond < 60) {
          return
        }
        if (!/^1[3|4|5|6|7|8|9|]\d{9}$/.test(this.userData.phone)) {
          this.$Message.warning('手机号格式不正确')
          return
        }
        if (this.actionsType === 'login' || this.actionsType === 'forget') this.loginSendValid() // 登录时候校验
        if (this.actionsType === 'register') this.registerSendValid() // 注册、忘记密码
      },
      /**
       * @desc 登录时候获取的验证码
       * @flag 1
       * @flag 2
       * */
      loginSendValid() {
        const { phone, areaCode } = this.userData
        this.isSending = true
        this.$ajaxGet('/user-server/auth/getMessageCode', {
          phone,
          areaCode,
        }).then((res) => {
          if (res && res.code === 10000) {
            this.isSending = false
            if (res.data.flag === 1) {
              this.$Message.warning('账号未注册，请先注册')
            }
            if (res.data.flag === 2) {
              this.$Message.success('已发送验证码，请注意查收')
              this.countDownTimer()
            }
          }
        })
      },
      /**
       * @desc 注册时候获取的验证码
       * @flag 3
       * @flag 4
       * */
      registerSendValid() {
        const { phone, areaCode } = this.userData
        this.isSending = true
        this.$ajaxGet('/user-server/auth/getMessageCodeWithCheck', {
          phone,
          areaCode,
        }).then((res) => {
          if (res && res.code === 10000) {
            this.isSending = false
            if (res.data.flag === 4) {
              this.$Message.warning('账号已注册，请直接登录')
              this.initLogin()
            }
            if (res.data.flag === 3) {
              this.$Message.success('已发送验证码，请注意查收')
              this.countDownTimer()
            }
          }
        })
      },
      onClickArea(name) {
        this.userData.areaCode = name
      },
      showPassword(val) {
        this.isShowPassword[val] = !this.isShowPassword[val]
      },
      switchLoginType() {
        this.$refs['loginForm'].resetFields()
        this.loading = false
      },
      onForgetPassword() {
        this.actionsType = 'forget'
        this.loginType = false
      },
      onRegisterOrBackLogin() {
        this.switchLoginType()
        this.isShowPassword = this.$options.data().isShowPassword
        this.countDownSecond = 60
        clearInterval(this.timer)
        switch (this.actionsType) {
          case 'login':
            this.actionsType = 'register'
            this.loginType = false
            this.userData.messageCode = ''
            break
          case 'forget':
            this.userData.confirmPassword = ''
            this.actionsType = 'login'
            break
          case 'register':
            this.userData = this.$options.data().userData
            this.actionsType = 'login'
            break
        }
      },
      login() {
        this.$refs['loginForm'].validate((valid) => {
          if (valid) {
            switch (this.actionsType) {
              case 'login':
                this.goLogin()
                break
              case 'forget':
                this.goForgetPassword()
                break
              case 'register':
                this.goRegister()
                break
            }
          }
        })
      },
      // 注册
      goRegister() {
        const { phone, messageCode, password, areaCode } = this.userData
        this.loading = true
        this.$ajaxPost('/user-server/auth/register', {
          phone,
          messageCode,
          password: md5(password),
          areaCode,
        }).then((res) => {
          this.loading = false
          if (res && res.code === 10000) {
            this.$Message.success(res.message)
            localStorage.setItem('token', res.data.token || '')
            localStorage.setItem('name', res.data.userInfo.name || '')
            localStorage.setItem('userId', res.data.userInfo.id || '')
            localStorage.setItem('headImg', res.data.userInfo.headImg || '')
            localStorage.setItem('phone', res.data.userInfo.phone || '')
            this.$nextTick(async () => {
              location.href = '/tenant/list'
            })
          }
        })
      },
      initLogin() {
        this.isShowPassword = this.$options.data().isShowPassword
        this.userData = this.$options.data().userData
        this.countDownSecond = 60
        this.loginType = false
        this.actionsType = 'login'
        localStorage.clear()
        this.switchLoginType()
        clearInterval(this.timer)
      },
      // 忘记密码,重置成功，返回登录页面
      goForgetPassword() {
        // 两个密码不匹配===
        this.loading = true
        const { phone, messageCode, password, areaCode, confirmPassword } = this.userData
        if (password !== confirmPassword) {
          this.$Message.error('确认密码不一致')
          return
        }
        this.$ajaxPost('/user-server/auth/resetPassword', {
          phone,
          messageCode,
          password: md5(password),
          areaCode,
        }).then((res) => {
          if (res && res.code === 10000) {
            this.$Message.success(res.message)
            this.initLogin()
          } else {
            if (this.actionsType === 'login') {
              this.actionsType = 'register'
            }
            this.userData.messageCode = ''
            this.loading = false
          }
        })
      },
      // 登录
      goLogin() {
        this.loading = true
        const authObj = {
          phone: this.userData.phone,
        }
        if (this.loginType) {
          authObj.passwordOrMessageCode = this.userData.messageCode
        } else {
          authObj.passwordOrMessageCode = md5(this.userData.password)
        }

        this.$ajaxPost('/user-server/auth/login', authObj).then(async (res) => {
          this.loading = false
          if (res && res.code === 10000) {
            localStorage.setItem('token', res.data.token || '')
            localStorage.setItem('name', res.data.userInfo.name || '')
            localStorage.setItem('realUserId', res.data.userInfo.id || '')
            localStorage.setItem('userId', res.data.userInfo.id || '')
            localStorage.setItem('headImg', res.data.userInfo.headImg || '')
            localStorage.setItem('phone', res.data.userInfo.phone || '')
            localStorage.setItem('level', res.data.level) // 通过level=2 判断是否是小中台的用户
            localStorage.setItem('originOrgId', res.data.originOrgId || '')
            localStorage.setItem('roleId', res.data.userInfo.roleId || '')
            localStorage.setItem('orgId', res.data.userInfo.orgId || '')
            localStorage.setItem('createType', res.data.userInfo.createType || '')
            localStorage.setItem('orgName', res.data.userInfo.orgName || '')
            localStorage.setItem('roleName', res.data.userInfo.roleName || '')
            localStorage.setItem('departmentId', res.data.userInfo.departmentId || '')
            localStorage.setItem('departmentName', res.data.userInfo.departmentName || '')
            localStorage.setItem('isSubStore', res.data.isSubStore || false) // 是否为门店
            localStorage.setItem('isChain', res.data.isChain || false) // 是否为连锁店
            localStorage.setItem('isPersonal', res.data.isPersonal || false) // 是否为个体
            console.log(res)
            await this.$nextTick(async () => {
              location.href = '/welcome'
            })
          } else {
            this.userData.messageCode = ''
          }
        })
      },
    },
  }
</script>

<style lang="scss">
  @import 'src/assets/scss/loginHall';

  .login-type {
    .ivu-switch::after {
      background: #756cea;
    }
  }
</style>
<style lang="scss" scoped>
  .login {
    width: 100%;
    height: 100vh;
    padding-top: 130px;
    background: url(../assets/images/Bg.png) no-repeat rgba(244, 242, 255, 1);

    button {
      border-radius: 24px;
    }
  }

  .login-header {
    height: 72px;
    padding-left: 24px;
    line-height: 72px;
    background: #fff;
    border-bottom: 1px solid #ddd;
  }

  .login-wrap {
    width: 100%;
    margin: 0 auto;
    border-radius: 4px;
  }

  .login-body {
    width: 1144px;
    height: 764px;
    margin: 0 auto;
    background: url('../assets/images/login/login-bg.png') no-repeat rgba(255, 255, 255, 0.8);
    background-size: cover;
    border-radius: 20px;
    box-shadow: 0 4px 40px 0 rgba(0, 0, 0, 0.1);

    .left-banner {
      float: left;
      width: 40%;
      height: 100%;
      text-align: right;

      .login-banner {
        float: right;
        width: 456px;
        height: 665px;
      }
    }

    .right-form {
      float: left;
      width: 60%;
      height: 100%;
      text-align: center;

      h2 {
        margin: 56px 0 24px;
        text-align: left;
      }

      .login-type {
        margin-bottom: 40px;

        span {
          margin: 0 10px;
        }

        .is-normal {
          color: #b5b5be;
        }
      }

      .form-body {
        width: 340px;
        margin: 170px auto;
      }
    }
  }

  .login-button {
    margin-top: 80px;
  }

  .btn-login {
    height: 48px;
    margin-top: 20px;
    margin-bottom: 20px;
    line-height: 48px;
  }

  .phone-input {
    float: right;
    width: 200px;
  }

  .forget-password {
    color: #92929d;
    cursor: pointer;
  }

  .phone-icon {
    &::before {
      position: absolute;
      top: 6px;
      left: 3px;
      z-index: 1;
      display: inline-block;
      width: 24px;
      height: 24px;
      background: url('../assets/images/login/icon-phone.png');
      content: '';
    }
  }

  .password-input {
    &::before {
      position: absolute;
      top: 6px;
      left: 3px;
      z-index: 1;
      display: inline-block;
      width: 24px;
      height: 24px;
      background: url('../assets/images/login/icon-password.png');
      content: '';
    }

    .show-password {
      background: url('../assets/images/login/icon-eye-close.png');
    }

    .close-password {
      background: url('../assets/images/login/icon-eye.png');
    }

    .show-password,
    .close-password {
      position: absolute;
      top: 6px;
      right: 3px;
      z-index: 1;
      display: inline-block;
      width: 24px;
      height: 24px;
      content: '';
    }
  }

  .valid-input {
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

    &::before {
      position: absolute;
      top: 6px;
      left: 3px;
      z-index: 1;
      display: inline-block;
      width: 24px;
      height: 24px;
      background: url('../assets/images/login/icon-valid.png');
      content: '';
    }
  }
</style>
