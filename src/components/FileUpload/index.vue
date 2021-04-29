<template>
  <div :style="boxStyle" class="file-cut-upload-comp">
    <div v-if="listType === 'picture-card'" class="picture-card">
      <div
        v-for="item in fileList"
        :key="item.uid"
        class="picture-card-item"
        :class="{
          'upload-error': item.status !== 'uploading' && item.uploadStatus !== 'success',
        }"
      >
        <slot name="fileItem" :data="item">
          <template v-if="item.status === 'finished' && item.uploadStatus === 'success'">
            <div class="picture-card-item-media">
              <img v-if="item.isImage" :src="item.url" class="picture-card-item-img" />
              <Icon v-else type="ios-paper-outline" />
            </div>
          </template>
          <template v-else-if="item.status === 'uploading'">
            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info />
          </template>
          <template v-else>
            <div class="picture-card-item-error"> 失败 </div>
          </template>
          <div
            v-if="item.status !== 'uploading' && (canRemove || canPreview)"
            class="picture-card-item-cover"
          >
            <Icon v-if="canPreview" type="ios-eye-outline" @click="handleView(item)" />
            <Icon
              v-if="canRemove"
              type="ios-trash-outline"
              class="removebtn"
              @click="handleRemove(item)"
            />
          </div>
        </slot>
      </div>
    </div>
    <Upload
      ref="upload"
      :default-file-list="defaultFileListMapper"
      :multiple="openMultiple"
      :action="localAction"
      :disabled="disabled"
      :name="name"
      with-credentials
      :show-upload-list="showUploadList"
      :accept="accept"
      :format="format"
      :max-size="maxSize"
      :before-upload="handleBeforeUpload"
      :on-success="handleSuccess"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :on-error="handleError"
      :on-progress="handleProgress"
      :style="{
        display: showUploadBtn ? (listType === 'picture-card' ? 'inline-block' : 'block') : 'none',
      }"
    >
      <Row v-if="fileList.length < max" type="flex" align="middle" :gutter="8">
        <i-col>
          <slot name="uploadBtn">
            <Button v-if="listType === 'list'" icon="ios-cloud-upload-outline"> 文件上传 </Button>
            <div v-if="listType === 'picture-card'" class="picturecardbtn">
              <Icon type="ios-camera" size="20" />
            </div>
          </slot>
        </i-col>
      </Row>
    </Upload>
    <slot name="uploadExtraText">
      <div v-if="showUploadBtn" class="uploadExtraText">
        <span v-if="showUploadText"> {{ uploadExtraText }} </span>
      </div>
    </slot>
    <div style="height: 6px;" />
    <div v-if="!showUploadList">
      <template v-if="listType === 'list'">
        <div v-for="item in fileList" :key="item.uid">
          <slot name="fileItem" :data="item">
            <div
              :class="{
                'upload-error': item.status !== 'uploading' && item.uploadStatus !== 'success',
                'upload-item': true,
              }"
            >
              <div>
                <div class="upload-item-con">
                  <div class="upload-item-left">
                    <div v-if="item.extName">
                      <Tag color="primary">
                        <span>{{ item.extName }} </span>
                      </Tag>
                    </div>
                    <div class="upload-text upload-name" @click="handleView(item)">
                      {{ item.name }}
                      <span v-if="item.sizeFormat" class="upload-item-size">
                        （{{ item.sizeFormat }}）
                      </span>
                    </div>
                    <div />
                  </div>
                  <div v-if="item.status !== 'uploading' && canRemove" class="upload-extra">
                    <Icon type="md-close" class="removebtn" @click="handleRemove(item)" />
                  </div>
                </div>
              </div>
              <div v-if="item.status === 'uploading'" class="uploadprogress">
                <Progress :percent="item.percentage" :stroke-width="2" />
              </div>
            </div>
          </slot>
        </div>
      </template>
    </div>

    <!-- 图片裁剪组件 -->
    <Modal
      v-model="cutVisible"
      title="图片裁剪"
      :width="72"
      :mask-closable="false"
      @on-ok="handleCutterOk"
    >
      <Row type="flex" :gutter="48">
        <i-col>
          <ImgCutter
            ref="cutter"
            :is-modal="false"
            :show-choose-btn="false"
            :size-change="sizeChange"
            :box-width="imgWidth >= boxWidth ? imgWidth + 50 : boxWidth"
            :box-height="imgHeight >= boxHeight ? imgHeight + 100 : boxHeight"
            :cut-width="imgWidth"
            :cut-height="imgHeight"
            :rate="isRate ? `${imgWidth}:${imgHeight}` : undefined"
            @onPrintImg="handlePrint"
          >
            <span slot="cancel" />
            <span slot="confirm" />
          </ImgCutter>
        </i-col>
        <i-col>
          <Row justify="center" align="middle">
            <i-col>
              <img
                :src="printFile && printFile.dataURL"
                class="cutter-preview"
                :style="{
                  width: imgWidth,
                  height: imgHeight,
                }"
              />
            </i-col>
          </Row>
        </i-col>
      </Row>
    </Modal>
    <!-- 图片裁剪组件 -->

    <Modal v-model="previewVisible" title="预览" :width="650" :mask-closable="false">
      <div class="file-cut-upload-comp-previewbox">
        <img :src="previewImg" />
      </div>
    </Modal>
  </div>
