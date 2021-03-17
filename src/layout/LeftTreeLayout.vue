<!--
 * @Description: 
 * @Author: sam.xutao
 * @Date: 2020-10-10 17:37:31
 * @LastEditTime: 2020-10-11 17:57:43
 * @LastEditors: sam.xutao
-->
<template>
  <div class="left-right-tree clearfix">
    <div class="left-tree">
      <slot name="left" />
    </div>
    <div class="right-table">
      <slot name="right" />
    </div>
  </div>
</template>

<script>
	export default {
		name: "LeftTreeLayout"
	};
</script>

<style scoped lang="scss">
		.left-tree {
				width: 300px;
				float: left;
				padding: 24px;
		}
		
		.right-table {
				// margin-left: 300px;
				border-left: 1px solid #E2E2EA;
				overflow: hidden;
				padding: 24px;
				
		}
		
		.query {
				padding: 24px 0;
		}
		
		.content {
				
				h3 {
						position: relative;
						height: 52px;
						font-size: 18px;
						color: #171725;
						border-bottom: 1px solid #E2E2EA;
						padding-bottom: 24px;
						
						&:before {
								display: block;
								content: "";
								position: absolute;
								left: -25px;
								top: 0;
								width: 6px;
								height: 28px;
								background: #887ef7;
								border-radius: 0 8px 8px 0;
						}
				}
		}

</style>
