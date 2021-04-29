<template>
  <div>
    <div class="name">
      {{ item.changeReasonString }}
    </div>
    <Poptip
      word-wrap
      width="200"
      trigger="hover"
      transfer
      placement="top-start"
      :content="item.content"
      :disabled="item.changeReason === 107"
    >
      <div class="display-id">
        {{ item.content }}
      </div>
    </Poptip>
  </div>
</template>

<script>
  export default {
    name: 'ChangeTypeCell',
    props: {
      item: Object,
    },
    data() {
      return {
        jump: false,
        pageType: '',
      }
    },
    created() {},
    methods: {},
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
    width: 180px;
    height: 22px;
    margin-top: 4px;
    overflow: hidden;
    font-family: SFUIDisplay-Light, SFUIDisplay;
    font-size: 12px;
    font-weight: 300;
    line-height: 22px;
    color: rgba(146, 146, 157, 1);
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
  }

  .display-action {
    height: 22px;
    margin-top: 4px;
    font-family: SFUIDisplay-Light, SFUIDisplay;
    font-size: 12px;
    font-weight: 300;
    line-height: 22px;
    color: rgba(146, 146, 157, 1);
    vertical-align: middle;
    cursor: pointer;

    &:hover {
      color: #756cea;
    }
  }
</style>
