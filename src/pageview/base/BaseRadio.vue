<template>
  <div class="base-radio">
    <!--				@on-change="(val)=>$emit('onChangeRadio',val)"-->
    <RadioGroup
      v-model="radioValue"
      vertical
    >
      <Radio :label="-1">
        <span>全部</span>
      </Radio>
      <Radio
        v-for="item in tagCategoryList"
        :key="item.code"
        :label="item.code"
      >
        <span>{{ item.value }}</span>
      </Radio>
    </RadioGroup>
    <div class="btn-group">
      <Button
        type="primary"
        ghost
        size="small"
        @click="radioValue=-1;$emit('onCancelRadioValue',radioValue)"
      >
        重置
      </Button>
      <Button
        type="primary"
        size="small"
        @click="$emit('onConfirmRadioValue',radioValue)"
      >
        确认
      </Button>
    </div>
  </div>
</template>

<script>
	export default {
		name: "BaseRadio",
		props:{
			tagCategoryList:{
				type:Array
			}
		},
		data () {
			return {
				radioValue: -1
			}
		}
	};
</script>

<style scoped lang="scss">
		.base-radio{
				text-align: left;
		}
		.btn-group{
				display: flex;
				margin: 10px 0 0;
				justify-content:space-between;
		}
</style>
