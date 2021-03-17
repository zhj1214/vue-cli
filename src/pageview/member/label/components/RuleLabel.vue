<!--
1、 item 只有一个子元素，不需要显示[且/或]
2、 不存在subRules，则认为其不存在下一级
3、 subRules 数组为空，则不显示，提交时候过滤
4、 对item(不存在子级时候)，点击 [+] ，则包裹住，变为数组模式，subRules为数组，把当前item变为子类
5、 点击[-]，移除这个item
6、 item 显示: - + [+]
7、 subRules 第一个子级显示: - + [+]，其他子级显示：- +
8、空值查询debug
-->
<template>
  <div class="AutoTag">
    <ul
      v-if="all&&all.subRules"
      class="node0"
    >
      <li
        v-show="all.subRules&&all.subRules.length>1"
        class="node1 node1-title"
      >
        <strong
          class="badge vertical-line"
          @click="changeANDOR(all)"
        >{{ logicParser(all.logic) }}</strong>
      </li>
      <li class="level-ul-1">
        <ul
          v-for="(node2,index2) in all.subRules||[]"
          :key="index2"
          class="ul-1"
        >
          <li
            v-if="node2.logic"
            class="node1 node2-title"
          >
            <strong
              class="badge vertical-line"
              @click="changeANDOR(node2)"
            >{{ logicParser(node2.logic) }}</strong>
          </li>
          <li
            v-if="!node2.subRules"
            class="li-1"
          >
            <span class="level-ascii">{{ toAsciiCode(index2, index2, "A") }}</span>
            <CascadeSelect
              :key="'A_'+index2"
              style="display: inline-block"
              :fields="fields"
              :cas-fields="casFields"
              :parent="all"
              :node="node2"
              :filter-attrs-list="filterAttrsList"
              :default-second-object="defaultSecondObject"
            />


            <!--                        <div class="btn-group-1"-->
            <!--                             v-if="all.subRules.length>1&&index2!==0">-->
            <!--                            <span>{{ index2 }}</span>-->
            <!--&lt;!&ndash;                            <Poptip&ndash;&gt;-->
            <!--&lt;!&ndash;                                confirm placement="top-end" transfer&ndash;&gt;-->
            <!--&lt;!&ndash;                                title="删除后不可恢复，是否确认删除改条件？"&ndash;&gt;-->
            <!--&lt;!&ndash;                                @on-ok="deleteThis('A',all,index2)">444&ndash;&gt;-->
            <!--&lt;!&ndash;                                <i&ndash;&gt;-->
            <!--&lt;!&ndash;                                    @click="deleteThis('A',all,index2)"&ndash;&gt;-->
            <!--&lt;!&ndash;                                    class="icon iconfont iconClose" style="color: #92929C;cursor:pointer;"></i>&ndash;&gt;-->
            <!--&lt;!&ndash;                            </Poptip>&ndash;&gt;-->
            <!--                            <i-->
            <!--                                @click="deleteThis('A',all,index2)"-->
            <!--                                class="icon iconfont iconClose" style="color: #92929C;cursor:pointer;"></i>-->
            <!--                        </div>-->
            <div
              v-if="all.subRules.length>1"
              class="btn-group-1"
            >
              <span>{{ index2 }}</span>
              <i
                class="icon iconfont iconClose"
                style="color: #92929C;cursor:pointer;"
                @click="deleteThis('A',all,index2)"
              />
            </div>

            <div class="append-button">
              <span
                v-if="all.subRules.length>1"
                class="span-a"
                @click="appendThis(node2,'A',index2,node2)"
              >
                <i class="icon iconfont iconAdd" />
                <span style="position: relative;top: 2px">新增</span>
              </span>
            </div>
          </li>
          <!--存在第三级-->
          <li
            v-if="node2.subRules"
            class="level-ul-2"
          >
            <ul
              v-for="(node3,index3) in node2.subRules"
              :key="index3"
              class="ul-2"
            >
              <li
                v-if="!node3.subRules"
                class="level-ul-4"
              >
                <span class="level-ascii">{{ toAsciiCode(index2, index3) }}</span>
                <CascadeSelect
                  v-if="defaultSecondObject.code"
                  :key="'B_'+index3"
                  style="display: inline-block"
                  class="bb"
                  :fields="fields"

                  :cas-fields="casFields"
                  :node="node3"
                  :filter-attrs-list="filterAttrsList"
                  :default-second-object="defaultSecondObject"
                />

                <!--第二级添加-->
                <div class="btn-group-2">
                  <i
                    class="icon iconfont iconClose"
                    style="color: #92929C;cursor:pointer;"
                    @click="deleteThis('B',node2,index3,all,index2)"
                  />
                </div>

                <div
                  v-if="index3===node2.subRules.length-1"
                  class="append-button"
                >
                  <span
                    class="span-a"
                    @click="appendThis(node3,'B',index3,node2)"
                  >
                    <i class="icon iconfont iconAdd" />
                    <span
                      style="position: relative;top: 2px"
                    >新增</span>
                  </span>
                </div>
              </li>
            </ul>
          </li>
        </ul>

        <div class="ul-1 btn-group">
          <span
            class="span-a"
            @click="addRow(all)"
          >
            <i class="icon iconfont iconAdd" />
            <span>新增</span>
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import {createCascadeFormat, log} from "@/utils/tools";
import CascadeSelect from './CascadeSelect';
import {defaultNode} from "../../memberTableCol";

