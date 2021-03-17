<template>
  <div>
    <span
      class="status-icon"
      :class="statusColor"
    />
    <span class="text">{{ findListLabel(list, item) }}</span>
  </div>
</template>

<script>
    import { findListLabel } from "@/utils/tools";
    export default {
        name: "OrderStatusCell",
        props: {
            item: Number,
            list: Array,
        },
        data() {
            return {
                date: '',
            }
        },
        computed: {
            statusColor() {
                let list = {
                    0: 'yellow-background',
                    1: 'yellow-background',
                    2: 'blue-background',
                    3: 'grey-background',
                    4: 'grey-background',
                    5: 'grey-background',
                    6: 'grey-background',
                }
                return list[this.item]
            },
        },
        created() {
        },
        methods: {
            findListLabel(list, item) {
                return findListLabel(list, item)
            }

        }
    }
</script>

<style lang="scss" scoped>
    .status-icon {
        width:6px;
        height:6px;
        margin: 3px 8px;
        display: inline-block;
    }

    .yellow-background {
        background:rgba(255,197,66,1);
    }

    .blue-background {
        background:rgba(80,181,255,1);
    }

    .grey-background {
        background:rgba(181,181,190,1);
    }

    .text {
        height:24px;
        font-size:14px;
        font-family:SFUIDisplay-Light,SFUIDisplay;
        font-weight:300;
        color:rgba(23,23,37,1);
        line-height:24px;
    }
</style>