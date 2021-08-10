/*
 * @Author: NineNan
 * @Date: 2021-07-24 11:21:47
 * @LastEditTime: 2021-07-27 14:10:56
 * @LastEditors: Please set LastEditors
 * @Description: 公共全局可用的mixin
 * 其实我感觉用 vuex 会更好
 * @FilePath: /yhqt-h5-client/src/mixins/public.js
 */
// import { STORAGE } from '@/utils/constant';

export const publicMixin = {
    computed: {
        /**
         * 是否登陆
         * @returns boolean
         */
        isLogin() {
            return this.$store.state.user.isLogin
        },
    },
    methods: {
        /**
         * 跳转登录页面
         */
        goLogin() {
            uni.navigateTo({
                url: '/pages/login/login'
            })
        }
    },
};
