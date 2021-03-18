<template>
	<view>
		<navBar title="地址" background="#fff" back="true"></navBar>
		<view class="view">
			<view v-for="(item, index) in addlist" :key="index" class="item" style="justify-content: space-between;">
				<view class="item-title"> {{item.title}}</view>
				<input class="item-input" style="min-width: 60vw;text-align: right;" :maxlength="item.inputLength" v-if="!item.ishow"
				 :placeholder="item.placeHolder" :value="item.value" :data-index="index" @input="inputChange"></input>
				<view v-else style="display: flex;align-items: center;" @click="showAreaSelect">
					<image class="item-img" src="/static/images/my/address.png"v-if="false" ></image>
					<view style="font-size: 28rpx;width: 50vw;color:rgb(129,129,129);text-align: right;" v-if="!item.value">{{item.placeHolder}}</view>
					<view style="font-size: 28rpx;width: 62vw;text-align: right;" v-else>{{item.value}}</view>
					<image style="width: 24rpx;height: 24rpx;right: 40rpx;" v-if="item.ishow" src="../../../static/images/left.png"></image>
				</view>
			</view>
		</view>
		<!-- 省市区 -->
		<u-select v-model="isShow" mode="mutil-column-auto" :list="areaList" :confirm-color="theme.borderColorValue" @confirm="areaOnChange"></u-select>
		<!-- 新增按钮 -->
		<view class="btnView">
			<view :class="isAddStatus?'btnView-Title':'btnView-Title-no'" :style="isAddStatus?theme.btn:''" @tap.stop="saveAdresss">保存</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				theme: uni.$theme,
				addlist: [{
					title: '收货人姓名',
					placeHolder: "请输入收货人姓名",
					inputLength: 10,
					value: ''
				}, {
					title: '手机号码',
					placeHolder: "请输入手机号码",
					inputLength: 14,
					value: ''
				}, {
					title: '所在地区',
					placeHolder: "请选择所在地区",
					value: '',
					inputLength: -1,
					ishow: true
				}, {
					title: '详情地址',
					placeHolder: "请输入详细地址",
					inputLength: 80,
					value: ''
				}],
				// 是否展示地区
				isShow: false,
				// // 是否可以 点击按钮
				// isAddStatus: false,
				// 是不是编辑状态
				editInfo: undefined,
				options: {},
				areaList: [],
				adressSwitch: {},

			};
		},
		computed: {
			isAddStatus() {
				var isok = true;
				this.addlist.forEach(item => {
					if (!item.value || item.value.length == 0) {
						isok = false;
					}
				});
				return isok
			}
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			console.log(options)
			if (options.editInfo) {
				var editInfo = JSON.parse(options.editInfo);
				let list = [{
					title: '收货人姓名',
					placeHolder: "请输入收货人姓名",
					inputLength: 10,
					value: editInfo.receiver
				}, {
					title: '联系方式',
					placeHolder: "请输入联系方式",
					inputLength: 14,
					value: editInfo.receiverPhone
				}, {
					title: '所在地区',
					placeHolder: "请选择所在地区",
					inputLength: -1,
					value: editInfo.province + ' ' + editInfo.city + ' ' + editInfo.county,
					adress: [editInfo.province, editInfo.city, editInfo.county],
					ishow: true
				}, {
					title: '详情地址',
					placeHolder: "请输入详细地址",
					inputLength: 80,
					value: editInfo.detailed
				}];
				this.setData({
					addlist: list,
					editInfo: editInfo
				});
			}

			uni.setNavigationBarTitle({
				title: options.editInfo ? '修改地址' : '新增地址'
			});
			this.setData({
				options: options
			});
		},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			let response = uni.$localStorage.getItem('areaData');
			if (!response) {
				// 预加载 省市区数据源
				var self = this;
				uni.$util.getAreaData(response => {
					let res = uni.$util.serveToCityData(response)
					uni.$localStorage.setItem('areaData', res);
					self.initData(res);
				});
			} else {
				this.initData(response);
			}
		},
		methods: {
			initData(response) {
				// area
				this.setData({
					areaList: response
				});
			},

			/**
			 * 所在地区
			 */
			showAreaSelect() {
				this.setData({
					isShow: true
				});
			},

			areaOnChange(values) {
				// console.log(values);
				if (values && values.length > 0) {
					this.addlist[2].value = "";
					var ad = [];
					values = values.map(item => {
						ad.push(item.label);
						this.addlist[2].value += item.label + ' ';
						return {
							name: item.label,
							code: item.value
						}
					});
					this.addlist[2].adress = ad;
					this.addlist[2].adressCode = values;
				} else {
					this.addlist[2].value = '北京市 北京市 东城区';
					this.addlist[2].adress = ['北京市', '北京市', '东城区'];
					this.addlist[2].adressCode = JSON.parse(
						'[{"code":"110000","name":"北京市"},{"code":"110100","name":"北京市"},{"code":"110101","name":"东城区"}]');
				}
				this.setData({
					addlist: this.addlist
				});
			},

			onClosePop() {
				this.setData({
					isShow: false
				});
			},

			surePop() {
				if (!this.addlist[2].value) {
					this.addlist[2].value = '北京市 北京市 东城区';
					this.addlist[2].adress = ['北京市', '北京市', '东城区'];
					this.addlist[2].adressCode = JSON.parse(
						'[{"code":"110000","name":"北京市"},{"code":"110100","name":"北京市"},{"code":"110101","name":"东城区"}]');
				}

				this.setData({
					addlist: this.addlist
				});
				this.setData({
					isShow: false
				});
			},

			/**
			 * 输入框事件
			 * */
			inputChange(e) {
				this.addlist[e.currentTarget.dataset.index].value = e.detail.value || '';
				this.setData({
					addlist: this.addlist
				});
			},

			/**
			 * 保存地址
			 */
			saveAdresss() {
				if (!this.isAddStatus) return;
				var err = "";
				this.addlist.forEach(item => {
					if (item.title == "收货人姓名" && (item.value.length < 1 || item.value.length > 10)) {
						err = "收件人姓名长度不超过10个字符";
					} else if (item.title == "联系方式" && (item.value.length > 14 || !/^[0-9]*$/.test(item.value))) {
						err = "联系方式长度不超过14个字符且必须为数字";
					}
				});

				if (err.length > 0) {
					return uni.$alert.showToast(err);
				}

				if (!this.addlist[2].adressCode && this.editInfo) {
					this.addlist[2].adressCode = [{
						code: this.editInfo.provinceCode,
						name: this.editInfo.province
					}, {
						code: this.editInfo.cityCode,
						name: this.editInfo.city
					}, {
						code: this.editInfo.countyCode,
						name: this.editInfo.county
					}];
				}

				if (this.editInfo) {
					uni.$api.apiRequest('userAddReceipEdit', {
						isDefault: this.editInfo.isDefault,
						memberId: uni.$localStorage.getItem("memberId"),
						province: this.addlist[2].adress[0],
						city: this.addlist[2].adress[1] || '',
						county: this.addlist[2].adress[2] || '',
						detailed: this.addlist[3].value,
						receiver: this.addlist[0].value,
						receiverPhone: this.addlist[1].value,
						id: this.editInfo ? this.editInfo.id : undefined,
						provinceCode: this.addlist[2].adressCode[0].code,
						cityCode: this.addlist[2].adressCode[1].code,
						countyCode: this.addlist[2].adressCode[2].code
					}).then(res => {
						this.addEditOnclick(res);
					});
				} else {
					uni.$api.apiRequest('userAddReceipAdd', {
						isDefault: this.options.isEmpty == '0' ? false : true,
						memberId: uni.$localStorage.getItem("memberId"),
						province: this.addlist[2].adress[0],
						city: this.addlist[2].adress[1] || '',
						county: this.addlist[2].adress[2] || '',
						detailed: this.addlist[3].value,
						receiver: this.addlist[0].value,
						receiverPhone: this.addlist[1].value,
						id: this.editInfo ? this.editInfo.id : undefined,
						provinceCode: this.addlist[2].adressCode[0].code,
						cityCode: this.addlist[2].adressCode[1].code,
						countyCode: this.addlist[2].adressCode[2].code
					}).then(res => {
						this.addEditOnclick(res);
					});
				}
			},

			addEditOnclick(res) {
				if (res.code == 10000) {
					if (this.options.adressId) {
						let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
						let prevPage = pages[pages.length - 2];
						
						 prevPage.$vm.currentAdress = {
								provinceCode: this.addlist[2].adressCode[0].code,
								cityCode: this.addlist[2].adressCode[1].code,
								countyCode: this.addlist[2].adressCode[2].code,
								province: this.addlist[2].adress[0],
								city: this.addlist[2].adress[1] || '',
								county: this.addlist[2].adress[2] || '',
								detailed: this.addlist[3].value,
								receiver: this.addlist[0].value,
								receiverPhone: this.addlist[1].value,
								adressId: 1
							};

						
	  

							// uni.$localStorage.setItem('adresstemp',{
							// 	provinceCode: this.addlist[2].adressCode[0].code,
							// 	cityCode: this.addlist[2].adressCode[1].code,
							// 	countyCode: this.addlist[2].adressCode[2].code,
							// 	province: this.addlist[2].adress[0],
							// 	city: this.addlist[2].adress[1] || '',
							// 	county: this.addlist[2].adress[2] || '',
							// 	detailed: this.addlist[3].value,
							// 	receiver: this.addlist[0].value,
							// 	receiverPhone: this.addlist[1].value,
							// 	adressId: 1
							// })
				setTimeout(() => {
					uni.navigateBack({});	
				}, 300);

						
					} else {
						uni.$alert.showSuccess('添加成功');
						setTimeout(() => {
							uni.navigateBack({});
						}, 1000);
					}
				}
			}

		}
	};
</script>
<style>
	@import "./receiptAdressAdd.css";
</style>