export default {
    name: "RuleLabel",
    components: {
        CascadeSelect
    },
    props: {
        all: {
            type: Object,
            default() {
                return {
                    subRules: []
                };
            }
        }
    },
    data() {
        return {
            fields: [],//√ 用户行为
            defaultSecondObject: {},// 第二行 具体实施的用户行为二
            filterAttrsList: [], // 漏斗过滤
            // 用户行为，级联
            casFields: [],
        };
    },
    created() {
        log('---IN RuleLabel')
        this.getTagFieldList("ACTION_TYPE");
        this.getTagFieldList("ATTR_TYPE");
        this.getDefaultSecondList("register_success");

        log('subRules', this.all.subRules[0])
    },
    methods: {
        // 获取第二行默认list
        getDefaultSecondList(code) {
            if (!code) return;
            this.$ajaxGet("/label-server/label/attrFieldDetail", {code})
                .then(res => {
                    if (res && res.code === 10000) {
                        this.defaultSecondObject = res.data || {};
                        log('getDefaultSecondList, this.defaultSecondObject', this.defaultSecondObject)
                    }
                });
        },
        /**
         * Show level title
         * */
        toAsciiCode(num, parentLevel, type) {
            if (typeof num !== "number") return "";
            let level = "";
            if (!type) level = parentLevel + 1;
            return String.fromCharCode(num + 1 + 64) + level;
        },
        logicParser(logicName) {
            return logicName === 'all' ? '且' : (logicName === 'any' ? '或' : '且');
        },
        changeANDOR(node) {
            this.$set(node, 'logic', node.logic === 'all' ? 'any' : 'all');
        },
        /**
         * 行为事件
         * ACTION_TYPE：行为事件，ATTR_TYPE：属性事件
         * @param type
         * */
        getTagFieldList(type) {
            let data = {
                type
            }
            if (type === 'ATTR_TYPE') {
                data.typeCodes = '401,402'
            }
            this.$ajaxGet('/label-server/label/field/type', data)
                .then(res => {
                    if (res && res.code === 10000) {

                        if (type === "ATTR_TYPE") {
                            this.filterAttrsList = res.data || [];
                        } else if (type === "ACTION_TYPE") {
                            log('type', type)
                            log('in getTagFieldList res.data', res.data)
                            this.fields = res.data || []
                            log(' this.fields', this.fields)
                            this.casFields = createCascadeFormat(this.fields, 'value', 'code')
                            log('this.casFields', this.casFields)
                        }
                    }
                });
        },
        /**
         * 给第一级添加item
         * 不再检查规则，直至提交前
         * */
        addRow(all) {
            if (all.subRules) {
                if (all.subRules.length > 25) {
                    this.$Message.warning("用户规则不能超过26条");
                    return;
                }
                this.$set(all, 'logic', 'all');
                all.subRules.push(
                    {
                        ...defaultNode()
                    },
                );
            }
        },

        /**
         * deleteThis
         * @parent
         * @index
         * @parentIndex 父级所在的索引
         * @level 1 2 3
         * @desc如果判断是最后一个，或者parent 的length =1，则直接删除父级
         * */
        deleteThis(level, parent, index, root, parentIndex, rootIndex) {

            switch (level) {
                // bug splice 这里会影响后续的其他删除，为此需要在watch做个条件计算
                case 'A':
                    //如果只有一位时候，需要提权B->A级
                    parent.subRules.splice(index, 1);
                    if (parent.subRules && parent.subRules.length === 1 && parent.subRules[0].subRules) {
                        this.$set(this.all, 'logic', parent.subRules[0].logic);
                        this.$set(this.all, 'subRules', parent.subRules[0].subRules);
                    }
                    break;
                case 'B':
                    // 只剩下一个时候，B->提权到A的子项
                    if (parent.subRules && parent.subRules.length > 2) {
                        parent.subRules.splice(index, 1);
                    } else if (parent.subRules.length === 2) {
                        parent.subRules.splice(index, 1);
                        this.all.subRules.splice(parentIndex, 1, parent.subRules[0]);
                    } else root.subRules.splice(parentIndex, 1);
                    break;
                default:
                    if (this.all.subRules[rootIndex].subRules.length < 2) {
                        if (this.all.subRules[rootIndex].subRules[0].subRules.length < 2) this.all.subRules.splice(rootIndex, 1);
                        else parent.subRules.splice(index, 1);// 删除第二级本身
                    } else {
                        //大于2的时候
                        if (parent.subRules && parent.subRules.length > 2) parent.subRules.splice(index, 1);
                        else if (parent.subRules.length === 2) {
                            parent.subRules.splice(index, 1);
                            root.subRules.splice(parentIndex, 1, parent.subRules[0]);
                        } else root.subRules.splice(parentIndex, 1);
                    }
            }
        },
        /**
         * 添加新项
         * @param node
         * @param level
         * @param index
         * @param parent
         * @第一级
         *    append
         *    +
         * @A
         *    append
         *    +
         * @B
         *    append
         *    +
         * */
        appendThis(node, level, index, parent) {
            // console.info("node==>", node);
            console.info("level==>", level);
            log('parent', parent)
            // console.info("index==>", index);
            // console.info("parent==>", parent);
            switch (level) {
                case 'A':
                    this.all.subRules.splice(index, 1,
                        {
                            logic: 'all',
                            subRules: [
                                {...node},
                                {...defaultNode()}
                            ]
                        });
                    break;
                case 'B':
                    log('parent.subRules', parent.subRules)
                    parent.subRules.push({...defaultNode()});
                    break;
                default:
                    parent.subRules.push({...defaultNode()});
            }
        }
    }
};
</script>

