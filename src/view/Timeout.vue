<!--
@desc 超时页面
-->
<template>
  <div class="error-page">
    <div class="content-con">
      <img :src="src" alt="" />

      <div
        style="
          margin-top: 64px;
          margin-bottom: 8px;
          font-size: 24px;
          color: #171725;
          text-align: center;
        "
      >
        登录超时
      </div>

      <p style="color: #696974; text-align: center;"> 已超过 4 小时未操作，请您重新登录。 </p>

      <div style="margin-top: 24px; text-align: center;">
        <Button type="warning" @click="backLogin"> 重新登录 </Button>
      </div>
    </div>
  </div>
</template>

<script>
  import timeout from '../assets/timeout.png'

  export default {
    name: 'Timeout',
    components: {},
    data() {
      return {
        src: timeout,
      }
    },
    methods: {
      backLogin() {
        location.href = '/login.html'
      },
    },
  }
</script>
<style lang="scss" scoped>
  .error-page {
    position: relative;
    width: 100%;
    height: 100%;
    background: #f8f8f9;

    .content-con {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 700px;
      height: 420px;
      transform: translate(-50%, -60%);

      img {
        display: block;
        width: 100%;
        height: 100%;
      }

      .text-con {
        position: absolute;
        top: 0;
        left: 0;

        h4 {
          position: absolute;
          top: 0;
          left: 0;
          font-size: 80px;
          font-weight: 700;
          color: #348eed;
        }

        h5 {
          position: absolute;
          top: 100px;
          left: 200px;
          width: 700px;
          font-size: 20px;
          font-weight: 700;
          color: #67647d;
          text-align: left;
        }
      }

      .back-btn-group {
        position: absolute;
        right: 0;
        bottom: 20px;
      }
    }
  }
</style>
