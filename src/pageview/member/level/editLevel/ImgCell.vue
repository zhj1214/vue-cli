<template>
  <div>
    <div v-if="item.imgUrl === undefined"> - </div>
    <img v-else :src="item.imgUrl" class="card-img" alt="卡面" />
  </div>
</template>

<script>
  // import {log} from "../../../utils/tools";

  export default {
    name: 'ImgCell',
    props: {
      item: Object,
    },
    data() {
      return {}
    },
    created() {
      this.showConfigBtn()
    },
    methods: {
      showConfigBtn() {
        if (this.item.id === '-') {
          this.toConfig = true
        }
      },
    },
  }
</script>

<style scoped lang="scss">
  .card-img {
    width: 36px;
    height: 36px;
  }
</style>
