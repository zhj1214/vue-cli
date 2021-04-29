<style lang="scss">
  @import './layout.scss';
</style>

<template>
  <Layout>
    <Sider
      ref="sideMenu"
      v-model="isCollapsed"
      hide-trigger
      collapsible
      class="menu-sider"
      :collapsed-width="78"
      :style="
        isCollapsed
          ? {
              background: '#fff',
              width: '96px',
              minWidth: '96px',
              position: 'relative',
            }
          : {
              background: '#fff',
              width: '264px',
              minWidth: '264px',
              boxShadow: '0px 2px 12px 0px rgba(0,0,0,0.04)',
            }
      "
    >
      <header class="menu-title" :style="{ width: isCollapsed ? '96px' : '256px' }">
        <section>
          <router-link to="/welcome">
            <img
              v-if="$store.state.storeLogo"
              style="width: 86px; height: 36px; border-radius: 50%; object-fit: contain;"
              :src="$store.state.storeLogo"
              alt=""
            />
            <img
              v-else
              src="../assets/images/logo.png"
              style="width: 86px; height: 36px; object-fit: contain;"
            />
          </router-link>
        </section>
        <h2 v-if="!isCollapsed">
          {{ curFullTitle }}
        </h2>
      </header>
      <div v-show="curMenu.length" style="position: relative; margin-top: 72px;">
        <aside class="aside-bar" />
        <div v-if="!isCollapsed" style="position: relative;">
          <div v-for="(items, indexS) in curMenu" :key="indexS" class="menu-list clearfix">
            <h3 :class="[{ isActive: items.actived }]" @click="toggleMenu(indexS)">
              <span
                ><i v-if="items.icon" :class="'icon iconfont ' + items.icon || ''" />{{
                  items.meta ? items.meta.title : ''
                }}</span
              >
            </h3>
            <div
              v-if="items.children && items.children.length && items.actived"
              class="aisde-submenu"
            >
              <SelfSubMenu
                v-show="items.meta && !items.meta.hidden"
                :menu-item="items"
                :current="curSelectMenu"
                @routeMenu="handleSelect"
              />
            </div>
          </div>
        </div>
        <div v-else-if="isCollapsed">
          <Dropdown
            v-for="(items, indexS) in curMenu"
            :key="items.name"
            placement="right-start"
            transfer-class-name="rigo-and-qq-browser"
            class="menu-list clearfix"
            transfer
          >
            <h3 :class="[{ isActive: items.actived }]" @click="toggleMenu(indexS)">
              <span
                ><i v-if="items.icon" :class="'icon iconfont ' + items.icon || ''" />{{
                  items.meta ? items.meta.title : ''
                }}</span
              >
            </h3>
            <DropdownMenu
              v-if="items.children && items.children.length && items.actived"
              slot="list"
            >
              <div
                class="aisde-submenu"
                style="
                  top: 0;
                  left: 96px;
                  height: 100vh;
                  box-shadow: rgba(0, 0, 0, 0.04) 0 2px 12px 0;
                "
              >
                <h2>{{ items.meta['fullTitle'] }}</h2>
                <SelfSubMenu
                  v-show="items.meta && !items.meta.hidden"
                  :menu-item="items"
                  :current="curSelectMenu"
                  @routeMenu="handleSelect"
                />
              </div>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </Sider>
    <Layout>
      <Header>
        <i
          v-if="curSelectMenu != 'welcome'"
          :class="rotateIcon"
          :style="{
            width: '72px',
            borderRight: 'solid 1px #E6EBF0',
            borderLeft: 'solid 1px #E6EBF0',
            textAlign: 'center',
          }"
          size="24"
          @click="collapsedSider"
        />
        <!--切换身份-->
        <Poptip placement="bottom-start" width="280" style="float: left;">
          <span class="orgBox span-a"><i class="icon iconfont iconCompany" />{{ orgName }}</span>

          <div slot="content" class="clear">
            <Input
              v-model="orgNameSearch"
              search
              placeholder="组织名称检索"
              @on-enter="onSearchOrg"
              @on-search="onSearchOrg"
            />
            <Scroll :on-reach-bottom="handleReachBottom" :distance-to-edge="[0, 0]">
              <div class="company-select" style="max-height: 80vh;">
                <div
                  v-for="item in searchCompanyList"
                  :key="item.value"
                  :value="item.value"
                  class="company-item"
                  @click="onChangeOrg(item)"
                >
                  <p style="float: left;">
                    {{ item.label }}
                  </p>
                  <Tooltip :content="tooltipData" max-width="auto" placement="top" :transfer="true">
                    <i @mouseenter="mouseenterIcon(item.id)" @mouseleave="mouseleaveIcon()"
                      ><Icon type="ios-information-circle-outline" :size="20"
                    /></i>
                  </Tooltip>
                </div>
              </div>
            </Scroll>
          </div>
        </Poptip>

        <Menu mode="horizontal" theme="light" active-name="1">
          <div class="layout-nav">
            <Dropdown trigger="click" style="margin-left: 20px;" transfer @on-click="dropdownClick">
              <span>
                <i
                  class="avatar"
                  :style="`background:url(${
                    $store.state.headImg || defaultAvatar
                  })no-repeat center;background-size: cover;`"
                />
                <a href="javascript:void(0)">
                  {{ $store.state.username }}
                  <Icon type="ios-arrow-down" />
                </a>
              </span>
              <DropdownMenu slot="list">
                <DropdownItem name="account">
                  <i class="icon iconfont iconAccount" />
                  账号管理
                </DropdownItem>
                <!-- <DropdownItem name="switch">
																		<i class="icon iconfont iconChange"></i>
																		切换商户
																</DropdownItem> -->
                <DropdownItem name="logout">
                  <i class="icon iconfont iconExit" />
                  退出登录
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </Menu>
      </Header>
      <Content
        :style="{
          padding: $route.name !== 'dashboard' ? '0 24px 24px' : '0 0 24px',
          background: '#F0F4FA',
        }"
      >
        <Breadcrumb
          :style="
            'margin: 24px 0 10px;text-align:left;' +
            ($route.name === 'dashboard' ? 'background:#fff;margin:0;padding:24px' : '')
          "
        >
          <BreadcrumbItem
            v-for="(item, index) in matchBreadcrumb"
            :key="Math.random() + index"
            :to="!index ? '' : item.path"
          >
            {{ item.meta && item.meta.title }}
          </BreadcrumbItem>
        </Breadcrumb>
        <Content
          :style="{
            padding: '0',
            minHeight: '280px',
            background: '#F0F4FA',
            width: '100%',
            height: $route.name.includes('report') ? '100%' : 'auto',
          }"
          class="content-body admin-layout"
        >
          <h2 v-show="$route.name !== 'people-detail' && !$route.meta.h2" class="h2">
            {{ $route.meta && $route.meta.title }}
          </h2>
          <router-view />
          <!--版权信息-->
          <Copyright color="#2e79a9" />
        </Content>
      </Content>
    </Layout>
    <Modal v-model="isLogout" title="退出登录" :mask-closable="false" @on-ok="logout">
      <p>确定退出登录？</p>
    </Modal>
  </Layout>
</template>
<script>
  import { mapActions, mapGetters, mapState } from 'vuex'
  import SelfSubMenu from './SubMenu'
  import Copyright from './Copyright'
  import defaultAvatar from '@/assets/images/default-avatar.png'
  import { throttle } from 'lodash'
  export default {
    name: 'AdminLayout',
    components: {
      Copyright,
      SelfSubMenu,
    },
    data() {
      return {
        defaultAvatar,
        updatePasswordStatus: false,
        isCollapsed: false,
        isLogout: false,
        orgName: localStorage.orgName || '',
        orgNameSearch: '',
        orgId: localStorage.orgId || '',
        matchBreadcrumb: [],
        curMenuCopy: undefined,
        searchCompanyList: [],
        curSelectMenu: localStorage.curMenu,
        tooltipData: '',
        orgPage: 1,
        orgSeach: '',
      }
    },
    computed: {
      ...mapState({
        moduleObj: (state) => state.menu.moduleObj,
        companyList: (state) => state.companyList || [],
      }),
      ...mapGetters(['menuList']),
      curMenu: {
        get() {
          if (!this.curMenuCopy) {
            const list =
              this.$store.getters.menuList.length && this.$store.getters.menuList[0].children
                ? this.$store.getters.menuList[0].children
                : []
            var arr = list.map((item, index) => {
              item.actived = this.curSelectMenu
                ? this.curSelectMenu.split('-')[0].includes(item.name)
                : !index
              return item
            })
            // console.log('咋回事')
            return arr
          } else {
            // console.log('对了')
            return this.curMenuCopy
          }
        },
        set(val) {
          // console.log(val,'new')
          this.curMenuCopy = val
          // console.log(this.curMenuCopy,'valNew')
        },
      },
      rotateIcon() {
        return [
          'menu-icon',
          this.isCollapsed ? 'icon iconfont iconUnfold' : 'icon iconfont iconFold',
        ]
      },
      menuitemClasses() {
        return ['menu-item', this.isCollapsed ? 'collapsed-menu' : '']
      },
      //异步数据无法触发改变化
      openNames() {
        const name = this.$route.name
        if (name === 'admin') {
          return ['platform']
        }
        return [name.replace(/-.*$/g, '')] || ['platform']
      },
      activeName() {
        if (this.$route.name === 'admin') {
          return 'platform-department'
        }
        return this.$route.name || 'platform-department'
      },
      // 获取档期一级菜单名称全称
      curFullTitle() {
        let iMenu = this.curMenu.filter((item) => item.actived)
        return iMenu.length ? iMenu[0].meta['fullTitle'] : ''
      },
    },
    watch: {
      $route(to, from) {
        // 如果是从欢迎页进入到其他业务页，展开菜单栏
        let toName = to.name,
          fromName = from.name
        // 如果目标路由为 welcome 页，且当前 collapse 是展开的，则进行操作
        if (toName == 'welcome') {
          !this.$refs.sideMenu.value && this.$refs.sideMenu.toggleCollapse()
          // 清除选中菜单
          this.curSelectMenu = toName
          this.toggleMenu(-1)
        }
        if (fromName == 'welcome' && toName) {
          this.$refs.sideMenu.toggleCollapse()
        }
        this.matchBreadcrumb = this.$route.matched
        this.$nextTick(() => {
          if (this.$refs['menu']) {
            this.$refs['menu'].updateOpened()
          }
          localStorage.setItem('pageId', to.meta.id || '')
        })
      },
      companyList(val) {
        this.searchCompanyList = val
      },
    },
    created() {
      this.getCompanyList()
      this.getRoleTree()
      this.matchBreadcrumb = this.$route.matched
    },
    mounted() {
      this.$store.dispatch('initRole')
      this.$store.dispatch('setAvatar')
      this.$store.dispatch('setStoreLogo')
      this.curSelectMenu = this.$route.name
      localStorage.setItem('curMenu', this.$route.name)
      if (this.$route.name === 'welcome') {
        this.isCollapsed = true
      }
      // this.initCurMenu();  // 根据角色构建当前菜单
    },
    methods: {
      ...mapActions(['getCompanyList']),
      // 初建 菜单信息
      initCurMenu() {
        let list =
          this.$store.getters.menuList.length && this.$store.getters.menuList[0].children
            ? this.$store.getters.menuList[0].children
            : []
        list = list.map((item, index) => {
          item.actived = this.curSelectMenu
            ? this.curSelectMenu.split('-')[0].includes(item.name)
            : !index
          return item
        })
        this.curMenu = list
      },
      // 点击一级菜单按钮切换
      toggleMenu(index) {
        let iList = this.curMenu.slice()
        iList = iList.map((mitem, mindex) => {
          if (index === mindex) {
            mitem.actived = true
            // console.log('进来了吗',mitem)
          } else {
            mitem.actived = false
          }

          return mitem
        })
        this.curMenu = iList
        // console.log(index,'toggleMenutoggleMenutoggleMenu____',this.curMenu)
      },
      dropdownClick(name) {
        switch (name) {
          case 'account':
            this.$router.push('/hall/account')
            break
          case 'switch':
            this.$router.push('/tenant/list')
            break
          case 'logout':
            this.isLogout = !this.isLogout
            break
        }
      },
      onSearchOrg(value) {
        if (typeof value === 'string') {
          this.orgSeach = value
          this.$ajaxGet('/user-server/auth/get/org/list', {
            searchType: 'name',
            searchContent: value,
            page: 1,
            size: 10,
          })
            .then((res) => {
              if (res && res.code === 10000) {
                this.searchCompanyList = res.data.list.map((item) => ({
                  label: item.orgName,
                  value: item.orgId,
                  id: item.id,
                }))
                this.orgPage = 1
              }
            })
            .catch((err) => {
              console.info(err)
            })
        }
      },
      //切换身份
      onChangeOrg(ob) {
        this.orgName = ob.label
        this.$nextTick(() => {
          this.fakeLogin(ob) // fakerLogin
        })
      },
      fakeLogin(item) {
        this.$ajaxGet('/user-server/auth/switchOrg', {
          orgId: item.value || this.orgId,
        })
          .then((res) => {
            if (res && res.code === 10000) {
              this.$Message.success('已切换到：' + res.data.userInfo.orgName)
              localStorage.setItem('token', res.data.token)
              localStorage.setItem('level', res.data.level) // 通过level=2 判断是否是小中台的用户
              localStorage.setItem('originOrgId', res.data.originOrgId || '')
              localStorage.setItem('userId', res.data.userInfo.id)
              localStorage.setItem('name', res.data.userInfo.name || '')
              localStorage.setItem('roleId', res.data.userInfo.roleId || '')
              localStorage.setItem('orgId', res.data.userInfo.orgId || '')
              if (res.data.userInfo.createType)
                localStorage.setItem('createType', res.data.userInfo.createType)
              localStorage.setItem('orgName', res.data.userInfo.orgName || '')
              localStorage.setItem('roleName', res.data.userInfo.roleName || '')
              localStorage.setItem('departmentId', res.data.userInfo.departmentId || '')
              localStorage.setItem('departmentName', res.data.userInfo.departmentName || '')
              localStorage.setItem('isSubStore', res.data.isSubStore || false) // 是否为门店
              localStorage.setItem('isChain', res.data.isChain || false) // 是否为连锁店
              localStorage.setItem('isPersonal', res.data.isPersonal || false) // 是否为个体
              return res.data.userInfo || {}
            }
          })
          .then(async (data) => {
            this.$store.dispatch('setUsername')
            if (data && JSON.stringify(data) !== '{}') {
              this.getCompanyList()
              location.href = '/welcome'
            }
          })
      },
      collapsedSider() {
        this.$refs.sideMenu.toggleCollapse()
      },
      ...mapActions(['getRoleTree']),
      handleReset(name) {
        this.$refs[name].resetFields()
        this.updatePasswordStatus = !this.updatePasswordStatus
      },
      logout() {
        const token = localStorage.getItem('token')
        this.$ajaxGet('/user-server/auth/logout', { token })
          .then((res) => {
            if (res && res.code === 10000) {
              this.$Notice.success({
                title: '退出成功！',
              })
              localStorage.clear()
              sessionStorage.clear()
              location.href = '/login.html'
            }
          })
          .catch((err) => {
            console.info(err)
          })
      },
      handleSelect(name) {
        localStorage.setItem('menuId', this.moduleObj[name] || '')
        // 点击叶子节点更新最新选中菜单
        this.curSelectMenu = name
        let parentMenu = name && name.split('-').length ? name.split('-')[0] : ''
        let iList = this.curMenu.slice()
        iList = iList.map((mitem) => {
          mitem.actived = mitem.name === parentMenu
          return mitem
        })
        this.curMenu = iList
        this.$nextTick(() => {
          this.$router.push({ name })
        })
      },
      //小菜单drop
      smallDropdown(name) {
        localStorage.setItem('menuId', this.moduleObj[name] || '')
        this.$nextTick(() => {
          this.$router.push({ name })
        })
      },
      throttleFunc: throttle(
        function (id) {
          this.tooltipData = ''
          this.$ajaxGet('/user-server/platform/department/detail', { id })
            .then((res) => {
              if (res && res.code === 10000) {
                this.tooltipData = res.data.completeOrgName
              }
            })
            .catch((err) => {
              console.info(err)
            })
        },
        1000,
        { trailing: false }
      ),
      mouseenterIcon(id) {
        this.throttleFunc(id)
      },
      mouseleaveIcon() {
        // this.tooltipData =''
      },
      // // throttle
      // handleReachBottom(){
      // 	throttle(function(){})
      // }
      handleReachBottom() {
        let page = this.orgPage
        const { orgSeach, searchCompanyList } = this
        let that = this
        return new Promise((resolve) => {
          this.$ajaxGet('/user-server/auth/get/org/list', {
            searchType: 'name',
            searchContent: orgSeach,
            size: 10,
            page: page + 1,
          })
            .then((res) => {
              if (res && res.code === 10000) {
                that.searchCompanyList = searchCompanyList.concat(
                  res.data.list.map((item) => ({
                    label: item.orgName,
                    value: item.orgId,
                    id: item.id,
                  }))
                )

                that.orgPage++
                resolve()
              }
            })
            .catch((err) => {
              console.info(err)
            })
        })
      },
    },
  }
</script>
