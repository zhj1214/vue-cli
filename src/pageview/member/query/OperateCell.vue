<template>
  <div class="operate">
    <div
      v-if="data.status !== 2"
      class="one-row"
    >
      <span
        v-if="__hasPower('addMark')"
        class="span-a mr-10 mark-text"
        @click="addMark"
      >打标签</span>
      <Dropdown
        trigger="click"
        transfer
        @on-visible-change="visibleChange"
        @on-click="clickDrop"
      >
        <span
          class="span-a mark-text"
          @click="clickMore"
        >
          <span>更多</span>
          <i
            :class="showIcon()"
            class="icon iconfont"
          />
        </span>

        <DropdownMenu slot="list">
          <!--                    <DropdownItem-->
          <!--                        v-if="__hasPower('accountStatus')"-->
          <!--                        name="drop-status"-->
          <!--                    >账户状态调整</DropdownItem>-->
          <DropdownItem
            v-for="a in memberActions"
            :key="a.value"
            :name="a.value"
          >
            {{ a.label }}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <img
        v-if="data.isFrozen"
        class="frozen"
        :src="frozenTag"
      >
    </div>

    <span
      v-else
      class="color-gray"
    >已注销</span>
  </div>
</template>

<script>
// import { log } from "@/utils/tools";
import frozenTag from '@/assets/images/member/frozen_tag.png'

import mixinsGlobal from "@/mixins/mixinsGlobal";

export default {
    name: "OperateCell",
    components: {},
    mixins: [mixinsGlobal],
    props: {
        data: Object,
        memberActions: Array,
    },
    data() {
        return {
            moreIndex: '',
            frozenTag: frozenTag,

            // memberActions: [
            //     {
            //         value: 'point',
            //         label: '积分调整',
            //     },
            //     {
            //         value: 'growth',
            //         label: '成长值调整',
            //     },
            //     {
            //         value: 'level',
            //         label: '等级调整',
            //     },
            //     {
            //         value: 'cancel',
            //         label: '账户注销',
            //     },
            //     {
            //         value: 'status',
            //         label: '账户状态调整',
            //     },
            // ],
        };
    },
    computed: {},
    watch: {},
    created() {
    },
    mounted() {
    },
    methods: {
        showIcon() {
            return this.moreIndex === this.data.index ? "iconDropdownUnfold" : "iconTreeFold"
        },
        addMark() {
            this.$emit('addMark')
        },
        clickDrop(name) {
            this.$emit('clickDrop', name)
        },
        visibleChange(v) {
            if (!v) this.moreIndex = -1;
        },
        clickMore() {
            this.moreIndex = this.data.index;
        }
    },
}
</script>

<style lang="scss" scoped>
.operate {
    position: relative;
}

.frozen {
    position: absolute;
    right: -18px;
    top: 0;
    width: 40px;
    height: 40px;
}

.one-row {
    display: flex;
    justify-content: center;
}

.mark-text {
    line-height: 36px;
}
</style>
