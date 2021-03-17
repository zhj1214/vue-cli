/*
 * @Description: 
 * @Author: sam.xutao
 * @Date: 2020-06-22 17:47:18
 * @LastEditTime: 2020-07-10 17:54:02
 * @LastEditors: sam.xutao
 */ 
export default {
  data() {
    return {
      baseMenu:  [],
      curMenu:null,   // 当前点选或默认选中的菜单项
      api:{
        CHECK_SELF_MENU:"/wechatplatform-server/api/mx/mp/menu/status",     // 检查自定义菜单是否开启 get 方式
        OPEN_SELF_MENU:"/wechatplatform-server/api/mx/mp/menu/status",        // 开启自定义菜单  post 方式
        LOAD_MENU_LIST:"/wechatplatform-server/api/mx/mp/menu/get",        // 拉取菜单列表
        SAVE_MENU_LIST:"/wechatplatform-server/api/mx/mp/menu/save",        // 保存菜单列表
        TOGGLE_OPEN_MENU:"/wechatplatform-server/api/mx/mp/menu/status",        // 开关自定义菜单
      }
    }
  },
  computed: {
    // 给每层菜单配置键值 buttonId，父子级菜单通过断线 - 分隔
    menus() {
      return this.baseMenu.map(item=>{
        item.buttonId = item.buttonId||Math.random()+'';
        if(item['subButton']){
          let subBtn = item['subButton'].map(subitem=>{
            return {...subitem,buttonId:subitem.buttonId || item.buttonId+"-"+Math.random()}
          })
          item['subButton'] = subBtn;
        }
        return item;
      }) 
    },
    // 根据点击操作的菜单，记录当前选中的菜单项的键值 buttonId，用于匹配显示
    menuKey() {
      if(this.curMenu){
        // if(this.curMenu.subButton&&this.curMenu.subButton['list']){
        //   let menuFirst = this.curMenu.subButton['list'][0]||{};
        //   return menuFirst['buttonId']
        // }else{
          return this.curMenu['buttonId']
        // }
        // return this.curMenu['buttonId']
      }else if(this.baseMenu.length){
        let menuFirst = this.menus[0] ;// this.menus[0].subButton.length?this.menus[0].subButton[0]:this.menus[0];
        this.curMenu = this.menus[0];
        return menuFirst['buttonId']
      }
    }
  },
  methods: {
    // 拉取菜单列表及对应内容
    async loadMenuList() {
      const {data} = await this.$ajaxGet(this.api.LOAD_MENU_LIST)
      if(data){
        let iMenus = data['button'] || [];
        this.baseMenu = iMenus.map(menu=>{
          return {...menu,subButton:menu.subButton||[]}
        })
      }
    },
    
    // 校验所有菜单是否能提交
    checkAllMenu(){
      let iMenus = this.baseMenu.slice();
      let allRight = true;
      for(let i=0;i<iMenus.length;i++){
        let iType = iMenus[i].type;
        console.log('==校验==',iMenus[i].name);
        
        if(iMenus[i].subButton && iMenus[i].subButton.length){
          let cMenu = iMenus[i].subButton;
          for(var j=0;j<cMenu.length;j++){
            let cType = cMenu[j].type;
            let validUrl = this.$checkUrl(cMenu[j].url||'');
            if(cType == 'view'){
              if(!cMenu[j].urlId || !cMenu[j].url || !validUrl){
                console.log('==校验失败子菜单==',cMenu[j])
                this.curMenu = cMenu[j]
                allRight = false;
                break;
              }
            }else if(cType == 'miniprogram'){
              let uniType = cMenu[j].weappType;
              if(!uniType||(uniType==1&&!cMenu[j].appId) || (uniType==2&&(!cMenu[j].appId||!cMenu[j].pagepath)) || !cMenu[j].url || !validUrl){
                console.log('==校验失败子菜单==',cMenu[j])
                this.curMenu = cMenu[j]
                allRight = false;
                break;
              }
            }
          }
        }else{
          let validUrl = this.$checkUrl(iMenus[i].url||'');
          // 如果是跳转网页，校验网页地址
          if(iType == 'view'){
            if(!iMenus[i].urlId || !iMenus[i].url || !validUrl){
              console.log('==校验失败==',iMenus)
              this.curMenu = iMenus[i]
              allRight = false;
              break;
            }
          }else if(iType == 'miniprogram'){
            if(!iMenus[i].appId || !iMenus[i].pagepath || !iMenus[i].url || !validUrl){
              console.log('==校验失败==',iMenus)
              this.curMenu = iMenus[i]
              allRight = false;
              break;
            }
          }
        }
        console.log(iMenus[i])
      }
      if(!allRight){
        this.$Message.error("请确认菜单配置")
      }
      return allRight;
    },
  },
}