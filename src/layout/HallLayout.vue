<!--
@desc 大厅路由
-->
<style lang="scss">
  @import '../assets/font/iconfont.css';

  .mos-item {
    clear: both;

    .area-code {
      float: left;
      width: 120px;
      height: 32px;
      border-bottom: 1px solid #e2e2ea;
    }

    .phone-input {
      position: relative;
      margin-left: 140px;
    }

    .phone-span {
      display: inline-block;
      width: 100%;
      height: 32px;
      border-bottom: 1px solid #e2e2ea;
    }

    .change-span {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 1;
      color: #756cea;
      cursor: pointer;
    }
  }
</style>
<style lang="scss" scoped>
  html,
  body,
  * {
    font-size: 14px;
  }

  html,
  body {
    width: 100%;
    height: 100%;
    overflow: hidden;
    scroll-behavior: smooth;
  }

  ul li {
    margin: 0;
    list-style-type: none;
  }

  #hall {
    height: 100%;
  }

  .hall-layout .ivu-layout-header {
    padding: 0;
    background: #fff;
    border-bottom: 1px solid #e6ebf0;
  }

  .hall-layout {
    height: 100%;

    .account-title {
      padding: 24px 24px 8px;
      font-family: SFUIDisplay-Medium, SFUIDisplay;
      font-size: 12px;
      font-weight: bold;
      color: #92929d;
    }
  }

  .menuItem-left {
    margin-right: 22px;

    > i {
      margin-right: 12px;
    }
  }

  .menu-icon {
    position: relative;
    z-index: 999;
    float: left;
    font-size: 20px;
    line-height: 60px;
    cursor: pointer;
  }

  .menu-list {
    display: flex;
    flex-direction: column;

    /deep/ li {
      display: flex;
      padding: 0;
      padding: 14px 24px;
      font-size: 14px;
      align-items: center;

      i {
        font-size: 24px;
      }
    }

    /deep/ .ivu-menu-item-active:not(.ivu-menu-submenu) {
      background: transparent;

      &::after {
        top: 8px;
        left: 0;
        width: 4px;
        height: 32px;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }
    }
  }

  .menu-item {
    overflow-y: auto;
  }

  .menu-item span {
    display: inline-block;
    width: 69px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    transition: width 0.2s ease 0.2s;
  }

  .menu-item i {
    font-size: 20px;
    vertical-align: middle;
    transform: translateX(0);
    transition: font-size 0.2s ease, transform 0.2s ease;
  }

  .collapsed-menu span {
    width: 0;
    transition: width 0.2s ease;
  }

  .collapsed-menu i {
    font-size: 22px;
    vertical-align: middle;
    transform: translateX(5px);
    transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  }

  .avatar-hall {
    display: inline-block;
    width: 36px;
    height: 36px;
    vertical-align: middle;
  }

  .avatar-bg {
    background: url('../assets/images/default-avatar.png') no-repeat center;
    background-size: contain;
  }

  .username {
    margin: 0 8px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(103, 103, 143, 1);
  }

  .layout {
    position: relative;
    overflow: hidden;
    background: #f5f7f9;
    border: 1px solid #d7dde4;
    border-radius: 4px;
  }

  .layout-logo {
    position: relative;
    height: 64px;
    margin: 0 auto;
    font-size: 30px;
    line-height: 64px;
    color: #fff;
    text-align: left;
    border-radius: 3px;

    &::after {
      position: absolute;
      bottom: 0;
      left: 0;
      display: inline-block;
      width: 100%;
      height: 1px;
      background: #e6ebf0;
      content: '';
    }
  }

  .ivu-dropdown-menu /deep/ .ivu-dropdown-item {
    i {
      font-size: 24px;
    }

    &:hover {
      color: #756cea;
      background: rgba(181, 181, 190, 0.16);
    }
  }

  .layout-nav {
    margin: 0 20px 0 auto;
    text-align: right;

    li {
      height: 40px;
      text-align: center;

      a {
        color: #000;

        &:hover {
          color: #756cea;
        }
      }
    }

    .ivu-icon-ios-arrow-forward {
      &::before {
        display: inline-block;
        width: 8px;
        height: 8px;
        background: url('../assets/images/down.png') no-repeat center;
        content: '';
      }
    }
  }

  .ul-small {
    position: relative;
    margin-top: 0;
    text-align: center;

    &::before {
      position: absolute;
      top: 59px;
      left: 0;
      display: block;
      width: 100%;
      height: 1px;
      background: #e6ebf0;
      content: '';
    }

    .small-logo {
      position: relative;
      width: 36px;
      height: 40px;
      padding-bottom: 10px;
      margin: 20px 0 10px;
    }

    i {
      font-size: 20px;
      color: #67678f;
    }

    .li-small {
      line-height: 48px;
    }
  }

  /* remove border */
  .is-businesses::after {
    display: none !important;
  }

  .businesses-body {
    padding-right: 258px !important;
  }

  /* button radio */
  .tenant-body /deep/ button {
    border-radius: 24px;
  }
