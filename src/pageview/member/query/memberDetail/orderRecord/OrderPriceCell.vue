<template>
  <div>
    <div
      v-if="item.payMoney !== 0"
      class="price"
    >
      ￥ {{ item.payMoney }}
    </div>
    <div
      v-if="item.payScore !== 0"
      class="points"
    >
      + {{ item.payScore }} 积分
    </div>
  </div>
</template>

<script>
    // import { dateParser } from "@/utils/tools";
    export default {
        name: "OrderPriceCell",
        props: {
            item: Object,
        },
        data() {
            return {
                date: '',
            }
        },
        created() {
        },
        methods: {

        }
    }
</script>

<style lang="scss" scoped>
    .price {
        text-align: right;
        font-size:12px;
    }

    .points {
        font-size:14px;
        color:rgba(23,23,37,1);
        line-height:24px;
        text-align: right;
    }
</style>