<style scoped lang="scss">
.AutoTag {
    margin-top: 48px;
}

.node1 {
    position: relative;
    border-left: 1px solid #756CEA;

    &:before {
        position: absolute;
        display: block;
        content: '';
        left: 0;
        top: 0;
        height: 1px;
        width: 12px;
        background: #756CEA;
    }

    &:after {
        position: absolute;
        display: block;
        content: '';
        left: 0;
        bottom: 0;
        height: 1px;
        width: 12px;
        background: #756CEA;
    }


    .badge {
        position: absolute;
        top: 50%;
        left: 0;
        width: 24px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        background: #E9E8FF;
        font-weight: 500;
        color: #756CEA;
        border-radius: 8px;
        cursor: pointer;
    }
}

.border-a {
    border: 1px solid #2d8cf0 !important;
}


ul {
    display: flex;
    /*
    & + ul {
            border-top: 1px solid #ddd;
    }*/

    &:after {
        display: block;
        content: '';
        clear: both;
    }
}

li {
    padding: 10px 12px;
    list-style: none;
}

.li-1, .level-ul-4 {
    display: flex;
    flex-wrap: wrap;

    .level-ascii {
        flex: 0 0 40px;
    }

    .demo {
        flex: 0 0 calc(100% - 60px);
    }

    .append-button {
        flex: 1;
    }
}


.li-1, .li-3 {
    position: relative;
    width: 100%;
}

.level-ul-1 {
    position: relative;
}

.level-ul-1, .level-ul-2, .level-ul-3, .level-ul-4 {
    width: 100%;
}

.level-ul-4 {
    display: flex;
}

.ul-1 {
    position: relative;
    width: 100%;
    padding: 24px;
    min-width: 1340px;
    margin-bottom: 20px;
    border-radius: 16px;
    background: #FAFAFB;
}

.ul-2 {
    position: relative;
    width: 100%;
    min-width: 720px;
}

.ul-3 {
    position: relative;
    min-height: 40px;
    flex-direction: column;
}

.btn-group-1 {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
}

.btn-group-2 {
    position: absolute;
    right: -20px;
    top: 20px;
}

.btn-group-3 {
    position: absolute;
    right: -40px;
    top: 50%;
    transform: translateY(-50%);
}

.node0 {
    margin-bottom: 60px;
    min-width: 1080px;
    margin-top: 24px;
}

.node1 {
    float: left;

    strong {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
}

.border1px {
    cursor: pointer;
    width: 32px;
    height: 32px;
    line-height: 30px;
    text-align: center;
    border: 1px solid #ddd;
}

.level-ascii {
    position: relative;
    display: inline-block;
    top: 15px;
    width: 24px;
    height: 24px;
    background: #756CEA;
    color: #fff;
    text-align: center;
    border-radius: 8px;
    vertical-align: top;

}

.btn-group {
    flex-direction: column;
    height: 76px;
    line-height: 76px;
    margin-top: 24px;
    border-radius: 16px;
    background: #FAFAFB;
    padding: 0 24px;
}
</style>
