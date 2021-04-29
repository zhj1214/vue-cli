<template>
  <div class="info-cell">
    <img class="photo" :src="data.headImg" />
    <div>
      <div class="name-sex">
        <span>{{ data.nickName }}</span>
        <Icon
          v-if="hasSex()"
          :style="infoStyle()"
          :type="data.sex === 'F' ? 'md-female' : 'md-male'"
          :color="data.sex === 'F' ? '#FF6B6A' : '#1990FF'"
        />
      </div>
      <div>{{ data.openId }}</div>
    </div>
  </div>
</template>

<script>
  // import { log } from "@/utils/tools";

  export default {
    name: 'FanInfoCell',
    components: {},
    props: {
      data: Object,
    },
    data() {
      return {}
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {},
    methods: {
      hasSex() {
        let sex = this.data.sex === 'F' || this.data.sex === 'M'
        return sex
      },
      infoStyle() {
        return {
          fontSize: '12px',
          marginLeft: '4px',
          background: this.data.sex === 'F' ? '#FFDBDB' : '#E7EEFF',
          borderRadius: '50%',
          padding: '4px',
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .info-cell {
    display: flex;
    justify-content: flex-start;
  }

  .photo {
    width: 40px;
    height: 40px;
    margin-right: 10px;
  }

  .name-sex {
    //display: flex;
    //justify-content: space-between;
  }
</style>
