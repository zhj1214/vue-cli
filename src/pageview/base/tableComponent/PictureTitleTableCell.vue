<template>
  <div class="picture-cell">
    <img
      class="picture"
      :src="imgUrl"
      :alt="alt"
    >
    <div>
      <div
        class="name"
        @click="jumpProductDetail"
      >
        {{ name }}
      </div>
      <div class="id">
        ID：{{ productId }}
      </div>
    </div>
  </div>
</template>

<script>
    /**
     *  图片标题单元格
     *  @desc 展示表格中的图片标题单元
     *  @param { string } imgUrl 图片链接
     *  @param { id } id 展示的 id
     *  @param { alt } alt 图片替代文本
     *  @example 调用示例 /authority/recommendManage/humanRecommend/HumanRecommend.vue
     *  h(PictureTitleTableCell, {
                    props: {
                        imgUrl: productImgUrl || '',
                        id: 0,
                        name: productName,
                        alt: '商品图片',
                    }
                })
     */
    export default {
        name: "PictureTitleTableCell",
        props: {
            imgUrl: String,
            id: Number,
            productId: String,
            name: String,
            alt: String,
            pageType: String,
        },
        methods: {
            jumpProductDetail() {
                let urlList = {
                    POINT_GOODS: '/store/store',
                    ONLINE_GOODS: '/store/online',
                }
                let url = urlList[this.pageType]
                let completeUrl = `${ url }?orderId=${ this.id }`
                console.log('completeUrl', completeUrl)
                // this.$router.push({
                //     path: url,
                //     query:{
                //         orderId: this.id
                //     }
                // });
                window.open(completeUrl, '_blank')
            },
        }
    }
</script>

<style lang="scss" scoped>
    .picture-cell {
        display: flex;
        justify-content: space-evenly;
    }

    .name {
        font-size:14px;
        font-family:PingFangSC-Regular,PingFang SC,sans-serif;
        font-weight:400;
        color: #729BE7;
        line-height:22px;
        cursor: pointer;
    }

    .id {
        margin-top: 4px;
        font-size:12px;
        font-family:SFUIDisplay-Regular,SFUIDisplay,sans-serif;
        font-weight:400;
        color:rgba(154,168,184,1);
        line-height:20px;
    }

    .picture {
        width: 48px;
        height: auto;
    }
</style>