</style>
<template>
  <div id="hall">
    <Layout class="hall-layout">
      <Sider
        v-show="!isBusinesses"
        ref="sideMenu"
        v-model="isCollapsed"
        hide-trigger
        collapsible
        :collapsed-width="78"
        :style="
          isCollapsed
            ? { background: '#fff' }
            : { background: '#fff', width: '258px', flex: '0 0 258px', maxWidth: '258px' }
        "
      >
        <Menu
          v-if="!isCollapsed"
          ref="menu"
          theme="light"
          width="256"
          style="height: 100%;"
          :active-name="activeName"
          :open-names="openNames"
          accordion
          :class="menuitemClasses"
          @on-select="handleSelect"
        >
          <div
            class="layout-logo"
            :style="isCollapsed ? { width: 'auto', 'text-align': 'center' } : {}"
          >
            <!-- <img src="../assets/images/logo-back.png" alt="logo" width="150" height="50" style="margin-top:6px;object-fit:contain;margin-left:15px"> -->
            <img
              src="../assets/images/hengtai-logo.png"
              alt="logo"
              width="150"
              height="50"
              style="margin-top: 6px; object-fit: contain; margin-left: 15px;"
            />
          </div>
          <h4 class="account-title"> 账户管理 </h4>
          <div
            v-for="(items, indexS) in hallMenuList"
            v-show="hallMenuList.length"
            :key="indexS"
            class="menu-list"
          >
            <MenuItem
              v-for="(item, index) in items.children"
              v-show="item.meta && !item.meta.hidden"
              :key="index"
              :name="item.name"
            >
              <i v-if="item.icon" :class="'icon iconfont ' + item.icon || ''" />
              <Icon v-else type="ios-navigate" />
              {{ !isCollapsed ? item.meta && item.meta.title : '' }}
            </MenuItem>
          </div>
          <div />
        </Menu>
      </Sider>
      <Layout>
        <Header>
          <Menu mode="horizontal" theme="light" active-name="1">
            <div class="layout-nav">
              <!--选择商户-->
              <router-link v-show="$route.name !== 'tenant-list'" to="/welcome">
                退出账号管理
              </router-link>
              <div v-if="isBusinesses" class="layout-logo" style="float: left;">
                <img
                  src="../assets/images/logo-back.png"
                  alt="logo"
                  width="150"
                  height="50"
                  style="margin-top: 6px; object-fit: contain; margin-left: 15px;"
                />
              </div>

              <Dropdown
                trigger="click"
                style="margin-left: 20px;"
                transfer
                @on-click="dropdownClick"
              >
                <span>
                  <img v-if="headImg" class="avatar-hall" :src="headImg" alt="" />
                  <i v-else class="avatar-hall avatar-bg" />
                  <a href="javascript:void(0)">
                    {{ $store.state.username || $store.state.phone }}
                    <Icon type="ios-arrow-down" />
                  </a>
                </span>

                <DropdownMenu slot="list">
                  <DropdownItem name="changePassword">
                    <i class="mr-5 icon iconfont iconAccount" />账号管理
                  </DropdownItem>
                  <DropdownItem name="logout">
                    <i class="mr-5 icon iconfont iconExit" />退出登录
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </Menu>
        </Header>
        <Content
          style="width: 100%; padding: 24px; background: #fff;"
          :class="'content-body ' + isBusinesses ? 'tenant-body' : ''"
        >
          <router-view />
          <!--版权信息-->
          <Copyright color="#2e79a9" />
        </Content>
      </Layout>
      <Modal v-model="isLogout" title="退出登录" :mask-closable="false" @on-ok="logout">
        <p>确定退出登录？</p>
      </Modal>
    </Layout>
  </div>
</template>
<script>
  import { mapGetters, mapState } from 'vuex'
  import Copyright from './Copyright'

  export default {
    name: 'HallLayout',
    components: {
      Copyright,
    },
    data() {
      return {
        updatePasswordStatus: false,
        isCollapsed: false,
        isLogout: false,
      }
    },
    computed: {
      ...mapState(['headImg']),
      ...mapGetters(['hallMenuList']),
      isBusinesses() {
        return this.$route.name.includes('tenant')
      },
      hallMenuList() {
        const list =
          this.$store.getters.hallMenuList.length && this.$store.getters.hallMenuList
            ? this.$store.getters.hallMenuList
            : []
        return list
      },
      rotateIcon() {
        return [
          'menu-icon',
          this.isCollapsed ? 'icon iconfont iconFold' : 'icon iconfont iconUnfold',
        ]
      },
      menuitemClasses() {
        return [
          'menu-item',
          this.isCollapsed ? 'collapsed-menu' : this.isBusinesses ? 'is-tenant' : '',
        ]
      },
      //异步数据无法触发改变化
      openNames() {
        const name = this.$route.name
        if (name === 'hall') {
          return ['account']
        }
        return [(name || '').replace(/-.*$/g, '')] || ['platform']
      },
      activeName() {
        if (this.$route.name === 'hall') {
          return 'hall-account'
        }
        return this.$route.name || 'hall-account'
      },
    },
    watch: {
      $route() {
        this.$nextTick(() => {
          if (this.$refs['menu']) {
            this.$refs['menu'].updateOpened()
          }
        })
      },
    },
    created() {},
    mounted() {},
    methods: {
      dropdownClick(name) {
        switch (name) {
          case 'changePassword':
            this.$router.push('/hall/account?type=profile')
            break
          case 'logout':
            this.isLogout = !this.isLogout
            break
        }
      },
      collapsedSider() {
        this.$refs.sideMenu.toggleCollapse()
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
        this.$nextTick(() => {
          this.$router.push({ name })
        })
      },
      //小菜单drop
      smallDropdown(name) {
        this.$nextTick(() => {
          this.$router.push({ name })
        })
      },
    },
  }
</script>
<style lang="scss">
  @import 'src/assets/scss/loginHall';

  .h2 {
    margin-bottom: 28px;
    font-size: 24px;
    font-weight: 600;
    color: rgba(62, 69, 82, 1);
    text-align: left;
  }

  .tenant-body {
    background: #fafafb !important;

    > div:first-child {
      min-height: 760px;
      border-radius: 20px;
    }
  }
</style>
