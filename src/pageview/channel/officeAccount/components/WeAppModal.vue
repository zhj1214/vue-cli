<!--
 * @Description: 选择小程序弹窗
 * @Author: sam.xutao
 * @Date: 2020-06-30 13:46:04
 * @LastEditTime: 2020-07-13 20:44:17
 * @LastEditors: sam.xutao
-->
<template>
  <div>
    <h3 class="mini-title">
      <p>
        <Icon type="md-information-circle" />
        微信公众号仅支持跳转已关联的小程序，请登录微信公众平台，将需要跳转的小程序关联至当前公众号，否则将无法跳转。
      </p>
    </h3>
    <!-- <p>{{miniForm}}</p> -->
    <Form
      ref="miniValidate"
      :model="miniForm"
      :rules="miniValidate"
      :label-width="125"
      class="mini-cont-form"
    >
      <FormItem
        label="小程序类型："
        prop="weappType"
      >
        <RadioGroup
          v-model="miniForm.weappType"
          @on-change="typeChange"
        >
          <Radio :label="1">
            已绑定小程序
          </Radio>
          <Radio :label="2">
            自定义小程序
          </Radio>
        </RadioGroup>
        <!-- <p v-if="miniForm.weappType==2">由于当前为通用菜单，自定义小程序必须已关联该公众号</p> -->
      </FormItem>

      <!-- 如果是已绑定小程序，显示如下： -->
      <div v-if="miniForm.weappType==1">
        <!-- 添加key值避免节点 diff 错误 -->
        <FormItem
          key="relateapp"
          label="小程序："
        >
          <span>{{ relateWeApp||"-" }}</span>
        </FormItem>
      </div>
      <!-- 如果是自定义小程序，用户自己输入信息 -->
      <div v-else>
        <!-- 添加key值避免节点 diff 错误 -->
        <FormItem
          key="appId"
          label="小程序 AppID："
          prop="appId"
        >
          <Input
            v-model="miniForm.appId"
            placeholder="请输入正确的小程序 AppID"
            style="width:280px"
          />
        </FormItem>
        <FormItem
          label="小程序路径："
          prop="pagepath"
        >
          <Input
            v-model="miniForm.pagepath"
            placeholder="请输入正确的小程序路径"
            style="width:280px"
          />
        </FormItem>
      </div>
      <footer style="border-top:solid 1px #E2E2E9; text-align:right; padding-top:24px;">
        <Button
          style="margin-right:8px;"
          @click="$emit('cancelWeapp')"
        >
          取消
        </Button>
        <Button
          type="primary"
          :disabled="disabled"
          @click="submitWeapp"
        >
          提交
        </Button>
      </footer>
    </Form>
  </div>
</template>

<script>
  export default {
    props: {
      weapp: {type: Object, required:true},
    },
    data() {
      const validateAppid = function(rule,val,cb){
        if(!val) cb("请输入小程序 APPID")

        if(val.match(/[^\w]+/g)){
          cb("请检查 APPID 格式")
        }
        cb();
      }
      return {
        relateWeApp: '',   // 绑定的小程序
        miniForm:{...this.weapp,weappType:this.weapp['weappType']||1}, // 如果没有设置过小程序，默认选中已绑定小程序
        api:{
          GET_RELEATE_APP:'/wechatplatform-server/api/edition/wx/platform/app',   // 获取授权到平台的公众号和小程序,通过传参miniProgram 区分
        },
        miniValidate:{
          appId:[{required:true,validator:validateAppid,type:"string",trigger:'change'}],
          pagepath:[{required:true,message:"请填写小程序路径"}],
        }
      }
    },
    computed: {
      disabled() {
        // 绑定小程序的tab下，但没有具体对应的小程序，则 不让提交
        return this.miniForm.weappType==1 && !this.relateWeApp;
      }
    },
    mounted () {
      if(this.miniForm.weappType == 1){
        // this.miniForm.appId = '';
        // this.miniForm.pagepath = '';
        this.getRelateWeapp();
      }
    },
    methods: {
      typeChange(val){
        if(val ==1 ){
          this.getRelateWeapp();
        }else{
          this.miniForm.weappName = '';
          if(this.miniForm.appId){
            this.miniForm.appId = '';
          }
          if(this.miniForm.pagepath){
            this.miniForm.pagepath = '';
          }
        }
      },
      // 获取公众号关联的小程序
      async getRelateWeapp() {
        const {data} = await this.$ajaxGet(this.api.GET_RELEATE_APP,{appType:2});
        if(data){
          this.relateWeApp = data.appName || "";
          this.relateAppId = data.appId || "";
        }
      },
      submitWeapp(){
				this.$refs['miniValidate'].validate(valid => {
					if (valid){
            // 如果选的是绑定小程序，则将该值赋给 weappName 返回
            if(this.miniForm.weappType == 1){
              this.miniForm.weappName = this.relateWeApp;
              this.miniForm.appId = this.relateAppId;
              // 如果是绑定的小程序，设置默认路径
              this.miniForm.pagepath = '/pages/index/index';
            }
            this.$emit("getWeapp",this.miniForm)
            console.log(this.miniForm)
          }
				});
      }
    },
  }
</script>

<style lang="scss" scoped>
  .mini-title{
    padding:12px 16px; margin-bottom: 24px;
    background:rgba(253,246,237,1);
    border-radius:4px;
    border:1px solid rgba(240,146,55,1);
    p{
      i{color: #756CEA;font-size: 16px;}
      font-size:14px;
      font-family:SFUIDisplay-Light,SFUIDisplay;
      font-weight:300;
      color:rgba(23,23,37,1);
    }
  }
  .mini-cont-form{
    p{
      font-size:12px;
      font-family:SFUIDisplay-Light,SFUIDisplay;
      font-weight:300;
      color:rgba(146,146,157,1);
    }
  }
</style>
