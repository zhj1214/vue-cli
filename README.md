<!--
 * @Description: 
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-03-04 15:53:53
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-03-18 21:24:35
-->

#  ht-applet
uni-app 项目框架
## 分支状态
1.master 正式环境版本
合并：release-2021xxxx
2.feature-x.0 测试分支
来源：release-20210318 -> feature-x.0 合并：feature-x.0-share-zhj -> feature-x.0
3.release-x.0 预发布环境
来源：release-20210318 -> release-x.0 合并：release-x.0-share-zhj -> release-x.0
4.release-2021xxxx 上线版本分支
来源：release-20210318 -> release-20210328 合并：release-20210328 + feature-x.0-share-zhj

###  当前基础库版本 2.6.0 (建议使用一年前版本，逐年递增)
app.js 中有版本校验   管理后台也设置 2.6.0

## 图片资源超过25kb统一使用 obs云存储获取链接使用
图片资源超过25kb统一使用 obs云存储获取链接使用

## 小程序场景二维码规则
小程序码传参规则：105_17503880_1
105： 记录ID/场景ID
17503880：商城orgId
1:场景值（例如1代表兑换券、2代表渠道拉新、3：游戏）

###场景穷举
1.兑换券逻辑
2.渠道拉新 pages: /pages/index/index
3.大转盘游戏抽奖
4.大转盘游戏抽奖 预览模式
5.核销员绑定
6.优惠券核销
7.门票核销
8.商品核销
9.活动预览
10.落地页
11.扫码领券

## 小程序内部跳转	路由规则
内部路由传参规则：protocol://domain/{module}?param1=value2&param2=value2
domain： 模块名称，目前代指	 appleht
module：页面路由 例如 pages/my/myPage
param： 参数
例子: 广告位配置，小游戏游客模式跳转。 protocol://appleht/pages/commLottery/circlenew?gameId=143&isTourist=1

## 登录默认账号
账号 17521091214
密码 885566

### 小程序审核发布
提供的测试账号: 账号：17521091214   密码：885566


### 环境
1.开发环境		http://htmosdev.data4truth.com

2.测试环境
模板： wxa1102f983873e46d       授权： wxc91325214d05e6e1 （恒太荟01）   商户： 12226364

3.预发布环境
模板： wx2cbaea50336c05a3(吴汕)      授权： wx61469e9df5790784 （恒太荟02）   商户： 77949820

4.正式环境
模板： wxac0ab75d3686b684(继于)      授权： wx3c3abcdafb46f828 （恒太荟03）   商户： 77949820

![Image text](https://eos-wuxi-1.cmecloud.cn/crmoss/19d3ef09-7ab5-4008-840d-2a00cf257eff.png)

### 上线备注
1.上线记得切换域名地址
2.ext.json文件  配置、激活、测试
3.隐藏清楚缓存 按钮






