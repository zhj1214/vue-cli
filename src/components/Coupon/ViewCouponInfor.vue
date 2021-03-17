<!--展示优惠券使用说明-->
<style lang="scss">
.cardDescView{
  .cardDescCont{
    padding:20px;
    font-family:PingFangSC-Regular;
    font-weight:600; max-height:75%; overflow:hidden; overflow-y:auto;
    .prodList{max-width:300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;}
    .prodList span{margin-right:8px;}
    li{ list-style-type: none; margin-bottom:16px;
    position: relative;text-indent: 1em;
      &::before{content:''; display: inline-block; width:6px; height: 6px; background: #DBB678; border-radius: 50%; left:0; top:8px;position: absolute;}}
    li h3{
      font-size:14px;
      color:rgba(103,103,143,1); 
      &+div{word-break:break-word;}
    }
    li>div{color:rgba(145, 145, 145, 1)}
  } 
}
.cardDescView{
  height: 97%;overflow: hidden; overflow-y:auto;
}
</style>
<style lang="scss">
  .prodList .ivu-tag{text-indent:0 !important;}
</style>
<template>
  <i-col
    span="24"
    class="cardDescView"
  >
    <h4 style="text-align:center">
      使用说明
    </h4>
    <p
      v-if="infor.couponDesc!=initDesc"
      class="cardDescCont"
      v-html="infor.couponDesc"
    />
    <div
      v-else
      class="cardDescCont"
    >
      <ul>
        <li>
          <h3>优惠券名称</h3>
          <div>{{ infor.couponName }}</div>
        </li>
        <li>
          <h3>优惠内容</h3>
          <!-- 体验券或者无门槛显示“无使用门槛” -->
          <!-- useThresholdType 使用门槛方式 1-无使用门槛 2-订单满X元 3-订单满X元每满Y元 4-商品标签 -->
          <!-- couponType分为1-满减，2-打折，3-体验 富基券-FJQ 长益券-CYQ 微信原生券-CYWQ 现金券-CASH 停车券-PARK 兑换券-EXCHANGE-->
          <!--<div v-if="infor.couponShowDetail&&infor.couponShowDetail['couponSummary']">{{infor.couponShowDetail['couponSummary']}}</div>-->
          <p style="text-align:left;">
            <b>{{ infor.couponType=='PARK'?infor.amountType==1?'减免':'免停':infor.couponType=='EXCHANGE'?infor.couponContent:'￥' }}</b>
            <b>{{ infor.couponAmount||infor.maxOfferAmount }}</b>
            <b>{{ infor.couponType=='PARK'?amountTypeObj[infor.amountType]:'' }}</b>
            <label v-if="infor.couponType!='PARK'&&infor.couponType!='EXCHANGE'">{{ amountTypeObj[infor.amountType] }}</label>
          </p>
          <!--<div
            v-if="infor.couponType==1"
          >{{infor.couponAmount?"减免"+infor.couponAmount+"元优惠券":''}}</div>
          <div v-if="infor.couponType==2">{{(infor.couponDiscount||1)+"折优惠券"}}</div>
          <div v-if="infor.couponType==3">{{(infor.couponAmount||0)+"元体验券"}}</div>
          <div>
            {{infor.useThresholdType==1||infor.couponType==3?infor.couponType==3?"无使用门槛，减"+(infor.couponAmount||0)+"元":"无使用门槛"
            :"满"+(infor.useThresholdAmount||0)+"元，"+(infor.couponType==1?"减":'最多减')+(infor.couponAmount||0)+'元'}}          
          </div>-->
        </li>
        <li>
          <h3>适用范围</h3>
          <div
            v-if="infor.couponType=='CASH'"
            class="prodList"
          >
            {{ infor.applyScopeType?infor.applyScopeType==2?'全品类':'':'-' }}
            <div v-if="convention">
              <div
                v-for="(value) in curConvention"
                :key="value.title"
              >
                <span style="color:#999;">{{ value.title }}</span>
                <p>
                  <Tag
                    v-for="(item,index) in value['list']"
                    :key="index"
                    type="border"
                    color="primary"
                  >
                    {{ index>4?item.title+'等':item.title }}
                  </Tag>
                </p>
              </div>
            </div>
          </div>
          <div v-else>
            -
          </div>
        </li>
        <li>
          <h3>有效日期</h3>
          <div v-show="infor.useTimeType">
            <div>
              {{ infor.useTimeType==4?'不限时间':infor.useTimeType==1
                ?infor.startTime&&infor.endTime?$format(new Date(infor.startTime),'YYYY-MM-DD HH:mm:ss')+"--"+$format(new Date(infor.endTime),'YYYY-MM-DD HH:mm:ss'):"不限时间":infor.useTimeType==2
                  ?'领券当日起 '+(infor.useDays||1)+' 天内可用':'领券次日起'+(infor.useDays||1)+"天内可用" }}
            </div>              
          </div>
        </li>
      </ul>
    </div>
  </i-col>
</template>
<script>
export default {
  name: "CouponView",
  props: {
    infor: { type: Object },
    convention:[Object,String]
  },
  data(){
    return{
      amountTypeObj:{1:'元',2:'小时',3:'分钟'},
      initDesc:'<ul><li>优惠券名称</li><li>优惠内容</li><li>适用商品</li><li>有效日期</li></ul>'
    }
  },
  computed:{
    curConvention(){
      if(!this.convention){return null;}
      
      // 全程医疗
      if(this.infor.orgId == 13){
        return {departments:{title:'部门',list:this.convention['departments'].filter(item=>item.children)}}
      }else{
        let iObj = {
          brands:{title:'品牌',list:this.convention['brands']['checked'].filter(item=>!item.parentId).filter((item,index)=>index<4)},
          departments:{title:'部门',list:this.convention['departments']['checked'].filter(item=>!item.parentId).filter((item,index)=>index<4)},
          categories:{title:'品类',list:this.convention['categories']['checked'].filter(item=>!item.parentId).filter((item,index)=>index<4)},
        };
        return iObj
      }
    }
  }
};
</script>

