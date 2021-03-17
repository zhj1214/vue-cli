<template>
  <div class="singleScreening">
    <div
      v-for="(item, index) in selectList"
      :key="index"
      class="buttonView"
    >
      <div
        :style="{ color: index === selected ? '#756CEA' : '#515a6e' }"
        @click="selectItem(item, index)"
      >
        {{ item.name || item.label }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FilterTableColList",
  props: {
    selectList: Array,
  },
  data() {
    return {
      selected: 0,
    };
  },
  methods: {
    //   选中方法
    selectItem(item, index) {
      item.index = index;
      this.selected = index;
      this.$emit("select", item);
    },
  },
};
</script>

<style scoped lang="scss">
.singleScreening {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.buttonView {
  font-size: 12px;
  width: 100%;
  text-align: center;
  padding: 7px 16px;
  &:hover {
    background-color: #f3f3f3;
    cursor: pointer;
  }
}

.btn-group {
  display: flex;
  margin: 10px 0 0;
  justify-content: space-between;
}
</style>
