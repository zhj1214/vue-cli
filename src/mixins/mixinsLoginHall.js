/***********************
 * @name JS
 * @author Jo.gel
 * @date 2020/3/3 0003
 ***********************/
export default {
	data() {
		return {
			countryAreaList: [
				{name: "中国大陆", prefix: "+86"}
			], // 手机区号
			timer: null,
			countDownSecond: 60,
		};
	},
	methods: {
		countDownTimer() {
			clearInterval(this.timer);
			this.timer = setInterval(() => {
				if (this.countDownSecond < 1) {
					clearInterval(this.timer);
					this.countDownSecond = 60;
				} else this.countDownSecond--;
			}, 1000);
		},
		goAccountPage() {
			this.$emit('whatComponent', {name: "Profile"});
		}
	}
};
