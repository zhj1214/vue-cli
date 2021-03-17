<!--
Render rule detail
-->
<template>
  <ul class="cascadeLabel">
    <slot name="level" />
    <!-- 用户做过，没做过-->
    <li
      v-if="metaMap.field&&node.eventType&&metaMap.field[node.eventType]"
      style="font-size: 16px;"
    >
      <strong>{{ node.actionAttr && actionRuleMap[node.actionAttr] }}</strong>
      <strong>
        {{ metaMap.field && node.eventType && metaMap.field[node.eventType] }}
      </strong>
    </li>

    <!-- actionAttr=1代表用户做过的情况，次数,numberValue 与value 是互斥的，表示int/float、string类型的区别,valueA,valueB 用于区间的int/float -->
    <li style="color: #171725">
      {{ node.actionAttr === 1 ? renderTotalType(node.totalType) : "" }}
      {{ node.actionAttr === 1 ? metaMap.operator && node.operator && metaMap.operator[node.operator] : "" }}
      <!--            {{-->
      <!--                node.actionAttr === 1 ? (node.eventType && metaMap[node.eventType] && metaMap[node.eventType][node.value] || node.goodsName || (Number(node.valueA) && Number(node.valueB) ? (node.valueA-->
      <!--                    + "," + node.valueB) : "") || (Number(node.numberValue) === 0 ? node.value : node.numberValue)) : ""-->
      <!--            }}-->
      {{
        showActionRule()
      }}
      {{ node.valueC ? ("至" + node.valueC) : "" }}<!--针对区间月份-->
      {{
        node.actionAttr === 1 ? (node.actionAttr === 3 ? node.unit : (metaMap.actionTotalType && node.totalType && metaMap.actionTotalType[node.totalType] && metaMap.actionTotalType[node.totalType].unit)) : ""
      }}
    </li>

    <!-- 时间 用户做过1、用户没做过2 才需要显示时间-->
    <li
      v-if="Number(node.actionAttr)!==3"
      class="p-text"
    >
      时间：
      {{ node.timeArea && parserTime(node.timeArea) }}
    </li>

    <!-- 用户做过的过滤规则 -->
    <li
      v-if="node.attrsRule&&node.attrsRule.children&&node.attrsRule.children.length"
      class="p-text"
    >
      <p>
        并满足以下筛选条件，筛选规则关系：<span
          class="is-active"
        >{{ node.attrsRule.logic === "all" ? "且(AND)" : "或(OR)" }} </span>
      </p>
      <p style="margin-top: 4px;">
        <span
          v-for="(item,filterIndex) in node.attrsRule.children"
          :key="filterIndex"
          class="filter-item"
        >
          {{ item.eventTypeName }}
          {{ metaMap["operator"] && metaMap["operator"][item.operator] || item.operatorName }}
          {{
            showFilterRule(item)
          }}
          {{ item.unit }}
        </span>
      </p>
    </li>
    <!-- 用户属性时的过滤规则-->
    <!--        <li class="p-text" v-if="node.actionAttr===3">-->
    <!--            <p style="margin-top: 4px;">-->
    <!--            <span class="filter-item">-->
    <!--                    {{ node.eventTypeName }}-->
    <!--                    {{-->
    <!--                    metaMap["operator"] && metaMap["operator"][node.operator] || node.operatorName-->
    <!--                }}-->
    <!--                    {{-->
    <!--                    node.eventType && metaMap[node.eventType] && metaMap[node.eventType][node.value] || node.goodsName || (Number(node.numberValue) === 0 ? node.value : node.numberValue) || node.value-->
    <!--                }}-->
    <!--                {{ node.unit }}-->
    <!--            </span>-->
    <!--            </p>-->
    <!--        </li>-->
    <li
      v-if="node.actionAttr===3"
      class="p-text"
    >
      <p style="margin-top: 4px;">
        <span class="filter-item">
          {{ node.eventTypeName }}
          {{
            metaMap["operator"] && metaMap["operator"][node.operator] || node.operatorName
          }}
          {{
            showPropertyRule()
          }}
          {{ node.unit }}
        </span>
      </p>
    </li>
  </ul>
</template>

<script>
import {actionRuleMap, computedEnums} from "../../memberTableCol";
import {_date} from "@/utils/tools";
import { checkNestedProperty } from "@/utils/tools";
import { log } from "@/utils/tools";

