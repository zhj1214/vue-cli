<!--
 * @Description: 未绑定授权公众号
 * @Author: sam.xutao
 * @Date: 2020-06-18 13:39:04
 * @LastEditTime: 2020-07-08 16:31:55
 * @LastEditors: sam.xutao
-->
<template>
  <div>
    <div class="padding-box nosign-box">
      <header>微信公众号绑定商户</header>
      <section class="sign-box">
        <aside class="sign-left">
          <img src="../../../../assets/images/channel/account-icon.png" alt="sign" />
          <a :href="authUrl"><Button type="primary">已有公众号，立即绑定</Button></a>
          <p>为保证所有功能的正常使用</p>
          <p>请将所有权限授权给 银泰商业运营平台 </p>
        </aside>
        <aside class="sign-right">
          <img src="../../../../assets/images/channel/no-mini-program.png" alt="sign" />
          <Button>
            <a href="https://mp.weixin.qq.com/cgi-bin/registermidpage?action=index" target="_blank"
              >没有公众号，立即申请</a
            >
          </Button>
          <p>在微信公众平台申请</p>
          <p>完成后回到 银泰商业运营平台 进行绑定</p>
        </aside>
      </section>
      <hr
        style="
          width: 70%;
          margin: 40px 0;
          margin-left: 15%;
          border: none;
          border-top: solid 1px #e2e2e9;
        "
      />
      <div class="bind-footer">
        <h4 style="margin-bottom: 36px; font-size: 16px;"> 常见问题 </h4>
        <div style="color: #171725;">
          <!--target="_blank"-->
          <div class="row-a">
            <a href="javascript:void(alert('稍后'))" style="color: #171725;">公众号绑定程序</a>
            <i class="icon iconfont iconRight" />
          </div>
          <div class="row-a">
            <a href="javascript:void(alert('稍后'))" style="color: #171725;">绑定注意事项</a>
            <i class="icon iconfont iconRight" />
          </div>
          <div class="row-a">
            <a href="javascript:void(alert('稍后'))" style="color: #171725;">公众号类型区别</a>
            <i class="icon iconfont iconRight" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      authUrl: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        key: '',
      }
    },
  }
</script>

<style lang="scss" scoped>
  .bind-footer {
    margin-bottom: 48px;
    text-align: center;
  }

  .row-a {
    display: inline-block;
    padding: 0 8px;
    margin-right: 24px;
    text-align: center;
    background: #fafafb;
  }

  .nosign-box {
    padding: 40px;

    header {
      margin-bottom: 24px;
      font-size: 28px;
      text-align: center;
    }

    .sign-box {
      display: flex;
      width: 75%;
      margin: 0 auto;
      justify-content: space-between;

      aside {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;

        button {
          margin-bottom: 24px;
        }
      }

      aside {
        p {
          font-family: SFUIDisplay-Light, SFUIDisplay;
          font-size: 12px;
          font-weight: 300;
          color: rgba(105, 105, 116, 1);
        }
      }
    }
  }
</style>
