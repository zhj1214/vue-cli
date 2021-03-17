<template>
  <div class="page-container">
    <div
      class="member-card"
      :class="cardStyle"
    >
      <div class="photo-name">
        <div class="frozen-container">
          <div
            v-if="frozenStatus"
            class="frozen-tag"
          >
            冻结
          </div>
        </div>

        <img
          class="user-photo"
          :src="memberInfo.headImg || defaultPhoto"
        >
        <div class="name-container">
          <div class="title-container">
            <span
              class="card-title"
              :class="{'grey-text': frozenStatus }"
            >{{ memberInfo.memberName || memberInfo.nickName || '-' }}</span>
            <img
              v-if="memberInfo.sex !== 'N'"
              class="user-gender"
              :src="showGender()"
              alt="用户性别"
            >
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
          <div class="property-name">
            成长值
          </div>
          <div class="property-value">
            {{ memberInfo.growthBalance }}
          </div>
        </div>
        <div class="separation-line" />
        <div>
          <div class="property-name">
            积分
          </div>
          <!--                <div v-if="cardStatus !== 'cancel'" class="property-value edit-cell">-->
          <!--                    <span class="point-value">{{ memberInfo.pointBalance }}</span>-->
          <!--                    <i  class="icon iconfont iconEdit" title="编辑" ></i>-->
          <!--                </div>-->
          <div class="property-value">
            <span>{{ memberInfo.pointBalance }}</span>
          </div>
        </div>
        <div
          v-if="hasVipLevel && levelStatus"
          class="separation-line"
        />
        <div v-if="hasVipLevel && levelStatus">
          <div class="property-name">
            <span>等级</span>
            <i
              v-if="memberInfo.isFrozenLevel"
              class="icon iconfont iconLocked"
              title="保级"
            />
          </div>
          <div
            class="property-value"
            :class="{'grey-text': memberInfo.isFrozenLevel }"
          >
            <span>{{ displayLevelName }}</span>
          </div>
        </div>
      </div>

      <div
        v-if="true"
        class="none-member big-block-narrow"
      >
        <img
          :src="notMemberText"
          alt="非付费会员"
        >
      </div>
      <div
        v-else
        class="vip-icon-list big-block-narrow"
      >
        <img
          class="vip-icon"
          :src="superVipIcon"
          alt="会员图标"
        >
      </div>

      <div class=" small-block-narrow">
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

      <div
        v-if="cardStatus !== 'cancel'"
        class="btn-container big-block-narrow"
      >
        <span
          class="card-action"
          @click="jumpDetail"
        >详情</span>
        <span
          class="card-action"
          @click="markMember"
        >打标签</span>
        <span
          class="card-action"
          @click="showAccountAction"
        >
          <i
            class="icon iconfont iconMore"
            title="更多"
          />
        </span>
      </div>
      <div
        v-else
        class="btn-container big-block-narrow cancel-card"
      >
        <span class="cancel-member">已注销</span>
      </div>

      <ul
        v-if="accountAction &&(cardStatus !== 'cancel')"
        class="account-list"
      >
        <li @click="changeAccountStatus('cancel')">
          账户注销
        </li>
        <li @click="changeAccountStatus('accountStatus')">
          账户状态
        </li>
        <li @click="changeAccountStatus('logout')">
          账户登出
        </li>
      </ul>

      <div
        v-if="accountAction &&(cardStatus !== 'cancel')"
        class="action-background"
        @click="showAccountAction"
      />
    </div>
  </div>
</template>

