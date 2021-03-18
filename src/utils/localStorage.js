/****************** 基本存储 操作 ******************/
var setItem = function(key, val) {
	try {
		uni.setStorageSync(key, JSON.stringify(val));
	} catch (e) {
		uni.setStorageSync(key, '');
	}
};

var getItem = function(key) {
	try {
		var value = uni.getStorageSync(key);
		
		value = JSON.parse(value);
		return value ? value : '';
	} catch (e) {
		return '';
	}
};

var remove = function(key) {
	uni.removeStorage({
		key: key,
		success(res) {
			console.log("删除本地缓存___" + key);
		}
	});
};
/****************** 用于保存当前用户相关信息 val 新增属性，或者修改原属性 ******************/
var setCurrentUser = function(val) {
	var user = this.getItem("wxUserInfo");
	var obj = { ...user,
		...val
	};
	this.setItem("wxUserInfo", obj);
	if (obj.memberIdStr || obj.memberId)
		this.setItem('memberId', obj.memberIdStr || obj.memberId);
	if (obj.organizationId)
		this.setItem('userOrgId', obj.organizationId);
};

var getCurrentUser = function() {
	return this.getItem("wxUserInfo");
};

var removeCurrentUserKey = function(key) {
	var user = this.getItem("wxUserInfo");
	delete user[key];
	this.setItem("wxUserInfo", user);
};

module.exports = {
	setItem,
	getItem,
	remove,
	setCurrentUser,
	getCurrentUser,
	removeCurrentUserKey
};
