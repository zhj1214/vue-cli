<!--
 * @Description: 绑定授权后信息展示
 * @Author: sam.xutao
 * @Date: 2020-07-06 13:53:58
 * @LastEditTime: 2020-07-06 20:18:57
 * @LastEditors: sam.xutao
-->
<template>
  <div class="complete-box padding-box">
    <p>
      <img :src="complete.isComplete ? AuthSuccessIcon : AuthFailIcon" alt="授权结果" />
    </p>
    <h3>{{ complete.isComplete ? '恭喜！授权成功' : '抱歉，授权绑定失败' }}</h3>
    <p class="complete-tip">
      {{
        complete.isComplete
          ? `${cType == 'account' ? '公众号' : '小程序'}「${complete.account}」已完成授权`
          : matchText[complete.status]
      }}
    </p>
    <p class="complete-btn">
      <Button
        type="primary"
        @click="complete.isComplete ? $emit('confirmComplete') : $emit('retryComplete')"
      >
        {{ complete.isComplete ? '确认' : '重试' }}
      </Button>
    </p>
  </div>
</template>

<script>
  import AuthFailIcon from '@/assets/images/channel/auth-fail.png'
  import AuthSuccessIcon from '@/assets/images/channel/auth-success.png'
  export default {
    props: {
      cType: { type: String, required: true }, // 类型，公众号:account或小程序：miniprogram
      complete: {
        // 授权信息
        type: Object,
        default: () => {
          return {}
        },
      },
    },
    data() {
      return {
        AuthFailIcon,
        AuthSuccessIcon,
        // 1.授权成功 2 没有开发平台账户管理权限 3 已授权其他商铺 4 个人小程序 5 获取授权信息失败
        matchText: {
          2: `未授权所有权限可能导致${
            this.cType == 'account' ? '公众号' : '小程序'
          }不可用，请重新授权并勾选所有权限`,
          3: '授权账号已经绑定了其他商户，请解绑后重试',
          4: '暂不支持个人小程序',
          5: '从第三方获取授权信息失败，请稍后重试',
        },
      }
    },
  }
</script>

<style lang="scss" scoped>
  .complete-box {
    text-align: center;

    h3 {
      margin-top: 20px;
      font-family: SFUIDisplay-Medium, SFUIDisplay;
      font-size: 24px;
      font-weight: 500;
      color: rgba(23, 23, 37, 1);
    }

    .complete-tip {
      font-family: SFUIDisplay-Light, SFUIDisplay;
      font-size: 14px;
      font-weight: 300;
      color: rgba(105, 105, 116, 1);
    }

    .complete-btn {
      padding-top: 40px;
    }
  }
</style>
