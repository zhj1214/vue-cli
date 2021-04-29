<template>
  <div>
    <div class="name">
      {{ item.equityName }}
    </div>
    <div class="display-id">
      {{ item.id }}
    </div>
  </div>
</template>

<script>
  export default {
    name: 'NameIdCell',
    props: {
      item: Object,
    },
    data() {
      return {}
    },
    created() {
      console.log('item', this.item)
    },
  }
</script>

<style lang="scss" scoped>
  .name {
    height: 24px;
    font-family: SFUIDisplay-Light, SFUIDisplay;
    font-size: 14px;
    font-weight: 300;
    line-height: 24px;
    color: rgba(23, 23, 37, 1);
  }

  .display-id {
    height: 22px;
    margin-top: 4px;
    font-family: SFUIDisplay-Light, SFUIDisplay;
    font-size: 12px;
    font-weight: 300;
    line-height: 22px;
    color: rgba(146, 146, 157, 1);
    vertical-align: middle;
  }
</style>
