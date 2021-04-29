<template>
  <BaseTable
    :list="layerCrowdList"
    :col="labelLayerPeopleCol"
    :loading="loading"
    :page-data="pageData"
    @on-pageSize="onPageSize"
    @on-pageChange="onPageChange"
  />
</template>

<script>
  import { labelLayerPeopleCol } from '../../memberTableCol'
  import BaseTable from '../../../base/BaseTable'

  export default {
    name: 'LayerMember',
    components: { BaseTable },
    props: {
      comData: Object,
    },
    data() {
      return {
        labelLayerPeopleCol: labelLayerPeopleCol.call(this),
        layerCrowdList: [],
        loading: false,
        // 客群用户
        pageData: {
          page: 1,
          size: 10,
          count: 0,
        },
      }
    },
    mounted() {
      this.onSearchLayerCrowdList()
    },
    methods: {
      onPageSize(size) {
        this.pageData.size = size
        this.onSearchLayerCrowdList()
      },
      onPageChange(page) {
        this.pageData.page = page
        this.$nextTick(() => {
          this.onSearchLayerCrowdList()
        })
      },
      // 获取客群人群
      onSearchLayerCrowdList() {
        const id = this.$route.query.id || this.comData.id || ''
        if (!id) return
        this.loading = true
        this.$ajaxGet('/label-server/labelGroup/members', {
          id,
          ...this.pageData,
        }).then((res) => {
          if (res && res.code === 10000) {
            this.layerCrowdList = res.data.list || []
            this.pageData.count = res.data.count || 0
          }
          this.loading = false
        })
      },
    },
  }
</script>

<style scoped></style>
