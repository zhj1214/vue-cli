<!--左边有点蓝色的那种布局-->
<template>
  <div class="CardLayout">
    <div class="card-layout-header">
      {{ header }}
      <slot name="headerRight" />
    </div>
    <!--			style="padding-bottom: 24px;"-->
    <div class="card-layout-body">
      <slot name="body" />
      <slot />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CardLayout',
    props: {
      header: {
        type: String,
      },
    },
  }
</script>

<style scoped lang="scss">
  .CardLayout {
    padding-bottom: 24px;
    margin-top: 24px;
    background-color: #fff;
  }

  .card-layout-header {
    position: relative;
    padding-left: 20px;
    font-size: 16px;
    font-weight: bold;
    line-height: 64px;
    color: #3e4552;
    border-bottom: 1px solid #e6ebf0;

    &::before {
      position: absolute;
      top: 20px;
      left: 0;
      display: block;
      width: 4px;
      height: 20px;
      background: #3d71ff;
      content: '';
    }
  }

  .card-layout-body {
    padding-left: 20px;
    margin-top: 30px;
  }
</style>
