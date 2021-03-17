<template>
  <div class="container">
    <i-col
      span="8"
      class="low"
    >
      <div>{{ lowName }}</div>
      <div class="member-name row-gap">
        {{ item.beforeLevelName }}
      </div>
    </i-col>
    <i-col
      span="4"
      class="icon"
      :class="(item.levelChangeType === 1) ? 'up-level' : 'down-level'"
    >
      <i
        class="icon iconfont iconTreeUnfold-copy"
        title=""
      />
    </i-col>
    <i-col
      span="8"
      class="high"
    >
      <div>{{ highName }}</div>
      <div class="member-name row-gap">
        {{ item.afterLevelName }}
      </div>
    </i-col>
  </div>
</template>

<script>
    import { dateParser } from "@/utils/tools";
    export default {
        name: "LevelChangeCell",
        props: {
            item: Object,
        },
        data() {
            return {
                date: '',
                lowName: '',
                highName: '',
            }
        },
        computed: {
        },
        created() {
            this.initDate()
        },
        methods: {
            dateParser(date) {
                return dateParser(date)
            },
            initDate() {
                let { levelChangeBefore, levelChangeAfter } = this.item
                this.lowName = this.changeLevelName(levelChangeBefore)
                this.highName = this.changeLevelName(levelChangeAfter)
            },
            changeLevelName(l) {
                let str = ''
                str = `${l.slice(0, 2)} ${l.slice(2)}`
                return str
            },
            createYear() {
                return this.date.slice(0, 10)
            },
            createTime() {
                return this.date.slice(-8)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .container {
        display: flex;
        justify-content: space-around;
    }

    .row-gap {
        margin-top: 4px;
    }

    .member-name {
        font-size:12px;
        font-weight:300;
        color:rgba(146,146,157,1);
        line-height:22px;
    }

    .high {
        text-align: left;
    }

    .up-level {
        .iconfont {
            color: #F85963;
        }
    }

    .down-level {
        .iconfont {
            color: #41D39B;
        }
    }
</style>