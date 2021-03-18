<template>
  <view class="page-store-exchange">
    <app-store-card></app-store-card>
    <app-store-card></app-store-card>
  </view>
</template>

<script>
import AppStoreCard from '@/pageComponents/ht-app/cards/store-card.vue';

export default {
  name: 'page-store-exchange',
  components: {
    AppStoreCard,
  },
};
</script>

<style lang="less" scoped>
.page-store-exchange {
}
</style>
