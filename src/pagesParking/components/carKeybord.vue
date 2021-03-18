<!--
 * @Author: NineNan
 * @Date: 2020-12-29 16:26:25
 * @LastEditTime: 2021-01-25 20:13:05
 * @LastEditors: Please set LastEditors
 * @Description: 车牌号键盘
 * @FilePath: /heng-weapp/src/pagesParking/components/carKeybord.vue
-->
<template>
    <view class="keybord">
        <view class="title" v-if="title">{{ title }}</view>
        <view class="license-plate flex-center-row" >
            <view
                v-for="(item, index) in 8"
                :key="index"
                @click="showKeyBoar(index)"
                :class="[
                    { selected: index === licensePlate.length },
                    'number',
                    { 'no-before': index === licensePlate.length - 1 },
                ]"
            >
                {{ licensePlate[index] || "" }}
            </view>
        </view>
        <!-- 车牌号键盘 begin -->
        <u-keyboard
            ref="uKeyboard"
            mode="car"
            :safe-area-inset-bottom="true"
            v-model="isShowCarKeyboard"
            @change="valChange"
            @backspace="backspace"
        ></u-keyboard>
        <!-- 车牌号键盘 end -->
    </view>
</template>
<script>
export default {
    props: {
        // 标题
        title: {
            type: String,
            default: "请输入您的车牌号",
            required: true,
        },
    },
    data() {
        return {
            isShowCarKeyboard: false,
            licensePlate: "", // 车牌
            currentEditIdx: 0, // 当前修改的索引值
        };
    },
    methods: {
        /**
         * @description: 展示键盘，决定修改哪一个字符
         * @param {idx} 索引
         */
        showKeyBoar(idx){
            console.log(idx)
            if(this.licensePlate.length > 0){
                this.currentEditIdx = idx;
            }
            this.isShowCarKeyboard = true;
        },
        /**
         * @description 判断事件是否发送
         */
        sendEvent() {
            const reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领]{1}[A-HJ-NP-Z]{1}(?:(([0-9]{5}[DF])|([DF][A-HJ-NP-Z0-9][0-9]{4}))|[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})$/; // 新能源和非新能源
            const arr = [7, 8];
            if (arr.includes(this.licensePlate.length)) {
                if (reg.test(this.licensePlate)) {
                    this.$emit("success", this.licensePlate);
                } else {
                    this.$emit("fail");
                    uni.showToast({
                        title: "请输入正确的车牌号",
                        icon: "none",
                    });
                }
            } else {
                this.$emit("fail");
            }
        },
        /**
         * @description 键盘按钮触发
         */
        valChange(val) {
            if (this.licensePlate.length >= 8) return false;
            if(this.licensePlate.length <= this.currentEditIdx){
                this.licensePlate += val;        
            } else {
                let arr = this.licensePlate.split("");
                arr.splice(this.currentEditIdx,1,val)
                this.licensePlate = arr.join("");
            }
            ++this.currentEditIdx;
            this.sendEvent();
        },
        /**
         * @description 键盘删除
         */
        backspace() {
            // 删除licensePlate的最后一个字符
            if (this.licensePlate.length) {
                this.licensePlate = this.licensePlate.substring(
                    0,
                    this.licensePlate.length - 1
                );
                this.sendEvent();
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.keybord {
    .title {
        font: 16px/22px "PingFangSC-Regular, PingFang SC";
        color: #404040;
        margin-bottom: 14px;
    }
    .license-plate {
        display: flex;
        .number {
            width: 35px;
            height: 35px;
            border-radius: 2px;
            border: 1px solid #b9b9b9;
            margin-right: 4px;
            text-align: center;
            font: 16px/35px "PingFangSC-Regular, PingFang SC";
            color: #404040;
            &:nth-of-type(2) {
                margin-right: 13px;
                position: relative;
                &::after {
                    content: "";
                    position: absolute;
                    top: 50%;
                    right: -13px;
                    width: 6px;
                    height: 2px;
                    background-color: #444444;
                    transform: translate(-50%);
                }
            }
            &:last-child {
                border: 1px dotted #b9b9b9;
                position: relative;
                margin-right: 0;
                &::before {
                    content: "新能源";
                    font: 9px/13px "PingFangSC-Regular, PingFang SC";
                    position: absolute;
                    width: 100%;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: #b9b9b9;
                }
            }
        }
        .selected {
            border: 1px solid #fe5d4d !important;
        }
        .no-before::before {
            display: none;
        }
    }
}
</style>