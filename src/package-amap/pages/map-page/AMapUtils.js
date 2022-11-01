import AMapLoader from '@amap/amap-jsapi-loader'

/**
 * @description: 获取设备类型
 */
const u = navigator.userAgent
// ios设备
export const isIos = !!u.match(/(i[^;]+;( U;)? CPU.+Mac OS X)/)
// android设备
export const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
// 微信浏览器
export const isInWechat = u.toLowerCase().indexOf('micromessenger') > -1

/**
 * @description: 初始化Map的JSAPI
 * @param {*} id 容器id
 * @param {*} isDraw
 */

export function mapLoader(id = '', isDraw = true) {
  if (window._aMap) {
    return Promise.resolve(window._aMap)
  }

  return AMapLoader.load({
    key: '21b26bcb4db13ff3541ce00c7a9506c4', // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ['AMap.Scale'] // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  }).then(async (AMap) => {
    // 1. 存储AMap类
    window._aMap = AMap
    // 2. 渲染地图页面
    if (id && isDraw) drawMapView(id)
    return window._aMap
  })
}

/**
 * @description: 绘制地图界面到指定id视图界面上
 * @param {*} id 容器id
 * @return {*} 地图实例
 */
export const drawMapView = (id, param = {}) => {
  // 0. 检查是否初始化，设置参数
  if (!window._aMap) {
    return console.error('请先调用mapLoader进行Map初始化')
  }
  const mapParam = {
    viewMode: '2D', // 默认为‘2D’，可选’3D’，选择‘3D’会显示 3D 地图效果。（自V1.4.0开始支持）
    animateEnable: true, // 地图平移过程中是否使用动画
    rotateEnable: true, // 地图是否可旋转:3D视图默认为true，2D视图默认false。
    features: ['bg', 'point', 'road', 'building'], // 设置地图上显示的元素种类: 支持'bg'（地图背景）、'point'（POI点）、'road'（道路）、'building'（建筑物）
    showBuildingBlock: true, // 设置地图显示3D楼块效果，移动端也可使用。推荐使用
    lang: 'zh_cn', //  默认为: zh_cn：中文简体 可选值：zh_cn：中文简体，en：英文，zh_en：中英文对照
    zoom: 16 // 地图显示的缩放级别范围：在PC上，默认为[3,18]，取值范围[3-18]；,在移动设备上，默认为[3,19],取值范围[3-19]
    // center: [120.08, 30.13] //初始化地图中心点位置,应该是当前位置
  }

  // 1. 初始化
  const map = new AMap.Map(id, { ...mapParam, ...param })
  window._map = map
  // 2. 钩子函数,可重复，会按照队列顺序执行
  map.on('complete', function () {
    console.log('地图加载完成！')
  })

  return map
}

/**
 * @description: 地图销毁
 * @author: zhj1214
 */
export function destruction(map) {
  window._map = null
  map.destroy()
}

/**
 * @description: 加载地图插件: 插件 'AMap.ToolBar', 'AMap.Scale', 'AMap.HawkEye', 'AMap.MapType', 'AMap.Geolocation'
 * @param {*} plugins 插件数组（注意名臣发给首字母大写）
 */
