<!--
 * @Description: 
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-04-28 17:35:35
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-04-29 14:49:21
-->
<template>
  <div class="mini-program">
    <component :is="currentComponent" :app-data="appData" @whatComponent="whatComponent" />
  </div>
</template>

<script>
  import InitBase from './components/InitBase'
  import DetailBase from './components/DetailBase'

  export default {
    name: 'Base',
    components: {
      InitBase,
      DetailBase,
    },
    data() {
      return {
        pageType: 'DetailBase',
        // 商户自己的orgID，门店则是父级的最大一级的orgId，原始组织id
        originOrgId: localStorage.getItem('originOrgId') || localStorage.getItem('orgId'),
        appData: {},
      }
    },
    computed: {
      currentComponent() {
        return this.pageType
      },
    },
    watch: {
      $route(to) {
        const { type = '' } = to.query || {}
        if (type === 'InitBase') {
          this.pageType = 'InitBase'
        }
      },
    },
    created() {
      this.getAppId()
    },
    methods: {
      whatComponent(label) {
        this.pageType = label.name
      },
      // 获取AppId
      getAppId() {
        this.$ajaxGet('/wechatplatform-server/api/auth/preAuthCode').then((res) => {
          if (res && res.code === 10000) {
            this.appData = res.data || {}
          }
        })
      },
    },
  }
</script>
