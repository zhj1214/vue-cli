/**
 * 适配分组接口（首页及店铺首页有调用）
 * @param {*} groupInfoList
 */
export function adaptGroups(groupInfoList = []) {
  return groupInfoList.map((gItem) => {
    return {
      ...gItem,
      groupName: gItem.name,
      groupLogo:
        gItem.imgUrlList && gItem.imgUrlList.length ? gItem.imgUrlList[0] : '',
      goodsInfoList: gItem.saleSpuInfoList.map((spu) => {
        return {
          ...spu,
          priceMoney: spu.priceNow,
          pricePoint: spu.pointNow,
          prePrice: spu.pricePre,
          showWorthToMember: spu.flagPrePrice, // 是否显示原价(true显示false不显示)
          goodsType: spu.type,
          showStockToMember: spu.flagStock, // 是否显示库存(true显示false不显示)
          mainImageUrl: spu.mainImgUrl,
          goodsName: spu.title,
        };
      }),
    };
  });
}

/**
 * 适配分组详情
 * @param {*} group
 */
export function adaptGroupDetail(group) {
  return {
    ...group,
    image:
      group.imgUrlList && group.imgUrlList.length ? group.imgUrlList[0] : '',
    title: group.secondTitle,
    groupName: group.name,
  };
}

/**
 * 适配切换商场返回数据
 * @param {*} mallData
 */
export function adaptChangeMall(mallData = {}) {
  return {
    constantlyInfo: mallData.constantlyMarket
      ? {
          ...mallData.constantlyMarket,
          orgid: mallData.constantlyMarket.orgId,
          type: 'constantly',
        }
      : null,
    keyList:
      mallData.provinceInfoList && mallData.provinceInfoList.length
        ? mallData.provinceInfoList.map((item) => item.name)
        : [],
    nearInfo: mallData.nearMarket
      ? {
          ...mallData.nearMarket,
          orgid: mallData.nearMarket.orgId,
          type: 'near',
        }
      : null,
    totalDataMap:
      mallData.provinceInfoList && mallData.provinceInfoList.length
        ? mallData.provinceInfoList.reduce((result, next) => {
            result[next.name] = next.marketInfoList.map((item) => {
              return {
                ...item,
                orgid: item.orgId,
              };
            });
            return result;
          }, {})
        : {},
  };
}

/**
 * 适配搜索好物的商场结果列表
 * @param {*} shopList 
 */
export function adaptShopList(shopList = []){
  return shopList.map(item =>{
    return {
      ...item,
      "brandsTotalNum":item.brandCount,
      "goodsTotalNum": item.saleSpuCount,
      "logo": item.logo,
      "marketName": item.parentName,
      "shopId":item.orgId,
      "shopIsClose": item.isClose,
      "shopName": item.name
    }
  })
}

/**
 * 适配搜索好物的优惠券结果列表
 * @param {*} couponList 
 */
export function adaptCouponList(couponList = []){
  return couponList.map(item =>{
    return {
      ...item,
      couponUrl: item.imageUrl,
      couponIdReal: item.couponId,
      couponId: item.couponContactId,
      couponStartTime: item.startTime,
      couponEndTime: item.endTime,
    }
  })
}

/**
 * 适配搜索好物的活动结果列表
 * @param {*} activityList 
 */
export function adaptActivityList(activityList = []){
  return activityList.map(item =>{
    return {
      ...item,
      activityLogo: item.logo,
    }
  })
}

/**
 *
 * @param {*} storeBaseInfo
 */
export function adaptStoreBaseInfo(storeBaseInfo = {}) {
  return {
    ...storeBaseInfo,
    addressObj: {
      lat: storeBaseInfo.preAddressLatitude,
      lng: storeBaseInfo.preAddressLongitude,
      addressDetail: storeBaseInfo.minuteAddress,
    },
    tel: storeBaseInfo.contact,
    marketName: storeBaseInfo.parentPreName,
    goodsCount: storeBaseInfo.saleSpuCount,
    logoUrl: storeBaseInfo.logo,
    shopName: storeBaseInfo.showName,
    shopId: storeBaseInfo.id,
  };
}

/**
 * 适配商品列表数据
 * @param {*} list
 */
export function adaptGoodsList(list = []) {
  return list.map((item) => {
    return {
      ...item,
      priceMoney: item.priceNow,
      pricePoint: item.pointNow,
      prePrice: item.pricePre,
      showWorthToMember: item.flagPrePrice,
      showStockToMember: item.flagStock, // 是否显示库存(true显示false不显示)
      goodsType: item.type,
      goodsName: item.name,
      mainImageUrl: item.mainImgUrl,
      imgUrl: item.mainImgUrl,
    };
  });
}

/**
 * 适配分类接口（店铺分类及首页品牌）
 * @param {*} categoryInfoList
 */
export function adaptCategories(categoryInfoList = []) {
  return categoryInfoList.map((item) => {
    const tmp = {
      ...item,
      image:
        item.imgUrlList && item.imgUrlList.length ? item.imgUrlList[0] : '',
      sortName: item.name,
    };

    if (item.recommendList) {
      tmp.recommendInfoList =
        item.recommendList && item.recommendList.length
          ? item.recommendList.map((it) => {
              return {
                ...it,
                content: it.linkName,
                link: it.linkValue,
              };
            })
          : [];
    }

    return tmp;
  });
}

