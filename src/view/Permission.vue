<!--
@desc 无权限页面
-->
<template>
  <div class="error-page">
    <div class="content-con">
      <img
        :src="src"
        alt=""
      >
						
      <div style="color:#171725;font-size: 24px;margin-top: 64px;margin-bottom: 8px;text-align: center">
        无操作权限
      </div>
						
      <p style="color: #696974;text-align: center">
        当前角色无操作权限，请返回上一页选择其他操作。
      </p>
						
      <div style="text-align: center;margin-top: 24px;">
        <Button
          type="warning"
          style="margin-right: 24px;"
          @click="backHome"
        >
          返回首页
        </Button>
        <Button
          type="warning"
          @click="goHistory"
        >
          返回上一页
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
	import permissionImg from '../assets/timeout.png';
	
	export default {
		name: 'NotFound',
		components: {},
		data() {
			return {
				src: permissionImg,
			};
		},
		methods: {
			backHome() {
				this.$router.replace({
					name: 'welcome'
				});
			},
			goHistory() {
				this.$router.go(-1);
			}
		}
	};
</script>
<style lang="scss" scoped>
		.error-page {
				width: 100%;
				height: 100%;
				position: relative;
				background: #f8f8f9;
				
				.content-con {
						width: 700px;
						height: 420px;
						position: absolute;
						left: 50%;
						top: 50%;
						transform: translate(-50%, -60%);
						
						img {
								display: block;
								width: 100%;
								height: 100%;
						}
						
						.text-con {
								position: absolute;
								left: 0;
								top: 0;
								
								h4 {
										position: absolute;
										left: 0;
										top: 0;
										font-size: 80px;
										font-weight: 700;
										color: #348EED;
								}
								
								h5 {
										position: absolute;
										width: 700px;
										left: 200px;
										text-align: left;
										top: 100px;
										font-size: 20px;
										font-weight: 700;
										color: #67647D;
								}
						}
						
						.back-btn-group {
								position: absolute;
								right: 0;
								bottom: 20px;
						}
				}
		}

</style>