</template>

<script>
  import { formatFileSize, formatExtName, isImage } from './utils'
  import ImgCutter from 'vue-img-cutter'
  import { v4 as uuidv4 } from 'uuid'
  import { proxy } from '../../utils/axios'

  export default {
    components: {
      ImgCutter,
    },
    props: {
      /**
       * 是否开启多选
       */
      multiple: {
        type: Boolean,
        default: false,
      },
      /**
       * 请求地址
       */
      action: {
        type: String,
        default: `/file-server/api/resources/files/upload`,
      },
      showUploadBtn: {
        type: Boolean,
        default: true,
      },
      showUploadText: {
        type: Boolean,
        default: true,
      },
      /**
       * 设置最大上传数量，不传或0位不限制 （默认不限制）
       */
      max: {
        type: Number,
        default: 0,
      },
      /**
       * 设置最小上传数量，不传或0位不限制 （默认不限制）
       */
      /**
       * 是否禁用
       */
      disabled: {
        type: Boolean,
        default: false,
      },
      /**
       * 上传字段名
       */
      name: {
        type: String,
        default: 'file',
      },
      /**
       * 是否展示默认上传列表，默认不展示
       */
      showUploadList: {
        type: Boolean,
        default: false,
      },
      /**
       * input的accept属性
       */
      accept: {
        type: String,
        default: '*',
      },
      /**
       * 除了accept外，选择文件后的对文件类型的过滤
       */
      format: {
        type: Array,
        default: () => {
          return []
        },
      },
      /**
       * 单个文件最大，单位和ivu一样  KB
       */
      maxSize: {
        type: Number,
        default: 0,
      },
      /**
       * 默认文件列表
       */
      defaultFileList: {
        type: Array,
        default: () => {
          return []
        },
      },

      // 是否展示移除按钮
      canRemove: {
        type: Boolean,
        default: true,
      },

      // 是否展示预览按钮
      canPreview: {
        type: Boolean,
        default: true,
      },

      // 是否开启下载，暂未实现
      canDownload: {
        type: Boolean,
        default: false,
      },

      // 图片裁剪的属性
      /**
       * 是否开启裁切，默认不开启
       */
      canCut: {
        type: Boolean,
        default: false,
      },
      isRate: {
        type: Boolean,
        default: true,
      },
      /**
       * 需要裁切的话，默认的裁切大小
       */
      imgWidth: {
        type: Number,
        default: 480,
      },
      imgHeight: {
        type: Number,
        default: 320,
      },

      boxStyle: {
        type: [String, Object],
      },

      /**
       * 列表展示限制，目前支持list和picture-card
       */
      listType: {
        type: String,
        default: 'list',
      },
      /**
       * 图片是否可以拉伸裁剪
       */
      sizeChange: {
        type: Boolean,
        default: true,
      },
      /**
       * 图片裁剪区域宽度
       */
      boxWidth: {
        type: Number,
        default: 600,
      },
      /**
       * 图片裁剪区域高度
       */
      boxHeight: {
        type: Number,
        default: 400,
      },
    },
    data() {
      return {
        fileList: [],
        cutVisible: false,
        cutImg: '',
        printFile: null,
        previewVisible: false,
        previewImg: '',
      }
    },
    computed: {
      // 给路径加上本地代理
      localAction() {
        return proxy + this.action
      },
      // 对默认文件进行格式化
      defaultFileListMapper() {
        return (
          this.defaultFileList &&
          this.defaultFileList.map((item) => {
            return {
              ...item,
              uid: item.uid || uuidv4(),
              status: 'finished',
              uploadStatus: 'success',
              sizeFormat: item.size && formatFileSize(item.size),
              isImage: isImage(item.name),
              response: item.response || {
                code: 10000,
                data: item.url,
              },
            }
          })
        )
      },
      /**
       * 格式化maxsize属性，展示用
       */
      formaxMaxSize() {
        return formatFileSize(this.maxSize * 1024)
      },
      uploadExtraText() {
        let t = ''
        if (this.max) {
          t = t + `限制最多上传${this.max}个文件，`
        }
        if (this.maxSize) {
          t = t + `单个文件限制${this.formaxMaxSize}，`
        }
        return t.replace(/[,|，]$/, '')
      },
      // 开启裁切时不允许多选
      openMultiple() {
        return this.multiple && !this.canCut
      },
    },
    watch: {
      defaultFileListMapper(newVal) {
        // console.log(newVal,'this.defaultFileListthis.defaultFileListthis.defaultFileList')
        if (newVal.length > 0) {
          this.fileList = newVal
        }
      },
    },
    mounted() {
      this.fileList = this.$refs.upload.fileList
    },
    methods: {
      handleChange() {
        console.log('uploadFile', 'changed')
        // 只对上传成功的文件抛给上层组件
        this.$emit(
          'on-change',
          this.fileList.filter((item) => {
            return item && item.response && item.response.code && item.response.code === 10000
          })
        )
      },
      // 开启裁剪时会用到该方法
      handleChangeFile2Base64(file) {
        var reader = new FileReader()
        // var imgUrlBase64;
        if (file) {
          //将文件以Data URL形式读入页面
          reader.readAsDataURL(file)
          reader.onload = () => {
            this.cutVisible = true
            this.cutImg = reader.result
            this.$refs.cutter.handleOpen({
              name: file.name,
              src: this.cutImg,
            })
          }
        }
      },
      handleBeforeUpload(file) {
        const check = !this.max || this.$refs.upload.fileList.length < this.max
        if (!check) {
          this.$Message['error']({
            background: true,
            content: `最多可上传${this.max}个文件`,
          })
          return false
        }
        if (this.canCut && file.type.indexOf('image') === 0) {
          // 开启裁剪并且文件格式为图片时
          this.handleChangeFile2Base64(file)
          this.cutVisible = true
          this.cutImg = file
          return false
        }
        return check
      },
      handleSuccess() {
        this.fileList = this.$refs.upload.fileList
        this.$refs.upload.fileList.forEach((item) => {
          if (item && item.response && item.response.code && item.response.code === 10000) {
            item.uploadStatus = 'success'
            item.sizeFormat = item.size && formatFileSize(item.size)
            item.url = item.response.data && item.response.data
            item.isImage = isImage(item.name)
          }
          item.extName = formatExtName(item.name)
        })
        this.handleChange()
      },
      handleRemove(file) {
        console.log(file, this.$refs.upload.fileList)
        this.fileList = this.$refs.upload.fileList
        this.$refs.upload.fileList.splice(
          this.$refs.upload.fileList.findIndex((item) => item.uid === file.uid),
          1
        )
        this.handleChange()
      },
      handleError() {
        this.$Message['error']({
          background: true,
          content: `文件上传失败`,
        })
      },
      handleFormatError() {
        this.$Notice.warning({
          title: '文件格式错误',
          desc: `文件可选格式${this.format}`,
        })
      },
      handleMaxSize() {
        this.$Notice.warning({
          title: '上传的文件太大',
          desc: `文件最大${formatFileSize(this.maxSize * 1024)}`,
        })
      },
      handleProgress() {
        // console.log("process:", e, file, fileList);
      },

      handleView(item) {
        if (!this.canPreview) return
        if (item.isImage) {
          this.previewVisible = true
          this.previewImg = item.url
        } else {
          window.open(item.url, '_blank')
        }
      },

      // 裁剪的一些方法
      handlePrint(e) {
        this.printFile = e
      },
      handleCutterOk() {
        const uid = uuidv4()
        let _file = {
          uid: uid,
          name: this.printFile.fileName,
          percentage: 0,
          status: 'uploading',
          size: this.printFile.file.size,
          type: this.printFile.file.type,
          extName: formatExtName(this.printFile.fileName),
          uploadStatus: null,
        }
        // this.$refs.upload.fileList.push(_file);
        const form = new FormData()
        form.append(this.name, this.printFile.file)
        this.$http(this.action, {
          method: 'post',
          data: form,
          onUploadProgress: (progressEvent) => {
            if (!this.fileList.some((item) => item.uid === uid)) {
              this.$refs.upload.fileList.push(_file)
              this.fileList = this.$refs.upload.fileList
            }
            this.fileList.forEach((item) => {
              if (item.uid === uid) {
                item.percentage = (progressEvent.loaded / progressEvent.total) * 100
              }
            })
            // Do whatever you want with the native progress event
          },
        })
          .then((res) => {
            if (res && res.status && res.status !== 200) {
              this.$Message['error']({
                background: true,
                content: `文件上传失败`,
              })
            } else {
              if (res && res.code === 10000) {
                _file.status = 'finished'
                _file.response = res
                this.handleSuccess(res, {
                  ..._file,
                  response: res,
                })
              } else {
                this.$Message['error']({
                  background: true,
                  content: res.msg,
                })
              }
            }
          })
          .catch(() => {
            this.$Message['error']({
              background: true,
              content: `文件上传失败`,
            })
          })
          .finally(() => {
            this.fileList.forEach((item) => {
              if (item.uid === uid) {
                if (item.status === 'uploading') {
                  item.status = 'error'
                }
              }
            })
          })
      },
    },
  }
