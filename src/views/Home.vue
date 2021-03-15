<!--
 * @Description: 
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-03-12 15:33:15
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-03-15 16:22:56
-->
<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import { ref } from "vue";
import HelloWorld from "@/components/HelloWorld.vue";
import api from "../api/";


export default {
  name: "Home",
  components: {
    HelloWorld
  },
  setup(props, context) {
    let list = ref([]);

    console.log(props, "____props__");
    console.log(context, "____context__");
    console.log(list, "____list__");
    console.log(api, "____api_____");
    // 请求参数：subject=1&model=c1&testType=&=&key=f8179153f5176ec2d6656a860ebb8dd7
    // http://v.juhe.cn
    api
      .getlist({
        subject: 1,
        model: "c1",
        key: "f8179153f5176ec2d6656a860ebb8dd7"
      })
      .then(res => {
        console.log("请求数据：", res);

        
      });

    return {
      list
    };
  }
};
</script>
