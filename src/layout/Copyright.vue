<!--
 * @Description: 
 * @Author: sam.xutao
 * @Date: 2020-10-10 17:37:31
 * @LastEditTime: 2021-02-02 17:58:32
 * @LastEditors: zhj1214
-->

<!------------------------
 *@name Vue.js
 *@author Jo.gel
 *@date 2019/6/3 0003
 -------------------------->
<template>
  <div class="footer-copy">
    <!-- <p>©2019-2020 MOS.com 版权所有 浙ICP备05057722号</p>
				<p><img :src="ICP" alt="">浙公网安备33010202000162</p> -->
    <p>Copyright 2021 © MOS.com All Rights Reserved. 浙ICP备05057722号</p>
    <p>浙公网安备33010202000162</p>
  </div>
</template>
<script>
	import ICP from '../assets/images/icon_icp.png';
	
	export default {
		name: 'Copyright',
		components: {},
		data() {
			return {
				ICP: ICP
			};
		},
		methods: {}
	};
</script>
<style lang="scss" scoped>
		.footer-copy {
				clear: both;
				font-size: 14px;
				margin-top: 35px;
				color: #9AA8B8;
				text-align: center;
				
				p {
						line-height: 22px;
				}
				
				img {
						vertical-align: middle;
				}
		}
</style>
