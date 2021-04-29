<template>
  <div :class="textClass">
    <span>{{ item.isAdd === 1 ? '+' : '-' }}</span>
    <span>{{ item.scoreValue }}</span>
  </div>
</template>

<script>
  export default {
    name: 'ChangeReasonCell',
    props: {
      item: Object,
    },
    data() {
      return {}
    },
    computed: {
      textClass() {
        let style = ['add-red', 'decrease-green']
        let type = this.item.isAdd === 1
        if (type) {
          return style[0]
        } else {
          return style[1]
        }
      },
    },
    created() {},
  }
</script>

<style scoped>
  .add-red {
    height: 24px;
    font-family: SFUIDisplay-Light, SFUIDisplay;
    font-size: 14px;
    font-weight: 300;
    line-height: 24px;
    color: rgba(252, 90, 90, 1);
  }

  .decrease-green {
    font-family: SFUIDisplay-Light, SFUIDisplay;
    font-size: 14px;
    font-weight: 300;
    line-height: 24px;
    color: rgba(61, 213, 152, 1);
  }
</style>
