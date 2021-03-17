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
            time: Number,
        },
        data() {
            return {
                date: '',
            }
        },
        watch: {
            time(updateValue) {
                this.time = updateValue
                this.initDate()
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
                this.date = this.dateParser(this.time)
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