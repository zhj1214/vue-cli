<template>
  <div>
    <h2 class="h2">
      修改密码
    </h2>
    <div class="user-password">
      <div class="password-form">
        <Form
          ref="password"
          class="form-body"
          :model="passwordData"
          :rules="passwordValid"
          label-position="left"
        >
          <FormItem
            label="旧密码"
            prop="oldPassword"
          >
            <i-input
              v-if="!isShowPassword['1']"
              v-model="passwordData.oldPassword"
              type="password"
              :maxlength="16"
              placeholder="请输入旧密码"
            />
            <i-input
              v-else
              v-model="passwordData.oldPassword"
              :maxlength="16"
            />
            <span
              v-if="!isShowPassword['1']"
              class="close-password"
              @click="showPassword(1)"
            />
            <span
              v-else
              class="show-password"
              @click="showPassword(1)"
            />
          </FormItem>
          <FormItem
            label="新密码"
            prop="newPassword"
          >
            <i-input
              v-if="!isShowPassword['2']"
              v-model="passwordData.newPassword"
              type="password"
              :maxlength="16"
              placeholder="请输入新密码，8~16位字符，包含字母和数字"
            />
            <i-input
              v-else
              v-model="passwordData.newPassword"
              :maxlength="16"
            />
            <span
              v-if="!isShowPassword['2']"
              class="close-password"
              @click="showPassword(2)"
            />
            <span
              v-else
              class="show-password"
              @click="showPassword(2)"
            />
          </FormItem>
          <FormItem
            label="确认密码"
            prop="confirmPassword"
          >
            <i-input
              v-if="!isShowPassword['3']"
              v-model="passwordData.confirmPassword"
              type="password"
              :maxlength="16"
              placeholder="请确认您的密码"
            />
            <i-input
              v-else
              v-model="passwordData.confirmPassword"
              :maxlength="16"
            />
            <span
              v-if="!isShowPassword['3']"
              class="close-password"
              @click="showPassword(3)"
            />
            <span
              v-else
              class="show-password"
              @click="showPassword(3)"
            />
          </FormItem>
        </Form>
        <Button
          style="height: 48px;margin-top: 60px;"
          long
          type="primary"
          @click="onConfirmUpdate"
        >
          确认修改
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import md5 from "js-md5";
import { isPassword } from "../../../utils/tools";

export default {
  name: "Password",
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
    const checkPwConfirm = (rule, val, callback) => {
      if (!val) {
        callback(new Error("请确认密码"));
      } else {
        if (!isPassword(val)) {
          callback(new Error("需包含数字和字母，8-16位"));
        } else {
          if (val !== this.passwordData.newPassword) {
            callback(new Error("两次密码不一致"));
          }
          callback();
        }
      }
    };
    return {
      passwordData: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      },
      passwordValid: {
        oldPassword: [{ required: true, validator: checkPw, trigger: "blur" }],
        newPassword: [{ required: true, validator: checkPw, trigger: "blur" }],
        confirmPassword: [
          { required: true, validator: checkPwConfirm, trigger: "blur" }
        ]
      },
      isShowPassword: {
        "1": false,
        "2": false,
        "3": false
      }
    };
  },
  methods: {
    onConfirmUpdate() {
      this.$refs["password"].validate(valid => {
        if (valid) this.updatePassword();
      });
    },
    updatePassword() {
      const { oldPassword, newPassword, confirmPassword } = this.passwordData;
      if (newPassword !== confirmPassword) {
        this.$Message.error("确认密码不一致");
        return;
      }
      this.$ajaxPost("/user-server/auth/updatePassword", {
        oldPassword: md5(oldPassword),
        newPassword: md5(newPassword)
      }).then(res => {
        if (res && res.code === 10000) {
          this.$Message.success("密码修改成功");
          setTimeout(() => {
            location.href = "/login.html";
          }, 500);
        }
      });
    },
    showPassword(val) {
      this.isShowPassword[val] = !this.isShowPassword[val];
    }
  }
};
</script>

<style scoped lang="scss">
.user-password {
  background: #fff;
  min-height: 760px;
  border-radius: 20px;
  padding-top: 30px;
}

.password-form {
  width: 340px;
  margin: 0 auto;
}
.close-password {
  background: url("../../../assets/images/login/icon-eye-close.png");
}
.show-password {
  background: url("../../../assets/images/login/icon-eye.png");
}

.show-password,
.close-password {
  display: inline-block;
  position: absolute;
  content: "";
  width: 24px;
  height: 24px;
  right: 3px;
  top: 36px;
  z-index: 1;
}
</style>