export const loadMapPlugin = (plugins = [], param) => {
  AMap.plugin(plugins, function () {
    if (plugins.includes('Scale')) {
      // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
      window._map.addControl(new AMap.Scale())
    }
    if (plugins.includes('ToolBar')) {
      // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
      window._map.addControl(new AMap.ToolBar())
    }

    if (plugins.includes('HawkEye')) {
      // 在图面添加鹰眼控件，在地图右下角显示地图的缩略图
      window._map.addControl(new AMap.HawkEye({ isOpen: true }))
    }

    if (plugins.includes('MapType')) {
      // 在图面添加类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
      window._map.addControl(new AMap.MapType())
    }
    // 定位
    if (plugins.includes('Geolocation')) {
      // 1. 创建定位点icon对象
      var curIcon = new AMap.Icon({
        // 图标尺寸
        size: new AMap.Size(param.icon_w, param.icon_h),
        // 图标的取图地址
        image: param.icon || 'https://jetour-sit.obs.cn-east-3.myhuaweicloud.com/fe-hybrid-h5/static/station-map-default.png',
        // 图标所用图片大小
        imageSize: new AMap.Size(param.icon_w, param.icon_h)
      })
      // 2. 创建定位对象
      const geolocation = new AMap.Geolocation({
        enableHighAccuracy: true, // 是否使用高精度定位，默认：true
        timeout: 30000, //超过10秒后停止定位，默认：无穷大
        convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        showButton: true, //显示定位按钮，默认：true
        position: 'RB', //  定位按钮的排放位置,  RB表示右下
        panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
        offset: [param.offset_x, param.offset_y], // 定位按钮的停靠位置的偏移量
        showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
        markerOptions: {
          icon: curIcon
        },
        showCircle: true, // 定位成功后用圆圈表示定位精度范围，默认：true. 如果改成false，会导致定位成功后，地图缩放级别变到最小了，应该是地图的bug
        extensions: 'all', // 是否需要详细的逆地理编码信息，默认为'base'只返回基本信息，可选'all'
        zoomToAccuracy: false //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
      })
      // 3. 添加定位控件
      window._map.addControl(geolocation)
      // 4. 回调定位结果
      geolocation.getCurrentPosition((status, result) => {
        if (status === 'complete') {
          param.geolocationCall(result)
        } else {
          console.error(result)
        }
      })
    }
  })
}

/**
 * @description: 创建标记（使用dom创建）
 * @param {*} map 地图对象
 * @param {*} param 创建mark的参数 {id:'唯一标识',icon: '图片url',text: ‘文字描述’,position:[经度，维度]}
 */

export const createMarker = (map, param) => {
  // 1. 创建标记marker集合
  if (!map.markers) map.markers = {}
  // 2. 初始化标记marker
  let marker = new AMap.Marker(param)
  // console.log(marker, 'markerm', param.id)
  // 3. 保存marker
  map.markers[param.id] = marker
  // 4. 自定义marker容器内容
  const markerImg = createMarkeText(marker, param)
  // 5. 添加到地图
  map.add(marker)
  // 6. marker的点击回调事件
  marker.on('click', (e) => {
    if (map.markerClick) {
      map.markerClick(e, markerImg)
    } else {
      console.error('请先初始化markerClick回调事件')
    }
  })
}

export const createMarkeText = (marker, param) => {
  // 1. 创建容器
  let markerContent = document.createElement('div')
  markerContent.className = 'markerBoxview'
  // 2. 点标记中的图标
  let markerImg = document.createElement('img')
  markerImg.src = param.icon // 'https://jetour-sit.obs.cn-east-3.myhuaweicloud.com/fe-hybrid-h5/static/station-map-default.png'
  markerImg.setAttribute('width', '35px')
  markerImg.setAttribute('height', '45px')
  markerContent.appendChild(markerImg)
  // 3. marker的文字描述
  if (param.text) {
    // 点标记中的文本
    let markerSpan = document.createElement('span')
    markerSpan.className = 'markerText'
    markerSpan.innerHTML = param.text
    markerContent.appendChild(markerSpan)
  }
  // 4. 将Element添加到Marker实例上（可以添加vue中的$el）
  marker.setContent(markerContent)

  return markerImg
}

/**
 * @description: 创建地图LabelMarker图层
 * @param {*} map 地图对象
 * @param {*} marks 是否同时绘制点位的数据
 * @return {*} 返回当前图层
 * @author: zhj1214
 */
export const createLayerMarker = (map, marks) => {
  // 1. 创建图层
  var layer = new AMap.LabelsLayer({
    zooms: [3, 20],
    zIndex: 1000,
    // 开启标注避让，默认为开启，v1.4.15 新增属性
    collision: true,
    // 开启标注淡入动画，默认为开启，v1.4.15 新增属性
    animation: true
  })
  // 2. 添加到地图上
  map.add(layer)
  // 3. 是否添加点位
  if (marks) addMarkerToLayer(map, marks, layer)

  return layer
}
/**
 * @description: 给marker图层添加标记点位
 * @param {*} map
 * @param {*} marks
 * @param {*} layer 点位图层
 * @author: zhj1214
 */
