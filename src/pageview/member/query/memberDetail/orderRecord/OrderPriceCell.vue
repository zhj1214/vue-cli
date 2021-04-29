<template>
  <div>
    <div v-if="item.payMoney !== 0" class="price"> ￥ {{ item.payMoney }} </div>
    <div v-if="item.payScore !== 0" class="points"> + {{ item.payScore }} 积分 </div>
  </div>
</template>

<script>
  // import { dateParser } from "@/utils/tools";
  export default {
    name: 'OrderPriceCell',
    props: {
      item: Object,
    },
    data() {
      return {
        date: '',
      }
    },
    created() {},
    methods: {},
  }
</script>

<style lang="scss" scoped>
  .price {
    font-size: 12px;
    text-align: right;
  }

  .points {
    font-size: 14px;
    line-height: 24px;
    color: rgba(23, 23, 37, 1);
    text-align: right;
  }
</style>
