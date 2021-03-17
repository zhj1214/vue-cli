<!--
 * @Description: 公众号菜单手机端模拟
 * @Author: sam.xutao
 * @Date: 2020-06-22 14:22:25
 * @LastEditTime: 2020-07-09 09:34:11
 * @LastEditors: sam.xutao
-->
<template>
  <div>
    <div class="menu-view-content">
      <header>{{ accountName }}</header>
      <section>
        <!-- {{activeMenu}}
        <p>{{menuKey}}</p> -->
      </section>
    </div>
    <!-- 菜单操作栏 -->
    <footer class="menu-view-footer">
      <aside>
        <i class="icon iconfont iconKeyboard" />
      </aside>
      <!-- 排序时对应的子级菜单 -->
      <MenuChild
        v-if="canDrag&&draggableChild&&offset.width"
        :key="Math.random()+'child'"
        :drag="canDrag"
        :menu-list="activeMenu.subButton"
        :offset="offset"
      />

      <!-- 一级菜单排序 -->
      <CommDrag
        v-if="canDrag"
        child-clsname=".img-view-box"
        box-id="menuDragBox"
        class="menu-drag-box"
        @dragStop="dragStop"
      >
        <template slot="drag-items">
          <li
            v-for="(item) in menus"
            :key="item.buttonId"
            :data-key="item.buttonId"
            class="img-view-box menu-view-item"
            @click="e=>viewMenu(item,e)"
          >
            <!-- <MenuChild v-if="activeMenu.key==item.key&&draggableChild" :drag="canDrag" :menuList="activeMenu.subButton['list']" :offsetWidth="offsetWidth" /> -->
            <span style="width:100%; height:100%; display:inline-block"><Icon type="ios-menu" />{{ item.name }}</span>
            <!-- <SelfMenuGroup :menu="item" :activeKey="menuKey" @getCurMenu="getCurMenu" @addChildMenu="addChildMenu" :isEdit="isEdit"></SelfMenuGroup> -->
          </li>
        </template>
      </CommDrag>
      <!-- 非排序时内容 -->
      <div
        v-for="item in menus"
        v-else
        :key="item.buttonId"
      >
        <SelfMenuGroup
          :menu="item"
          :active-key="menuKey"
          :is-edit="isEdit"
          @getCurMenu="getCurMenu"
          @addChildMenu="addChildMenu"
        />
      </div>
      <!-- 最多三个一级菜单，三个或以上就不让再添加；当一个都没有时显示添加菜单文字 -->
      <div
        v-if="menus.length<3&&isEdit&&!canDrag"
        class="menu-item-plus"
        @click="addFirstMenu"
      >
        <Icon type="md-add" /><span v-if="!menus.length">添加菜单</span>
      </div>
      <hr>
    </footer>
  </div>
</template>

<script>
import SelfMenuGroup from "./SelfMenuGroup.vue";  // 菜单组
import CommDrag from "@/components/CommDrag";   // 通用拖拽组件
import MenuChild from './MenuChild.vue';

