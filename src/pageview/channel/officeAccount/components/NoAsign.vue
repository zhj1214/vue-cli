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
          <img
            src="../../../../assets/images/channel/account-icon.png"
            alt="sign"
          >
          <a :href="authUrl"><Button type="primary">已有公众号，立即绑定</Button></a>
          <p>为保证所有功能的正常使用</p> 
          <p>请将所有权限授权给 银泰商业运营平台 </p>
        </aside>
        <aside class="sign-right">
          <img
            src="../../../../assets/images/channel/no-mini-program.png"
            alt="sign"
          >
          <Button>
            <a
              href="https://mp.weixin.qq.com/cgi-bin/registermidpage?action=index"
              target="_blank"
            >没有公众号，立即申请</a>
          </Button>
          <p>在微信公众平台申请</p>
          <p>完成后回到 银泰商业运营平台 进行绑定</p>
        </aside>
      </section>
      <hr style="border:none; border-top:solid 1px #E2E2E9; margin:40px 0; width:70%;margin-left:15%;">
      <div class="bind-footer">
        <h4 style="font-size: 16px;margin-bottom: 36px;">
          常见问题
        </h4>
        <div style="color:#171725">
          <!--target="_blank"-->
          <div class="row-a">
            <a
              href="javascript:void(alert('稍后'))"
              style="color:#171725"
            >公众号绑定程序</a>
            <i class="icon iconfont iconRight" />
          </div>
          <div class="row-a">
            <a
              href="javascript:void(alert('稍后'))"
              style="color:#171725"
            >绑定注意事项</a>
            <i class="icon iconfont iconRight" />
          </div>
          <div class="row-a">
            <a
              href="javascript:void(alert('稍后'))"
              style="color:#171725"
            >公众号类型区别</a>
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
      default: ''
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
      text-align: center;
      margin-bottom: 48px;
  }
  .row-a {
    display: inline-block;
    background: #FAFAFB;
    text-align: center;
    margin-right: 24px;
    padding:0 8px;
	}
  .nosign-box{
    padding:40px;
    header{font-size: 28px; text-align: center;margin-bottom: 24px;}
    .sign-box{
      width:75%; margin: 0 auto;
      display: flex; justify-content: space-between;
      aside{
        display: flex; flex-direction: column;
        align-items: center; flex:1;
        button{margin-bottom:24px;}
      }
      aside{
        p{
          font-size:12px;
          font-family:SFUIDisplay-Light,SFUIDisplay;
          font-weight:300;
          color:rgba(105,105,116,1)
        }
      }
    }
  }
</style>