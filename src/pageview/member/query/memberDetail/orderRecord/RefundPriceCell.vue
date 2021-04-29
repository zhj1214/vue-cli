<template>
  <div>
    <div class="price"> ￥ {{ item.totalPrice }} </div>
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
