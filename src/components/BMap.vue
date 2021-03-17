<!--
 * @Description: 地图控件【默认加载给定区域地图，选点时如超出区域，弹窗提示】
 * @Author: sam.xutao
 * @Date: 2020-03-12 16:45:09
 * @LastEditTime: 2021-03-15 19:27:37
 * @LastEditors: zhj1214
 *
 * @Props geoLocation {String}  非必填  省市区信息，中文字符串描述
 * @Props address {String}  非必填  详细地址描述信息
 * @Props mapWidth {String}  必填  地图区域宽度，需带上单位 px 或 %
 * @Props mapHeight {String}  必填  地图区域宽度，需带上单位 px 或 %
 *
 * @Function getPointAddress(add:String,point:Object)  返回地图选点具体信息，外部组件可获取  add:详细地址描述信息，point: {lng: 120.053259, lat: 30.166957}
 * @Function reportError(error:Object)  返回地图错误信息，error:{point,message}

 * @Example  基本用法示例
 *  import PowerMap from './Map.vue'
 *  <PowerMap @getPointAddress="getAddress" @reportError="getError"  :geoLocation="geo" :address="detail" mapWidth="800px" mapHeight="600px" />
 -->
<template>
  <div>
    <div
      id="container"
      :style="{width:mapWidth,height:mapHeight}"
    />
  </div>
