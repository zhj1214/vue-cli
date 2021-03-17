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
		name: "CardLayout",
		props:{
			header:{
				type:String
			}
		}
	};
</script>

<style scoped lang="scss">
		.CardLayout{
				background-color: #fff;
				padding-bottom: 24px;
				margin-top: 24px;
		}
		
		.card-layout-header {
				position: relative;
				line-height: 64px;
				border-bottom: 1px solid #E6EBF0;
				color: #3E4552;
				font-size: 16px;
				padding-left: 20px;
				font-weight: bold;
		
		&:before {
				 position: absolute;
				 display: block;
				 content: '';
				 left: 0;
				 top: 20px;
				 width: 4px;
				 height: 20px;
				 background: #3D71FF;
		 }
		}
		.card-layout-body {
				margin-top: 30px;
				padding-left: 20px;
				
		}
</style>
