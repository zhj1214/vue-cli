<!--
@desc 超时页面
-->
<template>
  <div class="error-page">
    <div class="content-con">
      <img
        :src="src"
        alt=""
      >
						
      <div style="color:#171725;font-size: 24px;margin-top: 64px;margin-bottom: 8px;text-align: center">
        登录超时
      </div>
						
      <p style="color: #696974;text-align: center">
        已超过 4 小时未操作，请您重新登录。
      </p>
						
      <div style="text-align: center;margin-top: 24px;">
        <Button
          type="warning"
          @click="backLogin"
        >
          重新登录
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
	import timeout from '../assets/timeout.png';
	
	export default {
		name: 'Timeout',
		components: {},
		data() {
			return {
				src: timeout,
			};
		},
		methods: {
			backLogin() {
				location.href = '/login.html';
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
