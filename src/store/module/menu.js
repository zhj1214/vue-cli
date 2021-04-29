/***********************
 * @name JS
 * @author Jo.gel
 * @date 2020/3/2 0019
 ***********************/
import { deepCopy } from '../../utils/tools'
import backRoutes from '../../router/backRouter'
import { axios_get } from '../../utils/axios'

let objRouter = {}
objRouter = deepCopy(backRoutes, objRouter)
const allRoutes = [objRouter[0]]

/**
 * @desc router -> menu
 * */
export const showAllBackRouters = (router) => {
  const res = []
  if (!router) return []
  for (const item of router) {
    // 不存在meta 或者 item存在且不存在hidden,hidden排除不需要显示
    if (!item.meta || (item.meta && !item.meta.hidden) || item.name) {
      const obj = {
        icon: (item.meta && item.meta.icon) || '',
        name: item.name || item.parent, //重定向到第一个子级时，被在路由中，name会被parent字段替代
        meta: item.meta,
      }
      if (hasChild(item)) {
        // let isToggle = localStorage.curMenu && localStorage.curMenu.includes(item.name);
        obj.children = showAllBackRouters(item.children)
        obj.meta = { ...obj.meta, toggle: true } // 默认全展开三级菜单
      }
      // 因为children第一个子元素 path:''被用于重定向到该menu的第一个子级，于是此处做了条件判断
      if (item.path && item.name && !item.meta.hidden) {
        res.push(obj)
      }
    }
  }
  return res
}

/**
 * @desc 检查时候存在children
 * */
const hasChild = (item) => {
  return item.children && item.children.length !== 0
}

export default {
  state: {
    // 存储后端的power数据
    roleTreeList: [],
    setRouter: [],
    initRule: [],
    moduleObj: {},
  },
  mutations: {
    // 后端返回的数据
    ROLE_TREE(state, data) {
      state.roleTreeList = data
    },
    ROLE_INIT(state, data) {
      state.initRule = data
    },
    SET_ROUTER(state, data) {
      state.setRouter = data
    },
    SET_MODULE(state, data) {
      state.moduleObj = data || {}
    },
  },
  getters: {
    /**
     * @desc 渲染出来的适合用于menu的菜单结构
     * @将真实路由->menu 用的结构
     * */
    menuList: (state) => {
      // sessionStorage.getItem("roleTree")  之前是这个判断
      if (state.setRouter.length > 0) {
        // console.info('走线上路由');
        return showAllBackRouters(state.setRouter)
      } else {
        // console.info('走本地路由');
        return showAllBackRouters(allRoutes)
      }
    },

    /**
     * @desc 用于控制页面按钮级的显示
     * @return {Array}
     * */
    pageActions(state) {
      const ob = {}
      const pageActionParser = (routers) => {
        if (Array.isArray(routers)) {
          for (const item of routers) {
            if (
              item.value &&
              item.value.match(/-/g) &&
              item.value.match(/-/g).length > 1 &&
              item.type === 'BUTTON'
            ) {
              const key = item.value.replace(/-[^-.]+$/, '')
              const value = item.value.replace(/^.*-/g, '')
              if (!ob[key]) ob[key] = [value]
              else ob[key].push(value)
            }
            pageActionParser(item.children)
          }
        }
        return ob
      }
      return pageActionParser(state.roleTreeList)
    },
  },
  actions: {
    // 用户组织权限树
    getRoleTree({ commit }) {
      if (!sessionStorage.getItem('operTree')) {
        axios_get('/user-server/auth/user/powers').then((res) => {
          if (res.code === 10000) {
            commit('ROLE_TREE', res.data || [])
            sessionStorage.setItem('roleTree', JSON.stringify(res.data)) //存储线上地址，后端返回的带分割的数据
          }
        })
      }
    },
    switchCompany({ commit }, data) {
      commit('ROLE_TREE', data)
    },
    async initRole({ commit, state }) {
      commit('ROLE_INIT', state.roleTreeList)
    },
    //存储真实地址
    setRealRouter({ commit }, data) {
      commit('SET_ROUTER', data)
    },
    //设置moduleId
    setModuleId({ commit }, data) {
      commit('SET_MODULE', data)
    },
  },
}
