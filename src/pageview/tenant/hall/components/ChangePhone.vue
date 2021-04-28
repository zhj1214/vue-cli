<!--
@desc 只允许点击一次 发送验证码
-->
<style>
 .input-messageCode .ivu-input{
			padding-left: 32px !important;
		}
</style>
<template>
  <div>
    <h2 class="h2">
      <span>更换手机号</span>
    </h2>
    <div class="account-changePhone">
      <div class="changePhone-form">
        <Form
          ref="changePhone"
          class="form-body"
          :model="accountData"
          :rules="accountObjValid"
        >
          <FormItem
            v-if="setup===0"
            label="银泰商业账号"
          >
            <div class="mos-item">
              <span class="area-code">{{ accountData.areaCode }}</span>
              <div class="phone-input">
                <span class="phone-span">{{ accountData.phone }}</span>
              </div>
            </div>
          </FormItem>
									
          <!--手机账号-->
          <FormItem
            v-else
            style="margin-top: 38px;"
            prop="phone"
          >
            <div class="left-phoneArea phone-icon">
              <Dropdown @on-click="onClickArea">
                <span class="phone-prefix">
                  {{ accountData.areaCode }}
                </span>
                <Icon type="ios-arrow-down" />
                <DropdownMenu slot="list">
                  <DropdownItem
                    v-for="item in countryAreaList"
                    :key="item.prefix"
                    :name="item.prefix"
                  >
                    {{ item.prefix+ item.name }}
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
            <i-input
              v-model="accountData.phone"
              type="text"
              :maxlength="11"
              class="change-phone-input"
              placeholder="请填写更改后的手机号"
            />
          </FormItem>
          <FormItem
            v-if="setup===0"
            label="密码"
            prop="password"
          >
            <i-input
              v-model="accountData.password"
              type="password"
              :maxlength="16"
              placeholder="请输入您的密码"
            />
          </FormItem>
									
          <!--验证码-->
          <FormItem
            v-show="setup===1"
            style="margin-bottom: 10px;margin-top: 38px"
            prop="messageCode"
          >
            <div>
              <i-input
                v-model="accountData.messageCode"
                type="text"
                :maxlength="6"
                placeholder="请输入短信验证码"
                class="input-messageCode"
              />
              <span
                class="send-valid is-active"
                @click="onSendValid"
              >{{ countDownSecond===60?'发送验证码':(countDownSecond+'s') }}</span>
              <span class="change-phone-mark" />
            </div>
          </FormItem>
        </Form>
        <Button
          style="height: 48px;margin-top: 60px;"
          long
          type="primary"
          @click="onNextSetup"
        >
          {{ setup?'确认修改':'下一步' }}
        </Button>
        <p style="text-align:center;margin-top:20px;">
          <a
            v-if="setup"
            @click="onPrevSetup"
          >上一步</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
	import md5 from 'js-md5';
	import {isPassword} from "../../../../utils/tools";
	import LoginHallMixins from "../../../../mixins/mixinsLoginHall";
	
	export default {
		name: "ChangePhone",
		mixins: [LoginHallMixins],
		props: {
			accountObj: {
				type: Object,
				default() {
					return {
						phone: "",
						areaCode: "",
						password: "",
						messageCode: ""
					};
				}
			}
		},
		data() {
			const checkPw = (rule, value, callback) => {
				if (!value) {
					callback(new Error("请输入密码8-16位密码"));
				} else {
					if (!isPassword(value)) {
						callback(new Error("需包含数字和字母，8-16位"));
					}
					callback();
				}
			};
			const checkMessageCode = (rule, value, callback) => {
				if (this.setup === 1) {
					if (!value) callback('请输入验证码');
					else if (value.length !== 6) callback('验证码为6位');
					else if (!/\d{6}/g.test(value)) callback('验证码格式不对');
					else callback();
				} else callback();
			};
			return {
				setup: 0,
				countDownSecond: 60,
				accountData: {
					phone: "",
					areaCode: "",
					password: "",
					messageCode: ""
				},
				accountObjValid: {
					phone: [
						{required: true, message: '账号不能为空', trigger: 'blur'},
						{len: 11, message: '手机号码格式不对'}
					],
					password: [
						{required: true, validator: checkPw, trigger: "blur"},
					],
					messageCode: [
						{required: true, validator: checkMessageCode, trigger: "blur"},
					]
				}
			};
		},
		computed: {},
		created() {
			const {phone, areaCode} = this.accountObj;
			this.accountData.phone = phone||localStorage.phone;
			this.accountData.areaCode = areaCode||'+86';
		},
		methods: {
			onNextSetup() {
				this.$refs['changePhone'].validate(valid => {
					if (valid) {
						if (!this.setup) this.checkAuth();
						else this.updatePhone();
					}
				});
			},
			onPrevSetup(){
				const {phone, areaCode} = this.accountObj;
				this.accountData.phone = phone||localStorage.creatorPhone;
				this.accountData.areaCode = areaCode||'+86';
				this.setup = 0;
			},
			onClickArea(name) {
				this.accountData.areaCode = name;
			},
			onSendValid() {
				if (this.countDownSecond < 60) {
					return;
				}
				
				// 校验手机号
				if (!/^1[3|4|5|6|7|8|9|]\d{9}$/.test(this.accountData.phone)) {
					this.$Message.warning('手机号格式不正确');
					return;
				}
				this.sendValid();
			},
			
			sendValid() {
				const {phone, areaCode} = this.accountData || {};
				if (!phone || !areaCode) return;
				this.accountData.messageCode = '';
				this.$ajaxGet('/user-server/auth/getMessageCodeWithCheck', {
					phone, areaCode
				})
					.then(res => {
						if (res && res.code === 10000) {
							if (res.data.flag === 3) {
								this.$Message.success('已发送验证码，请注意查收');
								this.countDownTimer();
							}
							if (res.data.flag === 4) {
								this.$Message.warning({
									content: '该手机已被绑定，无法添加为新手机号',
									duration: 3
								});
							}
						}
					});
			},
			/**
			 * @desc 根据密码手机号校验身份
			 * */
			checkAuth() {
				const {phone, password} = this.accountData || {};
				if (!phone || !password) return;
				this.$ajaxPost('/user-server/auth/checkEmployeePassword', {phone, password: md5(password)})
					.then(res => {
						if (res && res.code === 10000) {
							this.setup = 1;
							this.accountData.phone = "";
							this.accountData.messageCode = "";
						}
					});
			},
			/**
			 * @desc 更新手机号
			 * */
			updatePhone() {
				const {phone, areaCode, messageCode} = this.accountData || {};
				const id = localStorage.getItem('userId');
				this.$ajaxPost('/user-server/auth/updatePhone', {
					id, phone, messageCode, areaCode
				})
					.then(res => {
						if (res && res.code === 10000) {
							this.$Message.success(res.message || '操作成功');
							setTimeout(() => {
								location.href = '/login.html';
							}, 500);
						}
					});
			}
		}
	};
</script>

<style scoped lang="scss">
		.account-changePhone {
				background: #fff; min-height: 760px;
				padding-top:30px;
		}
		
		.changePhone-form {
				width: 340px;
				margin: 0 auto;
		}
		
		.change-phone-input {
				width: 200px;
				float: right;
		}
		
		.send-valid {
				cursor: pointer;
				display: inline-block;
				position: absolute;
				content: "";
				height: 24px;
				line-height: 24px;
				right: 3px;
				top: 6px;
				z-index: 1;
		}
		
		.change-phone-mark{
			background: url("../../../../assets/images/login/icon-valid.png");
		}
		.change-phone-mark{
			display: inline-block;
			position: absolute;
			content: "";
			width: 24px;
			height: 24px;
			left: 3px;
			top: 6px;
			z-index: 1;
		}
</style>
