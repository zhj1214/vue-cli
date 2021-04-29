/*
 * @Description:
 * @Author: sam.xutao
 * @Date: 2020-03-26 13:54:34
 * @LastEditTime: 2020-04-03 14:42:58
 * @LastEditors: sam.xutao
 */
// 优惠券
import { axios_post } from '@/utils/axios'

export default {
  namespaced: true,
  state: {
    //优惠券默认搜索条件
    couponSearch: {
      content: '', //优惠券名称/适用商品/优惠内容
      startTime: '',
      endTime: '',
      type: 2, //优惠券状态  1-待上架 2-已上架 3-已下架
      /**
       * 优惠券类型
       * 券一级类别:
       * DISCOUNT 折扣券
       * REDUCTION 满减券
       * EXCHANGE 兑换券
       * CARRIAGE 运费券
       * REAPACK 红包
       */
      couponTypeList: [],
      size: 12,
      page: 1,
      orgId: localStorage.getItem('originOrgId'),
      excludeZero: 1,
    },
  },
  mutations: {},
  actions: {
    //根据搜索条件返回优惠券列表信息
    loadCouponList({ state }, search) {
      search.excludeZero = search.isZero ? '' : 1
      const url = '/coupon-server/api/coupon/market/pageList'
      const iSearch = JSON.parse(JSON.stringify({ ...search } || state.couponSearch))
      // this.commModal.spinShow = true;
      // iSearch.couponOrigin = !iSearch.couponOrigin?null:iSearch.couponOrigin;
      return axios_post(url, iSearch)
        .then((res) => {
          if (res && res.code === 10000) {
            return Promise.resolve(res.data)
          } else {
            return Promise.reject({})
          }
        })
        .catch(() => Promise.reject({}))
    },
  },
}
