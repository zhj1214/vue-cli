<template>
  <div>
    <img
      class="photo"
      :src="data.headImg || defaultAvatar"
    >
    <div class="info">
      <span>{{ data.memberName || data.nickName }}</span>
      <Icon
        v-if="hasSex()"
        :style="infoStyle"
        :type="data.sex === 'F' ? 'md-female' : 'md-male'"
        :color="data.sex === 'F' ? '#FF6B6A' : '#1990FF'"
      />
    </div>
    <div
      :class="createIdClass"
      @click="jumpDetail"
    >
      {{ data.id }}
    </div>
  </div>
</template>

<script>
// import { log } from "@/utils/tools";
import defaultAvatar from "@/assets/images/default-avatar.png";
import mixinsGlobal from "@/mixins/mixinsGlobal";

export default {
    name: "UserInfoCell",
    components: {},
    mixins: [mixinsGlobal],
    props: {
        data: Object,
    },
    data() {
        return {
            defaultAvatar: defaultAvatar,
        };
    },
    computed: {
        infoStyle() {
            return  {
                fontSize: "12px",
                marginLeft: "4px",
                background: this.data.sex === "F" ? "#FFDBDB" : "#E7EEFF",
                borderRadius: "50%",
                padding: "4px"
            }
        },
        createIdClass() {
            return this.data.status === 1 ? 'action-text' : ''
        }
    },
    watch: {},
    created() {
    },
    mounted() {
    },
    methods: {
        hasSex() {
            let sex = this.data.sex === "F" || this.data.sex === "M"
            return sex
        },
        jumpDetail() {
            let notRight = !this.__hasPower('detail')
            if (notRight) {
                return
            }
            if (this.data.status !== 1) {
                return
            }
            this.$router.push({
                path: '/member/manage/details',
                query: {
                    id: this.data.id
                }
            })

        }
    },
}
</script>

<style lang="scss" scoped>
.photo {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    float: left;
}

.info {
    margin-left: 40px;
}
</style>
