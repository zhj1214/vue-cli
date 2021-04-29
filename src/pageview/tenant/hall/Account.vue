<!--
 * @Description: 
 * @Author: sam.xutao
 * @Date: 2020-10-10 17:37:32
 * @LastEditTime: 2020-10-11 16:00:56
 * @LastEditors: sam.xutao
-->
<!--
@desc 账号信息 {账号信息/更换手机/注销账号}
-->
<template>
  <div>
    <h2 class="h2"> 账号信息 </h2>
    <div class="user-account">
      <component :is="currentComponent" :account-obj="accountObj" @whatComponent="whatComponent" />
    </div>
  </div>
</template>

<script>
  import Profile from './components/Profile'
  import CancelAccount from './components/CancelAccount'
  import ChangePhone from './components/ChangePhone'

  export default {
    name: 'Account',
    components: {
      CancelAccount,
      ChangePhone,
      Profile,
    },
    data() {
      return {
        pageType: 'Profile',
        accountObj: {},
      }
    },
    computed: {
      currentComponent() {
        switch (this.pageType) {
          case 'Profile':
            return 'Profile'
          case 'CancelAccount':
            return 'CancelAccount'
          case 'ChangePhone':
            return 'ChangePhone'
          default:
            return 'Profile'
        }
      },
    },
    watch: {
      $route(to) {
        const { type = '' } = to.query || {}
        if (type === 'profile') {
          this.pageType = 'Profile'
        }
      },
    },
    methods: {
      whatComponent(label) {
        console.log(label, '_______________')
        this.pageType = label.name
        this.accountObj = label.accountObj || {}
        this.$router.replace('/hall/account').catch((err) => {
          err
        })
      },
    },
  }
</script>
