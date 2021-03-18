/**
 * @description Promise封装微信请求，方便链式调用
 */
var requestCount = 0;
var one_t; // 用于存储 app 实例
/**
 * @description api请求封装
 * */
const request = function(url, resolve, reject, data = {}, method, loading) {
	if (url.indexOf('/platform/memberBehavior') < 0 && url.indexOf('/api/market/addSearchLog') < 0 && loading) {
		uni.$alert.showLoading('请稍等');
		requestCount += 1;
	}

	if (!one_t)
		one_t = getApp()
	uni.request({
		url: url,
		timeout: 120000,
		method: method,
		data: data,
		header: {
			'rootOrgId': uni.$localStorage.getItem('rootOrgId') || (one_t.globalData ? (one_t.globalData.rootOrgId || '') : ''),
			'orgId': uni.$localStorage.getItem('orgId') || (one_t.globalData ? (one_t.globalData.orgId || ''): ''),
			'mToken': uni.$localStorage.getItem('Token') || '',
			'uid': uni.$localStorage.getItem('memberId') || '1', // uid就是memberId
			'content-type': 'application/json'
		},
		success: res => {
			const code = res.data.code;
			const msg = res.data.message || '';
			if (code == 10000 || code == 3003) {
				resolve(res.data);
			} else if (res.data.code == 50005) {
				uni.navigateTo({
					url: '/pages/index/switchMall/switchMall?showalert=1',
				});
			} else if (res.data.code == 30001) {
				reportErrlog(url, data, res.data)
				uni.reLaunch({
					url: '/pages/login/login'
				})
			} else if (res.data.code == 90000) {
				reportErrlog(url, data, res.data)
				show_error(msg || "服务异常，请重试");
			} else {
				reportErrlog(url, data, res.data)
				if (msg)
					show_error(msg);
				resolve(res.data);
			}
		},
		fail: err => {
			reportErrlog(url, data, "请求 TCP 建立失败")
			reject(err);
		},
		complete: res => {
			if (url.indexOf('/platform/memberBehavior') < 0 && url.indexOf('/api/market/addSearchLog') < 0 && loading) {
				requestCount -= 1;
				if (requestCount == 0) {
					uni.hideLoading();
				}
			}
			if (res.statusCode != 200) {
				console.error(res, '____error')
				show_error("当前页面访问人数过多，请稍后再试");
			}
		}
	});
};


/**
 * 云函数
 * */
const cloud = function(apis, data, loadingText) {
	return new Promise((resolve, reject) => {
		uni.$uniCloud.callFunction({
			name: apis[0],
			data: { ...data,
				...{
					api: apis[1]
				}
			},
			success: (res) => {
				const code = res.result.code;
				const msg = res.result.msg;
				if (code == 10000 || code == 20000) {
					resolve(res.result);
				} else {
					resolve(res.data);
				}
			},
			fail: err => {
				reject(err);
			}
		})
	});
};

/**
 * 错误日志上报
 * */
const reportErrlog = function(url, data, result) {
	let userObj = uni.$localStorage.getCurrentUser() || {}
	one_t = getApp();
	if (!userObj.phone || !one_t.globalData.isEnableCloud) return
	uni.$api.cloudRequest('cctvApi', {
		memberId: userObj.memberId,
		nickName: userObj.nickName,
		phone: userObj.phone,
		url: url,
		apiParam: data,
		apiResult: result
	})
}

const show_error = function(msg) {
	setTimeout(() => {
		uni.showToast({
			title: msg || '',
			icon: 'none',
			duration: 3000,
			success: () => {
				setTimeout(() => {
					uni.hideLoading();
				}, 3000);
			}
		});
	}, requestCount != 0 ? 300 : 0);
};

export {
	request,
	cloud
};
