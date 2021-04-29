<template>
  <div>
    <div class="current">
      {{ currentOrg }}
    </div>
    <div class="higher">
      {{ higherOrg }}
    </div>
  </div>
</template>

<script>
  // import { log } from "@/utils/tools";

  export default {
    name: 'BelongOrgCell',
    components: {},
    props: {
      currentOrg: String,
      higherOrg: String,
    },
    data() {
      return {}
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {},
    methods: {},
  }
</script>

<style lang="scss" scoped>
  .current {
    font-family: SFUIDisplay-Light, SFUIDisplay;
    font-size: 14px;
    font-weight: 300;
    line-height: 24px;
    color: #171725;
  }

  .higher {
    font-family: SFUIDisplay-Light, SFUIDisplay;
    font-size: 12px;
    font-weight: 300;
    line-height: 22px;
    color: #92929d;
  }
</style>
