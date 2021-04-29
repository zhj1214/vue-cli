<template>
  <div class="confirm-bubble">
    <Poptip v-model="showPop" trigger="click" placement="top" :transfer="true">
      <div class="action-text"> 查看说明 </div>
      <div slot="title" class="title">
        {{ createChangeReason() }}
      </div>
      <div slot="content" class="content">
        <div class="change-reason">
          {{ item.remark }}
        </div>
        <div v-if="showNumber" class="serial-number row-gap">
          <span>流水号：</span>
          <span @click="openGrowthPage">{{ item.serialNumber }}</span>
        </div>
        <div v-if="showOperator" class="operate-time row-gap">
          <div>操作人：{{ item.creator }}（{{ item.orgName }}）</div>
          <div>操作时间：{{ dateParser(item.insertTime) }}</div>
        </div>
      </div>
    </Poptip>
  </div>
</template>

<script>
  // import { log } from "@/utils/tools";
  import { findListLabel, dateParser } from '@/utils/tools'
  import { reasonList } from './reasonList'

  export default {
    name: 'ChangeReasonBubble',
    props: {
      item: Object,
    },
    data() {
      return {
        showPop: false,
        toConfig: false,
        showDelete: true,
        list: reasonList,
      }
    },
    computed: {
      showNumber() {
        let { levelChangeReason } = this.item
        return levelChangeReason === 1 || levelChangeReason === 2
      },
      showOperator() {
        let { levelChangeReason } = this.item
        return levelChangeReason === 4 || levelChangeReason === 5
      },
    },
    created() {},
    methods: {
      dateParser(time) {
        return dateParser(time)
      },
      createChangeReason() {
        let reason = findListLabel(this.list, this.item.levelChangeReason)
        return reason
      },
      openGrowthPage() {
        let serial = this.item.serialNumber
        this.$router.push({
          path: '/right/growthManage/growthDetail',
          query: {
            serial: serial,
          },
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  .title {
    font-family: SFUIDisplay-Medium, SFUIDisplay;
    font-size: 14px;
    font-weight: bold;
    line-height: 24px;
    color: rgba(23, 23, 37, 1);
  }

  .action-text {
    color: #756cea;
    cursor: pointer;
  }

  .content {
    padding: 4px 0;
  }

  .change-reason {
    font-family: SFUIDisplay-Light, SFUIDisplay;
    font-size: 14px;
    font-weight: 300;
    line-height: 24px;
    color: rgba(68, 68, 79, 1);
  }

  .serial-number {
    & span {
      font-family: SFUIDisplay-Light, SFUIDisplay;
      font-size: 12px;
      font-weight: 300;
      line-height: 22px;
      color: rgba(146, 146, 157, 1);
    }

    & span:last-child {
      color: #756cea;
      cursor: pointer;
    }
  }

  .operate-time {
    font-family: SFUIDisplay-Light, SFUIDisplay;
    font-size: 12px;
    font-weight: 300;
    line-height: 22px;
    color: rgba(146, 146, 157, 1);
  }

  .row-gap {
    margin-top: 4px;
  }
</style>
