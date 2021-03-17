<template>
  <div class="level-right">
    <div
      v-for="(t, index) in list"
      :key="index"
      class="tag-container"
    >
      <span>{{ t.equityName }}</span>
      <i
        class="icon iconfont iconClose"
        title=""
        @click="deleteRight(t)"
      />
    </div>
  </div>
</template>

<script>
// import { log } from "@/utils/tools";

export default {
    name: "ShowLevelRight",
    components: {},
    props: {
        list: Array,
    },
    data() {
        return {};
    },
    computed: {},
    watch: {
        // list(updateList) {
        //     log('重新渲染')
        //     this.$set(this.list, updateList)
        //     // this.list = updateList
        // }
    },
    created() {
    },
    mounted() {

    },
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
    justify-content: flex-start;
    flex-wrap: wrap;

    width: 380px;
    height: 92px;
    background: #FFFFFF;
    border-radius: 8px;
    border: 1px solid #E2E2E9;
    overflow: hidden auto;

    padding-left: 16px;
    //padding-right: 16px;
    padding-bottom: 16px;

    .iconfont {
        cursor: pointer;
    }
}

.tag-container {
    margin-top: 16px;
    height: 22px;
    background: #F6F6F7;
    border-radius: 11px;
    border: 1px solid #D5D5DB;
    padding-left: 12px;
    margin-right: 16px;

    font-size: 12px;
    font-family: SFUIDisplay-Light, SFUIDisplay;
    font-weight: 300;
    color: #696974;
    line-height: 22px;

    vertical-align: middle;

}
</style>
