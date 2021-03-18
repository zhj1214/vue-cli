export const tabs = [
  {
    iconPath: '/static/images/shop/home.png',
    selectedIconPath: '/static/images/shop/home__active.png',
    text: '店铺首页',
    customIcon: false,
  },
  {
    iconPath: '/static/images/shop/all-goods.png',
    selectedIconPath: '/static/images/shop/all-goods__active.png',
    text: '全部商品',
    customIcon: false,
  },
  {
    iconPath: '/static/images/shop/categories.png',
    selectedIconPath: '/static/images/shop/categories__active.png',
    text: '商品分类',
    customIcon: false,
  },
  {
    iconPath: '/static/images/shop/coupons.png',
    selectedIconPath: '/static/images/shop/coupons__active.png',
    text: '活动优惠',
    customIcon: false,
  },
  {
    iconPath: '/static/images/shop/brand.png',
    selectedIconPath: '/static/images/shop/brand__active.png',
    text: '店铺品牌',
    customIcon: false,
  },
]
export const tabsMall = [
  {
    iconPath: '/static/images/shop/all-goods.png',
    selectedIconPath: '/static/images/shop/all-goods__active.png',
    text: '全部商品',
    customIcon: false,
  },
  {
    iconPath: '/static/images/shop/coupons.png',
    selectedIconPath: '/static/images/shop/coupons__active.png',
    text: '活动优惠',
    customIcon: false,
  },
  {
    iconPath: '/static/images/shop/brand.png',
    selectedIconPath: '/static/images/shop/brand__active.png',
    text: '商城品牌',
    customIcon: false,
  },
]

export const routes_map = {
  0: '/pagesA/shop/home',
  1: '/pagesA/shop/all-goods',
  2: '/pagesA/shop/categories',
  3: '/pagesA/shop/coupons-activities',
  4: '/pagesA/shop/brand',
}

export const mall_routes_map = {
  0: '/pagesA/shop/all-goods',
  1: '/pagesA/shop/coupons-activities',
  2: '/pagesA/shop/brand',
}

export function onTabChange(index, isMall){
  console.log(index, isMall)
  const cur_routes_map =  isMall ? mall_routes_map : routes_map;
  const url = (this.query && this.query.shopId) ? (cur_routes_map[index] + '?shopId=' + this.query.shopId + '&is_mall=' + !!isMall) : (cur_routes_map[index] + + '?is_mall=' + !!isMall);
  console.log(url)
  uni.redirectTo({
    url
  })
}