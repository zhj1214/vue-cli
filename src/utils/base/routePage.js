let data;
// let route_url = ['goodsDetail/goodsDetail'];
/**
 * 1.这里data从app.js中传入，为了获取data的一些参数
 * 2. 此处不能写成oldOnShow()，否则没有this，this.setData等方法为undefined。这里的this在Page构造函数实例化的时候才会指定
 * 3.在Page构造函数实例化的时候，小程序会将当前的Page对象的原型链（__proto__）增加很多方法，例如setData。当前的obj没有setData
 * 4.离开页面 具体调用那个方法 https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/route.html#%E8%B7%AF%E7%94%B1%E6%96%B9%E5%BC%8F
 * */

function init(_data) {
	data = _data; // 重写page函数
	console.log(data);
	let oldPage = Page;
	Page = function (obj) {
		// 重写onShow方法，用一个变量保存旧的onShow函数
		let oldOnShow = obj.onShow || function () { };

		obj.onShow = function () {
			console.log(this.route, '____进来了'); // 商品 埋点
			if (this.route.indexOf('goodsDetail/goodsDetail') !== -1) {
				uni.$sampling.sampling('BROWSER_GOODS', this.options.goodsid, this.route);
			}
			// 页面统计
			uni.$statistics.collectionPVlog(this);
			oldOnShow.call(this);
		}; // 重写onUnload方法，用一个变量保存旧的onUnload函数


		let oldOnUnload = obj.onUnload || function () { };

		obj.onUnload = function () {
			console.log(this.route, '____leavePageLog'); // 商品 埋点

			if (this.route.indexOf('goodsDetail/goodsDetail') != -1) {
				uni.$sampling.sampling('BROWSER_GOODS', this.options.goodsid, this.route);
			} // 页面统计


			uni.$statistics.collectionPVlog(undefined, this);
			oldOnUnload.call(this);
		}; // 重写onHide方法，用一个变量保存旧的onHide函数


		let oldOnHide = obj.onHide || function () { };

		obj.onHide = function () {
			console.log(this.route, '____leavePageLog'); // 商品 埋点

			if (this.route.indexOf('goodsDetail/goodsDetail') != -1) {
				uni.$sampling.sampling('BROWSER_GOODS', this.options.goodsid, this.route);
			} // 页面统计


			uni.$statistics.collectionPVlog(undefined, this);
			oldOnHide.call(this);
		};

		return oldPage(obj);
	};
}

export default {
	init
};
