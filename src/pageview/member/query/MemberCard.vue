<template>
  <div class="page-container">
    <div class="member-card" :class="cardStyle">
      <div class="photo-name">
        <div class="frozen-container">
          <div v-if="frozenStatus" class="frozen-tag"> 冻结 </div>
        </div>

        <img class="user-photo" :src="memberInfo.headImg || defaultPhoto" />
        <div class="name-container">
          <div class="title-container">
            <span class="card-title" :class="{ 'grey-text': frozenStatus }">{{
              memberInfo.memberName || memberInfo.nickName || '-'
            }}</span>
            <img
              v-if="memberInfo.sex !== 'N'"
              class="user-gender"
              :src="showGender()"
              alt="用户性别"
            />
          </div>
          <div class="card-desc">
            {{ memberInfo.phone }}
          </div>
        </div>
        <Checkbox
          v-model="selectMember"
          class="select-member"
          :disabled="cardStatus === 'cancel'"
          @on-change="chooseMember"
        />
      </div>

      <div class="property-list small-block-narrow">
        <div class="property-cell">
          <div class="property-name"> 成长值 </div>
          <div class="property-value">
            {{ memberInfo.growthBalance }}
          </div>
        </div>
        <div class="separation-line" />
        <div>
          <div class="property-name"> 积分 </div>
          <!--                <div v-if="cardStatus !== 'cancel'" class="property-value edit-cell">-->
          <!--                    <span class="point-value">{{ memberInfo.pointBalance }}</span>-->
          <!--                    <i  class="icon iconfont iconEdit" title="编辑" ></i>-->
          <!--                </div>-->
          <div class="property-value">
            <span>{{ memberInfo.pointBalance }}</span>
          </div>
        </div>
        <div v-if="hasVipLevel && levelStatus" class="separation-line" />
        <div v-if="hasVipLevel && levelStatus">
          <div class="property-name">
            <span>等级</span>
            <i v-if="memberInfo.isFrozenLevel" class="icon iconfont iconLocked" title="保级" />
          </div>
          <div class="property-value" :class="{ 'grey-text': memberInfo.isFrozenLevel }">
            <span>{{ displayLevelName }}</span>
          </div>
        </div>
      </div>

      <div v-if="true" class="none-member big-block-narrow">
        <img :src="notMemberText" alt="非付费会员" />
      </div>
      <div v-else class="vip-icon-list big-block-narrow">
        <img class="vip-icon" :src="superVipIcon" alt="会员图标" />
      </div>

      <div class="small-block-narrow">
        <div class="register-info">
          <span>ID：</span>
          <span>{{ memberInfo.id }}</span>
        </div>
        <div class="register-info">
          <span>注册于</span>
          <span>{{ dateParser(memberInfo.createTime) }}</span>
        </div>
      </div>

      <!--        <div class="btn-container big-block-narrow" v-if="cardStatus !== 'cancel'">-->
      <!--            <Button class="w80" size="large" type="primary" @click="jumpDetail">详情</Button>-->
      <!--            <Button class="w80" size="large" type="default" @click="markMember">打标签</Button>-->
      <!--            <span class="more-action"  >-->
      <!--                <i class="icon iconfont iconMore" @click="showAccountAction" title="更多" ></i>-->
      <!--            </span>-->
      <!--        </div>-->

      <div v-if="cardStatus !== 'cancel'" class="btn-container big-block-narrow">
        <span class="card-action" @click="jumpDetail">详情</span>
        <span class="card-action" @click="markMember">打标签</span>
        <span class="card-action" @click="showAccountAction">
          <i class="icon iconfont iconMore" title="更多" />
        </span>
      </div>
      <div v-else class="btn-container big-block-narrow cancel-card">
        <span class="cancel-member">已注销</span>
      </div>

      <ul v-if="accountAction && cardStatus !== 'cancel'" class="account-list">
        <li @click="changeAccountStatus('cancel')"> 账户注销 </li>
        <li @click="changeAccountStatus('accountStatus')"> 账户状态 </li>
        <li @click="changeAccountStatus('logout')"> 账户登出 </li>
      </ul>

      <div
        v-if="accountAction && cardStatus !== 'cancel'"
        class="action-background"
        @click="showAccountAction"
      />
    </div>
  </div>
</template>

