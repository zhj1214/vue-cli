<!--
实际渲染组件
-->
<template>
  <li
    class="demo"
    :style="node.actionAttr==='3'?{paddingTop:'0'}:{}"
  >
    <!-- 做过没有做过 -->
    <Select
      v-model="node.actionAttr"
      class="w150 mr-5"
      @on-change="onChangeAttrs"
    >
      <OptionGroup
        v-for="items in actionAttrs"
        :key="items.code"
        :label="items.label"
      >
        <Option
          v-for="item in items.children"
          :key="item.code"
          :value="item.code"
        >
          {{ item.label }}
        </Option>
      </OptionGroup>
    </Select>
    <div
      v-if="node.actionAttr!=='3'"
      class="one-class"
      style="display: inline-block"
    >
      <!-- 行为+行为的结果 -->
      <!--            <Select-->
      <!--                class="w150 mr-5"-->
      <!--                v-if="node.actionAttr!=='3'"-->
      <!--                v-model="node.eventType"-->
      <!--                @on-change="onChangeEvent"-->
      <!--                filterable>-->
      <!--                <OptionGroup-->
      <!--                    v-for="items in fields"-->
      <!--                    :label="items.value"-->
      <!--                    :key="items.code">-->
      <!--                    <Option-->
      <!--                        v-for="item in items.children"-->
      <!--                        :value="item.code"-->
      <!--                        :key="item.code">{{ item.value }}-->
      <!--                    </Option>-->
      <!--                </OptionGroup>-->
      <!--            </Select>-->

      <Cascader
        v-if="node.actionAttr!=='3'"
        class="w150 mr-5 demo-inline"
        :data="casFields"
        placeholder="请选择变更类型"
        trigger="hover"
        @on-change="onChangeEvent"
      />

      <!-- 仅当用户没做过的时候-自定义日期date -->
      <DatePicker
        v-if="node.actionAttr==='2'"
        type="daterange"
        :value="computedDate()"
        class="tag-date"
        :editable="false"
        :options="dateOptions"
        placeholder="开始时间 →  结束时间"
        style="width: 200px"
        @on-change="changeDateClick"
      />

      <!-- 过滤图标 -->
      <i
        v-if="node.actionAttr!=='3'"
        class="icon iconfont iconFilter"
        style="cursor:pointer;"
        @click="onFilterModal"
      />
    </div>
    <div
      v-if="node.actionAttr!=='3'"
      class="is-behavior"
    >
      <!-- 第二行-->
      <div
        v-if="node.actionAttr==='1'"
        class="second-row"
      >
        <!-- 第二行统计-->
        <Cascader
          v-model="node.totalType"
          class="w150 mr-5"
          style="display: inline-block"
          :data="ob.supportActionTotalTypes||defaultSecondObject.supportActionTotalTypes||[]"
        />

        <!--logic supportOperators-->
        <Select
          v-model="node.operator"
          class="w120 mr-5"
          placeholder="操作符"
          @on-change="chooseLogic"
        >
          <Option
            v-for="(item,index) in ob.supportOperators||defaultSecondObject.supportOperators"
            :key="index"
            :value="item.code"
          >
            {{ item.value }}
          </Option>
        </Select>

        <div
          v-if="this.node.operator==='between'"
          class=""
          style="display: inline-block"
        >
          <InputNumber
            v-model.number="node.valueA"
            class="w80 ml-5 a8"
            :min="0"
            :max="99999999"
            :maxlength="20"
          />

          <span class="ml-5">至</span>
          <InputNumber
            v-model.number="node.valueB"
            class="w80 ml-5 mr-5"
            :min="0"
            :max="99999999"
            :maxlength="20"
          />
        </div>
        <!--Number输入,允许小数点--->
        <div
          v-else
          class="inputNumber-has-append"
          style="display: inline-block;vertical-align: middle"
        >
          <InputNumber
            v-model.number="node.numberValue"
            class="w100 mr-5 inputNumber-right-append"
            placeholder="值大于0"
            :min="0"
            :max="99999999"
            :step="1"
            :maxlength="20"
          />
          <span class="inputNumber-span">{{ getUnitName }}</span>
        </div>


        <!-- 自定义日期date -->
        <DatePicker
          type="daterange"
          :value="computedDate()"
          class="tag-date"
          :editable="false"
          :options="dateOptions"
          placeholder="开始时间 →  结束时间"
          style="width: 200px"
          @on-change="changeDateClick"
        />
      </div>

      <!-- 筛选过滤显示 -->
      <div
        v-if="node.attrsRule.children.length"
        class="filter-box"
      >
        <p>
          并满足以下筛选条件，筛选规则关系：
          <Dropdown @on-click="onChangeFilterLogic(arguments,node.attrsRule)">
            <span class="span-a">
              {{ node.attrsRule.logic === "all" ? "且(AND)" : "或(OR)" }}
              <Icon type="ios-arrow-down" />
            </span>
            <DropdownMenu slot="list">
              <DropdownItem name="any">
                或(OR)
              </DropdownItem>
              <DropdownItem name="all">
                且(AND)
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </p>

        <div class="filter-item">
          <span
            v-for="(rule,index) in node.attrsRule.children"
            :key="rule.attrsType+'-'+index"
          >
            {{ rule.eventTypeName }} {{ rule.operatorName }}
            {{ rule.goodsName || rule.value || rule.numberValue }}
            <i
              style="position:relative;cursor:pointer;z-index: 1"
              class="icon iconfont iconClose"
              @click="delRule(index)"
            />
          </span>
        </div>
      </div>
    </div>

    <!-- 用户属性 -->
    <div
      v-if="node.actionAttr==='3'"
      class="is-attrs"
      style="display: inline-block"
    >
      <SingleAttr
        :is-attr="true"
        :filter-attrs-list="filterAttrsList"
        :rule="node"
      />
    </div>

    <!-- 用户行为过滤规则 -->
    <div v-if="cascadeBehaviorModal">
      <Modal
        v-model="cascadeBehaviorModal"
        width="900"
        title="用户行为过滤规则"
        :mask-closable="false"
        @on-cancel="onCancelUserBehavior"
      >
        <!--
                v-if="cascadeBehaviorModal"
                -->
        <CascadeBehavior
          :filter-attrs-list="filterAttrsList"
          :node-type="node.eventType"
          :attrs-rule="localAttrsRule"
        />
        <div slot="footer">
          <Button @click="onCancelUserBehavior">
            取消
          </Button>
          <Button
            type="primary"
            @click="onConfirmUserBehavior"
          >
            确定
          </Button>
        </div>
      </Modal>
    </div>
  </li>
