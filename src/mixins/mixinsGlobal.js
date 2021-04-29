/***********************
 * @desc 全局性mixins，适合用于控制引入控制页面按钮权限显示
 * @author Jo.gel
 * @date 2020/3/18 0018
 * @example
 * 	import mixinsGlobal from "../../mixins/mixinsGlobal"
 * 	mixins: [mixinsGlobal]
 ***********************/
export default {
  computed: {
    pageAction() {
      return this.$store.getters.pageActions[this.$route.name] || []
    },
  },
  methods: {
    /**
     * 是否有权限
     * @desc 传入多个参数，只要有一个权限就返回 true。适合多个权限字段控制的页面元素。
     * @param list
     * @returns {boolean}
     */
    __hasPower(...list) {
      const hasRight = list.some((element) => this.pageAction.includes(element))
      return hasRight
    },
  },
}
