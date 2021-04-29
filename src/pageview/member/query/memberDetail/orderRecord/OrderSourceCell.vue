<template>
  <div>
    <div class="order" @click="jumpOrderDetail">
      {{ item.orderNo }}
    </div>
    <div class="source">
      {{ '在线商城' }}
    </div>
  </div>
</template>

<script>
  // import { dateParser } from "@/utils/tools";
  export default {
    name: 'OrderSourceCell',
    props: {
      item: Object,
    },
    data() {
      return {
        date: '',
      }
    },
    created() {},
    methods: {
      jumpOrderDetail() {
        let orderNum = this.item.orderNo
        let orgId = this.item.orgId
        let baseUrl = '/dealmanage/orderdetail'
        let completeUrl = `${baseUrl}?order=${orderNum}&orgId=${orgId}`
        window.open(completeUrl, '_blank')
      },
    },
  }
</script>

<style lang="scss" scoped>
  .order {
    font-family: SFUIDisplay-Light, SFUIDisplay;
    font-size: 14px;
    font-weight: 300;
    line-height: 24px;
    color: rgba(117, 108, 234, 1);
    cursor: pointer;
  }

  .source {
    margin-top: 4px;
    font-family: SFUIDisplay-Light, SFUIDisplay;
    font-size: 12px;
    font-weight: 300;
    line-height: 22px;
    color: rgba(146, 146, 157, 1);
  }
</style>
