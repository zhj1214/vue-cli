<template>
  <div class="base-checkbox">
    <div style="padding-bottom: 6px; margin-bottom: 6px;">
      <Checkbox
        :indeterminate="indeterminate"
        :value="checkAll"
        @click.prevent.native="handleCheckAll"
      >
        全选
      </Checkbox>
    </div>
    <CheckboxGroup v-model="checkAllGroup" vertical @on-change="checkAllGroupChange">
      <Checkbox v-for="(item, index) in checkAllList" :key="index" :label="item.code" class="block">
        <span>{{ item.value }}</span>
      </Checkbox>
    </CheckboxGroup>
    <div class="btn-group">
      <Button
        type="primary"
        ghost
        size="small"
        @click="
          checkAll = false
          checkAllGroup = []
          $emit('onCancelCheckbox', checkAllGroup, checkAll)
        "
      >
        重置
      </Button>
      <Button
        type="primary"
        size="small"
        @click="$emit('onConfirmCheckbox', checkAllGroup, checkAll)"
      >
        确认
      </Button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'BaseCheckbox',
    props: {
      checkAllList: {
        type: Array,
      },
    },
    data() {
      return {
        indeterminate: true,
        checkAll: false,
        checkAllGroup: [],
      }
    },
    methods: {
      handleCheckAll() {
        if (this.indeterminate) {
          this.checkAll = false
        } else {
          this.checkAll = !this.checkAll
        }
        this.indeterminate = false

        if (this.checkAll) {
          let codes = []
          for (let item of this.checkAllList) {
            codes.push(item.code)
          }
          this.checkAllGroup = codes
        } else {
          this.checkAllGroup = []
        }
      },
      checkAllGroupChange(data) {
        if (data.length === this.checkAllList.length) {
          this.indeterminate = false
          this.checkAll = true
        } else if (data.length > 0) {
          this.indeterminate = true
          this.checkAll = false
        } else {
          this.indeterminate = false
          this.checkAll = false
        }
      },
    },
  }
</script>

<style scoped lang="scss">
  .btn-group {
    display: flex;
    margin: 10px 0 0;
    justify-content: space-between;
  }
</style>
