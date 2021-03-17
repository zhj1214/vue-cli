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
    name: "BelongOrgCell",
    components: {},
    props: {
        currentOrg: String,
        higherOrg: String,
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
    .current {
        font-size: 14px;
        font-family: SFUIDisplay-Light, SFUIDisplay;
        font-weight: 300;
        color: #171725;
        line-height: 24px;
    }

    .higher {
        font-size: 12px;
        font-family: SFUIDisplay-Light, SFUIDisplay;
        font-weight: 300;
        color: #92929D;
        line-height: 22px;
    }
</style>