</template>

<script>
import {actionAttrs, shortcuts, computedEnums, childrenNoe} from "../../memberTableCol";
import CascadeBehavior from "./CascadeBehavior";
import {_date, diffDaysTwo, log} from "@/utils/tools";

import SingleAttr from "./SingleAttr";

export default {
    name: "CascadeSelect",
    components: {CascadeBehavior, SingleAttr},
    props: {
        fields: {
            type: Array
        },
        casFields: {
            type: Array
        },
        parent: Object,
        //当前节点 B
        node: {
            type: Object,
            default() {
                return {
                    attrsRule: {}
                };
            }
        },
        filterAttrsList: Array,
        // 某项第二行的默认值
        defaultSecondObject: {
            type: Object,
            default() {
                return {
                    supportActionTotalTypes: []
                };
            }
        },
    },
    data() {
        return {
            localAttrsRule: JSON.parse(JSON.stringify({
                ...this.node.attrsRule,
                children: [
                    {
                        ...childrenNoe,
                        isDefault: true
                    }
                ]
            })),
            cascadeBehaviorModal: false,
            actionAttrs: actionAttrs,
            isStatic: true,//判断是点击标签还是直接点击日期
            dateOptions: {
                shortcuts: shortcuts.call(this),
                // 禁止今天以后的时间
                disabledDate(date) {
                    return date && date.valueOf() > Date.now() - 8640000;
                }
            },
            //所有字段的集合
            rulesObMap: {
                "login_success": this.defaultSecondObject
            },
            orgId: localStorage.getItem('orgId'),
        };
    },
    computed: {
        // 获取单位
        getUnitName() {
            const code = this.node.eventType;
            const obj = this.rulesObMap[code] || {};
            const secondList = obj.supportActionTotalTypes || this.defaultSecondObject.supportActionTotalTypes || [];
            const [totalType = ''] = this.node.totalType || [];
            let item = secondList.filter(item => {
                return item.value === totalType;
            });
            const [item_ob = {}] = item;
            const {unit} = item_ob;

            log('getUnitName, item_ob', item_ob)
            return unit || "次";
        },
        // 获取该项的对象展开
        ob() {
            log('in CascadeSelect,  this.rulesObMap',  this.rulesObMap)
            const code = this.node.eventType;
            return this.rulesObMap[code] || {};
        },
    },
    created() {
        log('---IN CascadeSelect')
        log('this.casFields', this.casFields)
        // this.debugUserBehavior()
    },
    methods: {
        // 调试用户行为过滤规则弹窗
        debugUserBehavior() {
            this.cascadeBehaviorModal = true
        },
        onChangeFilterLogic(arg, attrNode) {
            this.$set(attrNode, 'logic', arg[0]);
        },
        delRule(rule, index) {
            this.node.attrsRule.children.splice(index, 1);
        },
        onFilterModal() {
            let json = {};
            // 首次
            log('this.node.attrsRule,', this.node.attrsRule,)
            if (!this.node.attrsRule.children.length) {
                json = JSON.parse(JSON.stringify({
                    ...this.node.attrsRule,
                    children: [
                        {
                            ...childrenNoe,
                            isDefault: true
                        }
                    ]
                }));
            } else json = JSON.parse(JSON.stringify(this.node.attrsRule));
            this.cascadeBehaviorModal = true;
            this.$nextTick(() => {
                this.$set(this.localAttrsRule, "children", json.children);
            });
        },
        onCancelUserBehavior() {
            this.cascadeBehaviorModal = false;
        },
        /**
         * 用户+属性，清空部分默认值
         * code=3 用户属性
         * code=1,2 用户做过，用户没做过
         * */
        onChangeAttrs(code) {
            if (code === '3') {
                this.$set(this.node.timeArea, "beginTime", "");
                this.$set(this.node.timeArea, "endTime", "");
                this.$set(this.node, "value", "");
                const eventTypeOb = this.filterAttrsList && this.filterAttrsList[0] || {};

                const {children} = eventTypeOb;
                const eventTypeChildOb = children[0];
                const {code} = eventTypeChildOb;
                const logicList = this.ob.supportOperators || this.defaultSecondObject.supportOperators || [];

                const firstLogicOb = logicList[0] || {};
                const logic = firstLogicOb.code;
                this.$set(this.node, "eventType", code);
                this.$set(this.node, "operator", logic);

                this.$set(this.node, "numberValue", 0);
            } else {
                // 1,2 用户做过，用户没做过
                const actionAttrOb = this.fields && this.fields[0] || {};

                log('in else, this.fields', this.fields)
                const {children} = actionAttrOb;
                const actionAttrChildOb = children[0];

                const {code} = actionAttrChildOb;
                this.$set(this.node, "eventType", code);
                this.$set(this.node.timeArea, "beginTime", this.$format(new Date(), "YYYY-MM-DD"));
                this.$set(this.node.timeArea, "endTime", this.$format(new Date(), "YYYY-MM-DD"));
            }
        },
        chooseLogic() {
            log('in chooseLogic', this.node.operator)
            log('this.node', this.node)
        },
        onChangeEvent(code) {
            log('onChangeEvent, code', code)
            this.node.eventType = code.slice(-1)[0]
            log('this.node.eventType', this.node.eventType)
            this.getSecondChangeList(this.node.eventType);
        },
        // onChangeEvent(code) {
        //     this.getSecondChangeList(code);
        // },

        // // 变更行为后获取第二行的下拉列表:统计等list
        // getSecondChangeList(code) {
        //     if (!code) return;
        //     this.$ajaxGet("/label-server/label/attrFieldDetail", {code})
        //         .then(res => {
        //             if (res && res.code === 10000) {
        //                 this.$set(this.rulesObMap, code, res.data || {});
        //             }
        //         });
        // },
        // 变更行为后获取第二行的下拉列表:统计等list
        getSecondChangeList(code) {
            log('code', code)
            if (!code) return;
            this.$ajaxGet("/label-server/label/attrFieldDetail", {code})
                .then(res => {
                    if (res && res.code === 10000) {
                        this.$set(this.rulesObMap, code, res.data || {});
                        log('rulesObMap', this.rulesObMap)
                    }
                });
        },
        /**
         * 保存过滤规则
         * */
        onConfirmUserBehavior() {
            let emptyValueArray = [];
            log('this.localAttrsRule', this.localAttrsRule)
            let children = this.localAttrsRule.children.map(item => {
                // 处理区间
                if (item.operator === "between") {
                    // item.value = (item.valueA + "," + item.valueB);
                    item.value = `[${item.valueA},${item.valueB}]`
                }

                if (!item.value && item.numberValue === 0 || !item.operator) {
                    emptyValueArray.push("1");
                }
                delete item.isDefault;
                return item;
            });

            if (emptyValueArray.length) {
                this.$Message.error("请检查字段是否填写完整，或数字类型不得小于0!");
                return;
            }
            this.cascadeBehaviorModal = false;
            this.node.attrsRule = JSON.parse(JSON.stringify({...this.localAttrsRule, children: children}));
        },
        operator(opList) {
            if (!this.node.operator) {
                return opList[0];
            }
            return this.node.operator;
        },
        computedDate() {
            if (this.node.timeArea && this.node.timeArea.type) {
                const type = this.node.timeArea.type;
                const timeArea = this.node.timeArea;
                switch (type) {
                    case 'static':
                        return [this.node.timeArea.beginTime, this.node.timeArea.endTime];
                    case 'dynamic':
                        return _date.lastWhatDay(timeArea.value);
                    case 'enums':
                        return this.computedEnums(timeArea.subType, timeArea.value);
                    default:
                        new Error('something error');
                        return [];
                }
            }
            return [];
        },
        /**
         * 根据入参枚举，算出相应的时间
         * @subType last this
         * @value day week month year
         * */
        computedEnums(subType, value) {
            return computedEnums(subType, value);
        },
        /**
         * @desc 日期
         * 1. 开始和结束时间不得超过2年（366*2）
         * */
        changeDateClick(date) {
            const diffDays = diffDaysTwo(date[0], date[1]);
            if (diffDays > 366 * 2) {
                this.$Message.error("时间跨度须小于2年，已重置为当天，请重新选择日期");
                this.$set(this.node, 'timeArea', {
                    type: 'static',
                    beginTime: this.$format(new Date(), "YYYY-MM-DD"),
                    endTime: this.$format(new Date(), "YYYY-MM-DD")
                });
                return;
            }
            if (this.isStatic) {
                this.$set(this.node, 'timeArea', {
                    type: 'static',
                    beginTime: date[0],
                    endTime: date[1],
                });
                this.$set(this.node, 'timesText', '');
            }
            this.isStatic = true;
        },
        onDateSelect(value) {
            this.$set(this.node, 'value', value);
        }
    }
};
</script>

<style scoped lang="scss">
.demo-inline {
    display: inline-block;
}

.filter-box {
    height: 80px;
    width: 100%;
    margin-top: 24px;
    margin-bottom: 24px;
    padding-left: 48px;

    p {
        font-size: 12px;
        color: #44444F;
    }

    .filter-item {
        padding-top: 12px;

        span {
            display: inline-block;
            height: 24px;
            line-height: 24px;
            margin-bottom: 8px;
            padding: 0 10px;
            border: 1px solid #D5D5DB;
            margin-right: 24px;
            background: #F6F6F7;
            color: #696974;
            border-radius: 12px;
        }
    }
}

.second-row {
    margin-top: 12px;
}

.inputNumber-has-append {
    .inputNumber-right-append {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }

    .inputNumber-span {
        position: relative;
        display: inline-block;
        top: 0;
        left: -6px;
        height: 32px;
        line-height: 32px;
        vertical-align: middle;
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
        padding: 0 10px;
        border: 1px solid #E2E2E9;
    }
}

.is-attrs {
    margin-top: 12px;
}
</style>
