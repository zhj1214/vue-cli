<template>
  <Modal
    v-model="status"
    title="选择等级权益"
    width="648"
    :mask-closable="false"
    footer-hide
    @on-visible-change="changePopStatus"
  >
    <div class="content">
      <BaseTable
        ref="baseTable"
        :no-page="true"
        :list="list"
        :col="columns"
        @on-selectTable="onSelectTable"
      />
      <div class="view-footer huge-block-narrow">
        <Button class="text-narrow button-gap" @click="cancelConsumePop"> 取消 </Button>
        <Button type="primary" @click="submitRight"> 确定 </Button>
      </div>
    </div>
  </Modal>
</template>

<script>
  // import { log } from "@/utils/tools";
  import { col } from './chooseRightCol'
  import { log } from '@/utils/tools'
  import BaseTable from '@/pageview/base/BaseTable'

  export default {
    name: 'ChooseRightPop',
    components: {
      BaseTable,
    },
    props: {
      modalStatus: Boolean,
    },
    data() {
      return {
        status: this.modalStatus,
        columns: col.call(this),
        list: [],
        selectList: [],

        pageData: {
          page: 1,
          size: 10,
          count: 0,
        },
      }
    },
    computed: {},
    watch: {},
    created() {
      this.getList()
    },
    mounted() {},
    methods: {
      submitRight() {
        this.$emit('selectRight', this.selectList)
        this.$emit('updateStatus', false)
        this.initSelect()
      },
      cancelConsumePop() {
        this.initSelect()
        this.$emit('updateStatus', false)
      },
      changePopStatus() {
        this.initSelect()
        this.$emit('updateStatus', this.status)
      },
      initSelect() {
        this.selectList = []
      },
      getList() {
        let server = '/grade-server'
        let url = server + '/api/grade/equity/getAllGradeEquity'
        this.list = []

        this.$ajaxGet(url)
          .then((res) => {
            if (res && res.code === 10000) {
              let resData = res.data
              this.list = resData || []
              log('list', this.list)
              this.pageData.count = resData.total || 0
            }
          })
          .catch((err) => {
            log(err)
          })
      },
      onPageChange(page) {
        this.pageData.page = page
        this.$nextTick(() => {
          this.getList()
        })
      },
      onPageSize(size) {
        this.pageData.size = size
        this.$nextTick(() => {
          this.getList()
        })
      },
      onSelectTable(selection) {
        this.selectList = selection
      },
    },
  }
</script>

<style lang="scss" scoped></style>
