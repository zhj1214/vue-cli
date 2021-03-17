<!--
 * @Description: 自定义菜单
 * @Author: sam.xutao
 * @Date: 2020-06-18 11:12:34
 * @LastEditTime: 2020-07-13 17:02:42
 * @LastEditors: sam.xutao
-->
<template>
  <div>
    <section
      v-if="authData.verifyTypeInfo===-1"
      class="menu-manage padding-box"
      style="text-align:center"
    >
      <p class="no-menu">
        自定义菜单仅对已认证公众号开放，请前往<a
          href="https://mp.weixin.qq.com"
          target="_blank"
        >“微信公众号设置”</a>进行认证
      </p>
    </section>
    <section v-else>
      <!-- 为null 则没有自定义菜单 0关闭 1开启 -->
      <header
        v-if="isOpen !== null"
        class="selfmenu-title"
      >
        <span><Icon type="ios-information-circle-outline" /> <label>当前自定义菜单</label>  {{ isOpen?'已启用':'已停用' }}</span>
        <Poptip
          v-if="isOpen"
          confirm
          transfer
          placement="top-end"
          popper-class="confirm-pop"
          width="220"
          title="关闭自定义菜单之后， 将在24小时内对所有用户生效。 是否确认关闭？"
          @on-ok="toggleUse"
        >
          <span style="cursor:pointer">停用</span>
        </Poptip>
        <Poptip
          v-else
          confirm
          transfer
          placement="top-end"
          popper-class="confirm-pop"
          width="220"
          title="启用自定义菜单后将对所有用户可见"
          @on-ok="toggleUse"
        >
          <span style="cursor:pointer">启用</span>
        </Poptip>
      </header>
      <section class="padding-box ">
        <!-- <p>{{menuKey}}</p> -->
        <!-- isOpen 为 null 只是不显示开始关闭菜单信息，但可以编辑菜单 -->
        <div v-if="isOpen!=0">
          <div class="selfmenu-box">
            <MenuView
              class="menu-view"
              :active-menu="curMenu"
              :menus="menus"
              :menu-key="menuKey"
              :is-edit="true"
              :can-drag="menuDraggable"
            />
            <article class="menu-manage">
              <!-- 未选中菜单获取进行排序时不显示菜单管理内容 -->
              <MenuManage
                v-if="curMenu&&!menuDraggable"
                :active-menu="curMenu"
                @removeMenu="removeMenu"
                @menuChange="menuChange"
              />
              <p
                v-else
                class="no-menu"
              >
                点击左侧菜单进行编辑操作
              </p>
            </article>
          </div>
          <footer
            v-if="menus.length>0"
            class="selfmenu-footer"
          >
            <Button
              :disabled="!draggable"
              :type="menuDraggable?'primary':'default'"
              @click="openSort"
            >
              {{ menuDraggable?'完成排序':'菜单排序' }}
            </Button>
            <p v-if="!menuDraggable">
              <Button
                style="margin-right:10px;"
                @click="preVisible=true;"
              >
                预览
              </Button>
              <Button
                type="primary"
                :loading="saveLoading"
                @click="saveMenu"
              >
                提交并发布
              </Button>
            </p>
          </footer>
        </div>
        <section v-else>
          <p style="text-align:center;">
            请开启自定义菜单后编辑
          </p>
        </section>
      </section>
    </section>

    <Modal
      v-model="preVisible"
      footer-hide
      class-name="selfmenu-box menuview-box"
      width="385px"
      :closable="false"
    >
      <MenuView
        v-if="preVisible"
        class="menu-view"
        :active-menu="curMenu"
        :menus="menus"
        :menu-key="menuKey"
      />
    </Modal>
  </div>
</template>

<script>
import MenuView from './components/MenuView.vue';
import MenuManage from './components/MenuManage.vue';
import menuMixins from './menuMixins';