<script>
  // import { log } from "@/utils/tools";
  import { dateParser } from '@/utils/tools'
  import defaultPhoto from '@/assets/images/member/default_member_photo.png'
  import femaleIcon from '@/assets/images/member/female_icon.png'
  import maleIcon from '@/assets/images/member/male_icon.png'

  import superVipIcon from '@/assets/images/member/super_vip_icon.png'
  import notMemberText from '@/assets/images/member/not_member_text.png'

  export default {
    name: 'MemberCard',
    components: {},
    props: {
      memberInfo: Object,
      unselectOutside: Boolean,
      clearAll: Boolean,
      // 等级模式是否启用
      levelStatus: Boolean,
    },
    data() {
      return {
        defaultPhoto: defaultPhoto,
        femaleIcon: femaleIcon,
        maleIcon: maleIcon,
        superVipIcon: superVipIcon,
        notMemberText: notMemberText,

        selectMember: false,
        cardStyle: '',
        cardStatus: 'normal',
        frozenStatus: true,
        accountAction: false,

        statusType: '',
      }
    },
    computed: {
      notPayMember() {
        return this.memberInfo.payMember === '-1'
      },
      hasVipLevel() {
        return this.memberInfo.levelId !== '-1'
      },
      displayLevelName() {
        let level = this.memberInfo.levelId.slice(2)
        return `LV ${level}`
      },
    },
    watch: {
      unselectOutside: function (n) {
        if (n) {
          this.selectMember = false
          this.cardStyle = ''
          this.$emit('updateStatus', this.memberInfo)
        }
      },
      memberInfo(newValue) {
        this.renderPage(newValue)
      },
    },
    created() {
      this.renderPage(this.memberInfo)
      if (this.clearAll) {
        this.selectMember = false
      }
    },
    updated() {},
    methods: {
      dateParser(date) {
        return dateParser(date)
      },
      renderPage(data) {
        let { status, isFrozen } = data
        // 已注销
        let isCanceled = status === 2

        // let frozen = isFrozen === 1
        if (isCanceled) {
          this.cardStyle = 'canceled'
          this.cardStatus = 'cancel'
        }
        // 已冻结
        this.frozenStatus = isFrozen
      },
      showGender() {
        let gender = this.memberInfo.sex || 'default'
        let iconList = {
          M: maleIcon,
          F: femaleIcon,
          N: '',
          default: '',
        }
        return iconList[gender]
      },
      chooseMember() {
        let status = this.selectMember
        if (status) {
          this.cardStyle = 'selected'
          this.$emit('select-card', this.memberInfo)
        } else {
          this.cardStyle = ''
          this.$emit('unselect-card', this.memberInfo)
        }
      },
      showAccountAction() {
        this.accountAction = !this.accountAction
      },
      changeAccountStatus(type) {
        this.accountAction = false
        this.$emit('action-cell', type, this.memberInfo)
      },

      markMember() {
        this.$Message.info('功能暂未开放')
        this.$emit('action-cell', 'tag', this.memberInfo.id)
      },
      jumpDetail() {
        this.$emit('action-cell', 'detail', this.memberInfo)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .page-container {
    position: relative;
  }

  .member-card {
    position: relative;
    width: 264px;
    padding: 24px;
    font-family: SFUIDisplay-Light, SFUIDisplay, sans-serif;
    background: rgba(255, 255, 255, 1);
    border: 1px solid transparent;
    border-radius: 16px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);
    box-sizing: border-box;

    /* overflow: hidden; */

    &:hover {
      box-shadow: 0 12px 24px 0 rgba(0, 0, 0, 0.12);
    }
  }

  .selected {
    border: 1px solid rgba(117, 108, 234, 1);
  }

  .canceled {
    opacity: 0.6;
  }

  .frozen-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 264px;
    height: 60px;
    overflow: hidden;
    border-radius: 16px;
  }

  .frozen-tag {
    position: absolute;
    top: 0;
    left: -20px;
    padding: 4px 20px;
    font-size: 10px;
    font-weight: 300;
    color: white;
    background-color: #b4b3bf;
    transform: rotate(-45deg);
  }

  .user-photo {
    width: 64px;
    height: auto;
    max-height: 64px;
    padding: 4px;
    background: white;
    border: 1px solid rgba(226, 226, 234, 1);
    border-radius: 50%;
  }

  .photo-name {
    display: flex;
    justify-content: flex-start;
  }

  .name-container {
    padding: 6px;
    margin-left: 6px;
  }

  .title-container {
    line-height: 28px;
  }

  .card-title {
    display: inline-block;
    width: 100px;
    overflow: hidden;
    font-size: 18px;
    font-weight: 500;
    line-height: 28px;
    color: rgba(23, 23, 37, 1);
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
  }

  .card-desc {
    margin-top: 4px;
    font-family: SFUIDisplay-Light, SFUIDisplay;
    font-size: 12px;
    font-weight: 300;
    line-height: 22px;
    color: rgba(146, 146, 157, 1);
  }

  .select-member {
    position: absolute;
    top: 12px;
    right: 12px;
  }

  .small-block-narrow {
    margin-top: 16px;
  }

  .big-block-narrow {
    margin-top: 24px;
  }

  .user-gender {
    width: 24px;
    height: auto;
    max-height: 24px;
    margin-left: 4px;
    vertical-align: middle;
  }

  .property-list {
    display: flex;
    justify-content: space-evenly;
  }

  .separation-line {
    height: 16px;
    margin-top: 16px;
    border-right: 1px solid rgba(226, 226, 234, 1);
  }

  .property-name {
    font-size: 12px;
    font-weight: 300;
    line-height: 24px;
    color: rgba(181, 181, 190, 1);

    & > span {
      font-size: 12px;
    }

    & > .iconLocked {
      font-size: 18px;
    }
  }

  .property-value {
    height: 26px;
    margin-top: 10px;
    font-size: 14px;
    font-weight: 500;
    color: rgba(23, 23, 37, 1);
    text-align: center;
    vertical-align: middle;
    box-sizing: border-box;
  }

  .grey-text {
    color: rgba(146, 146, 157, 1);
  }

  .iconEdit {
    display: none;
    vertical-align: middle;
  }

  .edit-cell {
    .iconfont {
      color: #756cea;
      cursor: pointer;
    }
  }

  .edit-cell:hover {
    & > .point-value {
      display: none;
    }

    & > .iconEdit {
      display: inline;
    }
  }

  .none-member {
    display: flex;
    justify-content: center;

    & > img {
      width: 116px;
      height: auto;
    }
  }

  .vip-icon-list {
    display: flex;
    justify-content: center;
  }

  .vip-icon {
    width: 20px;
    height: 20px;
  }

  .register-info {
    text-align: center;

    & > span {
      font-size: 10px;
      font-weight: 300;
      line-height: 20px;
      color: rgba(181, 181, 190, 1);
    }
  }

  .btn-container {
    display: flex;
    justify-content: space-between;
    background: #fafafb;
    border-radius: 4px;

    & > span:not(:last-child) {
      border-right: 1px solid rgba(241, 241, 245, 1);
    }
  }

  .card-action {
    width: 72px;
    font-size: 14px;
    line-height: 32px;
    color: rgba(68, 68, 79, 1);
    text-align: center;
    vertical-align: middle;
    cursor: pointer;

    .iconfont {
      color: rgba(68, 68, 79, 1);
    }

    &:hover {
      /* border:1px solid #756CEA; */
      color: #756cea;
    }

    &:hover > .iconMore {
      color: #756cea;
      cursor: pointer;
    }
  }

  .cancel-card {
    display: flex;
    justify-content: center;
  }

  .more-action {
    height: 40px;
    padding: 0 6px;
    vertical-align: middle;
    background: rgba(255, 255, 255, 1);
    border: 1px solid #dcdee2;
    border-radius: 4px;
  }

  .cancel-member {
    padding: 6px 20px;
    color: rgba(181, 181, 190, 1);
    border-radius: 8px;
    opacity: 0.6;
  }

  .account-list {
    position: absolute;
    right: -26px;
    bottom: -88px;
    z-index: 2;
    width: 120px;
    list-style-type: none;
    background-color: white;
    border-radius: 8px;
    -webkit-box-shadow: 0 0 8px 0 rgba(181, 181, 190, 0.24);
    box-shadow: 0 0 8px 0 rgba(181, 181, 190, 0.24);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;

    & > li {
      padding: 6px 0 6px 16px;
      line-height: 24px;
      cursor: pointer;
    }

    & > li:hover {
      background: rgba(250, 250, 251, 1);
    }
  }

  .action-background {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    overflow: auto;
    background: rgba(79, 48, 14, 0.01);
  }
</style>
