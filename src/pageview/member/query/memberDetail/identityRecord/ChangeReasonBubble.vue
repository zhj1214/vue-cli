<template>
  <div class="confirm-bubble">
    <Poptip
      v-model="showPop"
      trigger="click"
      placement="top"
      :transfer="true"
    >
      <div class="action-text">
        查看说明
      </div>
      <div
        slot="title"
        class="title"
      >
        {{ createChangeReason() }}
      </div>
      <div
        slot="content"
        class="content"
      >
        <div class="change-reason">
          {{ item.remark }}
        </div>
        <div
          v-if="showNumber"
          class="serial-number row-gap"
        >
          <span>流水号：</span>
          <span @click="openGrowthPage">{{ item.serialNumber }}</span>
        </div>
        <div
          v-if="showOperator"
          class="operate-time row-gap"
        >
          <div>操作人：{{ item.creator }}（{{ item.orgName }}）</div>
          <div>操作时间：{{ dateParser(item.insertTime) }}</div>
        </div>
      </div>
    </Poptip>
  </div>
</template>

<script>
    // import { log } from "@/utils/tools";
    import { findListLabel, dateParser } from "@/utils/tools";
    import { reasonList } from "./reasonList";

    export default {
        name: "ChangeReasonBubble",
        props: {
            item: Object,
        },
        data() {
            return {
                showPop: false,
                toConfig: false,
                showDelete: true,
                list: reasonList,
            };
        },
        computed: {
            showNumber() {
                let { levelChangeReason } = this.item
                return levelChangeReason === 1 || levelChangeReason === 2
            },
            showOperator() {
                let { levelChangeReason } = this.item
                return levelChangeReason === 4 || levelChangeReason === 5
            }
        },
        created() {
        },
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
                    path:"/right/growthManage/growthDetail",
                    query: {
                        serial : serial ,
                    }})
            }
        }
    }
</script>

<style scoped lang="scss">
    .title {
        font-size:14px;
        font-family:SFUIDisplay-Medium,SFUIDisplay;
        font-weight: bold;
        color:rgba(23,23,37,1);
        line-height:24px;
    }

    .action-text {
        cursor: pointer;
        color: #756CEA;
    }

    .content {
        padding: 4px 0;
    }

    .change-reason {
        font-size:14px;
        font-family:SFUIDisplay-Light,SFUIDisplay;
        font-weight:300;
        color:rgba(68,68,79,1);
        line-height:24px;
    }

    .serial-number {
        & span {
            font-size:12px;
            font-family:SFUIDisplay-Light,SFUIDisplay;
            font-weight:300;
            color:rgba(146,146,157,1);
            line-height:22px;
        }
        & span:last-child {
            cursor: pointer;
            color: #756CEA;
        }
    }

    .operate-time {
        font-size:12px;
        font-family:SFUIDisplay-Light,SFUIDisplay;
        font-weight:300;
        color:rgba(146,146,157,1);
        line-height:22px;
    }

    .row-gap {
        margin-top: 4px;
    }
</style>
