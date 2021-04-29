/*
 * @Description:
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-03-11 09:45:45
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-03-15 19:56:01
 */
/***********************
 * @desc 常用于不分页的下拉选择module，主要用于select以及table的筛选数组
 * @data [{label:"",value:""}]的格式返回
 * @name JS
 * @author Jo.gel
 * @date 2020/6/30 0030
 * @usage 在组件中引入
 *  import {mapState, mapActions} from 'vuex';
 
 *  mounted(){
 *    this.getBlankPowersTree().then(res=>{console.log(res)})
 *  }
 ***********************/

import { axios_get } from '../../utils/axios'

export default {
  actions: {
    // 获取不分页的标签分组
    async getLabelGroupSelect() {
      const res = await axios_get('/label-server/labelType/listSimple')
      let list = []
      if (res && res.code === 10000) {
        const data = (res.data && res.data) || []
        list = data.map((item) => ({ label: item.value, value: item.code }))
      }
      return list
    },
    // 获取不分页的会员等级level
    // eslint-disable-next-line no-unused-vars
    async getMemberLevelListSelect({ commit }, data) {
      const orgId = data
      const res = await axios_get('/grade-server/api/grade/info', { orgId })
      let list = []
      if (res && res.code === 10000) {
        const levelList = (res.data && res.data.gradeLevelRelationList) || []
        list = levelList.map((item) => ({ label: item.levelName, value: item.levelId }))
      }
      return list
    },
  },
}