</script>

<style lang="less">
  .file-cut-upload-comp {
    .upload-error {
      color: #f34141;
    }

    .upload-item {
      position: relative;
      padding: 2px;
      margin-top: 0;
      border-radius: 2px;
      transition: all 0.2s ease-in-out;

      .uploadprogress {
        position: absolute;
        bottom: -8px;
        left: 2px;
        width: calc(100% - 2px);
      }

      &-con {
        display: -webkit-box;
        -webkit-box-align: center;
      }

      &-left {
        display: -webkit-box;
        -webkit-box-align: center;
        -webkit-box-flex: 1;
      }

      &-size {
        font-size: 12px;
        color: #999;
      }

      .upload-extra {
        display: none;
      }

      .upload-text {
        max-width: calc(100% - 80px);
        margin-left: 4px;
        overflow: hidden;
        font-size: 12px;
        line-height: 26px;
        color: #444;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
        -webkit-box-flex: 1;
      }

      &.upload-error {
        color: #f34141;

        .upload-text {
          color: #f34141 !important;
        }
      }

      &:hover {
        // background: #ccc;
        background: rgb(243, 243, 243);

        .upload-extra {
          display: block;
        }

        .upload-text {
          color: #2d8cf0;
        }
      }
    }

    .removebtn {
      cursor: pointer;
    }

    .uploadExtraText {
      font-size: 12px;
      line-height: 18px;
      color: #999;
    }

    .cutter-preview {
      display: block;
    }

    .picturecardbtn {
      display: flex;
      width: 58px;
      height: 58px;
      cursor: pointer;
      border: 1px dashed #ccc;
      border-radius: 2px;
      transition: all 0.3s;
      align-items: center;
      justify-content: center;

      &:hover {
        color: #2d8cf0;
        border: 1px dashed #2d8cf0;
      }
    }

    .picture-card {
      display: inline-block;
      vertical-align: bottom;

      &-item {
        position: relative;
        display: inline-block;
        width: 58px;
        height: 58px;
        margin-right: 6px;
        overflow: hidden;
        vertical-align: bottom;
        border: 1px solid #ccc;
        border-radius: 2px;

        &.upload-error {
          border: 1px solid #f34141;
        }

        &-media {
          display: flex;
          height: 100%;
          align-items: center;
          justify-content: center;
        }

        &-error {
          display: flex;
          height: 100%;
          color: #f34141;
          align-items: center;
          justify-content: center;
        }

        &-img {
          display: block;
          width: 100%;
          height: 100%;
        }

        &-cover {
          position: absolute;
          top: 0;
          left: 0;
          display: none;
          width: 100%;
          height: 100%;
          color: #fff;
          align-items: center;
          justify-content: center;
        }

        &:hover {
          .picture-card-item-cover {
            display: flex;
            background: rgba(0, 0, 0, 0.6);
          }
        }
      }
    }
  }

  .file-cut-upload-comp-previewbox {
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      display: block;
      max-width: 750px;
      max-height: 750px;
      margin: 0 auto;
    }
  }
</style>
