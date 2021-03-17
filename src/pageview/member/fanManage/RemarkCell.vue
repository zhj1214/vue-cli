<template>
  <div>
    <Poptip
      word-wrap
      width="200"
      trigger="hover"
      transfer
      placement="top-start"
      :content="remark"
    >
      <span class="show-ellipsis">{{ remark }}</span>
    </Poptip>
  </div>
</template>

<script>
// import { log } from "@/utils/tools";

export default {
    name: "RemarkCell",
    components: {},
    props: {
        remark: String,
    },
    data() {
        return {};
    },
    computed: {},
    watch: {},
    created() {
    },
    mounted() {

    },
    methods: {},
}
</script>

<style lang="scss" scoped>
    .show-ellipsis {
        display: inline-block;
        width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
