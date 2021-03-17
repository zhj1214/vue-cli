<template>
  <div>
    <div v-if="toConfig">
      -
    </div>
    <img
      v-else
      :src="item.cardBackground"
      class="card-img"
      alt="卡面"
    >
  </div>
</template>

<script>
    // import {log} from "../../../utils/tools";

    export default {
        name: "ImgCell",
        props: {
            item: Object,
        },
        data() {
            return {
                toConfig: false,
            };
        },
        watch: {
            item(updateValue) {
                if (updateValue.id === '-') {
                    this.toConfig = true
                }
            }
        },
        created() {
            this.showConfigBtn()
        },
        methods: {
            showConfigBtn() {
                if (this.item.id === '-') {
                    this.toConfig = true
                }
            }
        }
    }
</script>

<style scoped lang="scss">

    .card-img {
        width:104px;
        height:40px;
    }
</style>
