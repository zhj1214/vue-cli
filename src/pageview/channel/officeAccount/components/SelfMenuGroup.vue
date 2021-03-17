<!--
 * @Description: 菜单组合
 * @Author: sam.xutao
 * @Date: 2020-06-22 15:57:14
 * @LastEditTime: 2020-07-13 11:07:21
 * @LastEditors: sam.xutao
-->
<template>
  <div class="menu-view-item">
    <!-- 有子菜单的情况 -->
    <!-- <p>{{(activeKey.includes(menu.key)||!isEdit)&&offset.width}}</p> -->
    <!-- <Poptip trigger="click" v-if="children&&children.length" width="90" ref="menuPoptip" > -->
    <div v-if="children&&children.length">
      <MenuChild
        v-if="(activeKey.includes(menu.buttonId)||!isEdit)&&offset.width"
        :key="Math.random()+'parent'"
        :menu-list="children||[]"
        :offset="offset"
        :menu-width="90"
      >
        <template slot="content">
          <div
            v-for="item in children"
            :key="item.buttonId"
            :class="['pop-menu-item',{'isActive':isEdit&&activeKey===item.buttonId}]"
            @click="menuClick(item)"
          >
            {{ item.name }}
          </div>
          <div
            v-if="children.length<5&&isEdit"
            class="pop-menu-item menu-plus"
            @click="addMenu"
          >
            <Icon type="md-add" />
          </div>
        </template>
      </MenuChild>
      <span
        :class="{isActive:isEdit&&activeKey===menu.buttonId}"
        @click="e=>menuClick(menu,e)"
      ><Icon type="ios-menu" />{{ menu.name }}</span>
    </div>

    <!-- </Poptip> -->
    <!-- 没有子菜单的情况 -->
    <div v-else-if="isEdit">
      <MenuChild
        v-if="activeKey===menu.buttonId&&offset.width"
        :key="Math.random()+'child'"
        :menu-list="children||[]"
        :offset="offset"
        :menu-width="90"
      >
        <template slot="content">
          <div
            class="pop-menu-item menu-plus"
            @click="addMenu"
          >
            <Icon type="md-add" />
          </div>
        </template>
      </MenuChild>
      <span
        :class="activeKey===menu.buttonId?'isActive':null"
        @click="e=>menuClick(menu,e)"
      >{{ menu.name }}</span>
    </div>
    <div v-else>
      <span @click="e=>menuClick(menu,e)">{{ menu.name }}</span>
    </div>
  </div>
</template>

<script>
  import MenuChild from './MenuChild.vue';
  export default {
    components: {
      MenuChild,
    },
    props: {
      menu: {type: Object,required:true},   // 菜单内容，可能是一级也可能两级
      activeKey:{type:[String,Number]},              // 当前激活的菜单项
      isEdit:{type:Boolean},               // 是否为编辑态
    },
    data() {
      return {
        children: this.menu.subButton || {},    // 获取子菜单
        offset:{
          left:0,width:0,bottom:80
        },
        // menuVisible:this.activeKey.includes(this.menu.key) // 当前激活的菜单
      }
    },
    watch: {
      'menu':{
        handler: function (newVal) {
          this.children = newVal.subButton || {}
        },
        deep: true
      },
    },
    mounted () {
    },
    methods: {
      // 点击记录菜单项
      menuClick(imenu,e) {
        let allMenus = document.querySelectorAll(".child-menu");
        if(allMenus){
          let childMenus = Array.from(allMenus);
          childMenus.map(item=>{
            item.style.display = "none"
          })
          !this.isEdit && this.$set(this.offset,'width',0)
        }
        this.$nextTick(()=>{
          if(e){
            console.log(imenu,e.target);
            let iParent = e.target;
            this.offset.width = iParent.offsetWidth;
            this.offset.left = iParent.offsetLeft+Math.floor((iParent.offsetWidth-90)/2);
          }
        })
        // 如果是预览，不用记录菜单项
        if(!this.isEdit){
          // 一级菜单，不用做任何操作，直接返回
          if(imenu.subButton&&imenu.subButton.length){
            return false;
          }else{
            let iType = imenu.type;
            // 如果是跳转网页，则打开新标签页；否则小程序直接返回，不做操作
            if(iType == 'view' && imenu.url){
              window.open(imenu.url,'_blank')
            }else{
              return false;
            }
          }
        }else{
          this.$emit('getCurMenu',imenu)
        }
      },
      // 添加新的菜单项
      addMenu(){
        this.$emit("addChildMenu",this.menu.buttonId)
      }
    },
  }
</script>
<style lang="scss">
  .menu-view-item {
    .ivu-poptip-popper{min-width:90px;
      .ivu-poptip-body{
         padding:8px 0;
      }
    }
    .ivu-poptip,.ivu-poptip-rel{width:100%;}
  }
</style>
<style lang="scss" scoped>
  .menu-view-item{
    height: 44px;
    border-left:solid 1px #EFEFEF;
    line-height: 44px;cursor: pointer;
    // &:active,&:hover{color:#756CEA; }
    .pop-menu-item{
      height: 44px; width: 90%; margin:0 auto; overflow: hidden;
      white-space: nowrap; text-overflow: ellipsis;
      line-height: 44px; font-size: 14px; color:#444;
      &:not(:last-child){border-bottom: solid 1px #EFEFEF;}
      &:hover{color: #756CEA;}
      i{font-size: 16px;}
    }
    span{
      width: 100%;display: inline-block; font-size: 14px; color:#444;
      max-width: 120px; white-space: nowrap; text-overflow: ellipsis;

      i{margin-right: 4px;}
      &:hover{color:#756CEA;}
    }
    div.isActive,span.isActive{border:solid 1px #756CEA !important; color:#756CEA;}
  }
</style>
