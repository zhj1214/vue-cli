/**********************************Toast 提示********************************/
var showToast = text => uni.showToast({
  title: text || "缺少入参",
  icon: "none",
  duration: 3000
}); // 显示繁忙提示


var showLoading = text => uni.showLoading({
	mask: true,
  title: text
}); 
// 显示成功提示
var showSuccess = text => uni.showToast({
  title: text,
  icon: "success"
}); // 自定义 toast提示


var showModal = (title, content) => {
  uni.hideToast();
  return new Promise(function (resolve, reject) {
    uni.showModal({
      title,
      content: content,
      success(res) {
        if (res.confirm) {
          resolve(true);
        } else if (res.cancel) {
          resolve(false);
        }
      },
      showCancel: false
    });
  });
};

module.exports = {
  showLoading,
  showSuccess,
  showToast,
  showModal
};