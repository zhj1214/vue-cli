<!-- 游戏中心 -->
<template>
	<view class="lottery">
		<navBar title="游戏中心" background="#fff" :back="false"></navBar>
		<view class="swiper-list">
			<u-swiper class="swiperList-item" height="280" :list="list" :effect3d="true" name="logo" @click="goToLottery"></u-swiper>
		</view>
		<div class="hot-activity" v-if="false">
			<div class="title">热门活动</div>
			<empty-list tip="暂无活动" v-if="!total && !loadFlag" :top="45"></empty-list>
			<van-list class="avtivity-list" v-model="loading" :finished="finished" finished-text="没有更多了" error-text="请求失败，请稍后再试"
			 :error.sync="error" :offset="50" @load="loadData" v-else>
				<div class="activity-item" v-for="(item, index) in list" :key="index" @click="goTo">
					<div class="image">
						<img :src="item.logo" />
						<div class="status" :class="{'not-start': item.status == 1, 'starting': item.status == 2, 'end': item.status == 3}">
							<span v-text="handleStatus(item.status)"></span>
						</div>
					</div>
					<div class="sub-title">
						<p>{{item.title}}</p>
						<div class="view-detail">
							<span>查看详情</span>
							<van-icon name="arrow" />
						</div>
					</div>
				</div>
			</van-list>
		</div>
	</view>
</template>

<script>
	// import {
	// 	swiper,
	// 	swiperSlide
	// } from "vue-awesome-swiper";
	// import {
	// 	List,
	// 	Icon
	// } from "vant";
	// import EmptyList from "@/components/empty-list";

	export default {
		data() {
			return {
				swiperOption: {
					loop: true,
					effect: "coverflow",
					grabCursor: true,
					centeredSlides: true,
					slidesPerView: "auto",
					coverflowEffect: {
						rotate: 50,
						stretch: 0,
						depth: 100,
						modifier: 1,
						slideShadows: true
					},
					pagination: {
						el: ".swiper-pagination"
					},
					autoplay: {
						delay: 3000,
						disableOnInteraction: false
					},
					spaceBetween: -10
				},
				loading: false,
				finished: false,
				loadFlag: true,
				page: 1,
				size: 10,
				total: 0,
				list: [{
						logo: 'https://m.360buyimg.com/mobilecms/s700x280_jfs/t1/80578/19/7548/112245/5d59fc73Ee55f972c/7de06196e583d621.jpg!cr_1125x445_0_171!q70.jpg.dpg',
						title: '七夕换个钓法？',
						status: 1,
					},
					{
						logo: 'https://m.360buyimg.com/mobilecms/s700x280_jfs/t1/80578/19/7548/112245/5d59fc73Ee55f972c/7de06196e583d621.jpg!cr_1125x445_0_171!q70.jpg.dpg',
						title: '全民拼手速，抢亿万红包',
						status: 3,
					},
					{
						logo: 'https://m.360buyimg.com/mobilecms/s700x280_jfs/t1/80578/19/7548/112245/5d59fc73Ee55f972c/7de06196e583d621.jpg!cr_1125x445_0_171!q70.jpg.dpg',
						title: '七夕换个钓法？',
						status: 2,
					}
				],
				error: false,
				images: [{
						image: "https://img10.360buyimg.com/img/jfs/t1/55906/8/9187/90193/5d67354fE45bdef63/d3513787b9eb4794.jpg",
						id: "1"
					},
					{
						image: "https://img14.360buyimg.com/img/jfs/t1/41410/10/8016/118707/5d19c9e7Ecf9b5594/c67bd0aaad47e63a.jpg",
						id: "2"
					},
					{
						image: "https://img12.360buyimg.com/img/jfs/t1/43732/15/12916/96835/5d634496E0ec4bccf/9fff14cac415ba97.jpg",
						id: "3"
					}
				]
			};
		},
		components: {
			// [List.name]: List,
			// [Icon.name]: Icon,
			// EmptyList,
			// swiper,
			// swiperSlide
		},
		methods: {
			loadData() {

			},
			goToLottery(index) {
				this.$router.push({
					path: '/lottery-circle/1'
				})
			},
			goTo() {
				this.$router.push({
					path: '/lottery-circle/1'
				})
			},
			handleStatus(status) {
				if (status == 1) {
					return '未开始'
				} else if (status == 2) {
					return '进行中'
				} else if (status == 3) {
					return '已结束'
				} else {
					return ''
				}
			}
		}
	};
</script>
<style>
	.lottery-pagination {
		bottom: -26px !important;
		left: 50%;
		transform: translateX(-50%);
	}

	.lottery-pagination .swiper-pagination-bullet {
		width: 7px;
		height: 7px;
		background: rgba(188, 188, 188, 1);
	}

	.lottery-pagination .swiper-pagination-bullet-active {
		background: linear-gradient(44deg, rgba(182, 133, 58, 1) 0%, rgba(231, 202, 163, 1) 100%);
	}
</style>

<style lang='less' scoped>
	.lottery {
		background: #fff;
		min-height: 100%;
	}

	.swiper-list {
		width: 100%;
		position: relative;

		.swiperList-item {}
	}

	.slide-item {
		width: 323px !important;
		height: 140px;
	}

	.image {
		width: 323px;
		height: 140px;
		box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.08);
		border-radius: 9px;
	}

	.status {
		width: 70px;
		height: 20px;
		background: rgba(195, 195, 195, 1);
		border-radius: 0px 50px 50px 0px;
		position: absolute;
		left: 0;
		top: 12px;
		font-size: 12px;
		font-family: PingFangSC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;

		span {
			line-height: 14px;
		}
	}

	.not-start {
		background: rgba(191, 157, 95, 1);
	}

	.starting {
		background: rgba(109, 212, 0, 1);
	}

	.end {
		background: rgba(195, 195, 195, 1);
	}

	.hot-activity {
		padding-top: 39px;

		.title {
			padding-left: 16px;
			font-size: 17px;
			font-family: PingFangSC;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);
			line-height: 25px;
			margin-bottom: 12px;
		}
	}

	.activity-item {
		box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.08);
		border-radius: 10px;
		width: 320px;
		margin: 0 auto;
		margin-bottom: 16px;

		.image {
			position: relative;
			width: 100%;
			height: 136px;

			img {
				display: block;
				width: 100%;
				height: 100%;
			}
		}

		.sub-title {
			height: 32px;
			line-height: 32px;
			display: flex;
			justify-content: space-between;
			padding: 0 12px;

			p {
				font-size: 12px;
				font-family: PingFangSC;
				font-weight: 400;
				color: rgba(62, 62, 62, 1);
				width: 60%;
				text-overflow: ellipsis;
				overflow: hidden;
				white-space: nowrap;
			}

			.view-detail {
				font-size: 12px;
				font-family: PingFangSC;
				font-weight: 400;
				color: rgba(62, 62, 62, 1);
				display: flex;
				align-items: center;
			}
		}
	}
</style>
