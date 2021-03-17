<template>
  <div class="singleScreening">
    <div
      v-for="(item,index) in selectLits"
      :key="index"
      class="buttonView"
    >
      <Button
        type="text"
        size="small"
        :style="{'color':item.isSelect?'#2d8cf0':'#515a6e'}"
        @click="selectItem(item,index)"
      >
        {{ item.title }}
      </Button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SingleScreening",
  props: {
    selectLits: Array
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    //   选中方法
    selectItem(item, index) {
      item.index = index;
      this.$emit("select", item);
    }
  }
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
}
.btn-group {
  display: flex;
  margin: 10px 0 0;
  justify-content: space-between;
}
</style>