</template>
<script>
export default {
  name:"PowerMap",
  props:{
    geoLocation:{type:String,default:"浙江省杭州市西湖区"},    // 省市区信息
    address:{type:String,required:''},         // 详细地址描述
    mapWidth:{type:String,required:true},   // 地图区域宽
    mapHeight:{type:String,required:true},  // 地图区域高
  },
  data(){
    return {
      center:[116.331398,39.897445],
      zoom:16,isFirst:true,timer:null,
      map:null,curPolygon:null,
      city:"",    // 当前行政区域对应的城市信息，用于详情地址检索，可为空
      // 选点弹窗信息
      opts:{
        width:200,height:80,
        title:"地址信息",
      },
      localPoint:null,
      curBounds:null,
      // 错误信息弹窗
      lastInfoBox:null,infoOpts:{
        align:0,
        closeIconUrl:"https://img.icons8.com/color/2x/close-window.png",
        boxStyle:{
          opacity: "0.8",
          background: "#333333",
          width:"268px",
          height: "80px"
        },closeIconMargin: "1px 1px 0 0",
        enableAutoPan: true
      }
    }
  },
  watch:{
    geoLocation(){
      this.getBoundary()
    },
    address(nval){
        // this.drawWithAddress()
      if(this.isFirst && nval){
        this.isFirst = false
        this.drawWithAddress()
      }
    }
  },
  mounted(){
    // 百度地图API功能
    let map = new window.BMap.Map("container");
    var point = new window.BMap.Point(this.center[0],this.center[1]);
    map.centerAndZoom(point,this.zoom);
    map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
	  map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用
    this.map = map;

    this.$nextTick(()=>{
      // 获取浏览器地址
      this.getLocalPoint();
      // 根据行政区获取边界
      this.getBoundary();
      // 监听点击添加标注并定位到具体位置
      map.addEventListener("click", this.clickToPoint);
    })
  },
  destroyed(){
    // 地图组件卸载后清除所有标记信息
    this.map&&this.map.clearOverlays(); 
  },
  methods:{
    // 根据点或标记绘制弹窗信息
    drawInfoBox(pointOrmark,cont){
      // console.log(pointOrmark instanceof window.BMap.Point)
      if(this.timer){clearTimeout(this.timer)}
      let curPoint = new window.BMap.Marker(pointOrmark); //pointOrmark|| 
      if(!pointOrmark){
        curPoint = new window.BMap.Point(this.center[0],this.center[1])
      }
      var html = `<div class='infoBoxContent '><h3>信息提示</h3><p>${cont}</p></div>`;
      let infoBox = new window.BMapLib.InfoBox(this.map,html,this.infoOpts);

      if(this.lastInfoBox){ this.lastInfoBox.close(); }
      this.map.clearOverlays(); 
      this.lastInfoBox = infoBox;
      infoBox.open(curPoint);
      // 报错信息后回到原来行政区划定位置
      // this.timer = setTimeout(()=>{
      //   this.getBoundary()
      // },1500);
      // 回传错误信息
      this.$emit("reportError",{
        point:pointOrmark,
        message:cont
      })
    },
    // 获取本地地址
    getLocalPoint(){
      var geolocation = new window.BMap.Geolocation();
      let t=this;
      geolocation.getCurrentPosition(function(r){
        if(this.getStatus() == 0){
          let mk = new window.BMap.Marker(r.point);
          t.drawMark(mk)
          t.drawPoint(r.point);
          t.localPoint=r.point;
        }
        else {
          alert('获取定位信息失败：'+this.getStatus());
        } 
      });       
    },
    // 根据外部传入地址实际选点，选点前先判定是否在规定区域
    drawWithAddress(){
      // 创建地址解析器实例
      let myGeo = new window.BMap.Geocoder(),t=this;
      // 将地址解析结果显示在地图上,并调整地图视野
      myGeo.getPoint(this.geoLocation+this.address, function(point){ //
        // 判定解析出来的点是否在指定行政区域内
        if (point) {
          let cpoint = new window.BMap.Point(point.lng,point.lat)
          if(t.isInsidePolygon(cpoint,t.curPolygon)){
            t.map.clearOverlays();        //清除地图覆盖物
            t.map.centerAndZoom(cpoint, t.zoom);
            let iMark = new window.BMap.Marker(cpoint);
            t.map.addOverlay(iMark);

            // 为mark标记添加信息弹窗
            // t.addWindow2mark(t.address,cpoint)
            t.getDetailMsg(cpoint,t.addWindow2mark)
          }else{
            t.drawInfoBox(cpoint,"所填写的地址不在选定区域，请重新填写")
            return false;
          }
        }else{
          t.drawInfoBox(t.localPoint,"您选择的地址没有解析到结果")
          return false;
        }
      });
    },
    // 为某个具体的 mark 标记添加信息弹窗
    addWindow2mark(cont,point){
      let infoWindow = new window.BMap.InfoWindow(cont,this.opts);  // 创建信息窗口对象 
      this.map.openInfoWindow(infoWindow,point)
    },
    // 根据行政区框定地图区域
    getBoundary(){       
      var bdary = new window.BMap.Boundary(),t=this;
      bdary.get(this.geoLocation, function(rs){       //获取行政区域
        t.map.clearOverlays();        //清除地图覆盖物       
        var count = rs.boundaries.length; //行政区域的点有多少个
        if (count === 0) {
          // t.drawInfoBox(t.localPoint,"请设置具体行政区域");
          // t.localPoint && t.drawPoint(t.localPoint)
          return ;
        }
        var pointArray = [];
        for (var i = 0; i < count; i++) {
          var ply = new window.BMap.Polygon(rs.boundaries[i], {strokeWeight: 1, strokeColor: "#ff0000"}); //建立多边形覆盖物
          t.map.addOverlay(ply);  //添加覆盖物
          t.curPolygon = ply
          pointArray = pointArray.concat(ply.getPath());
        }    
        t.map.setViewport(pointArray);    //调整视野  
        t.curBounds =  t.map.getBounds() 
        t.address && t.drawWithAddress()
        // t.setBounds()     //设置可选区域
        // if(t.isFirst && t.address){
        //   t.isFirst = false
        //   t.drawWithAddress()
        // }
      });   
    },
    // 根据行政区域边界限定可视区域
    setBounds(){  
      let start = this.curBounds.yl,end = this.curBounds.Pl;
      var b = new window.BMap.Bounds(new window.BMap.Point(start.lng,start.lat),new window.BMap.Point(end.lng,end.lat));
      try {   
        window.BMapLib.AreaRestriction.setBounds(this.map, b);
      } catch (e) {
        alert(e);
      }
    },
    // 点击获取位置信息
    clickToPoint(location){
      // 判定点选的点是否在选定区域内
      let isInPolygon = this.isInsidePolygon(location.point,this.curPolygon);
      if(!isInPolygon){
        this.drawInfoBox(location.point,"所标注的点超出选定区域，请重新选择")
        return false;
      }
      this.map.clearOverlays()
      let mk = new window.BMap.Marker(location.point);    
      this.drawMark(mk);    // 绘制mark标签
      this.drawPoint(location.point);
      
      // 根据编码获取详细地址，外部可获取
      this.getDetailMsg(location.point,this.addWindow2mark);
    },
    // 根据选点返回具体的地址详情，外部组件可获取
    getDetailMsg(point,fn){
      let geoc = new window.BMap.Geocoder(),t=this; 
      geoc.getLocation(point, function(rs){
        var addComp = rs.addressComponents;
        console.log(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
        t.$emit("getPointAddress",rs.address,point)
        // 如果存在外部方法，即为给mark标记添加弹窗信息
        fn&&fn(rs.address,point)
      })    
    },
    // 绘制标注
    drawMark(mk){this.map.addOverlay(mk)},
    // 绘制地图点
    drawPoint(point){
      this.map.panTo(point);
    },
    // 判定一个点是否在区域内
    isInsidePolygon(point, polygon){  
      if(!(point instanceof window.BMap.Point) || !(polygon instanceof window.BMap.Polygon)){
          return false;
      }
      var polygonBounds = polygon.getBounds();
      if(!polygonBounds.containsPoint(point)){
          return false;
      }
      var pts = polygon.getPath();
          
      var N = pts.length;
      var boundOrVertex = true; 
      var intersectCount = 0;
      var precision = 2e-10; 
      var p1, p2;//neighbour bound vertices
      var p = point; 
        
      p1 = pts[0];//left vertex        
      for(var i = 1; i <= N; ++i)  {            
          if(p.equals(p1))
          {
              return boundOrVertex;  //p is an vertex
          }            
          p2 = pts[i % N];//right vertex            
          if(p.lat < Math.min(p1.lat, p2.lat) || p.lat > Math.max(p1.lat, p2.lat)) //ray is outside of our interests 
          {               
              p1 = p2; 
              continue;//next ray left point
          }
              
          if(p.lat > Math.min(p1.lat, p2.lat) && p.lat < Math.max(p1.lat, p2.lat)){
              if(p.lng <= Math.max(p1.lng, p2.lng))
              {                  
                  if(p1.lat == p2.lat && p.lng >= Math.min(p1.lng, p2.lng))
                  {
                      return boundOrVertex;
                  }
                    
                  if(p1.lng == p2.lng)
                  {                      
                      if(p1.lng == p.lng)
                      {
                          return boundOrVertex;
                      }
                      else
                      {
                            ++intersectCount;
                      } 
                  }
                  else
                  {                      
                      var xinters = (p.lat - p1.lat) * (p2.lng - p1.lng) / (p2.lat - p1.lat) + p1.lng;                 
                      if(Math.abs(p.lng - xinters) < precision)
                      {
                          return boundOrVertex;
                      }
                              
                      if(p.lng < xinters)
                      {
                          ++intersectCount;
                      } 
                  }
              }
          } else{             
              if(p.lat == p2.lat && p.lng <= p2.lng)
              {            
                  var p3 = pts[(i+1) % N]; //next vertex                    
                  if(p.lat >= Math.min(p1.lat, p3.lat) && p.lat <= Math.max(p1.lat, p3.lat))
                  {
                      ++intersectCount;
                  }
                  else
                  {
                      intersectCount += 2;
                  }
              }
          }            
          p1 = p2;//next ray left point
      }
      if(intersectCount % 2 == 0){
        return false;
      }else { 
        return true;
      }     
    } 
  }
}
</script>
<style lang="scss">
  .infoBoxContent{
    margin:15px; color:#fff;
  }
  .infoBox{
    border-radius: 10px;
    img{width:20px; height:20px;}
  } 
</style>
