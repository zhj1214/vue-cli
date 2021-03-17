<template>
  <div>
    <div class="name">
      {{ item.serialNumber }}
    </div>
  </div>
</template>

<script>
    export default {
        name: "NameIdCell",
        props: {
            item: Object,
        },
        data() {
            return {

            }
        },
        created() {
        }
    }
</script>

<style lang="scss" scoped>
    .name {
        height:24px;
        font-size:14px;
        font-family:SFUIDisplay-Light,SFUIDisplay;
        font-weight:300;
        color:rgba(23,23,37,1);
        line-height:24px;
    }

    .display-id {
        margin-top: 4px;
        height:22px;
        font-size:12px;
        font-family:SFUIDisplay-Light,SFUIDisplay;
        font-weight:300;
        color:rgba(146,146,157,1);
        line-height:22px;
        vertical-align: middle;
    }
</style>