export default {
  components: {
    SelfMenuGroup,CommDrag,MenuChild
  },
  props: {
    activeMenu: {
      type: [Object,null],
    },
    menus:{type:Array},   // 菜单项
    menuKey:{type:[String,Number]},      // 激活的菜单键值
    isEdit:{type:Boolean},      // 是否为编辑状态
    canDrag:{type:Boolean},     // 是否拖拽排序
  },
  data() {
    return {
      accountName: "公众号名称",
      offset:{
        left:0,width:0,bottom:80
      }
    };
  },
  computed: {
    draggableChild() {
      return this.activeMenu&&this.activeMenu.subButton&&this.activeMenu.subButton.length
    }
  },
  methods: {
    // 获取点击的菜单项
    getCurMenu(imenu) {
      this.$parent.getCurMenu(imenu)
    },
    // 排序时，点击具体一级菜单时记录位置信息，用于显示二级菜单
    viewMenu(imenu,e){

      this.getCurMenu(imenu)
      let iParent = e.target.offsetParent;
      this.offset.width = iParent.offsetWidth;
      this.offset.left = iParent.offsetLeft;
      console.log(imenu,iParent)
    },
    // 一级菜单排序操作结束
    dragStop() {
      // 获取所有一级菜单数据，获取对应key值，并重新赋值给 baseMenu
      let lis = document.querySelectorAll("#menuDragBox li.menu-view-item");

      if (lis.length) {
        let listtomenu = Array.from(lis).map(item=>item.dataset.key);
        this.$parent.sortMenu(listtomenu)
        console.log('drag list',lis);
        this.offset.width = 0;
        this.offset.left = 0;
        // this.refuseForm.imgList = Array.from(imgs).map(item => [item.src]);
      }
    },
    // 二级菜单排序操作结束
    sortChildMenu(pKey,childs){
      let iMenus = this.menus.slice();
      let parentMenu = null,parentIndex=-1,resChild=[];
      // 获取父级菜单
      iMenus.map((item,index)=>{
        if(item.buttonId==pKey){
          parentMenu = item;
          parentIndex = index;
        }
      });
      // 替换父菜单的子菜单
      if(parentMenu){
        let childMenus = parentMenu.subButton
        childs.map(ckey=>{
          let cMenu = childMenus.filter(menu=>menu.buttonId==ckey);
          resChild = resChild.concat(cMenu[0])
        });
        parentMenu.subButton = resChild;
        iMenus.splice(parentIndex,1,parentMenu);
      }
      this.$parent.sortMenu(iMenus.map(item=>item.buttonId))
      console.log(resChild,iMenus)
      // this.$parent.sortMenu(pKey,childs);
    },
    addFirstMenu(){
      this.$parent.addFirstMenu()
      // let menuList = this.baseMenu.slice();
      // let iMenu = {
      //     "name":"菜单名称",
      //     "subButton":{list:[]}
      // };
      // menuList.push(iMenu);
      // this.baseMenu = menuList;
    },
    // 添加新的子级菜单，只会基于第一层
    addChildMenu(pkey){
      this.$parent.addChildMenu(pkey)
      // let menuList = this.baseMenu.slice();
      // let curIndex = -1,curMenu = menuList.filter((item,index)=>{
      //   if(item.key===pkey){
      //     curIndex = index;
      //     return item;
      //   }
      // });
      // if(curIndex>-1){
      //   // 父级菜单可能已经有二级菜单
      //   curMenu[0]['subButton'] = curMenu[0]['subButton'] || {list:[]};
      //   curMenu[0]['subButton'].list = [
      //     ...curMenu[0]['subButton'].list,
      //     {name:'菜单名称'}
      //   ]

      //   menuList.splice(curIndex,1,curMenu[0])
      //   this.baseMenu = menuList;
      // }
    }
  },
};
</script>
<style lang="scss">

.menu-drag-box{
  .draggable-box{
    display: flex;
    li{box-shadow: none;height: 48px;margin:2px;overflow: visible;}
    li:focus{outline: none;}
  }
}
</style>
<style lang="scss" scoped>
.menu-view-content {
  background: url(../../../../assets/images/channel/Top.png) no-repeat
    top #ededed;
  background-size: 112% 85px;
  width: 100%;
  height: 100%;
  position: relative;
  header {
    text-align: center;
    height: 80px;
    padding-top: 50px;
    font-weight: bold;
  }
  >section{
    margin-top:10px;
    min-height: 400px;
    max-height: 80%;
  }
}
.menu-view-footer {
  display: flex;
  height: 70px;
  position: absolute; text-align: center;
  bottom: 0;left: 0;
  width: 100%; justify-content: space-between;
  background: #F7F7F7;
  >aside{width:48px;}
  >div{flex:1; i{font-size: 16px;}}
  hr{
    border:none; height: 4px; background: #000;
    width: 130px; position: absolute; left:50%; bottom: 6px;
    margin-left:-65px; border-radius: 30%;
  }
}
.menu-item-plus{
  height: 48px;
  border-left: solid 1px #EFEFEF;
  line-height: 48px;
  cursor: pointer;
  &:active,&:hover{color:#756CEA; }
}
</style>
