/****************** 基本存储 操作 ******************/
let setItem = function (key, val) {
  try {
    uni.setStorageSync(key, JSON.stringify(val))
  } catch (e) {
    uni.setStorageSync(key, '')
  }
}

let getItem = function (key) {
  try {
    let value = uni.getStorageSync(key)

    value = JSON.parse(value)
    return value ? value : ''
  } catch (e) {
    return ''
  }
}

let remove = function (key) {
  uni.removeStorage({
    key: key,
    success() {
      console.log('删除本地缓存___' + key)
    },
  })
}
/****************** 用于保存当前用户相关信息 val 新增属性，或者修改原属性 ******************/
let setCurrentUser = function (val) {
  let user = this.getItem('wxUserInfo')
  let obj = { ...user, ...val }
  this.setItem('wxUserInfo', obj)
  if (obj.memberIdStr || obj.memberId) this.setItem('memberId', obj.memberIdStr || obj.memberId)
  if (obj.organizationId) this.setItem('userOrgId', obj.organizationId)
}

let getCurrentUser = function () {
  return this.getItem('wxUserInfo')
}

let removeCurrentUserKey = function (key) {
  let user = this.getItem('wxUserInfo')
  delete user[key]
  this.setItem('wxUserInfo', user)
}

module.exports = {
  setItem,
  getItem,
  remove,
  setCurrentUser,
  getCurrentUser,
  removeCurrentUserKey,
}
