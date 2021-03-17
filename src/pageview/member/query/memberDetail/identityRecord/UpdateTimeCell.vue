<template>
  <div>
    <div class="name">
      {{ createYear() }}
    </div>
    <div class="display-id">
      {{ createTime() }}
    </div>
  </div>
</template>

<script>
    import { dateParser } from "@/utils/tools";
    export default {
        name: "Update",
        props: {
            item: Object,
        },
        data() {
            return {
                date: '',
            }
        },
        created() {
            this.initDate()
        },
        methods: {
            dateParser(date) {
                return dateParser(date)
            },
            initDate() {
                this.date = this.dateParser(this.item.insertTime, 'YYYY-MM-DD')
            },
            createYear() {
                return this.date.slice(0, 10)
            },
            createTime() {
                return this.date.slice(-8)
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>