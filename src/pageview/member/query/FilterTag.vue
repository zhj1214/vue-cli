<template>
  <div class="each-filter">
    <span>{{ filterName }}：</span>
    <div
      v-for="(item, index) in list"
      :key="index"
      :class="item.selected ? 'select-filter' : 'filter-value'"
      @click="selectFilter(index, item)"
    >
      {{ item.label }}
    </div>
  </div>
</template>

<script>
    /**
     * 高级筛选的标签
     * @param list [{
     *     label: '要展示的名称',
           value: '标签的值',
           selected: 'boolean 是否选中',
           isAll: 'boolean 是否选择了全部',
     * }]
     */
    export default {
        name: "FilterTag",
        props: {
            list: Array,
            filterName: String,
        },
        data() {
            return {
                selectedTagIndex: [],
            }
        },
        created() {
        },
        methods: {
            selectFilter(index, item) {
                if (item.value === '') {
                    let currentStatus = item.isAll
                    item.isAll = !currentStatus
                }

                let currentFilter = this.list[index].selected
                let isSelectAll = item.isAll

                let tempList = this.$_.clone(this.list)
                if (isSelectAll) {
                    tempList.map(item => {
                        item.selected = false
                        item.isAll = false
                    })

                    // 当前选中的
                    item.selected = !currentFilter
                    tempList[index] = item
                } else {
                    tempList.map(item => {
                        // 取消标签「全部」的状态
                        item.isAll = false
                        if (item.value === '') {
                            item.selected = false
                        }
                    })
                    item.selected = !currentFilter
                }

                this.$emit('updateTag', tempList)
            }
        }
    }
</script>

<style lang="scss" scoped>

    .each-filter {
        display: inline-block;
        margin-right: 40px;
        height: 26px;

        & > div:not(:last-child) {
            margin-right: 8px;
        }
    }

    .filter-value {
        display: inline-block;
        padding: 0 13px;
        line-height:26px;
        height: 26px;
        cursor: pointer;
    }

    .select-filter {
        display: inline-block;
        line-height:24px;
        height: 24px;
        padding: 0 12px;
        background:#E9E8FF;

        border-radius:12px;
        box-sizing: border-box;
        cursor: pointer;

        border:1px solid rgba(117, 108, 234, 1);
        text-align: center;
        font-size:14px;
        font-weight:300;
        color:rgba(117, 108, 234, 1);
    }
</style>
