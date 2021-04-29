<template>
  <div id="wangeditor" :style="styles">
    <div ref="editorElem" style="text-align: left;" />
    <Spin v-if="isUpload" fix :style="styles" class="video-loading">
      <Icon type="ios-loading" size="18" class="demo-spin-icon-load" />
      <div>视频上传中……</div>
    </Spin>
  </div>
</template>
<script>
  import E from 'wangeditor'
  import { log } from '@/utils/tools'

  export default {
    name: 'EditorElem',
    props: [
      'catchData',
      'content',
      'menus',
      'styles',
      'uploadImgServer',
      'uploadFileName',
      'placeholder',
    ],
    data() {
      return {
        editor: null,
        isUpload: false,
      }
    }, // 接收父组件的方法
    watch: {
      content(newval, oval) {
        log('in content')
        log('newval', newval)
        log('oval', oval)
        // 避免光标换行, 初始化内容时执行，之后均不执行
        // if (newval.includes('请编辑内容')) {
        // 	newval = newval.replace('请编辑内容','')
        // }
        // !oval && this.editor.txt.html(newval);
        let newValue = !oval
        log('!oval', newValue)
        this.editor.txt.html(newval)
      },
    },
    mounted() {
      this.editor = new E(this.$refs.editorElem)
      log('this.content', this.content)

      let t = this
      this.editor.config.zIndex = 100
      this.editor.config.showFullScreen = false
      // 关闭粘贴样式的过滤
      this.editor.config.pasteFilterStyle = false
      this.editor.config.onchange = (html) => {
        this.catchData(html) // 把这个html通过catchData的方法传入父组件
      }
      this.editor.config.uploadImgServer = this.$upload || '你的上传图片的接口'
      this.editor.config.uploadFileName = this.uploadFileName || 'file'

      this.editor.config.uploadVideoServer = this.$upload
      this.editor.config.uploadVideoName = 'file'

      // 编辑器菜单建议带操作的按钮放在第二排，不然会有 z-index 层级覆盖问题

      this.editor.config.menus = this.menus || [
        // 菜单配置
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'link', // 插入链接
        'list', // 列表
        'justify', // 对齐方式
        'quote', // 引用
        'emoticon', // 表情
        'image', // 插入图片
        'table', // 表格
        'code', // 插入代码
        'undo', // 撤销
        'redo', // 重复
      ]
      // 下面是最重要的的方法
      this.editor.config.uploadImgHooks = {
        // before: function (xhr, editor, files) {
        //             // 图片上传之前触发
        //             // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件

        //             // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
        //             // return {
        //             //     prevent: true,
        //             //     msg: '放弃上传'
        //             // }
        // },
        success: function (result) {
          // xhr, editor, result
          // 图片上传并返回结果，图片插入成功之后触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
          t.$emit('uploadSuccess', result.response || result.responseText)
        },
        // fail: function (xhr, editor, result) {
        //             // 图片上传并返回结果，但图片插入错误时触发
        //             // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
        // },
        // error: function (xhr, editor) {
        //             // 图片上传出错时触发
        //             // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
        // },
        // timeout: function (xhr, editor) {
        //             // 图片上传超时时触发
        //             // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
        // },

        // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
        // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
        customInsert: function (insertImg, result) {
          // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
          // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

          // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
          // let url = Object.values(result.data);      // result.data就是服务器返回的图片名字和链接
          // JSON.stringify(url);    // 在这里转成JSON格式

          const imageURL = result.data || ''
          insertImg(imageURL)

          // result 必须是一个 JSON 格式字符串！！！否则报错
        },
      }

      this.editor.create() // 创建富文本实例
      this.editor.txt.html(this.content)
      if (!this.content || !this.content.toString().trim()) {
        this.editor.txt.html(this.placeholder)
      }
      this.$refs.editorElem.addEventListener('input', this.inputEvent)

      this.uploadVideo()
    },
    beforeDestroy() {
      this.$refs['editorElem'].removeEventListener('input', this.inputEvent)
    },
    methods: {
      inputEvent() {
        // console.log(123123);
        let html = this.editor.txt.html()
        if (html === '' || html === '<p><br></p>') {
          this.editor.config.onchange()
        }
      },
      uploadVideo() {
        let that = this
        this.editor.config.uploadVideoHooks = {
          // 上传视频之前
          before: function (xhr) {
            console.log(xhr)
            that.isUpload = true
            // 可阻止视频上传
            // return {
            //     prevent: true,
            //     msg: '需要提示给用户的错误信息'
            // }
          },
          // 视频上传并返回了结果，视频插入已成功
          success: function (result) {
            console.log('success', result)
            that.$emit('uploadSuccess', result.response || result.responseText)
          },
          // 视频上传并返回了结果，但视频插入时出错了
          fail: function (xhr, editor, resData) {
            console.log('fail', resData)
          },
          // 上传视频出错，一般为 http 请求的错误
          error: function (xhr, editor, resData) {
            console.log('error', xhr, resData)
            that.hideUploadVideo()
            that.isUpload = false
          },
          // 上传视频超时
          timeout: function (xhr) {
            console.log('timeout', xhr)
          },
          // 视频上传并返回了结果，想要自己把视频插入到编辑器中
          // 例如服务器端返回的不是 { errno: 0, data: { url : '.....'} } 这种格式，可使用 customInsert
          customInsert: function (insertVideoFn, result) {
            that.isUpload = false
            // insertVideoFn 可把视频插入到编辑器，传入视频 src ，执行函数即可
            insertVideoFn(result.data)
          },
        }
      },
    },
  }
</script>
<style lang="scss">
  // $placeholder: '请输入内容';
  // // #wangeditor .w-e-text{border:solid 1px #f00;}
  // #wangeditor .w-e-text:blank::before{
  // 	content: $placeholder;
  // }

  // #wangeditor .w-e-text:focus::before{
  // 	content: '';
  // }
</style>
<style lang="scss" rel="stylesheet/scss">
  #wangeditor {
    width: 50rem;
    background: #fff;
  }

  .w-e-toolbar {
    flex-wrap: wrap;
  }

  .w-e-text-container {
    height: 180px !important;
    padding-top: 5px;
  }

  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }

  .video-loading {
    z-index: 1000;
  }
</style>
