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
        name: "ChangeTypeCell",
        props: {
            item: Object,
        },
        data() {
            return {
                jump: false,
                pageType: '',
            }
        },
        created() {
        },
        methods: {
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

        text-overflow:ellipsis;
        width: 180px;
        overflow:hidden;
        white-space:nowrap;
    }

    .display-action {
        cursor: pointer;
        margin-top: 4px;
        height:22px;
        font-size:12px;
        font-family:SFUIDisplay-Light,SFUIDisplay;
        font-weight:300;

        line-height:22px;
        color:rgba(146,146,157,1);
        vertical-align: middle;

        &:hover {
            color: #756CEA;
        }
    }
</style>