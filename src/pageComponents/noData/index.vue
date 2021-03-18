<!--
 * @Author: your name
 * @Date: 2020-12-30 16:50:26
 * @LastEditTime: 2020-12-30 17:22:44
 * @LastEditors: Please set LastEditors
 * @Description: 暂无数据组件
 * @FilePath: /heng-weapp/src/pageComponents/noData/index.vue
-->
<template>
    <view class="no-data">
        <image :src="img" />
        <text>{{ text }}</text>
    </view>
</template>
<script>
export default {
    props: {
        // 图片地址
        img: {
            type: String,
            default: require("@/static/images/parking/noRecord.png"),
        },
        // 文案
        text: {
            type: String,
            default: "暂无数据",
        },
        // 图片大小
        // imgStyle: {
        //     type: Object,
        //     default: () => {
        //         return {
        //             width: "140px",
        //             height: "140px",
        //         };
        //     },
        // },
    },
    data() {
        return {
            imgStyle: {
                width: "140px",
                height: "140px",
            },
        };
    },
    created() {
        console.log("imgStyle:", this.imgStyle);
    },
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>