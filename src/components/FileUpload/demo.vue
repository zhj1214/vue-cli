<template>
  <Fupload
    :multiple="true"
    name="file"
    :can-cut="true"
    :default-file-list="[{ name: 'aaa', url: '123213' }]"
    :show-upload-list="false"
    :max="2"
    :max-size="1000"
    :img-width="100"
    :show-upload-btn="true"
    list-type="list"
    :can-remove="false"
    :can-preview="true"
    @on-change="handleChange"
  >
    <!-- 自定义上传按钮 -->
    <!-- <template v-slot:uploadBtn>我是自定义按钮</template> -->
    <!-- 自定义上传按钮 -->
    <!-- <template v-slot:uploadExtraText>我是自定义按钮提示</template> -->
    <!-- 自定义渲染每行文件内容 -->
    <!-- <template v-slot:fileItem="{ data: data }"> {{ data.name }}</template> -->
  </Fupload>
</template>

<script>
  import Fupload from './index.vue'
  export default {
    components: {
      Fupload,
    },
    methods: {
      handleChange(fileList) {
        /**
         * @response
         * @type Array
         * @item {
         *    name: string      文件名
         *    size: number      文件大小，单位为B
         *    url: string       文件服务器地址
         *    uid: string       由upload或者uuid生成的唯一id
         *    extName: string   文件后缀名
         *    type: string      文件类型  image/*
         *    ...               其余不需要的属性
         * }
         */
        console.log('fileList:', fileList)
      },
    },
  }
</script>

<style></style>
