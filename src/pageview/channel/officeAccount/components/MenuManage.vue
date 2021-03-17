<!--
 * @Description: 公众号菜单具体配置
 * @Author: sam.xutao
 * @Date: 2020-06-22 14:23:10
 * @LastEditTime: 2020-07-13 11:25:03
 * @LastEditors: sam.xutao
-->
<template>
  <div v-if="activeMenu">
    <!-- <p>activeMenu :{{activeMenu}}</p> -->
    <!-- <hr>
    <p>当前菜单内容：{{menuForm}}</p> -->
    <h3 class="menu-cont-title">
      <span>{{ menuForm.name }}</span>

      <Poptip
        confirm
        transfer
        placement="top-end"
        width="260"
        popper-class="confirm-pop"
        title="删除后该菜单下设置的内容将被删除，不可以恢复，是否确认删除该菜单？"
        @on-ok="$emit('removeMenu',activeMenu.buttonId)"
      >
        <a href="javascript:void(0);"><Icon type="ios-trash" /></a>
      </Poptip>
    </h3>
    <Form
      ref="menuValidate"
      :model="menuForm"
      :rules="menuValidate"
      :label-width="120"
      class="menu-cont-form"
    >
      <FormItem
        :label="isParent?'菜单名称：':'子菜单名称：'"
        prop="name"
      >
        <Input
          v-model="menuForm.name"
          placeholder="请输入菜单名称"
          style="width:280px"
          @on-blur="blurName"
        />
        <p class="menu-tip">
          仅支持中英文和数字，不超过{{ isParent?'4个汉字或8个字母':'8个汉字或16个字母' }}
        </p>
      </FormItem>
      <!-- 不包含子级菜单，才能编辑其他内容 -->
      <div v-if="!hasChildMenu">
        <FormItem
          :label="isParent?'菜单内容：':'子菜单内容：'"
          prop="mail"
        >
          <RadioGroup
            v-model="menuForm.type"
            @on-change="menuTypeChange"
          >
            <Radio label="view">
              跳转网页
            </Radio>
            <Radio label="miniprogram">
              跳转小程序
            </Radio>
          </RadioGroup>
        </FormItem>
        <!-- 跳转网页和跳转小程序字段内容不同 -->
        <!-- 如果是网页： -->
        <div v-if="menuForm.type==='view'">
          <FormItem
            label="页面地址："
            prop="url"
          >
            <Select
              v-model="menuForm.urlId"
              style="width:140px;margin-right:8px;"
              @on-change="pageChange"
            >
              <Option
                v-for="item in officePages"
                :key="item.id"
                :value="item.id"
              >
                {{ item.pageName }}
              </Option>
            </Select>
            <!-- 自定义页面才能编写，否则是选择业务地址 -->
            <Input
              v-model="menuForm.url"
              type="url"
              :placeholder="menuForm.urlId===-1?'请输入地址':''"
              :disabled="menuForm.urlId!==-1"
              style="width:280px;"
            />
            <p class="menu-tip">
              订阅者点击该子菜单会跳转到该链接
            </p>
          </FormItem>
        </div>
        <!-- 如果是小程序： -->
        <div v-else>
          <FormItem
            key="weapp"
            label="选择小程序："
            prop="weapp"
          >
            <section v-if="!menuForm.weappType">
              <p class="menu-mini">
                <Icon type="ios-add-circle-outline" /> <a
                  href="javascript:void(0);"
                  @click.stop="choiceWeApp"
                >选择小程序</a>
              </p>
            </section>
            <!-- 已绑定的小程序： -->
            <section v-else-if="menuForm.weappType==1">
              <p>
                已绑定的小程序 - {{ menuForm.weappName||'-' }}<Divider type="vertical" /> <a
                  href="javascript:void(0);"
                  @click.stop="choiceWeApp"
                >变更</a>
              </p>
            </section>
            <!-- 关联的小程序： -->
            <section v-else>
              <p>
                小程序 AppID：{{ menuForm.appId||'-' }}<Divider type="vertical" /> <a
                  href="javascript:void(0);"
                  @click.stop="choiceWeApp"
                >变更</a>
              </p>
              <p>小程序路径：{{ menuForm.pagepath || '-' }}</p>
            </section>
            <p class="menu-tip">
              订阅者点击该子菜单会跳转到所关联的小程序
            </p>
          </FormItem>
          <FormItem
            label="备用网页："
            prop="url"
          >
            <!-- type="url" -->
            <Input
              v-model="menuForm.url"
              placeholder="请输入备用网址"
              style="width:280px;"
            />
            <p class="menu-tip">
              旧版微信客户端无法支持小程序，用户点击菜单时将打开备用网页
            </p>
          </FormItem>
        </div>
      </div>
    </Form>
    <Modal
      v-model="weappVisible"
      title="选择小程序"
      :mask-closable="false"
      :footer-hide="true"
      width="644"
    >
      <WeAppModal
        v-if="weappVisible"
        :weapp="menuForm"
        @cancelWeapp="cancelWeapp"
        @getWeapp="getWeappInfo"
      />
    </Modal>
  </div>
