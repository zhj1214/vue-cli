export default {
  data() {
    return {
      organizeType: null,
      // 1：商户，2：门店，3：部门，4：区域，5：商场，6：特殊部门（店铺下部门），7：特殊部门（商场下部门），8：特殊部门（区域下部门），9：特殊部门（集团下部门），10：店铺
      isSearchDirectOrgInfo: false,
      directOrgId: null, // 直营店铺orgId
    }
  },
  mounted() {
    this.directOrgId = null
  },
  methods: {
    // 查看组织详情接口
    async getBatch(isSearchDirectOrgInfo = false) {
      const { data = [] } = await this.$ajaxPost('/user-server/internal/organization/batch', [
        localStorage.getItem('orgId'),
      ])
      if (data && data.length) {
        this.organizeType = data[0].type
        if (this.organizeType == 5 && isSearchDirectOrgInfo) {
          this.searchDirectOrgInfo()
        }
      }
    },
    // arr:数组，数组中手动加入当前登录人所在组织type类型值
    getAuth(arr) {
      if (!arr || !arr.length || !arr.includes(this.organizeType)) {
        return false
      }
      return true
    },
    async searchDirectOrgInfo() {
      const { data = [] } = await this.$ajaxPost(
        '/user-server/internal/organization/searchDepartment',
        {
          orgIds: [localStorage.getItem('orgId')],
          types: [10],
          shopTypes: [3],
          isSearch: true,
        }
      )
      this.isSearchDirectOrgInfo = false
      if (data && data.list.length) {
        this.directOrgId = data.list[0].orgId
      } else {
        return this.$Message.error('组织查询异常')
      }
    },
  },
}
