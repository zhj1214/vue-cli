<template>
  <div class="layerCard">
    <Card class="card-item">
      <slot name="body" />
    </Card>
  </div>
</template>
<script>
  export default {
    name: 'LayerCard',
    components: {},
  }
</script>
<style lang="scss" scoped>
  .layerCard {
    width: 25%;
    margin-top: 24px;

    .card-item {
      height: 100%;
      border-radius: 16px;
    }

    &:nth-child(4n + 1) {
      padding-left: 12px;
    }

    &:nth-child(4n + 2) {
      padding-right: 12px;
    }

    &:nth-child(4n + 3),
    &:nth-child(4n + 4) {
      padding: 0 12px;
    }
  }
</style>
