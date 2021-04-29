<!--
用户行为过滤规则, 点击且/或可切换
-->
<template>
  <div class="cascade-behavior">
    <div v-if="attrsRule.children.length > 1" class="li-wrap">
      <strong class="badge vertical-line" @click="changeANDOR"
        >{{ logicParser(attrsRule.logic) }}
      </strong>
    </div>
    <ul class="ul-behavior">
      <SingleAttr
        v-for="(item, rIndex) in attrsRule.children"
        :key="rIndex"
        :rule="item"
        :r-index="rIndex"
        :is-attr="false"
        :filter-attrs-list="filterAttrsType"
      >
        <div slot="delete" class="del-rule">
          <i
            class="icon iconfont iconClose"
            style="color: #92929c; cursor: pointer;"
            @click="delRule(rIndex)"
          />
        </div>
      </SingleAttr>
    </ul>

    <!-- plus 按钮 -->
    <div style="margin-left: 24px;">
      <span class="span-a" @click="appendRule"> <i class="icon iconfont iconAdd" />新增 </span>
    </div>
  </div>
</template>

<script>
  import { childrenNoe } from '../../memberTableCol'
  import SingleAttr from './SingleAttr'
  import { log } from '@/utils/tools'

  export default {
    name: 'CascadeBehavior',
    components: { SingleAttr },
    props: {
      attrsRule: {
        type: Object,
        default() {
          return {
            logic: 'all',
            children: [
              {
                address: [],
                betweenValue: [],
              },
            ],
          }
        },
      },
      filterAttrsList: {
        type: Array,
        required: true,
      },
      nodeType: String,
    },
    data() {
      return {
        filterAttrsType: [],
      }
    },
    created() {
      log('---IN CascadeBehavior')
      this.getAttrEvent()
    },
    methods: {
      changeANDOR() {
        this.$set(this.attrsRule, 'logic', this.attrsRule.logic === 'all' ? 'any' : 'all')
      },
      logicParser(logicName) {
        return logicName === 'all' ? '且' : '或'
      },
      // 添加新的一行规则
      appendRule() {
        if (this.attrsRule.children.length > 19) {
          this.$Message.warning('用户行为过滤规则不能超过20条')
          return
        }
        this.attrsRule.children.splice(this.attrsRule.children.length, 0, {
          ...childrenNoe,
        })
      },
      // 删除规则
      delRule(index) {
        this.attrsRule.children.splice(index, 1)
      },
      getAttrEvent() {
        let data = {
          code: this.nodeType,
        }
        this.$ajaxGet('/label-server/label/getAttrTypeByActionType', data).then((res) => {
          if (res && res.code === 10000) {
            this.filterAttrsType = res.data || []
            log('getAttrEvent res.data', res.data)
          }
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  .cascade-behavior {
    position: relative;
    padding: 0 24px;
    margin: 24px 0;

    .li-wrap {
      position: absolute;
      top: 0;
      left: 12px;
      height: 100%;
      border-left: 1px solid #756cea;

      &::before {
        position: absolute;
        top: 0;
        left: 0;
        display: block;
        width: 12px;
        height: 1px;
        background: #756cea;
        content: '';
      }

      &::after {
        position: absolute;
        bottom: 0;
        left: 0;
        display: block;
        width: 12px;
        height: 1px;
        background: #756cea;
        content: '';
      }
    }

    .badge {
      position: absolute;
      top: 50%;
      left: -12px;
      width: 24px;
      height: 24px;
      line-height: 24px;
      color: #756cea;
      text-align: center;
      cursor: pointer;
      background: #e9e8ff;
      border-radius: 8px;
      transform: translateY(-50%);
    }
  }

  .ul-behavior {
    padding-top: 12px;
    padding-left: 24px;

    > li {
      position: relative;
      padding-bottom: 12px;
      margin-bottom: 24px;
      list-style: none;

      .del-rule {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
      }
    }
  }

  .is-attrs {
    .cascade-behavior {
      padding: 0;
      margin: 0;
    }

    .ul-behavior {
      padding-left: 0;
    }
  }
</style>
