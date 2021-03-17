<!--
@desc 渲染接收的rule对象
-->
<template>
  <div class="label-view">
    <li
      v-if="rule.subRules&&rule.subRules.length>1"
      class="wrap-border"
    >
      <strong class="badge vertical-line">{{ rule.logic === "all" ? "且" : "或" }}</strong>
    </li>
    <ul class="ul-1">
      <li
        v-for="(aNode,aIndex) in rule.subRules||[]"
        :key="'a_'+aIndex"
        class="li-1"
      >
        <CascadeLabel
          v-if="aNode.actionAttr"
          :key="'a__'+aIndex"
          :node="aNode"
          :meta-map="metaMap"
        >
          <span
            slot="level"
            class="span-level"
          >{{ toAsciiCode(aIndex, aIndex, "A") }}</span>
        </CascadeLabel>

        <div
          v-if="aNode.subRules&&aNode.subRules.length>1"
          class="wrap-border"
        >
          <strong
            class="badge vertical-line"
          >{{ aNode.logic === "all" ? "且" : "或" }}</strong>
        </div>
        <ul>
          <li
            v-for="(bNode,bIndex) in aNode.subRules||[]"
            :key="'b_'+bIndex"
          >
            <CascadeLabel
              :key="'b__'+aIndex+'_'+bIndex"
              :node="bNode"

              :meta-map="metaMap"
            >
              <span
                slot="level"
                class="span-level"
              >
                {{ toAsciiCode(aIndex, bIndex) }}
              </span>
            </CascadeLabel>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import CascadeLabel from "./CascadeLabel";

export default {
    name: "LabelView",
    components: {CascadeLabel},
    props: {
        rule: {
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
            metaMap: {}
        };
    },
    created() {
        this.getMetaMap();
    },
    methods: {
        /**
         * Show level title
         * */
        toAsciiCode(num, parentLevel, type) {
            if (typeof num !== "number") return "";
            let level = "";
            if (!type) level = parentLevel + 1;
            return String.fromCharCode(num + 1 + 64) + level;
        },
        // 获取枚举字段集合
        getMetaMap() {
            this.$ajaxGet("/label-server/label/metaMap")
                .then(res => {
                    if (res && res.code === 10000) {
                        this.metaMap = res.data || {};
                    }
                });
        }
    }
};
</script>

<style scoped lang="scss">
.label-view {
    margin-top: 48px;
    display: flex;
    padding-bottom: 30px;

    li {
        list-style: none;
    }


    .ul-1 {
        flex: 1;
        position: relative;
        margin-top: -20px;
        margin-bottom: -20px;
    }


    .li-1 {
        display: flex;
        background: #FAFAFB;
        border-radius: 8px;
        padding: 24px;

        & + li {
            margin-top: 20px;
        }
    }

    ul {
        position: relative;
        padding-left: 24px;
    }


    .wrap-border {
        position: relative;
        border-right: 1px solid #756CEA;

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
            left: -12px;
            width: 24px;
            height: 24px;
            line-height: 24px;
            text-align: center;
            background: #E9E8FF;
            font-weight: 500;
            color: #756CEA;
            border-radius: 8px;
        }
    }

}
</style>
