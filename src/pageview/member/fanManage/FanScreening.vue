<template>
  <div class="screening_box">
    <Button
      v-for="(item,index) in selectLits"
      :key="index"
      class="btn_item"
      type="text"
      size="small"
      :style="{'color':item.isSelect?'#2d8cf0':'#515a6e'}"
      @click="selectItem(item,index)"
    >
      {{ item.label }}
    </Button>
  </div>
</template>

<script>
export default {
    name: "FanScreening",
    props: {
        selectLits: Array
    },
    data() {
        return {

        };
    },
    created() {
    },
    methods: {
        //   选中方法
        selectItem(item, index) {
        item.index = index;
        this.$emit("select", item);
        }
    }
};
</script>

<style lang="scss" scoped>
.screening_box {
    max-height: 500px;
    overflow: hidden auto;
}
.btn_item{
  display:block;
  width:100%;
  text-align:center;
}

</style>
