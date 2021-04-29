<template>
  <div class="level-right">
    <div v-for="(t, index) in list" :key="index" class="tag-container">
      <span>{{ t.equityName }}</span>
      <i class="icon iconfont iconClose" title="" @click="deleteRight(t)" />
    </div>
  </div>
</template>

<script>
  // import { log } from "@/utils/tools";

  export default {
    name: 'ShowLevelRight',
    components: {},
    props: {
      list: Array,
    },
    data() {
      return {}
    },
    computed: {},
    watch: {
      // list(updateList) {
      //     log('重新渲染')
      //     this.$set(this.list, updateList)
      //     // this.list = updateList
      // }
    },
    created() {},
    mounted() {},
    methods: {
      deleteRight(i) {
        let id = i.equityId
        this.$emit('delete', id)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .level-right {
    display: flex;
    width: 380px;
    height: 92px;
    //padding-right: 16px;
    padding-bottom: 16px;
    padding-left: 16px;
    overflow: hidden auto;
    background: #fff;
    border: 1px solid #e2e2e9;
    border-radius: 8px;
    justify-content: flex-start;
    flex-wrap: wrap;

    .iconfont {
      cursor: pointer;
    }
  }

  .tag-container {
    height: 22px;
    padding-left: 12px;
    margin-top: 16px;
    margin-right: 16px;
    font-family: SFUIDisplay-Light, SFUIDisplay;
    font-size: 12px;
    font-weight: 300;
    line-height: 22px;
    color: #696974;
    vertical-align: middle;
    background: #f6f6f7;
    border: 1px solid #d5d5db;
    border-radius: 11px;
  }
</style>