export default {
    name: "CascadeLabel",
    props: {
        node: {
            type: Object,
            default() {
                return {
                    timeArea: {},
                    attrsRule: {
                        children: []
                    }
                };
            }
        },
        metaMap: {
            type: Object,
            default() {
                return {
                    field: {},
                    fieldType: {},
                    operator: {},
                    actionTotalType: {},
                };
            }
        }
    },
    data() {
        return {
            actionRuleMap: actionRuleMap,
            timeMap: {
                'last_day': '昨天',
                'this_day': '今天',
                'last_week': '上周',
                'this_week': '本周',
                'last_month': '上月',
                'this_month': '本月',
                'last_year': '去年',
                'this_year': '本年',
            }
        };
    },
    computed: {},
    methods: {
        /**
         * 计算枚举时间
         * @param timeArea
         * @return string
         * */
        parserTime(timeArea = {}) {
            const {type, subType, value, beginTime, endTime} = timeArea || {};
            switch (type) {
                case 'static':
                    return (beginTime || "") + " ~ " + (endTime || "");
                case 'dynamic':
                    var [_beginTime, _endTime] = _date.lastWhatDay(Number(value)) || ["", ""];
                    return ('最近' + value + '天 | ') + _beginTime + " ~ " + _endTime;
                case 'enums':
                    var [enBegin, enEnd] = computedEnums(subType, value) || ["", ""];
                    return this.timeMap[subType + '_' + value] + " | " + enBegin + " ~ " + enEnd;
                default:
                    new Error('意外的type:' + type);
                    return "";
            }
        },
        /**
         * 渲染级联的totalType
         * @param totalTypeArray
         * */
        renderTotalType(totalTypeArray) {
            let resultStr = "";
            if (!totalTypeArray) return resultStr;
            else if (Array.isArray(totalTypeArray)) {
                const mapActionType = this.metaMap.actionTotalType || {};
                const firstKey = totalTypeArray[0];
                if (mapActionType[firstKey]) {
                    const children = mapActionType[firstKey].children;
                    totalTypeArray.map((item, index) => {
                        if (index === 0) {
                            resultStr += mapActionType[firstKey].label;
                        }
                        if (children && Array.isArray(children)) {
                            children.map(child => {
                                if (child.value === item) {
                                    resultStr += " " + child.label;
                                }
                            });
                        }
                    });

                }
            }
            return resultStr;
        },
        /**
         * 显示用户属性的规则
         */
        showPropertyRule() {
            log('showPropertyRule, this.node', this.node)
            log('this.item', this.item)
            let operator = this.node.operator
            if (operator === 'between') {
                let { valueA, valueB } = this.node
                let text = `[${ valueA },${ valueB }]`
                if (valueA === valueB) {
                    return this.node.value
                }
                return text
            }

            // eslint-disable-next-line no-unused-vars
            let display
            if (this.node.hasOwnProperty('eventType')) {
                let eventType = this.node.eventType

                let hasNodeValue = checkNestedProperty(this.metaMap, eventType, this.node.value)
                if (hasNodeValue) {
                    display = this.metaMap[this.node.eventType][this.node.value]
                    return display
                }
            }

            let hasGoodsName = this.node.hasOwnProperty('goodsName') &&
                this.node.goodsName !== '' &&
                this.node.goodsName !== null

            if (hasGoodsName) {
                display = this.node.goodsName
                return display
            }



            let hasNumberValue = Number(this.node.numberValue) !== 0
            if (hasNumberValue) {
                display = this.node.numberValue
            } else {
                display = this.node.value
            }
            return display
        },
        // 用户做过
        showActionRule() {
            log('showPropertyRule, this.node', this.node)
            // eslint-disable-next-line no-unused-vars
            let display
            if (this.node.hasOwnProperty('eventType')) {
                let eventType = this.node.eventType

                let hasNodeValue = checkNestedProperty(this.metaMap, eventType, this.node.value)
                if (hasNodeValue) {
                    display = this.metaMap[this.node.eventType][this.node.value]
                    return display
                }
            }

            let hasGoodsName = this.node.hasOwnProperty('goodsName') &&
                this.node.goodsName !== '' &&
                this.node.goodsName !== null

            if (hasGoodsName) {
                display = this.node.goodsName
                return display
            }

            let operator = this.node.operator
            if (operator === 'between') {
                let { valueA, valueB } = this.node
                let text = `${ valueA },${ valueB }`
                if (valueA === valueB) {
                    return this.node.value
                }
                return text
            }

            let hasNumberValue = Number(this.node.numberValue) !== 0
            if (hasNumberValue) {
                display = this.node.numberValue
            } else {
                display = this.node.value
            }
            return display
        },
        showFilterRule(rule) {
            log('showFilterRule, rule', rule)
            log('this.item', this.item)
            let operator = rule.operator
            if (operator === 'between') {
                let { valueA, valueB } = rule
                let text = `[${ valueA },${ valueB }]`
                if (valueA === valueB) {
                    return rule.value
                }
                return text
            }

            // eslint-disable-next-line no-unused-vars
            let display
            if (rule.hasOwnProperty('eventType')) {
                let eventType = rule.eventType

                let hasNodeValue = checkNestedProperty(this.metaMap, eventType, rule.value)
                if (hasNodeValue) {
                    display = this.metaMap[rule.eventType][rule.value]
                    return display
                }
            }

            let hasGoodsName = this.node.hasOwnProperty('goodsName') &&
                rule.goodsName !== '' &&
                rule.goodsName !== null

            if (hasGoodsName) {
                display = rule.goodsName
                return display
            }



            let hasNumberValue = Number(rule.numberValue) !== 0
            if (hasNumberValue) {
                display = rule.numberValue
            } else {
                display = rule.value
            }
            return display
        },
    }
};
</script>

<style scoped lang="scss">
.cascadeLabel {
    margin-bottom: 24px;

    li {
        list-style: none;
        padding: 0 10px;
        border-radius: 4px;
        margin: 0 5px;
    }

    .value {
        background: #fff;
        border: 1px solid #E1E6EB;
        color: #3E4552;
    }
}

.filter-item {
    padding: 0 10px;
    border: 1px solid #D5D5DB;
    margin-right: 24px;
    background: #F6F6F7;
    color: #696974;
    border-radius: 12px;
}

.span-level {
    position: absolute;
    left: 0;
    top: 0;
    display: inline-block;
    width: 24px;
    height: 24px;
    text-align: center;
    border-radius: 8px;
    color: #fff;
    background: #756CEA;
}
</style>
