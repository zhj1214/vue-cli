<template>
  <div :class="textClass">
    <span>{{ item.isAdd === 1 ? '+' : '-' }}</span>
    <span>{{ item.scoreValue }}</span>
  </div>
</template>

<script>
    export default {
        name: "ChangeReasonCell",
        props: {
            item: Object,
        },
        data() {
            return {

            }
        },
        computed: {
            textClass() {
                let style = ['add-red', 'decrease-green']
                let type = this.item.isAdd === 1
                if (type) {
                    return style[0]
                } else {
                    return style[1]
                }
            },
        },
        created() {
        }
    }
</script>

<style scoped>
    .add-red {
        height:24px;
        font-size:14px;
        font-family:SFUIDisplay-Light,SFUIDisplay;
        font-weight:300;
        color:rgba(252,90,90,1);
        line-height:24px;
    }

    .decrease-green {
        font-size:14px;
        font-family:SFUIDisplay-Light,SFUIDisplay;
        font-weight:300;
        color:rgba(61,213,152,1);
        line-height:24px;
    }
</style>