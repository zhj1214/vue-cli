<!--
 * @Description: 指定区域设置
 * @Author: sam.xutao
 * @Date: 2020-03-19 15:17:56
 * @LastEditTime: 2020-04-13 15:43:32
 * @LastEditors: sam.xutao
 -->
 <style lang="scss" scoped>
   .city-box{
     display: flex;
     h3{height: 40px; line-height: 40px;background: #F0F4FA;text-indent: 1em;}
     ul{
       max-height: 400px; overflow: hidden;
       overflow-y: auto; width: 260px;
       li{
         height:36px; line-height: 36px;cursor: pointer; text-indent: 0.5em;
         label{display: inline-block; width:72%;}
         &:hover{background: rgba(255, 140, 8,0.2);}
         >i{display: inline-block; height: 12px; width: 12px; border: solid 1px #756CEA;}
       }
       li.isActived{
        //  &:hover{background: #756CEA;}
         background: rgba(255, 140, 8,0.2);
         position: relative;
         &::before{
           content:"";display: inline-block;width:4px; height: 100%; position: absolute;
           background: rgb(255, 140, 8); left:0;top:0;
         }
        }
       li.isDisable{
         background: #ccc !important;
       }
     }
     i.area-checkbox-icon{
       display: inline-block; width:12px; height: 12px; border:solid 2px #756CEA;
     }
   }
 </style>
 <style lang="scss">
   .city-box{
     .ivu-icon{font-size: 20px;}
     .ivu-icon-md-checkbox{color:#756CEA}
     .ivu-checkbox-group{
       display: flex; flex-direction: column;
       max-height: 400px; overflow: hidden;
       overflow-y: auto; width: 240px;
       label{
         height:36px; line-height: 36px;cursor: pointer;
         padding:0 5px;
        //  &:hover{background: rgba(0,0,0,0.2);}
         span{float: right;margin-top:5px;}
       }
      //  label.isActived{background: #756CEA;color:#fff}
     }
   }
 </style>
<template>
  <div>
    <section class="city-box">
      <aside>
        <h3>省份</h3>
        <ul>
          <li
            v-for="item in provinces"
            :key="item.id+Math.random()"
            :class="{'isActived':item.id.substr(0,2)==curProvince,'isDisable':disableProvince.includes(item.id)}"
            @click="toggleProvince(item.id)"
          >
            <span @click.stop="disableProvince.includes(item.id)?null:checkItem(item,'province')">
              <!-- <Icon type="ios-medical" v-if="hasMinateArr(item.id)&&!provinceChoices.includes(item.id)"/> -->
              <span
                v-if="hasMinateArr(item.id)&&!provinceChoices.includes(item.id)"
                class="ivu-checkbox-indeterminate"
                style="margin-left:9px;vertical-align:middle;"
              >
                <span class="ivu-checkbox-inner" />
              </span>
              <Icon
                v-else-if="provinceChoices.includes(item.id)"
                type="md-checkbox"
              />
              <Icon
                v-else
                type="ios-square-outline"
              />
            </span>
            <label>{{ item.name }} </label>
            <span><Icon
              type="ios-arrow-forward"
              style="color:#ccc"
            /></span>
          </li>
        </ul>

        <!-- <CheckboxGroup v-model="provinceChoices">
          <Checkbox :label="item.id" v-for="item in provinces" :key="item.id+Math.random()"
            @click.native="toggleProvince(item.id)" :class="{'isActived':item.id.substr(0,2)==curProvince}">
            {{item.name}}
          </Checkbox>
        </CheckboxGroup> -->
      </aside>
      <aside>
        <h3>城市</h3>
        <ul>
          <li
            v-for="item in citys.filter(item=>item.id.substring(0,2)==curProvince)"
            :key="item.id+Math.random()"
            :class="{'isDisable':disableCity.includes(item.id)||disableProvince.includes(item.parent+'0000')}"
          >
            <span @click.stop="disableCity.includes(item.id)||disableProvince.includes(item.parent+'0000')?null:checkItem(item,'city')">
              <Icon
                v-if="cityChoices.includes(item.id)"
                type="md-checkbox"
              />
              <Icon
                v-else
                type="ios-square-outline"
              />
            </span>
            <label>{{ item.name }} </label>
          </li>
        </ul>
        <!-- <CheckboxGroup v-model="cityChoices" @on-change="cityChange" >
          <Checkbox :label="item.id" v-for="item in viewCity" :key="item.id+Math.random()"
            :class="{'isActived':cityChoices.includes(item.id)}" >
            {{item.name}}
          </Checkbox>
        </CheckboxGroup> -->
      </aside>
    </section>
    <div style="margin-top:20px; text-align:right;">
      <Button
        class="mr-10"
        @click="cancelCity"
      >
        取消
      </Button>
      <Button
        type="primary"
        :disabled="!provinceChoices.length&&!cityChoices.length"
        @click="confirmCity"
      >
        确定
      </Button>
    </div>
  </div>
</template>
<script>

export default {
  name:"CityManage",
  props:{
    disableArea:{type:Object,required:true},
    checked:{type:Object},
  },
  data(){
    return {
      provinces:[],provinceChoices:[],
      citys:[],cityChoices:[],
      curProvince:'',curCity:[],
    }
  },
  computed:{
    allData(){return this.$store.state.areaCity;},
    // 当前选中省份可视的城市列表
    viewCity(){
      let iCity = this.citys.filter(item=>item.id.substring(0,2)==this.curProvince);
      return iCity;
    },
    // 不可选的省份
    disableProvince(){
      // 过滤掉当前编辑的省份
      let checkedProvince = this.checked?this.checked.province.map(item=>item.id):[];

      let tempProvince = this.disableArea['province'].filter(item=>{
        if(!checkedProvince.includes(item.id)){
          return item;
        }
      })
      console.log(tempProvince)
      return tempProvince.map(item=>item.id)
    },
    // 不可选的城市
    disableCity(){
      // 过滤掉当前编辑的城市
      let checkedCity = this.checked?this.checked.city.map(item=>item.id):[];
      let tempCity = this.disableArea['city'].filter(item=>{
        if(!checkedCity.includes(item.id)){
          return item;
        }
      })
      console.log(tempCity)
      return tempCity.map(item=>item.id)
    }
  },
  watch:{
    provinceChoices(nval,oval){
      console.log(nval,oval)
    }
  },
  mounted(){
    console.log(this.$store.state)
    this.initData();
    if(this.checked){
      // 选中的省份
      this.provinceChoices = this.checked.province.map(item=>item.id)
      // 选中的城市
      let citys = this.checked.city.map(item=>item.id)
      // 以及选中省份中的所有城市
      let provinceCity = [];
      this.citys.filter(item=>{
        if(this.provinceChoices.includes(item.parent+'0000')){
          provinceCity.push(item.id);
        }
      })
      this.cityChoices = citys.concat(provinceCity)
    }
  },
  methods:{
    cancelCity(){
      this.$emit("handelSelectCity",this.checked)
    },
    confirmCity(){
      let province = this.provinces.filter(item=>this.provinceChoices.includes(item.id));
      let city = this.citys.filter(item=>this.cityChoices.includes(item.id)&&!this.provinceChoices.includes(item.parent+'0000'))
      console.log(province,'==',city)
      this.$emit('handelSelectCity',{province,city})
    },
    hasMinateArr(item){
      return this.cityChoices.filter(city=>city.substring(0,2)==item.substring(0,2)).length
    },
    toggleProvince(id){
      this.curProvince = id.substring(0,2);
    },
    // 点选省份或城市更新级联状态和选中数据
    checkItem(item,name){
      // 定位具体是哪个省份或城市
      let curList = this[name+'Choices'].slice(),index=-1;
      curList.filter((citem,cindex)=>{
        if(citem==item.id){
          index = cindex;
        }
      })
      // index不为-1说明之前是勾选
      if(index>-1){
        curList.splice(index,1);
        // 如果操作的是省份，则同步移除城市信息
        if(name=='province'){
          this.citys.map(city=>{
            if(city.parent === item.id.substring(0,2)){
              this.cityChoices.splice(this.cityChoices.indexOf(city.id),1)
            }
          })
        }else{
          // 如果操作的是城市，则同步移除省级选中信息
          let pIndex = -1;
          this.provinceChoices.filter((pitem,pindex)=>{
            if(pitem.substring(0,2)==item.id.substring(0,2)){
              pIndex = pindex
            }
          })
          pIndex>-1 && this.provinceChoices.splice(pIndex,1)
        }
      }else{
        let provinceHasDisableCity = false; // 如果当前勾选省份包含禁选的城市，则不允许将其加入已选省份 provinceChoices 中
        // 如果操作的是省份，则同步添加城市信息
        if(name=='province'){
          this.citys.map(city=>{
            // 当前城市所属省份为操作省份，并且它目前不在已选城市列表中，并且不在禁选城市列表中
            if(this.disableCity.includes(city.id)&&(city.parent+'0000')==item.id){provinceHasDisableCity=true;}
            if(city.parent == item.id.substring(0,2)&&!this.cityChoices.includes(city.id)&&!this.disableCity.includes(city.id)){
              this.cityChoices.push(city.id)
            }
          })
        }
        if(!provinceHasDisableCity){
          curList.push(item.id);
        }
        // 如果城市全选，则直接记录省级
        if(name=='city'){
          let allCity = this.citys.filter(city=>city.parent==item.parent);
          let curCity = curList.filter(mitem=>mitem.substring(0,2)==item.parent)
          console.log("all:",allCity,'current:',curCity)
          if(allCity.length == curCity.length){
            this.provinceChoices.push(item.parent+'0000')
          }
        }
      }
      this[name+'Choices'] = curList;
    },
    // 初始构建数据
    initData(){
      let iProvince = [],iCity = [];
      console.log(this.allData)
      for(var province in this.allData['provinceList']){
        if(province.substring(0,2)!=90)
          iProvince.push({id:province,name:this.allData['provinceList'][province*1],indeterminate:false})
      }
      for(var city in this.allData['cityList']){
        if(city.substring(0,1)!=9){
          // 针对直辖市，需到countyList拉取县郡数据
          let curProvince = city.substring(0,2);
          // 北京市-11、上海市-31、天津市-12、重庆市-50
          if(curProvince === '11'||curProvince === '12'||curProvince === '31'||curProvince === '50'){
            for(var county in this.allData['countyList']){
              if(county.substring(0,2)==curProvince){
                iCity.push({id:county,name:this.allData['countyList'][county*1],parent:county.substring(0,2)})
              }
            }
          }else{
            iCity.push({id:city,name:this.allData['cityList'][city*1],parent:city.substring(0,2)})
          }
        }
      }
      this.provinces = iProvince;
      this.citys = iCity;
    }
  }
}
</script>
