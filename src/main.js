/*
 * @Description:
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-03-01 11:44:49
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-03-25 15:27:32
 */
import Vue from "vue";
import App from "./App";
import store from "./store";
import uView from "uview-ui";






// let DIR_NAME = 'test'
// let fileName = 'test.json'
// let filePath = './test/test.json'
// let dirEntry =  file.getDirEntry(DIR_NAME); //创建、获取文件夹
// let fileEntry =  file.getFileEntry(fileName, dirEntry); // 创建、获取文件
// let {result:content} =  file.getFileContext(filePath); // 获取文件的内容
// // let trajectory = JSON.parse(content||"[]");
// // trajectory.push({lat, lng});
// fileEntry.createWriter(function(writer){
// 	writer.seek(0);
// 	writer.write(JSON.stringify({"a":'112132145434'}));
// })


// production: "https://crm.cntpy.com", // 测试环境
//     development: "https://htmostest.data4truth.com", // 正式环境
//     pord: "https://crmuat.cntpy.com", // 预发布

// {
//   "extEnable": true,
//   "extAppid": "wxc91325214d05e6e1",
//   "ext": {
//     "version": "2.6.0",
//     "orgId": "12226364",
//     "appId": "wxc91325214d05e6e1"
//   }
// }


 
// fs.mkdir('/home', function() {
//     fs.writeFile('/home/hello-world.txt', 'Hello world!\n', function() {
//         fs.readFile('/home/hello-world.txt', 'utf-8', function(err, data) {
//             console.log(data);
//         });
//     });
// });


Vue.use(uView);
Vue.prototype.$store = store;
Vue.config.productionTip = false;

Vue.mixin({
  methods: {
    setData: function(obj, callback) {
      let that = this;
      const handleData = (tepData, tepKey, afterKey) => {
        tepKey = tepKey.split(".");
        tepKey.forEach((item) => {
          if (tepData[item] === null || tepData[item] === undefined) {
            let reg = /^[0-9]+$/;
            tepData[item] = reg.test(afterKey) ? [] : {};
            tepData = tepData[item];
          } else {
            tepData = tepData[item];
          }
        });
        return tepData;
      };
      const isFn = function(value) {
        return typeof value == "function" || false;
      };
      Object.keys(obj).forEach(function(key) {
        let val = obj[key];
        key = key.replace(/\]/g, "").replace(/\[/g, ".");
        let front, after;
        let index_after = key.lastIndexOf(".");
        if (index_after != -1) {
          after = key.slice(index_after + 1);
          front = handleData(that, key.slice(0, index_after), after);
        } else {
          after = key;
          front = that;
        }
        if (front.$data && front.$data[after] === undefined) {
          Object.defineProperty(front, after, {
            get() {
              return front.$data[after];
            },
            set(newValue) {
              front.$data[after] = newValue;
              that.$forceUpdate();
            },
            enumerable: true,
            configurable: true,
          });
          front[after] = val;
        } else {
          that.$set(front, after, val);
        }
      });
      // this.$forceUpdate();
      isFn(callback) && this.$nextTick(callback);
    },
  },
});

App.mpType = "app";

const app = new Vue({
  store,
  ...App,
});
app.$mount();
