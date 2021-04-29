<!-- 二维码组件 -->
<template>
  <div class="qrcode-wrapper" :style="Style">
    <div class="content">
      <div ref="img" class="img" />
    </div>
    <!-- <qrcode :url="cypherUrl" :wid="width" :hei="height"></qrcode> -->
  </div>
</template>

<script>
  /**
   * @description qrcode插件props描述
   * url 二维码输入的内容 String
   * iconurl 二维码中间小图片地址 String
   * wid 二维码宽度 Number
   * hei 二维码高度 Number
   * colorDark 二维码颜色 String
   * colorLight 二维码背景色 String
   * imgwid 二维码中间小图片宽度 Number
   * imghei 二维码中间小图片高度	Number
   */
  // import qrcode from 'vue_qrcodes'
  import QRCode from 'qrcode'
  export default {
    components: {
      // QRCode
    },
    props: {
      width: {
        type: Number,
      },
      height: {
        type: Number,
      },
      url: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        cypherUrl: '',
        timer: '',
      }
    },
    computed: {
      Style() {
        return `width:${this.width}px;height:${this.height}px;`
      },
    },
    watch: {
      url(val) {
        this.cypherUrl = val || ''
        this.setQrcode()
      },
    },
    created() {
      this.cypherUrl = this.url
    },
    mounted() {
      // this.setQrcode();
    },
    methods: {
      setQrcode() {
        let img = this.$refs.img
        // let urlTemp = this.cypherUrl
        // let canvas = document.body.querySelector("canvas");
        QRCode.toCanvas(this.cypherUrl)
          .then((url) => {
            // if (canvas) {
            //   img.removeChild(canvas);
            // }
            img.appendChild(url)
          })
          .catch((err) => {
            console.log(err)
          })
      },
    },
  }
</script>
<style>
  .img canvas {
    position: absolute;
    width: 100% !important;
    height: 100% !important;
  }
</style>

<style lang="less" scoped>
  // .qrcode-container{
  //   width: 100px;
  //   height: 100px;
  // }
  .qrcode-wrapper {
    position: relative;

    .content {
      position: absolute;
      right: 0;
      left: 0;
      height: 100%;

      .img {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