/**
 * 适配二级分类接口（店铺分类及首页品牌）
 * @param {*} categoryInfoList
 */
export function adaptSubCategories(categoryInfoList = []) {
  return categoryInfoList.map((item) => {
    const tmp = {
      ...item,
      image: item.image,
      sortName: item.name,
    };

    if (item.recommendList) {
      tmp.recommendInfoList =
        item.recommendList && item.recommendList.length
          ? item.recommendList.map((it) => {
              return {
                ...it,
                content: it.linkName,
                link: it.linkValue,
              };
            })
          : [];
    }

    return tmp;
  });
}

/**
 * 适配商品详情
 * @param {*} goodsDetail
 */
export function adaptGoodsDetail(goodsDetail = {}) {
  console.log('goodsDetail',goodsDetail)
  return {
    ...goodsDetail,
    goodsBaseInfo: {
      exchangeNum: goodsDetail.saleCount,
      exchangeVerificationNum: 0,
      freightSettings: goodsDetail.deliverInfo && goodsDetail.deliverInfo.freightType,
      freightSettingsData: goodsDetail.deliverInfo && goodsDetail.deliverInfo.freightAmount,
      goodsDesc: goodsDetail.baseInfo.detail,
      exchangeDescription: goodsDetail.baseInfo.buyExplain,

      goodsName: goodsDetail.baseInfo.title,
      secondName: goodsDetail.baseInfo.secondTitle,
      goodsType: goodsDetail.baseInfo.type,
      id: goodsDetail.baseInfo.id,
      paymentMethod: goodsDetail.deliverInfo && goodsDetail.deliverInfo.deliverWay,
      prePrice:
        goodsDetail.priceInfo.pricePreSkuMin ===
        goodsDetail.priceInfo.pricePreSkuMax
          ? goodsDetail.priceInfo.pricePreSkuMax
          : goodsDetail.priceInfo.pricePreSkuMin +
            '-' +
            goodsDetail.priceInfo.pricePreSkuMax,
      priceMoney: goodsDetail.baseInfo.type==1?
              goodsDetail.priceInfo.priceNowSkuMin&&goodsDetail.priceInfo.pointNowSkuMin?
              goodsDetail.priceInfo.priceNowSkuMin +
              '+' +
              goodsDetail.priceInfo.pointNowSkuMin
              :goodsDetail.priceInfo.priceNowSkuMin&&!goodsDetail.priceInfo.pointNowSkuMin?
              goodsDetail.priceInfo.priceNowSkuMin
              :goodsDetail.priceInfo.pointNowSkuMin
            : goodsDetail.priceInfo.priceNow,
      pricePoint: goodsDetail.baseInfo.type==1?
              goodsDetail.priceInfo.priceNowSkuMax&&goodsDetail.priceInfo.pointNowSkuMax?
              goodsDetail.priceInfo.priceNowSkuMax +
              '+' +
              goodsDetail.priceInfo.pointNowSkuMax
              : goodsDetail.priceInfo.priceNowSkuMax&&!goodsDetail.priceInfo.pointNowSkuMax?
              goodsDetail.priceInfo.priceNowSkuMax:goodsDetail.priceInfo.pointNowSkuMax
            : goodsDetail.priceInfo.pointNow,
      // priceMoney:
      //   goodsDetail.priceInfo.priceNowSkuMin ===
      //   goodsDetail.priceInfo.priceNowSkuMax
      //     ? goodsDetail.priceInfo.priceNowSkuMax
      //     : goodsDetail.priceInfo.priceNowSkuMin +
      //       '-' +
      //       goodsDetail.priceInfo.pricePreSkuMax,
      // pricePoint:
      //   goodsDetail.priceInfo.pointNowSkuMin ===
      //   goodsDetail.priceInfo.pointNowSkuMax
      //     ? goodsDetail.priceInfo.pointNowSkuMax
      //     : goodsDetail.priceInfo.pointNowSkuMin +
      //       '-' +
      //       goodsDetail.priceInfo.pointNowSkuMax,
      showStockToMember: goodsDetail.baseInfo.flagStock,
      showWorthToMember: goodsDetail.baseInfo.flagPrePrice,
    },
    imgUrlList: goodsDetail.imgUrlList,

    storeBaseInfo: {},
    totalStockCount: goodsDetail.stockInfo.countSale,
  };
}

/**
 * 适配sku列表
 */
export function adaptSkuList(skuInfoList = []){
  return skuInfoList.map(sku => {
    return {
      ...sku,
      count: sku.stockCountSale,
      point: sku.pointNow,
      prePrice: sku.pricePre,
      price: sku.priceNow,
      spec: sku.specDetailList,
      skuIdReal: sku.skuId, // 保存真实的skuId
      skuId: sku.saleId, // 用saleId适配skuId，
    }
  })
}

/**
 * 适配品牌接口
 * @param {*} list
 */
export function adaptBrandList(list = []) {
  return list
}