export default {
  components: {
    MenuView,MenuManage
  },
  mixins: [menuMixins],
  props: {
    authData: Object,
  },
  data() {
    return {
      preVisible:false, // 预览弹窗显隐值
      isOpen: null,      // 是否启用自定义菜单
      menuDraggable:false,    // 菜单排序标识
      saveLoading:false,    // 保存按钮 loading 状态
    }
  },
  computed: {
    draggable() {
      return this.menus.length>1 || (this.menus.length&&this.menus[0].subButton&&this.menus[0].subButton.length>1)
    }
  },
  mounted () {
    // 校验是否启用自定义菜单
    this.checkMenuable();
  },
  methods: {
    // 停启用自定义菜单
    async toggleUse() {
      const {code} = await this.$ajaxPost(this.api.TOGGLE_OPEN_MENU,{status:this.isOpen?0:1});
      if(code && code === 10000){
        this.$Message.success("自定义菜单已"+(this.isOpen?'关闭':'开启'));
        this.checkMenuable();
      }
    },
    // 开启菜单排序
    openSort(){this.menuDraggable = !this.menuDraggable;},
    // 排序菜单,menus 为键值buttonId数组
    sortMenu(menus){
      let iMenus = this.baseMenu.slice(),resMenu=[];
      menus.map(item=>{
        let cMenu = iMenus.filter(menu=>menu.buttonId==item);
        resMenu = resMenu.concat(cMenu[0])
      })
      console.log('==菜单结果==',resMenu)
      this.baseMenu = resMenu;
    },
    // 删除菜单
    removeMenu(key){
      key = key+'';
      let keyArr = key.split("-"),allMenu = this.baseMenu.slice();
      // 先获取一级菜单
      let firstMenu = null,firstIndex = -1;
      allMenu.filter((item,index)=>{
        if(item.buttonId==keyArr[0]){
          firstMenu = item;
          firstIndex = index;
        }
      });
      if(key.match("-")&&firstMenu){
        // 如果 key 值包含 - ，则表示是二级菜单
        let secondList = firstMenu['subButton'];
        let secondIndex = -1;
        // 从二级菜单中找到当前操作项
        secondList.filter((item,index)=>{
          if(item.buttonId == key){
            secondIndex = index;
          }
        });
        // 将该二级菜单移除
        secondList.splice(secondIndex,1);
        // 重新赋值一级菜单
        firstMenu['subButton'] = secondList;
        allMenu.splice(firstIndex,1,firstMenu);
      }else if(firstIndex>-1){
        // 一级菜单的话直接找到并删除
        allMenu.splice(firstIndex,1);
        this.baseMenu = allMenu;
      }
      this.curMenu = null;

      let allMenus = document.querySelectorAll(".child-menu");
      if(allMenus){
        let childMenus = Array.from(allMenus);
        childMenus.map(item=>{
          item.style.display = "none"
        })
      }
    },
    // 校验是否开启自定义菜单
    async checkMenuable(){
      const {data} = await this.$ajaxGet(this.api.CHECK_SELF_MENU,{orgId:localStorage.orgId});
      if(data!=null){
        // 为null 则没有自定义菜单 0关闭 1开启
        this.isOpen = data;
        // 如果开启了自定义菜单，则拉取菜单数据
        this.loadMenuList();
      }
    },
    // 保存菜单
    async saveMenu(){
      // 校验所有菜单是否都填写好必选字段
      let isAllValid = this.checkAllMenu();

      if(isAllValid){
        let iMenus = this.renderSaveMenu();
        this.saveLoading = true;
        console.log(JSON.parse(JSON.stringify(iMenus)).map(item=>{
          // delete item.buttonId;
          return item;
        }))
        const {code,data} = await this.$ajaxPost(this.api.SAVE_MENU_LIST,{button:JSON.parse(JSON.stringify(iMenus))});

        if(code && code === 10000 && data){
          if(data ==1 ){
            this.$Message.success({
              content:"操作成功",
              onClose:()=>{window.location.reload()}
            });
            // this.checkMenuable();
          }else{
            this.$Modal.error({
              title: '提示',
              content: '微信公众号仅支持跳转已关联的小程序，请先关联要跳转的小程序。',
              // onOk: ()=>{this.loadMenuList()}
            });
            this.saveLoading = false;
          }
        }else{
          window.location.reload();
        }
      }
    },
    // 保存菜单时需将菜单 buttonId值和一些结构移除
    renderSaveMenu(){
      let allMenus = this.baseMenu.slice();
      return allMenus.map(item=>{
        // 保存菜单时需将 buttonId 值移除
        // delete item.buttonId;
        // 如果一级菜单没有子级菜单项，同时删除 subButton
        if(item.subButton&&!item.subButton.length){
          delete item.subButton;
        }
        // 如果有子级菜单，同样移除 buttonId 值
        if(item.subButton&&item.subButton.length){
          delete item.type;
          item.subButton = item.subButton.map(menu=>{
            // delete menu.buttonId;
            return menu;
          })
        }
        return item;
      })
    },
    // 获取点击的菜单项
    getCurMenu(imenu) {
      this.curMenu =  imenu;
    },
    // 菜单内容变更同步到主数据
    menuChange(menu){
      let keys = menu.buttonId.split("-");
      let menuList = this.baseMenu.slice();

      // 如果keys数组长度超过一项，说明改变的是子菜单
      if(keys.length>1){
        this.baseMenu = menuList.map(item=>{
          if(item.buttonId === keys[0]){
            item.subButton = item.subButton.map(citem=>{
              if(citem.buttonId===menu.buttonId){
                citem = menu;
              }
              return citem;
            })
            // item = menu;
          }
          return item;
        })
      }else{
        // 否则说明变更的是一级菜单，直接修改
        this.baseMenu = menuList.map(item=>{
          if(item.buttonId === keys[0]){
            item = menu;
          }
          return item;
        })
      }
    },
    // 添加一级菜单
    addFirstMenu(){
      let menuList = this.baseMenu.slice();
      let iMenu = {
          "name":"菜单名称",type:'view',
          "subButton":[],buttonId:Math.random()+''
      };
      menuList.push(iMenu);
      this.baseMenu = menuList;
      // 添加完成后指向新菜单
      this.$nextTick(()=>{
        this.curMenu = iMenu;
      })
    },
    // 添加新的子级菜单，只会基于第一层
    addChildMenu(pkey){
      let menuList = this.baseMenu.slice();
      // 获取第一层级菜单
      let curIndex = -1,curMenu = menuList.filter((item,index)=>{
        if(item.buttonId===pkey){
          curIndex = index;
          return item;
        }
      });
      if(curIndex>-1){
        // 父级菜单可能已经有二级菜单
        curMenu[0] = {
          buttonId:curMenu[0].buttonId,
          name:curMenu[0].name,type:curMenu[0].type,
          subButton:curMenu[0]['subButton'] || []
        }
        let childMenu = {name:'菜单名称',type:'view',buttonId:curMenu[0].buttonId+"-"+Math.random()};
        // curMenu[0]['subButton'] = curMenu[0]['subButton'] || {list:[]};
        curMenu[0]['subButton'] = [
          ...curMenu[0]['subButton'],
          {...childMenu}
        ]

        menuList.splice(curIndex,1,curMenu[0])
        this.baseMenu = menuList;
        // 添加完成后指向新菜单
        this.$nextTick(()=>{
          this.curMenu = childMenu;
        })
      }
    }
  },
}
</script>
<style lang="scss">
  .menuview-box{
    .ivu-modal-body{padding:0;}
  }
  .confirm-pop{
    .ivu-poptip-body {
      .ivu-icon{
        &::before{content: "";}
        background: url(../../../assets/images/channel/warn-icon.png) center no-repeat;
        width:16px; height: 16px; display: inline-block;
        margin-top:3px; margin-left: -3px;
      }
      .ivu-poptip-body-message{text-align: left;}
    }
  }
</style>
<style lang="scss" scoped>
  .selfmenu-title{
    display: flex; justify-content: space-between;
    height:48px; align-items:center;
    background:rgba(253,246,237,1);
    border-radius:4px; padding:12px 16px;
    border:1px solid rgba(240,146,55,1);
    margin-bottom: 24px;
    span{
      font-size:14px;
      font-family:SFUIDisplay-Light,SFUIDisplay;
      font-weight:300;
      color:#756CEA;
      .ivu-icon{font-size: 16px; margin-right:8px; font-weight: bold;}
      label{color:#171725;}
    }
  }
  .selfmenu-box{
    display: flex; justify-content: space-between;
    >div{min-height: 688px;}
    .menu-view{
      width:385px; background:#EDEDED;min-height: 688px;
      border-radius: 16px; padding:12px;
      position: relative; overflow: hidden;
    }
    .menu-manage{
      flex:1; margin-left: 30px;
      background: #FAFAFB;
      border-radius: 8px;
      padding:24px;
      .no-menu{
        text-align: center;
        margin-top: 30%;
      }
    }
  }
  .selfmenu-footer{
    display: flex; justify-content: space-between;
    padding-top:20px; border-top:solid 1px #e2e2e9;
    margin-top:24px;
  }
</style>