export const addMarkerToLayer = (map, marks, layer) => {
  // 0. 组装初始化数据（可以在外部就初始化好）
  marks = marks.map((e) => {
    e.zooms = [5, 20]
    e.opacity = 1
    e.zIndex = 10
    e.icon = {
      type: 'image',
      image: 'https://a.amap.com/jsapi_demos/static/images/poi-marker.png' || e.icon,
      clipOrigin: [14, 92], // 从什么位置开始裁剪
      clipSize: [50, 68], // 裁剪的尺寸 px
      size: [25, 34],
      anchor: 'bottom-center',
      angel: 0,
      retina: true
    }
    e.text = {
      content: e.name,
      direction: 'top',
      offset: [0, -5],
      style: {
        fontSize: 15,
        fontWeight: 'normal',
        fillColor: '#333',
        strokeColor: '#fff',
        strokeWidth: 2
      }
    }
    e.extData = {
      abc: '自定义属性',
      id: e.id || 'id'
    }
    return e
  })

  // 1.1 存储这次的点位数据
  if (!map.markers) map.markers = []
  console.log('marksmarksmarks', marks[0])

  // 1.2 创建LabelMarker点位
  marks.forEach((element) => {
    var labelMarker = new AMap.LabelMarker(element)
    map.markers.push(labelMarker)
    layer.add(labelMarker)
  })
  // 2. 自动适配到合适视野范围
  // map.setFitView() // 无参数，默认包括所有覆盖物的情况
  // map.setFitView([map.markers[0], map.markers[1]]) // 传入覆盖物数组，仅包括polyline和marker1的情况
}

/**
 * @description: 跳转到高德导航
 * @param {*} markerinfo
 */

export const jumpAMap = (markerinfo) => {
  // 1. 获取经纬度
  let lng = markerinfo.longitude || (markerinfo.position && markerinfo.position[0])
  let lat = markerinfo.latitude || (markerinfo.position && markerinfo.position[1])
  if (!lng || !lat) return uni.showToast({ title: '请传入经纬度', icon: 'none' })
  // 2. 安卓手机
  if (!isIos) {
    window.location.href = `androidamap://viewMap?sourceApplication=appname&poiname=${markerinfo.text}&lat=` + lat + '&lon=' + lng + '&dev=0'
    //判断是否跳转
    setTimeout(function () {
      let hidden = window.document.hidden || window.document.mozHidden || window.document.msHidden || window.document.webkitHidden
      if (typeof hidden === 'undefined' || hidden === false) {
        //调用高德地图
        window.location.href = 'https://uri.amap.com/marker?position=' + lng + ',' + lat + `&name=${markerinfo.name || '未知'}`
      }
    }, 2000)
  }
  // 3. iOS手机
  if (isIos) {
    window.location.href = `iosamap://viewMap?sourceApplication=appname&poiname=${markerinfo.text}&lat=` + lat + '&lon=' + lng + '&dev=0'

    //判断是否跳转
    setTimeout(function () {
      let hidden = window.document.hidden || window.document.mozHidden || window.document.msHidden || window.document.webkitHidden
      if (typeof hidden === 'undefined' || hidden === false) {
        //调用高德地图
        window.location.href = 'https://uri.amap.com/marker?position=' + lng + ',' + lat + `&name=${markerinfo.name || '未知'}`
      }
    }, 2000)
  }
}

// 清楚地图覆盖物
// 2.1 方式一： 会导致界面越来月卡，因为节点没有删除。 aMap.markers[key].hide()
//   for (let key in aMap.markers) {
//     aMap.markers[key].hide()
//   }
// 2.2 方式二： 直接操作节点,删除dom
// if (aMap.do.childNodes[1] && aMap.do.childNodes[1].childNodes.length > 1) {
//   for (let key in aMap.markers) {
//     aMap.do.childNodes[1].removeChild(aMap.markers[key].dom)
//   }
// 2.3 方式三： 直接调用地图清楚所有覆盖物方法
// aMap.clearMap() // 会将所有覆盖物清楚，也会删除定位的marker😯
// 2.4 方式四： 调用map的remove方法，
// https://lbs.amap.com/demo/javascript-api/example/map-componets/map-overlays