<script>
    // import { log } from "@/utils/tools";
    import { dateParser } from "@/utils/tools";
    import defaultPhoto from "@/assets/images/member/default_member_photo.png";
    import femaleIcon from "@/assets/images/member/female_icon.png";
    import maleIcon from "@/assets/images/member/male_icon.png";

    import superVipIcon from "@/assets/images/member/super_vip_icon.png";
    import notMemberText from "@/assets/images/member/not_member_text.png";

    export default {
        name: "MemberCard",
        components: {  },
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
                return `LV ${ level }`
            }
        },
        watch: {
            unselectOutside: function (n) {
                if(n) {
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
        updated() {
        },
        methods: {
            dateParser(date) {
                return dateParser(date)
            },
            renderPage(data) {
                let { status, isFrozen, } = data
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
        }
    }
</script>

<style lang="scss"  scoped>
    .page-container {
        position: relative;
    }

    .member-card {
        position: relative;
        box-sizing: border-box;
        padding: 24px;
        width:264px;

        background:rgba(255,255,255,1);
        border: 1px solid transparent;
        box-shadow:0px 2px 12px 0px rgba(0,0,0,0.04);
        border-radius:16px;

        font-family:SFUIDisplay-Light,SFUIDisplay,sans-serif;
        /*overflow: hidden;*/

        &:hover {
            box-shadow:0px 12px 24px 0px rgba(0,0,0,0.12);
        }
    }

    .selected {
        border:1px solid rgba(117, 108, 234, 1);
    }

    .canceled {
        opacity: 0.6;
    }

    .frozen-container {
        position: absolute;
        width:264px;
        height: 60px;
        border-radius:16px;
        top: 0;
        left: 0;
        overflow: hidden;
    }

    .frozen-tag {
        position: absolute;
        top: 0;
        left: -20px;
        font-size: 10px;
        font-weight: 300;
        color: white;
        background-color: #B4B3BF;
        transform: rotate(-45deg);
        padding: 4px 20px;
    }

    .user-photo {
        width:64px;
        padding: 4px;
        height: auto;
        border-radius: 50%;
        max-height:64px;
        background: white;
        border:1px solid rgba(226,226,234,1);
    }

    .photo-name {
        display: flex;
        justify-content: flex-start;
    }

    .name-container {
        margin-left: 6px;
        padding: 6px;
    }

    .title-container {
        line-height: 28px;
    }

    .card-title {
        display: inline-block;
        font-size:18px;
        font-weight:500;
        color:rgba(23,23,37,1);
        line-height:28px;
        vertical-align: middle;

        text-overflow: ellipsis;
        width: 100px;
        overflow: hidden;
        white-space: nowrap;
    }

    .card-desc {
        margin-top: 4px;
        font-size:12px;
        font-family:SFUIDisplay-Light,SFUIDisplay;
        font-weight:300;
        color:rgba(146,146,157,1);
        line-height:22px;
    }

    .select-member {
        position: absolute;
        right: 12px;
        top: 12px;
    }

    .small-block-narrow {
        margin-top: 16px;
    }

    .big-block-narrow {
        margin-top: 24px;
    }

    .user-gender {
        margin-left: 4px;
        width: 24px;
        height: auto;
        max-height: 24px;
        vertical-align: middle;
    }

    .property-list {
        display: flex;
        justify-content: space-evenly;
    }

    .separation-line {
        margin-top: 16px;
        height: 16px;
        border-right: 1px solid rgba(226,226,234,1);
    }
    .property-name {
        line-height: 24px;
        font-size:12px;
        font-weight:300;
        color:rgba(181,181,190,1);

        & > span {
            font-size:12px;
        }

        & > .iconLocked {
            font-size: 18px;
        }
    }

    .property-value {
        margin-top: 10px;
        height: 26px;
        box-sizing: border-box;
        font-size:14px;

        vertical-align: middle;
        font-weight:500;
        color:rgba(23,23,37,1);
        text-align: center;
    }

    .grey-text {
        color:rgba(146,146,157,1);
    }

    .iconEdit {
        display: none;
        vertical-align: middle;
    }
    .edit-cell {
        .iconfont {
            cursor: pointer;
            color: #756CEA;
        }
    }
    .edit-cell:hover  {
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

    .register-info  {
        text-align: center;
        & > span {
            font-size:10px;
            font-weight:300;
            color:rgba(181,181,190,1);
            line-height:20px;
        }
    }

    .btn-container {
        display: flex;
        justify-content: space-between;
        background: #FAFAFB;
        border-radius: 4px;

        & > span:not(:last-child) {
            border-right: 1px solid rgba(241,241,245,1);
        }
    }

    .card-action {
        width: 72px;
        line-height: 32px;
        vertical-align: middle;
        text-align: center;
        cursor: pointer;

        font-size:14px;
        color:rgba(68,68,79,1);

        .iconfont {
            color:rgba(68,68,79,1);
        }

        &:hover {
            /*border:1px solid #756CEA;*/
            color: #756CEA;
        }
        &:hover > .iconMore {
            cursor: pointer;
            color: #756CEA;
        }

    }

    .cancel-card {
        display: flex;
        justify-content: center;
    }

    .more-action {
        vertical-align: middle;
        background:rgba(255,255,255,1);
        border-radius:4px;
        border:1px solid #dcdee2;
        height: 40px;
        padding: 0 6px;


    }

    .cancel-member {
        padding: 6px 20px;
        color:rgba(181,181,190,1);
        border-radius:8px;
        opacity:0.6;
    }

    .account-list {
        position: absolute;
        z-index: 2;
        background-color: white;
        width: 120px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        -webkit-box-shadow: 0px 0px 8px 0px rgba(181, 181, 190, 0.24);
        box-shadow: 0px 0px 8px 0px rgba(181, 181, 190, 0.24);
        border-radius: 8px;
        right: -26px;
        bottom: -88px;
        list-style-type: none;

        & > li {
            cursor: pointer;
            padding: 6px 0 6px 16px;
            line-height:24px;
        }

        & > li:hover {
            background:rgba(250,250,251,1);
        }
    }

    .action-background {
        position: fixed;
        overflow: auto;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1;
        background: rgba(79, 48, 14, 0.01);
    }
</style>