</template>

<script>
  import WeAppModal from './WeAppModal.vue';
  export default {
    components: {
      WeAppModal,
    },
    props: {
      activeMenu: {
        type: [Object,null],
      },
    },
    data() {
      const validateName = function(rule,val,cb){
        if(!val || !val.length){
          cb("请输入菜单名称")
        }
        // 不能包含除数字，字母和中文以外的特殊字符
        if(val.match(/[^a-z0-9\u4e00-\u9fa5]+/ig)){
          cb("菜单名称不能包含特殊字符")
        }
        // 汉字计数，汉字不能超过四个
        let zhCount = val.match(/[\u4e00-\u9fa5]*/g).join("");
        // 字母数字计数，不能超过八位
        let charCount = val.match(/[a-z0-9]*/gi).join("");

        // 一个中文占两位，字母数字占一位
        let total = zhCount.length*2 + charCount.length;
        if(this.isParent && total&& total>8){
          cb("菜单名称不能超过8位，最多四个中文字符")
        }else if(total&& total>16){
          cb("子菜单名称不能超过16位，最多八个中文字符")
        }
        cb()
      }

      return {
        // isParent: this.activeMenu.subButton['list']&&this.activeMenu.subButton['list'].length,    // 通过是否有list子菜单判定当前是否为一级菜单
        officePages:[{id:-1,pageName:'自定义地址'}],   // 公众号业务页面，如果是 -1 则为自定义页面
        api:{
          GET_ACCOUNT_PAGES:"/wechatplatform-server/api/mx/mp/pages",     // 获取公众号对应业务网址，用于构建跳转网页
        },
        weappVisible:false,   // 选择小程序弹窗
        menuForm:JSON.parse(JSON.stringify(this.activeMenu)),
        obj: {
          a: 123
        },
        menuValidate:{
          name:[
            {required:true,validator:validateName,trigger:"change",type:"string"},
          ],
          url:[
            {required:true,type:"string",message:"请填写页面地址"},
            { type: 'url', message: '无效的url地址，格式必须为https://xx.xx 或 https://xx.xx', trigger: 'blur' },
          ],
          backurl:[{required:true,type:'string',message:"请填写备用网页"}],
          weapp:[{required:true}]
        }
      }
    },
    computed: {
      isParent() {
         // 是否为一级菜单
        return this.activeMenu.subButton
      },
      hasChildMenu(){
        // 是否有子级菜单，如果有，则只能编辑菜单名称
        return this.activeMenu.subButton&&this.activeMenu.subButton.length
      }
    },
    watch: {
      activeMenu(newValue,oldValue) {
        console.log(newValue.buttonId,'==activeMenu buttonId==',oldValue.buttonId)
        this.menuForm = JSON.parse(JSON.stringify(newValue));
      },
      'menuForm.url'(nval,oval){
        if(nval != oval){
          this.$emit("menuChange",this.menuForm)
        }
      },
      'menuForm.name'(nval,oval){
        if(nval != oval){
          this.$emit("menuChange",this.menuForm)
        }
      },
      'menuForm.urlId'(nval,oval){
        if(nval != oval){
          this.$emit("menuChange",this.menuForm)
        }
      },
      'menuForm.weappType'(nval,oval){
        if(nval != oval){
          this.$emit("menuChange",this.menuForm)
        }
      },
      'menuForm.appId'(nval,oval){
        if(nval != oval){
          this.$emit("menuChange",this.menuForm)
        }
      },
      'menuForm.pagepath'(nval,oval){
        if(nval != oval){
          this.$emit("menuChange",this.menuForm)
        }
      },
      'menuForm.type'(nval,oval){
        if(nval != oval){
          this.$emit("menuChange",this.menuForm)
        }
      },
      'menuForm':{
        handler: function (nval,oval){
          console.info("菜单内容变更==",nval,oval)
          // let jsonNew = JSON.stringify(nval),jsonOld = JSON.stringify(oval);
          // if(jsonNew !== jsonOld && nval.key===oval.key){
          //   this.$emit("menuChange",nval)
          // }
        },
        deep: true
      },
    },
    mounted () {
      this.loadAccountPages();
    },
    methods: {
      // urlChange(e){
      //   this.$set(this.menuForm,'backurl',e.target.value)
      //   // this.menuForm.backurl = e.target.value;
      // },
      menuTypeChange(type){
        if(type=='miniprogram'){
          this.$set(this.menuForm,'url','');
          this.$set(this.menuForm,'urlId','');
        }
      },
      // 名称校验后如果出错，赋值名称为“菜单名称”
      blurName(){
        this.$refs['menuValidate'].validateField("name",(error)=>{
          if(error){
            this.menuForm.name = "菜单名称";
          }
        })
      },
      // 拉取公众号业务页面
      async loadAccountPages() {
        const {data} = await this.$ajaxGet(this.api.GET_ACCOUNT_PAGES);
        if(data){
          let iData = data.map(item=>{
            return {...item,pageUrl:item.pageUrl+"?orgId="+localStorage.originOrgId}
          })
          this.officePages = this.officePages.concat(iData||[]);
        }
      },
      // 获取到小程序弹窗信息
      getWeappInfo(weApp){
        this.menuForm = weApp;
        this.cancelWeapp();
      },
      // 取消选择小程序弹窗
      cancelWeapp(){ this.weappVisible = false;},
      // 选择小程序弹窗
      choiceWeApp(){
        this.weappVisible = true;
      },
      // 业务页面选择时，如果是自定义地址，页面地址重置；业务页面则获取pageUrl
      pageChange(id){
        if(!id){
          return false;
        }
        if(id === -1){
          this.$set(this.menuForm,'url','')
          return false;
        }else{
          // 获取到业务页面，赋值给 url 字段
          let curPage = this.officePages.filter(item=>item.id===id);
          this.$set(this.menuForm,'url',curPage[0].pageUrl)
        }
        this.$emit("menuChange",this.menuForm)
      }
    },
  }
</script>
<style lang="scss">

  .menu-cont-form {
    label.ivu-form-item-label{
      font-size:14px;
      font-family:SFUIDisplay-Light,SFUIDisplay;
      font-weight:300;
      color:rgba(68,68,79,1);
    }
  }
</style>
<style lang="scss" scoped>
  .menu-cont-title{
    display: flex; justify-content: space-between;
    position: relative; height: 50px;
    border-bottom: solid 1px #efefef;
    margin-bottom: 24px;
    span{
      &::before{
        content:""; display: inline-block;
        width:4px; height: 24px; background: #756CEA;
        left:-20px; position: absolute; top:2px;
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
      }
    }
    .ivu-icon-ios-trash{font-size: 20px;}
  }
  .menu-cont-form{
    p{
      font-size:14px;
      font-family:SFUIDisplay-Light,SFUIDisplay;
      font-weight:300;
      color:rgba(68,68,79,1);
    }
    .menu-tip{
      font-size:12px; width:280px;
      font-family:SFUIDisplay-Light,SFUIDisplay;
      font-weight:300; line-height: 22px;
      color:rgba(146,146,157,1);
    }
  }
  .menu-mini i{font-size: 16px; font-weight: bold; color:#756CEA; margin-right: 8px;}
</style>
