export function uuid() {
  var s = ['f']
  var hexDigits = '0123456789abcdef'
  for (var i = 1; i < 10; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[5] = hexDigits.substr((s[5] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01

  var uuid = s.join('')
  return uuid
}


const flutterBridge = (method: string, data: AnyObject = {}) => {
  const userAgent = window.navigator.userAgent
  if (!userAgent.match(/ios|android\/[0-9.]+/)) {
    return
  }
  // const { data, success, error } = _data
  // const uniqueIds = { success: 'success', error: 'error' }

  const successCallbackStr = uuid()
  const errorCallbackStr = uuid()

  const _str = JSON.stringify({
    method,
    data,
    success: successCallbackStr,
    error: errorCallbackStr
  })

  return new Promise((resolve, reject) => {
    window[successCallbackStr] = (res: AnyObject) => {
      resolve(res)
    }
    window[errorCallbackStr] = (res: AnyObject) => {
      reject(res)
    }
    window.spBridge.postMessage(_str)
  })
}

class $flutter {
  /**
   * 获取token
   * {
      'method':'getToken',
      'data':{},
      'success':’’,
      'error':’’,
      }
   */
  static fbToken = async (data?: AnyObject) => {
    const token = (await flutterBridge('getToken', data)) as {
      type: AnyObject
      token: string
    }
    return token.token
  }

  /**
   * 调查问卷，提交问卷的时候桥接函数，通知app刷新待评价列表
   */
  static surveyPostMsgCommit = (data?: AnyObject) => {
    return flutterBridge('workPublishSuccess', data)
  }
  /**
   * 拨打电话
   * {
      'method':'call',
      'data':{phone:'132xxxxxxxx'},
      'success':’’,
      'error':’’,
    }
   */
  static fbPhoneCall = (data: { phone: string }) => {
    return flutterBridge('call', data)
  }

  /**
   * 获取用户id
   * {
      'method':'getAccountId',
      'data':{},
      'success':'{'accountId':'accountId','jetourer':'true'}',
      'error':’’,
    }
   */
  static fbAccountId = async () => {
    const res = await flutterBridge('getAccountId', {})
    return res
  }

  /**
   * 打开新的web页面
   * {
      'method':'openLink',
      'data':{url:'',title:''},
      'success':’’,
      'error':’’,
      }
   */
  static fbOpenLink = (data: { url: string; title?: string }) => {
    return flutterBridge('openLink', data)
  }

  /**
   * 打开新的广告位页面
   * {
      'method':'adRouter',
      'data':{
        contentId: "1352"
        id: "1704"
        jumpLink: "app://car_series_detail.jump"
        jumpRemark: "了解大圣"
        jumpType: "app-path"
        terminal: "app"
      },
      'success':’’,
      'error':’’,
      }
   */
  static fbAdRouter = (data: { contentId: string; id: string; jumpLink: string; jumpRemark: string; jumpType: string; terminal: string }) => {
    return flutterBridge('adRouter', data)
  }

  /**
   * 返回上级/指定页面
   * {
      'method':'navigationBack',
      'data':{
        routeName: 'CarBookingPayPage'
      },
      'success':’’,
      'error':’’,
      }
   */
  static fbNavigationBack = (data?: { routeName: string }) => {
    return flutterBridge('navigationBack', data)
  }
  /**
   * 返回上级 （处理h5返回）
   * {
      'method':'canGoBack',
      'success':’’,
      'error':’’,
      }
   */
  static canGoBack = () => {
    return flutterBridge('canGoBack')
  }
  /**
   * 关闭所有web页面
   * {
      'method':'navigationClose',
      'data':{},
      'success':’’,
      'error':’’,
      }
   */
  static fbNavigationClose = () => {
    return flutterBridge('navigationClose')
  }

  /**
   * 跳转原生页面
   * {
      'method':'router',
      'data':{routeName:'LoginPage',params:{}},
      'success':’’,
      'error':’’,
      }
   */
  static fbRouter = (data: { routeName: string; params?: AnyObject }) => {
    console.info(data)
    return flutterBridge('router', data)
  }

  /**
   * 分享
   * {
      'method':'share',
      'data':{
        platform: '0',//平台类型：0 微信好友，1 微信朋友圈，2 微博 （具体分享平台有待确认）
        title: '分享',//控制显示文本，空字符串表示显示默认文本
        content:'',// 描述内容
        imgUrl:'http://xxxxxxx', //显示图片 大小不超过10MB
        thumbUrl:'',// 缩略图 大小不超过 32KB
        webpageUrl:''
      },
      'success':’’,
      'error':’’,
      }
   */
  static fbShare = (data: AnyObject) => {
    return flutterBridge('share', data)
  }
  /**
   * 分享
   * {
      'method':'openMap',
      'data':{

      },
      'success':’’,
      'error':’’,
      }
   */
      static fbOpenMap = (data: AnyObject) => {
        return flutterBridge('openMap', data)
      }

  /**
   * 隐藏/显示原生导航条
   * {
      'method':'hiddenNavigationBar',
      'data':{hidden:true},
      'success':’’,
      'error':’’,
    }
   */
  static fbHiddenNavigationBar = (data: AnyObject) => {
    return flutterBridge('hiddenNavigationBar', data)
  }

  /**
   * 复制到粘贴板
   * {
      'method':'clipboard',
      'data':{content:'xxxxxxx'},
      'success':’’,
      'error':’’,
    }
   */
  static fbClipboard = (data: AnyObject) => {
    return flutterBridge('clipboard', data)
  }

  /**
   * 定位
   * {
      'method':'location',
      'data':{},
      'success':xxx:{
        'latitude': 2.3, // 经度
        'longitude': 1.2, // 纬度
      },
      'error':’’,
      }

   */
  static fbLocation = (async (data?: AnyObject) => {
    return await flutterBridge('location', data)
  }) as (data?: AnyObject) => Promise<{ latitude: number; longitude: number }>

  /**
   * 下载
   * {
      'method':'download',
      'data':{},
      'success':’’,
      'error':’’,
      }
   */
  static fbDownload = (data: AnyObject) => {
    return flutterBridge('savePicture', data)
  }
  /**
   * 滑块验证
   * {
      'method':'sliderCaptcha',
      'data':{},
      'success':’’,
      'error':’’,
      }
   */
  static sliderCaptcha = (data: AnyObject) => {
    return flutterBridge('sliderCaptcha', data)
  }

  /**
   * 获取状态栏高度
   * {
      'method':'getStatusBarHeight',
      'data':{},
      'success':’’,
      'error':’’,
      }
   */
  static fbGetStatusBarHeight = async (data?: AnyObject) => {
    const res = (await flutterBridge('getStatusBarHeight', data)) as { height: number }
    return res?.height || 0
  }
  /**
   * 打开微信小程序
   * {
      'method':'openMiniProgram',
      'data':{
        username:123,// 小程序原始id
        path:'/xx/xx',// 拉起小程序页面的可带参路径，不填默认拉起小程序首
      },
      'success':’’,
      'error':’’,
      }
   */
  static openMiniProgram = (data: AnyObject) => {
    return flutterBridge('openMiniProgram', data)
  }
  /**
   * 传递经销商门店信息
   * {
      'method':'passDealerInfo',
      'data':{
        dealerName:'',// 经销商名称
        dealerId:'',// 经销商id
      },
      'success':’’,
      'error':’’,
      }
   */
  static passDealerInfo = (data: AnyObject) => {
    return flutterBridge('passDealerInfo', data)
  }
  /**
   * 帮app渲染富文本
   * {
      'method':'getContent',
      'data':{
      },
      'success':’’,
      'error':’’,
      }
   */
  static getContent = ((data?: AnyObject) => {
    return flutterBridge('getContent', data)
  }) as (data?: AnyObject) => Promise<AnyObject>

  /**
   * 打开图片预览
   * {
      'method':'reviewImg',
      'data':{},
      'success':’’,
      'error':’’,
      }
   */
  static reviewImg = (data: AnyObject) => {
    return flutterBridge('reviewImg', data)
  }
}

export default $flutter
