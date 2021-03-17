<template>
  <i-switch
    :value="isOpen"
    size="large"
    :disabled="isDisable"
    @on-change="changeValue"
  >
    <span slot="open">{{ showObj.open }}</span>
    <span slot="close">{{ showObj.close }}</span>
  </i-switch>
</template>

<script>
export default {
    name:"SwitchCom",
    props:{
        showObj:Object,
        isOpen:{
            type:Boolean,
            default:false,
        },
        isDisable:{
            type:Boolean,
            default:false,
        }
    },
    data(){
        return {

        }
    },
    methods:{
        changeValue(value){
            this.$emit("changeSwitch",value)
        }
    }
}
</script>