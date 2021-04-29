<template>
  <div>
    <Cascader
      ref="organizationTree"
      v-model="displayOrg"
      :data="orgData"
      :load-data="loadTreeData"
      :placeholder="placeholder"
      change-on-select
      @on-change="chooseOrg"
    />
  </div>
</template>

<script>
  // import { log } from "@/utils/tools";

  import { createOrgCascade, log } from '@/utils/tools'

  /**
   * 选择所属组织组件
   * 选中组织后，会触发 selectOrg 事件，回调函数的参数是包含选中组织的 orgId
   * @param showCurrent 是否显示当前层级
   * @param currentNodeList 自定义当前层级的数据
   * @example <BelongOrgCascade @selectOrg="selectOrg" />
   */
  export default {
    name: 'BelongOrgCascade',
    components: {},
    props: {
      // 是否展示当前级
      showCurrent: {
        type: Boolean,
        default: true,
      },
      currentSelect: String,
      currentNodeList: {
        type: Array,
        default: function () {
          return []
        },
      },
      defaultSelect: {
        type: Array,
        default: function () {
          return []
        },
      },
      // placeholder文案 默认请选择
      placeholder: {
        type: String,
        default: '请选择',
      },
    },
    data() {
      return {
        orgData: [],
        searchDepart: '',
        actionDepart: '',
        actionOrgId: '',
        // 只用作回显
        displayOrg: this.defaultSelect,
      }
    },
    computed: {},
    watch: {
      currentSelect(newVal) {
        this.actionDepart = newVal
      },
    },
    created() {
      this.initData()
      this.renderCurrentLevel()
    },
    mounted() {},
    methods: {
      initData() {
        this.searchDepart = localStorage.getItem('departmentId')
      },
      // 是否要渲染当前层级
      renderCurrentLevel() {
        if (this.showCurrent) {
          if (this.currentNodeList.length !== 0) {
            this.orgData = this.currentNodeList
          } else {
            let { orgName, departmentId, orgId } = localStorage
            this.orgData = [
              {
                label: orgName,
                value: departmentId,
                loading: false,
                children: [],
                orgId,
              },
            ]
          }
        } else {
          this.getOrgList((resData) => {
            this.orgData = createOrgCascade(resData, 'name', 'id')
          })
        }
      },
      /**
       * 获取组织数据
       * @param fn 用来给级联赋值
       */
      getOrgList(fn) {
        let server = '/user-server'
        let url = server + '/platform/department/pageTree'
        let data = {
          departmentId: this.searchDepart,
        }

        this.$ajaxPost(url, data)
          .then((res) => {
            if (res && res.code === 10000) {
              let resData = res.data.list || []
              if (fn) {
                fn(resData)
              }
            }
          })
          .catch((err) => {
            log(err)
          })
      },
      /**
       * 动态加载组织树
       * @param node 当前节点
       * @param callback 回调函数，用来控制子节点的展开
       */
      loadTreeData(node, callback) {
        this.actionDepart = this.currentSelect || node.value
        this.searchDepart = node.value
        node.loading = true

        this.getOrgList((resData) => {
          let dataFormat = createOrgCascade(resData, 'name', 'id')

          // 用来修复没有子节点时，级联不能选中的 bug
          if (dataFormat.length === 0) {
            dataFormat = [
              {
                label: '暂无数据',
                value: '',
                disabled: true,
              },
            ]
          }
          node.children = dataFormat
          node.loading = false
          callback()
        })
      },
      chooseOrg(list, selectedData) {
        log('selectedData', selectedData)
        let emptySelect = selectedData.length === 0

        let orgId
        if (emptySelect) {
          orgId = ''
        } else {
          // 永远只取最后一个
          orgId = selectedData.slice(-1)[0].orgId
        }

        this.$emit('selectOrg', orgId, selectedData)
      },
      /**
       * @description 清空组织树
       */
      clearTree() {
        this.$refs.organizationTree.clearSelect()
      },
    },
  }
</script>

<style lang="scss" scoped></style>
