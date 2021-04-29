<template>
  <div>
    <i-switch v-model="open" :disabled="switchStatus" @on-change="changeStatus">
      <Icon slot="open" type="md-checkmark" />
      <Icon slot="close" type="md-close" />
    </i-switch>
  </div>
</template>

<script>
  import { log } from '@/utils/tools'
  import mixinsGlobal from '@/mixins/mixinsGlobal'

  export default {
    name: 'StatusCell',
    components: {},
    mixins: [mixinsGlobal],
    props: {
      status: Boolean,
      id: [Number, String],
      operate: Boolean,
    },
    data() {
      return {
        orgId: '',
        orgName: '',
        open: this.status,
      }
    },
    computed: {
      switchStatus() {
        return !this.__hasPower('public') && !this.operate
      },
    },
    watch: {
      status(updateStatus) {
        this.open = updateStatus
      },
    },
    created() {},
    mounted() {},
    methods: {
      changeStatus() {
        let server = '/label-server'
        let url = server + '/label/updateOpenState'
        let data = {
          id: this.id,
          isOpen: this.open,
        }

        this.$ajaxPost(url, data)
          .then((res) => {
            if (res && res.code === 10000) {
              this.$Message.success(res.message)
              this.$emit('updateList')
            }
          })
          .catch((err) => {
            log(err)
          })
      },
      cancel() {
        // this.showTip = false
      },
    },
  }
</script>

<style lang="scss" scoped></style>
