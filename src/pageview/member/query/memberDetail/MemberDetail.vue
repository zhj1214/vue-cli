<template>
  <div class="member-detail">
    <h2 class="page-title">
      <span @click="backListPage"><i class="icon iconfont iconBack" title="返回" /></span>
      <span @click="backListPage">会员详情</span>
    </h2>
    <div class="detail-block">
      <div class="left-col">
        <div class="user-info">
          <div class="user-photo-container" :class="{ 'user-frozen': userInfo.isFrozen }">
            <img class="user-photo" :src="userInfo.headImg || defaultPhoto" alt="用户头像" />
            <span v-if="__hasPower('edit')" class="edit-icon">
              <i class="icon iconfont iconEdit" title="编辑" @click="openBasicInfoPop"
            /></span>
            <div v-if="userInfo.isFrozen" class="frozen-tag"> 冻结 </div>
          </div>

          <div class="info-container">
            <div class="brief-info">
              <div class="user-name" :class="{ 'frozen-user-name': userInfo.isFrozen }">
                {{ userInfo.memberName }}
              </div>
              <div v-if="userInfo.lastLoginTime !== ''" class="active-time">
                <span>最近活跃于</span>
                <span>{{ dateParser(userInfo.lastLoginTime) }}</span>
              </div>
              <div v-else class="active-time">
                <span>该用户尚未登录</span>
              </div>

              <div class="property-list middle-block-narrow">
                <div class="property-cell">
                  <div class="property-name"> 成长值 </div>
                  <div class="property-value color-text" @click="openGrowthPage">
                    {{ userInfo.growthBalance }}
                  </div>
                </div>
                <div class="separation-line" />
                <div>
                  <div class="property-name"> 积分 </div>
                  <!--                <div v-if="cardStatus !== 'cancel'" class="property-value edit-cell">-->
                  <!--                    <span class="point-value">{{ memberInfo.pointBalance }}</span>-->
                  <!--                    <i  class="icon iconfont iconEdit" title="编辑" ></i>-->
                  <!--                </div>-->
                  <div class="property-value color-text" @click="openPointPage">
                    <span>{{ userInfo.pointBalance }}</span>
                  </div>
                </div>
                <div v-if="hasVipLevel" class="separation-line" />
                <div v-if="hasVipLevel">
                  <div class="property-name">
                    <span>等级</span>
                    <i
                      v-if="userInfo.isFrozenLevel"
                      class="icon iconfont iconLocked"
                      title="保级"
                    />
                  </div>
                  <div class="property-value" :class="{ 'grey-text': userInfo.isFrozenLevel }">
                    <span>{{ createLevelName() }}</span>
                  </div>
                </div>
              </div>

              <div class="vip-icon-container big-block-narrow">
                <div v-if="false" class="vip-icon-list">
                  <img class="vip-icon" :src="superVipIcon" alt="会员图标" />
                </div>
                <div v-else class="none-member">
                  <img :src="notMemberText" alt="非付费会员" />
                </div>
              </div>
            </div>

            <ul class="personal-info">
              <li class="info-row">
                <i-col span="12">
                  <div class="info-name"> 昵称 </div>
                  <div class="info-value">
                    {{ userInfo.nickName || '-' }}
                  </div>
                </i-col>
                <i-col span="12" class="info-value">
                  <div class="info-name"> 手机号 </div>
                  <div class="info-value">
                    {{ userInfo.sensitivePhone }}
                  </div>
                </i-col>
              </li>
              <li class="info-row">
                <i-col span="12">
                  <div class="info-name"> 出生日期 </div>
                  <div class="info-value">
                    {{ userInfo.birthday || '-' }}
                  </div>
                </i-col>
                <i-col span="12" class="info-value">
                  <div class="info-name"> 年龄 </div>
                  <div class="info-value">
                    {{ userInfo.age || '-' }}
                  </div>
                </i-col>
              </li>
              <li class="info-row">
                <i-col span="12">
                  <div class="info-name"> 性别 </div>
                  <div class="info-value">
                    {{ createGenderText(userInfo.sex) }}
                  </div>
                </i-col>
                <i-col span="12" class="info-value">
                  <div class="info-name"> 婚姻状况 </div>
                  <div class="info-value">
                    {{ createMarriageText(userInfo.maritalStatus) }}
                  </div>
                </i-col>
              </li>
              <li class="info-row">
                <i-col span="12">
                  <div class="info-name"> 证件类型 </div>
                  <div class="info-value">
                    {{ createPaperText(userInfo.papersType) }}
                  </div>
                </i-col>
                <i-col span="12" class="info-value">
                  <div class="info-name"> 证件号 </div>
                  <div class="info-value">
                    {{ userInfo.papersNo || '-' }}
                  </div>
                </i-col>
              </li>
            </ul>

            <footer class="middle-block-narrow">
              <div class="origin-info"> ID：{{ userInfo.id }} </div>
              <div class="origin-info"> 注册于 {{ dateParser(userInfo.createTime) }} </div>
            </footer>
          </div>
        </div>

        <div class="address-container big-block-narrow">
          <div class="card-title">
            <span>收货地址</span>
            <span>
              <Tooltip placement="top" :content="addressRemainText()">
                <i class="icon iconfont iconAdd" title="增加" @click="openAddressPop('add')" />
              </Tooltip>
            </span>
          </div>
          <div v-for="(item, index) in displayAddressList" :key="index" class="address-info">
            <div v-if="item.isDefault" class="default-address"> [默认地址] </div>
            <div v-else class="address-order"> 地址 {{ item.order }} </div>

            <div>
              <span class="icon-space">
                <i class="icon iconfont iconAddress" title="地址" />
              </span>
              <span class="address-text">{{ item.province + item.city + item.county }}</span>
            </div>
            <div>
              <span class="icon-space" />
              <span class="address-text">{{ item.detailed }}</span>
            </div>
            <div class="receiver-action">
              <div>
                <span class="icon-space">
                  <i class="icon iconfont iconName" title="姓名" />
                </span>
                <span class="address-text text-ellipsis"
                  >{{ item.receiver }}（{{ item.receiverPhone }}）</span
                >
              </div>

              <div class="modify-address">
                <Poptip
                  confirm
                  title="删除后不可恢复，是否确认删除该地址？"
                  @on-ok="deleteAddress(item.id)"
                >
                  <i class="icon iconfont iconRemove" title="删除" />
                </Poptip>

                <i
                  class="icon iconfont iconEdit"
                  title="编辑"
                  @click="openAddressPop('edit', item)"
                />
              </div>
            </div>
          </div>

          <div class="page-dot-container">
            <div
              v-for="(item, index) in addressPageList"
              :key="index"
              :class="targetPageIndex === index ? 'active-dot' : 'default-dot'"
              class="page-dot"
              @click="changeDisplayAddress(item.page, index)"
            />
          </div>
        </div>

        <Modal v-model="showAddressPop" :title="createAddressPopTitle()" width="456" footer-hide>
          <div class="content">
            <Form
              ref="memberInfo"
              :label-width="100"
              :model="addressForm"
              :rules="addressModalValidate"
            >
              <FormItem label="收货地址：" prop="districtList">
                <!--                                <al-cascader class="w280"-->
                <!--                                             v-model="districtList"-->
                <!--                                             @on-change="chooseProvinceCity"-->
                <!--                                             :level="2"/>-->
                <Cascader
                  v-model="addressForm.districtList"
                  class="w280"
                  placeholder="请选择省 / 市 / 区"
                  :data="provinceCityList"
                  @on-change="chooseProvinceCity"
                />
              </FormItem>
              <FormItem label="" prop="detailed">
                <Input
                  v-model="addressForm.detailed"
                  class="w280"
                  placeholder="请输入详细地址"
                  :maxlength="80"
                />
              </FormItem>

              <FormItem label="收货人：" prop="receiver">
                <Input
                  v-model="addressForm.receiver"
                  class="w280"
                  placeholder="请输入收货人姓名"
                  :maxlength="10"
                />
              </FormItem>
              <FormItem label="联系方式：" prop="receiverPhone">
                <Input
                  v-model="addressForm.receiverPhone"
                  class="w280"
                  placeholder="请输入收货人联系方式"
                  :len="11"
                />
              </FormItem>

              <FormItem label="默认地址：">
                <RadioGroup v-model="defaultAddress">
                  <Radio label="1"> 是 </Radio>
                  <Radio label="2"> 否 </Radio>
                </RadioGroup>
              </FormItem>
            </Form>
            <div slot="footer" class="modal-footer">
              <Button type="default" size="large" class="w60 btn-gap" @click="cancelAddAddress">
                取消
              </Button>
              <Button type="primary" size="large" class="w60" @click="confirmAddress">
                确认
              </Button>
            </div>
          </div>
        </Modal>

        <Modal v-model="showBasicInfoPop" title="编辑基本信息" width="456" footer-hide>
          <div class="content">
            <Form
              ref="basicInfo"
              :label-width="100"
              :model="basicInfoForm"
              :rules="basicInfoValidate"
            >
              <FormItem label="手机号：" prop="phone">
                <Input
                  v-model="basicInfoForm.phone"
                  class="w280"
                  placeholder="手机号："
                  :maxlength="11"
                />
                <div class="phone-remind"> 修改后将改变用户登录账号，请谨慎修改。 </div>
              </FormItem>
              <FormItem label="姓名：" prop="memberName">
                <Input v-model="basicInfoForm.memberName" class="w280" placeholder="请输入姓名" />
              </FormItem>

              <FormItem label="证件号码：" prop="papersNo">
                <i-input v-model="basicInfoForm.papersNo" class="w280" placeholder="请输入证件号码">
                  <Select slot="prepend" v-model="basicInfoForm.papersTypeInt" style="width: 90px;">
                    <Option :value="1"> 身份证 </Option>
                    <Option :value="2"> 护照 </Option>
                    <Option :value="3"> 通行证 </Option>
                  </Select>
                </i-input>
              </FormItem>

              <FormItem label="性别：" prop="sex">
                <Select v-model="basicInfoForm.sex" class="w280">
                  <Option value="M"> 男 </Option>
                  <Option value="F"> 女 </Option>
                </Select>
              </FormItem>

              <FormItem label="出生日期：" prop="birthday">
                <DatePicker
                  type="date"
                  :value="basicInfoForm.birthday"
                  :options="timeOption"
                  format="yyyy-MM-dd"
                  placeholder="请选择出生日期"
                  class="w280"
                  @on-change="handleTimePicker"
                />
              </FormItem>

              <FormItem label="年龄：" prop="age">
                <Input v-model="basicInfoForm.age" class="w280" placeholder="请输入年龄" />
              </FormItem>

              <FormItem label="婚姻状况：" prop="maritalStatus">
                <Select
                  v-model="basicInfoForm.maritalStatus"
                  placeholder="请选择婚姻状况"
                  class="w280"
                >
                  <Option :value="1"> 已婚 </Option>
                  <Option :value="0"> 未婚 </Option>
                </Select>
              </FormItem>
            </Form>
            <div slot="footer" class="modal-footer">
              <Button type="default" size="large" class="w60 btn-gap" @click="cancelBasicInfo">
                取消
              </Button>
              <Button type="primary" size="large" class="w60" @click="addBasicInfo"> 确认 </Button>
            </div>
          </div>
        </Modal>
      </div>
      <div class="right-col">
        <div class="">
          <div class="member-portrait">
            <p class="label-header">
              <strong style="font-size: 18px;">会员画像</strong>
            </p>
            <div class="label-org">
              <span class="icon-hover">
                <i
                  v-if="__hasPower('edit') && labelPortrait.length > 0"
                  class="icon iconfont iconRemove"
                  @click="editLabelModal"
                />
                <i
                  v-if="__hasPower('edit')"
                  class="icon iconfont iconAdd"
                  @click="openLabelModal"
                />
              </span>
              <Select
                v-model="labelOrg"
                class="w240"
                placeholder="请输入标签所属组织名称"
                filterable
                clearable
                :remote-method="getSourceOrg"
                @on-change="getMemberPortrait"
              >
                <Scroll v-if="sourceList.length > 0" :height="200" :on-reach-bottom="getSourceOrg">
                  <Option v-for="(option, index) in sourceList" :key="index" :value="option.orgId">
                    {{ option.name }}
                  </Option>
                </Scroll>
              </Select>
            </div>

            <div class="clear member-portrait-height big-block-narrow">
              <div v-for="(labelGroup, indexS) in labelPortrait" :key="indexS" class="group-label">
                <h4>{{ labelGroup.labelTypeName }}</h4>
                <div class="tag-container">
                  <span
                    v-if="notOnePage(labelGroup.size)"
                    class="change-tag change-left action-text"
                    @click="changeLabelPage(indexS, -1)"
                  >
                    <i class="icon iconfont iconLeft" />
                  </span>
                  <div class="tag-list">
                    <Tooltip
                      v-for="(item, labelIndex) of labelGroup.labels"
                      :key="labelIndex"
                      placement="top"
                      max-width="300"
                    >
                      <div slot="content">
                        <p>所属组织：{{ displayBelongOrg(item.belongOrg, item.belongOrgStr) }}</p>
                        <p>标签ID：{{ item.id }}</p>
                      </div>
                      <span class="member-tag">{{ item.name }}</span>
                    </Tooltip>
                  </div>
                  <span
                    v-if="notOnePage(labelGroup.size)"
                    class="change-tag change-right"
                    @click="changeLabelPage(indexS, 1)"
                  >
                    <i class="icon iconfont iconRight" />
                  </span>
                </div>
                <div v-if="notOnePage(labelGroup.size)" class="tag-page">
                  <span class="color-text">{{ labelGroup.page }}/{{ labelGroup.size }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="right-box big-block-narrow">
          <Tabs v-model="selectedTab" type="card">
            <TabPane
              v-for="tab in memberTabs"
              :key="tab.value"
              :name="tab.value"
              :label="tab.label"
            />
          </Tabs>

          <keep-alive>
            <component :is="currentTabComponent" :member-id="memberId" />
            <!--                        <UserTravel :memberId="memberId"/>-->
          </keep-alive>
        </div>
      </div>
    </div>
    <!--打标签-->
    <Modal
      v-model="labelModal"
      title="打标签"
      :mask-closable="false"
      @on-cancel="onCancelLabelModal"
    >
      <Form
        ref="labelForm"
        onsubmit="return false"
        :model="labelForm"
        :rules="labelValidate"
        :label-width="150"
      >
        <FormItem label="标签名：" prop="labelIds">
          <i-select
            v-model="labelForm.labelIds"
            multiple
            filterable
            remote
            :remote-method="getAllLabels"
            @on-change="limitLabel"
          >
            <Option v-for="item in labelsList" :key="item.id" :value="item.id">
              {{ item.name }}
            </Option>
          </i-select>
        </FormItem>
      </Form>

      <div slot="footer">
        <Button type="primary" ghost @click="onCancelLabelModal"> 取消 </Button>
        <Button type="primary" @click="onSubmitLabel"> 确认 </Button>
      </div>
    </Modal>

    <Modal
      v-model="editLabelModalStatus"
      title="摘除手动标签"
      width="800"
      :mask-closable="false"
      @on-cancel="onCancelEditLabel"
    >
      <div class="member-portrait edit-label-pop">
        <div v-for="(labelGroup, indexS) in labelPortrait" :key="indexS" class="group-label">
          <h4>{{ labelGroup.labelTypeName }}</h4>
          <div class="tag-container">
            <span class="change-tag change-left action-text" @click="changeLabelPage(indexS, -1)">
              <i class="icon iconfont iconLeft" />
            </span>
            <div class="tag-list">
              <Tooltip
                v-for="(label, labelIndex) of labelGroup.labels"
                :key="labelIndex"
                placement="top"
                max-width="300"
              >
                <div slot="content">
                  <p>所属组织：{{ displayBelongOrg(label.belongOrg, label.belongOrgStr) }}</p>
                  <p>标签ID：{{ label.id }}</p>
                </div>
                <span :class="deleteLabelClass(label.isHand)" class="member-tag">
                  {{ label.name }}
                  <i
                    v-if="label.isHand"
                    class="icon iconfont iconClose"
                    @click="closeMemberLabel(label.id)"
                  />
                </span>
              </Tooltip>
            </div>
            <span class="change-tag change-right" @click="changeLabelPage(indexS, 1)">
              <i class="icon iconfont iconRight" />
            </span>
          </div>
          <div class="tag-page">
            <span class="color-text">{{ labelGroup.page }}/{{ labelGroup.size }}</span>
          </div>
        </div>
      </div>

      <div slot="footer">
        <Button type="primary" @click="onCancelEditLabel"> 关闭 </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { log, dateParser, getIdentityInfo } from '@/utils/tools'
  import _ from 'lodash'
  // import { provinceCityList } from '@/utils/provinceCityList';
  import UserTravel from './userTravel/UserTravel'
  import OrderRecord from './orderRecord/OrderRecord'
  import IdentityRecord from './identityRecord/IdentityRecord'
  import PointRecord from './pointRecord/PointRecord'

  import RegisterRecord from '@/pageview/member/query/memberDetail/registerRecord/RegisterRecord'

  import defaultPhoto from '@/assets/images/member/default_member_photo.png'

  import superVipIcon from '@/assets/images/member/super_vip_icon.png'
  import notMemberText from '@/assets/images/member/not_member_text.png'
  import mixinsGlobal from '@/mixins/mixinsGlobal'
  import { displayBelongOrg } from '@/pageview/member/memberTool'

  export default {
    name: 'MemberDetail',
    components: {
      UserTravel,
      OrderRecord,
      IdentityRecord,
      PointRecord,
      RegisterRecord,
    },
    mixins: [mixinsGlobal],
    data() {
      return {
        memberId: '',
        timeOption: {
          disabledDate(date) {
            // 禁用过去的时间
            return date && date.valueOf() > Date.now() - 86400000
          },
        },
        defaultPhoto: defaultPhoto,
        superVipIcon: superVipIcon,
        notMemberText: notMemberText,

        userInfo: {
          id: '',
          authenStatus: '',
          birthday: '',
          createTime: '',
          modifyTime: '',

          growthBalance: '',
          isFrozen: '',
          isFrozenLevel: '',

          isPerfect: '',
          memberName: '',
          organizationId: '',
          phone: '',

          pointBalance: '',
          sourceCode: '',
          status: '',
          virtualPhone: '',

          levelName: '',
          lastLoginTime: '',
          papersType: '',
          papersNo: '',
          levelId: '',

          payMember: '',
          nickName: '',
          age: '',
          sex: '',

          headImg: '',
        },

        showBasicInfoPop: false,
        basicInfoForm: {
          id: '',
          memberName: '',
          sex: '',
          papersTypeInt: 1,
          papersNo: '',

          birthday: '',
          age: '',
          phone: '',
          sensitivePhone: '',
          maritalStatus: '',
        },
        basicInfoValidate: {
          phone: [
            {
              required: true,
              message: '请输入手机号',
              trigger: 'blur',
              type: 'string',
            },
          ],
          papersNo: {
            type: 'string',
            trigger: 'blur',
            asyncValidator: (rule, value) => {
              return new Promise((resolve, reject) => {
                const reg = /^[1-8][0-9]{5}(19|20)\d{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/
                const identity = this.basicInfoForm.papersTypeInt === 1
                if (identity && !reg.test(value)) {
                  reject('证件号')
                } else {
                  this.autoFillInfo(value)
                  resolve()
                }
              })
            },
            message: '请输入正确的证件号',
          },
        },

        addressList: [],
        orderAddressList: [],
        displayAddressList: [],
        addressPageList: [],
        addressLimit: 18,

        targetPageIndex: 0,
        deleteAddressId: '',
        showAddressPop: false,
        districtList: [],

        addressPopType: 'add',
        currentAddressInfo: '',
        addressForm: {
          province: '',
          city: '',
          county: '',
          detailed: '',

          receiver: '',
          receiverPhone: '',
          isDefault: '',
          districtList: [],
        },
        defaultAddress: '1',

        phoneReg: /^1[3456789]\d{9}$/,
        addressModalValidate: {
          districtList: [
            {
              required: true,
              message: '请选择省/市/区',
              trigger: 'change',
              type: 'array',
            },
          ],
          detailed: [
            {
              required: true,
              message: '请输入收货地址',
              trigger: 'blur',
              type: 'string',
            },
          ],
          receiver: [
            {
              required: true,
              message: '请输入收货人姓名',
              trigger: 'blur',
              type: 'string',
            },
          ],
          receiverPhone: [
            {
              required: true,
              message: '请输入收货人联系方式',
              trigger: 'blur',
              type: 'string',
            },
            {
              type: 'string',
              trigger: 'blur',
              asyncValidator: (rule, value) => {
                return new Promise((resolve, reject) => {
                  const reg = this.phoneReg
                  if (!reg.test(value)) {
                    reject('证件号')
                  } else {
                    resolve()
                  }
                })
              },
              message: '请输入正确的联系方式',
            },
          ],
        },

        simpleGenderList: [
          {
            value: 'M',
            label: '男',
          },
          {
            value: 'F',
            label: '女',
          },
          {
            value: 'N',
            label: '未知',
          },
        ],
        maritalStatusList: [
          {
            value: 0,
            label: '未婚',
          },
          {
            value: 1,
            label: '已婚',
          },
          {
            value: 2,
            label: '离异',
          },
        ],

        paperTypeList: [
          {
            value: 1,
            label: '身份证',
          },
          {
            value: 2,
            label: '护照',
          },
          {
            value: 3,
            label: '通行证',
          },
        ],

        memberTabs: [
          {
            label: '用户旅程',
            value: 'userTravel',
          },
          {
            label: '积分记录',
            value: 'points',
          },
          {
            label: '订单记录',
            value: 'order',
          },
          {
            label: '身份记录',
            value: 'identity',
          },
          {
            label: '注册记录',
            value: 'register',
          },
        ],
        selectedTab: 'userTravel',

        // 会员画像模块
        labelModal: false,
        editLabelModalStatus: false,
        labelsList: [],
        // 标签的分页个数
        showTotalLabel: 10,

        labelPortrait: [], //会员画像
        // 筛选的出来的label id
        labelForm: {
          labelIds: [],
        },
        labelValidate: {
          labelIds: [{ required: true, type: 'array', message: '请选择标签名', trigger: 'change' }],
        },
        handleDebouncedScroll: {},
        sourceList: [],
        labelOrg: '',
        labelPageData: {
          page: 1,
          size: 50,
        },
        maxLabelOrg: false,
      }
    },
    computed: {
      hasVipLevel() {
        return this.userInfo.levelId !== '-1'
      },
      provinceCityList() {
        return this.$store.getters.cascadeCitys
      },
      isPayMember() {
        return this.userInfo.payMember !== '-1'
      },
      currentTabComponent() {
        const tabList = {
          userTravel: 'UserTravel',
          order: 'OrderRecord',
          identity: 'IdentityRecord',
          points: 'PointRecord',
          register: 'RegisterRecord',
        }
        return tabList[this.selectedTab]
      },
    },
    created() {
      this.initData()
      this.getMemberDetail()
      this.getSourceOrg()
    },
    mounted() {
      this.getMemberPortrait()
    },
    methods: {
      dateParser(date) {
        return dateParser(date)
      },
      displayBelongOrg(b, p) {
        return displayBelongOrg(b, p)
      },
      initData() {
        this.memberId = this.$route.query.id
        this.orgId = localStorage.getItem('orgId')
      },
      createGenderText(type) {
        const item = this.$_.find(this.simpleGenderList, { value: type })
        if (item === undefined) {
          return '-'
        }
        return item.label
      },
      createMarriageText(type) {
        const item = this.$_.find(this.maritalStatusList, { value: type })
        if (item === undefined) {
          return '-'
        }
        return item.label
      },
      // 证件类型
      createPaperText(type) {
        const item = this.$_.find(this.paperTypeList, { value: type })
        if (item === undefined) {
          return '-'
        }
        return item.label
      },
      getMemberDetail() {
        const data = {
          memberId: this.memberId,
        }

        const server = '/member-server'
        const url = server + '/member/info/detail'

        this.$ajaxGet(url, data)
          .then((res) => {
            if (res && res.code === 10000) {
              const resData = res.data
              const { birthday } = resData

              Object.assign(this.userInfo, resData)
              this.userInfo.birthday =
                birthday === undefined ? '' : dateParser(birthday, 'YYYY-MM-DD')

              this.addressList = resData.memberAddressDoList
              this.createAddressPage()
              this.orderAddressData()
            }
          })
          .catch((err) => {
            log(err)
          })
      },
      chooseProvinceCity(value, selectedData) {
        const [provinceName, cityName, countyName] = value
        const [provinceItem, cityItem, countyItem] = selectedData

        if (value.length > 0) {
          Object.assign(this.addressForm, {
            province: provinceName,
            city: cityName,
            county: countyName,
            provinceCode: provinceItem.code,
            cityCode: cityItem.code,
            countyCode: countyItem.code,
          })
        } else {
          Object.assign(this.addressForm, {
            province: '',
            city: '',
            county: '',
            provinceCode: '',
            cityCode: '',
            countyCode: '',
          })
        }
      },
      createAddressPage() {
        const filterPage = 3
        const length = this.addressList.length
        const pageLength = Math.ceil(length / filterPage)

        const tempList = []
        for (let i = 0; i < pageLength; i++) {
          const page = i * 3
          const item = {
            page: page,
            active: i === 0,
          }
          tempList.push(item)
        }

        this.addressPageList = tempList
      },
      changeDisplayAddress(page, index) {
        this.displayAddressList = this.orderAddressList.slice(page, page + 3)
        this.targetPageIndex = index
      },
      orderAddressData() {
        let defaultAddress = ''
        const tempList = []
        const hasDefaultAddress = this.$_.find(this.addressList, { isDefault: true })

        let order = hasDefaultAddress ? 2 : 1
        this.addressList.forEach((item) => {
          if (item.isDefault) {
            defaultAddress = {
              ...item,
              order: 0,
            }
          } else {
            const name = {
              ...item,
              order: order,
            }
            order++
            tempList.push(name)
          }
        })

        if (defaultAddress !== '') {
          tempList.unshift(defaultAddress)
        }

        this.orderAddressList = tempList
        this.displayAddressList = this.orderAddressList.slice(0, 3)
      },
      addressRemainText() {
        const length = this.addressList.length
        let text = ''
        text = `还可添加 ${this.addressLimit - this.addressList.length} 条地址信息`
        if (length >= this.addressLimit) {
          text = `已无法继续添加`
        }

        return text
      },
      deleteAddress(id) {
        this.deleteAddressId = id
        this.sendDeleteRequest()
      },
      sendDeleteRequest() {
        const server = '/member-server'
        const url = server + '/member/address/delete'
        const data = {
          id: this.deleteAddressId,
        }
        this.$ajaxPost(url, data)
          .then((res) => {
            if (res && res.code === 10000) {
              this.$Message.success(res.message)
              this.getMemberDetail()
            }
          })
          .catch((err) => {
            log(err)
          })
      },
      openAddressPop(type, currentAddress) {
        const length = this.addressList.length
        this.currentAddressInfo = currentAddress
        if (length >= this.addressLimit) {
          this.$Message.error('收货地址添加已达上限')
          return
        }

        this.showAddressPop = true
        this.addressPopType = type

        if (type === 'edit') {
          this.fillAddressPop()
        }
        this.createAddressPopTitle()
      },
      fillAddressPop() {
        Object.assign(this.addressForm, this.currentAddressInfo)
        const { province, city, county, isDefault } = this.currentAddressInfo
        this.addressForm.districtList = [province, city, county]
        this.defaultAddress = isDefault ? '1' : '2'
      },
      formatAddressData() {
        const data = {
          ...this.addressForm,
          memberId: this.memberId,
          isDefault: this.defaultAddress === '1',
        }
        delete data.districtList

        return data
      },
      validateAddress() {
        const { districtList, detailed, receiver, receiverPhone } = this.addressForm
        const emptyAddress = districtList.length === 0
        if (emptyAddress) {
          this.$Message.error('保存失败，您还未填写区域信息！')
          return true
        }

        if (detailed === '') {
          this.$Message.error('保存失败，您还未填写详细地址！')
          return true
        }
        if (receiver === '') {
          this.$Message.error('保存失败，您还未填写收货人！')
          return true
        }
        if (receiverPhone === '') {
          this.$Message.error('保存失败，您还未填写联系方式！')
          return true
        } else if (!this.phoneReg.test(receiverPhone)) {
          this.$Message.error('保存失败，联系方式格式错误！')
          return true
        }

        return false
      },
      confirmAddress() {
        const type = this.addressPopType
        if (type === 'add') {
          this.addAddress()
        } else if (type === 'edit') {
          this.editAddress()
        }
      },
      editAddress() {
        const server = '/member-server'
        const url = server + '/member/address/modify'

        const notPass = this.validateAddress('memberInfo')
        if (notPass) {
          this.showAddressPop = true
          return
        }
        const data = this.formatAddressData()
        data.id = this.currentAddressInfo.id

        this.$ajaxPost(url, data)
          .then((res) => {
            this.cancelAddAddress()
            if (res && res.code === 10000) {
              this.$Message.success(res.message)
              this.getMemberDetail()
            }
          })
          .catch((err) => {
            log(err)
          })
      },
      addAddress() {
        const server = '/member-server'
        const url = server + '/member/address/add'

        const notPass = this.validateAddress('memberInfo')
        if (notPass) {
          this.showAddressPop = true
          return
        }
        this.showAddressPop = false

        const data = this.formatAddressData()

        this.$ajaxPost(url, data)
          .then((res) => {
            this.cancelAddAddress()
            if (res && res.code === 10000) {
              this.$Message.success(res.message)
              this.getMemberDetail()
            }
          })
          .catch((err) => {
            log(err)
          })
      },

      cancelAddAddress() {
        this.showAddressPop = false
        this.addressForm = {
          province: '',
          city: '',
          county: '',
          detailed: '',

          receiver: '',
          receiverPhone: '',
          isDefault: '',
        }

        this.defaultAddress = '1'
        this.districtList = []
      },
      createAddressPopTitle() {
        const text = this.addressPopType === 'add' ? '新增' : '编辑'
        const complete = text + '收货地址'
        return complete
      },
      handleTimePicker(val) {
        this.basicInfoForm.birthday = val
      },
      openBasicInfoPop() {
        this.showBasicInfoPop = true
        const {
          id,
          memberName,
          sex,
          papersNo,
          birthday,
          age,
          phone,
          maritalStatus,
          papersType,
        } = this.userInfo

        Object.assign(this.basicInfoForm, {
          id: id,
          memberName: memberName,
          sex: sex,
          papersTypeInt: papersType,
          papersNo: papersNo,

          birthday: birthday,
          age: age,
          phone: phone,
          maritalStatus: maritalStatus,
        })
        // let { maritalStatus } = this.userInfo
        // this.basicInfoForm = maritalStatus === 1
      },
      validateBasicInfo() {
        const { phone } = this.basicInfoForm

        if (phone === '') {
          this.$Message.error('保存失败，您还未填写手机号！')
          return true
        }

        return false
      },
      cancelBasicInfo() {
        this.showBasicInfoPop = false
        this.$refs['basicInfo'].resetFields()
      },
      formatBasicInfo() {
        const data = {
          ...this.basicInfoForm,
        }
        const { phone } = this.basicInfoForm
        if (phone.includes('*')) {
          delete data.phone
        }

        return data
      },
      addBasicInfo() {
        const server = '/member-server'
        const url = server + '/member/info/modify'

        const notPass = this.validateBasicInfo()
        if (notPass) {
          return
        }
        this.showBasicInfoPop = false

        const data = this.formatBasicInfo()

        this.$ajaxPost(url, data)
          .then((res) => {
            if (res && res.code === 10000) {
              this.$Message.success(res.message)
              this.getMemberDetail()
            }
          })
          .catch((err) => {
            log(err)
          })
      },
      backListPage() {
        this.$router.push('/member/manage/query')
      },
      createLevelName() {
        const { levelId, levelName } = this.userInfo
        const text = `${levelId.slice(0, 2).toUpperCase()} ${levelId.slice(2)}-${levelName}`
        return text
      },
      openGrowthPage() {
        const phone = this.userInfo.phone
        this.$router.push({
          path: '/right/growthManage/growthDetail',
          query: {
            phone: phone,
          },
        })
      },
      openPointPage() {
        const phone = this.userInfo.phone
        this.$router.push({
          path: '/right/pointManage/pointDetail',
          query: {
            phone: phone,
          },
        })
      },
      autoFillInfo(cardId) {
        const birthday = getIdentityInfo(cardId, 1)
        const sex = getIdentityInfo(cardId, 2)
        const age = getIdentityInfo(cardId, 3)
        Object.assign(this.basicInfoForm, {
          birthday: birthday,
          sex: sex,
          age: age,
        })
      },
      // 打开增加标签modal
      openLabelModal() {
        this.labelModal = true
        this.getAllLabels()
      },
      // 关闭modal
      onCancelLabelModal() {
        this.labelModal = false
        this.labelForm.labelId = ''
        this.$refs['labelForm'].resetFields()
      },
      onSubmitLabel() {
        this.$refs['labelForm'].validate((valid) => {
          if (valid) this.memberAddLabel()
          else this.$Message.error('请检查错误！')
        })
      },
      // 拉取会员标签总列表
      getAllLabels(name = '') {
        this.$ajaxGet('/label-server/label/handLabelList', { name })
          .then((res) => {
            if (res && res.code === 10000) {
              this.labelsList = res.data || []
            }
          })
          .catch((err) => {
            console.log(err)
          })
      },
      editLabelModal() {
        this.editLabelModalStatus = true
      },
      onCancelEditLabel() {
        this.getMemberPortrait()
        this.labelForm.closeLabelIds = []
        this.editLabelModalStatus = false
      },
      // 关闭标签
      closeMemberLabel(labelId) {
        this.$ajaxPost('/label-server/internal/label/cancelTag2Member', {
          labelId,
          memberId: this.memberId,
        }).then((res) => {
          if (res && res.code === 10000) {
            this.$Message.success(res.message || '操作成功')
            this.getMemberPortrait()
          }
        })
      },
      // 增加标签
      memberAddLabel() {
        this.$ajaxPost('/label-server/label/tag2Member', {
          labelIds: this.labelForm.labelIds,
          memberIds: [this.userInfo.id],
        })
          .then((res) => {
            if (res && res.code === 10000) {
              this.$Message.success(res.message || '操作成功')
              this.getMemberPortrait()
              this.onCancelLabelModal()
            }
          })
          .catch((err) => {
            console.log(err)
          })
      },
      getSourceOrg(query = '') {
        const server = '/user-server'
        const url = server + '/platform/department/pageDepartment'

        const { page, size } = this.labelPageData
        // 已加载完所有的组织数据
        if (this.maxLabelOrg) {
          return
        }
        const data = {
          searchType: 'name',
          searchContent: query,
          page: page,
          size: size,
        }

        const p = new Promise((resolve, reject) => {
          this.$ajaxPost(url, data)
            .then((res) => {
              if (res.code === 10000) {
                this.renderLabelOrg(res.data)
                resolve()
              } else {
                reject()
              }
            })
            .catch((err) => {
              log(err)
            })
        })
        return p
      },
      renderLabelOrg(resData) {
        const list = resData !== undefined ? resData.list : []
        this.sourceList = this.sourceList.concat(list)
        const { page } = this.labelPageData

        const isMax = resData.count === this.sourceList.length
        this.maxLabelOrg = isMax
        if (!isMax) {
          this.labelPageData.page = page + 1
        }
      },
      debugImage() {
        const tempData = [
          {
            labelTypeName: '会员信息',
            labels: [
              {
                id: '497067',
                name: '手动标签002',
                isHand: true,
              },
              {
                id: '497022',
                name: '快乐',
                isHand: true,
              },
              {
                id: '23323',
                name: '难过😞',
                isHand: true,
              },
              {
                id: '4970322',
                name: '快乐',
                isHand: true,
              },
              {
                id: '233223',
                name: '难过😞',
                isHand: true,
              },
              {
                id: '4971022',
                name: '快乐',
                isHand: true,
              },
              {
                id: '233283',
                name: '难过😞',
                isHand: true,
              },
              {
                id: '4970229',
                name: '快乐',
                isHand: true,
              },
              {
                id: '233623',
                name: '难过😞',
                isHand: true,
              },
              {
                id: '4970222',
                name: '快乐',
                isHand: true,
              },
              {
                id: '2333323',
                name: '难过😞',
                isHand: true,
              },
              {
                id: '49778022',
                name: '快乐',
                isHand: true,
              },
              {
                id: '2332378',
                name: '难过😞',
                isHand: true,
              },
              {
                id: '2332379',
                name: '难23432',
                isHand: true,
              },
              {
                id: '2332380',
                name: '难过😞',
                isHand: true,
              },
              {
                id: '2332381',
                name: '难过😞',
                isHand: true,
              },
              {
                id: '2332382',
                name: '难过😞',
                isHand: true,
              },
              {
                id: '2332383',
                name: '难过😞',
                isHand: true,
              },
              {
                id: '2332384',
                name: '难过😞',
                isHand: true,
              },
            ],
          },
          {
            labelTypeName: '客户评价',
            labels: [
              {
                id: '224025',
                name: '手动标签001',
                isHand: true,
              },
            ],
          },
          {
            labelTypeName: '会员身份',
            labels: [
              {
                id: '250551',
                name: '属性规则标签-001',
                isHand: false,
              },
            ],
          },
        ]

        this.labelPortrait = this.createMemberImage(tempData)
      },
      // 获取会员画像
      getMemberPortrait() {
        this.labelPortrait = []
        this.$ajaxGet('/label-server/internal/label/memberImage', {
          memberId: this.memberId,
          orgId: this.labelOrg || this.orgId,
        }).then((res) => {
          if (res && res.code === 10000) {
            const resData = res.data || []
            this.labelPortrait = this.createMemberImage(resData)
          }
        })
        // this.debugImage()
      },
      createMemberImage(resList) {
        const container = []
        for (let i = 0; i < resList.length; i++) {
          const labelGroup = resList[i]
          const dataList = labelGroup.labels
          const size = Math.ceil(dataList.length / this.showTotalLabel)

          const labels = dataList.slice(0, this.showTotalLabel)

          const modal = {
            labelTypeId: labelGroup.labelTypeId,
            labelTypeName: labelGroup.labelTypeName,
            page: 1,
            size: size,
            dataList: dataList,
            labels: labels,
          }
          container.push(modal)
        }
        return container
      },
      changeLabelPage(groupIndex, action) {
        const group = _.cloneDeep(this.labelPortrait[groupIndex])
        let newPage = group.page + action
        if (newPage > group.size) {
          newPage = 1
        } else if (newPage === 0) {
          newPage = group.size
        }

        const start = this.showTotalLabel * (newPage - 1)
        const end = this.showTotalLabel + start
        const labels = group.dataList.slice(start, end)

        this.labelPortrait[groupIndex].page = newPage
        this.labelPortrait[groupIndex].labels = labels
      },
      deleteLabelClass(hand) {
        return hand ? 'delete-tag' : ''
      },
      notOnePage(p) {
        return p !== 1
      },
      limitLabel(l) {
        if (l.length > 20) {
          l.pop()
          this.$Message.error('一次最多只能加 20 个标签！')
        }
        this.labelForm.labelIds = l
      },
    },
  }
</script>

<style lang="scss" scoped>
  .page-title {
    margin-bottom: 28px;
    vertical-align: middle;

    & > span {
      font-family: SFUIDisplay-Semibold;
      font-size: 24px;
      font-weight: 600;
      line-height: 32px;
      color: rgba(62, 69, 82, 1);
      text-align: left;
      vertical-align: middle;
      cursor: pointer;

      /* vertical-align: middle; */
    }

    .iconBack {
      position: relative;
      display: inline-block;
      padding-right: 12px;
      font-size: 24px;
      vertical-align: middle;
      transform: translateY(-2.5px);
    }
  }

  .detail-block {
    display: flex;
    justify-content: flex-start;
  }

  .left-col {
    /* margin-right: 24px; */
    padding-right: 24px;
  }

  .right-col {
    width: 100%;
  }

  .user-info {
    width: 360px;
    overflow: hidden;
    background: rgba(255, 255, 255, 1);
    border-radius: 16px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);
  }

  .user-photo-container {
    position: relative;
    width: 360px;
    height: 76px;
    background: url('../../../../assets/images/member/user_background.png') no-repeat 0 0;
    background-size: 100%;
    border-radius: 16px 16px 0 0;
  }

  .user-frozen {
    background: url('../../../../assets/images/member/user_background_frozen.png') no-repeat 0 0;
  }

  .edit-icon {
    position: absolute;
    top: 88px;
    right: 24px;

    .iconEdit {
      color: #b6b3b6;
      cursor: pointer;

      &:hover {
        color: #756cea;
      }
    }
  }

  .user-photo {
    position: absolute;
    top: 32px;
    left: 50%;
    z-index: 2;
    width: 88px;
    padding: 4px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(226, 226, 234, 1);
    border-radius: 50%;
    transform: translateX(-50%);
  }

  .info-container {
    padding: 24px;
    background: rgba(255, 255, 255, 1);
    border-radius: 16px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);
  }

  .brief-info {
    border-bottom: 1px solid rgba(226, 226, 234, 1);
  }

  .user-name {
    margin-top: 52px;
    font-size: 24px;
    font-weight: 500;
    line-height: 34px;
    color: rgba(23, 23, 37, 1);
    text-align: center;
  }

  .frozen-user-name {
    color: rgba(146, 146, 157, 1);
  }

  .active-time {
    margin-top: 6px;
    text-align: center;

    & > span {
      font-size: 12px;
      font-weight: 300;
      line-height: 22px;
      color: rgba(146, 146, 157, 1);
    }

    & > span:first-child {
      padding-right: 4px;
    }
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
    vertical-align: middle;

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

  /* .iconEdit { */

  /*    display: none; */

  /*    vertical-align: middle; */

  /* } */

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

  .middle-block-narrow {
    margin-top: 20px;
  }

  .big-block-narrow {
    margin-top: 24px;
  }

  .vip-icon-container {
    margin-bottom: 40px;
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

  .color-text {
    color: rgba(117, 108, 234, 1);
  }

  .personal-info {
    padding-top: 2px;
    padding-bottom: 24px;
    border-bottom: 1px solid rgba(226, 226, 234, 1);
  }

  .info-row {
    display: flex;
    margin-top: 20px;
    justify-content: space-between;
  }

  .info-name {
    font-size: 12px;
    font-weight: 300;
    line-height: 22px;
    color: rgba(146, 146, 157, 1);
  }

  .info-value {
    margin-top: 4px;
  }

  .origin-info {
    font-size: 10px;
    font-weight: 300;
    line-height: 20px;
    color: rgba(181, 181, 190, 1);
    text-align: center;
  }

  .right-box {
    padding: 24px;
    background-color: white;
    border-radius: 24px;
  }

  .block-name {
    position: relative;
    padding-bottom: 24px;
    font-size: 18px;
    font-weight: 500;
    line-height: 28px;
    color: rgba(23, 23, 37, 1);
    border-bottom: 1px solid rgba(226, 226, 234, 1);

    &::before {
      position: absolute;
      left: -24px;
      width: 6px;
      height: 28px;
      background: rgba(117, 108, 234, 1);
      border-radius: 0 8px 8px 0;
      content: '\00a0';
    }
  }

  .component-narrow {
    margin-right: 8px;
  }

  .address-container {
    width: 360px;
    padding: 24px;
    background: rgba(255, 255, 255, 1);
    border-radius: 16px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);
    box-sizing: border-box;
  }

  .card-title {
    display: flex;
    justify-content: space-between;

    & > span:first-child {
      font-size: 16px;
      font-weight: 500;
      line-height: 26px;
      color: rgba(23, 23, 37, 1);
    }

    .iconAdd {
      color: rgba(117, 108, 234, 1);
      cursor: pointer;
    }
  }

  .address-info {
    margin-bottom: 20px;

    .iconfont {
      color: rgba(146, 146, 157, 1);
      vertical-align: middle;
    }
  }

  .address-order {
    font-size: 12px;
    font-weight: 300;
    line-height: 22px;
    color: rgba(146, 146, 157, 1);
  }

  .address-text {
    display: inline-block;
    width: 220px;
    overflow: hidden;
    font-size: 14px;
    font-weight: 300;
    line-height: 24px;
    color: rgba(23, 23, 37, 1);
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
  }

  .receiver-action {
    display: flex;
    justify-content: space-between;

    &:first-child {
      margin-right: 4px;
    }

    .iconfont {
      vertical-align: middle;
      cursor: pointer;
    }
  }

  .modify-address {
    display: none;
  }

  .address-info:hover .modify-address {
    display: inline-block;

    .iconfont:hover {
      color: rgba(117, 108, 234, 1);
    }
  }

  .icon-space {
    display: inline-block;
    width: 28px;

    .iconfont {
      vertical-align: middle;
    }
  }

  .default-address {
    font-size: 12px;
    font-weight: 300;
    line-height: 22px;
    color: rgba(117, 108, 234, 1);
  }

  .page-dot-container {
    display: flex;
    justify-content: center;

    & > div:not(:last-child) {
      margin-right: 4px;
    }
  }

  .page-dot {
    cursor: pointer;
    border-radius: 2px;
  }

  .default-dot {
    width: 12px;
    height: 4px;
    background: rgba(226, 226, 234, 1);
    border-radius: 2px;
  }

  .active-dot {
    width: 24px;
    height: 4px;
    background: rgba(117, 108, 234, 1);
    border-radius: 2px;
  }

  .modal-footer {
    display: flex;
    padding-top: 14px;
    border-top: 1px solid rgba(226, 226, 234, 1);
    justify-content: flex-end;
  }

  .btn-gap {
    margin-right: 8px;
  }

  .phone-remind {
    margin-top: 4px;
    font-size: 12px;
    font-weight: 300;
    line-height: 22px;
    color: rgba(146, 146, 157, 1);
  }

  .frozen-tag {
    position: absolute;
    top: -4px;
    left: -18px;
    padding: 10px 20px 4px 20px;
    font-size: 10px;
    font-weight: 300;
    color: white;
    background-color: #b4b3bf;
    transform: rotate(-45deg);
  }

  .member-portrait-height {
    max-height: 460px;
    overflow-y: auto;

    .group-label:not(:last-child) {
      margin-bottom: 36px;
    }
  }

  .label-header {
    //display: flex;
    //justify-content: space-between;
    width: 100%;
  }

  .label-org {
    position: absolute;
    top: 24px;
    right: 24px;
  }

  .member-portrait {
    //margin-bottom: 24px;
    position: relative;
    padding: 24px;
    background: white;
    border-radius: 24px;

    h4 {
      height: 38px;
      padding: 8px 12px;
      background: #fafafb;
      border-radius: 8px;
    }

    .member-tag {
      display: inline-block;
      padding: 0 12px;
      margin-top: 8px;
      margin-left: 10px;
      font-size: 12px;
      font-weight: 300;
      line-height: 22px;
      color: #696974;
      background: #f6f6f7;
      border: 1px solid #d5d5db;
      border-radius: 10px;
    }

    .delete-tag {
      padding-right: unset;

      .iconClose {
        cursor: pointer;
      }
    }
  }

  .edit-label-pop {
    padding: 8px !important;
  }

  .tag-warp {
    padding: 12px 24px;

    span {
      display: inline-block;
      padding: 2px 8px;
      background: #f7f4f8;
      border: 1px solid #e3e1e4;
      border-radius: 16px;

      & + span {
        margin-top: 8px;
        margin-left: 10px;
      }
    }
  }

  .tag-container {
    display: flex;
    margin-top: 20px;
    margin-bottom: 20px;
    line-height: 36px;
    justify-content: space-between;

    .change-tag {
      display: flex;
      cursor: pointer;
      justify-content: center;
      align-items: center;

      .icon {
        font-size: 24px;
        color: #696974;
      }
    }

    .change-left {
      margin-right: 8px;
    }

    .change-right {
      margin-left: 8px;
    }
  }

  .tag-list {
    min-width: 630px;
  }

  .tag-page {
    text-align: center;
  }

  .table-layout {
    padding: 24px;
    background: white;
    border-radius: 24px;
  }

  .icon-hover {
    margin-right: 20px;
    color: #bbb8bb;

    i {
      cursor: pointer;

      &:hover {
        color: #756cea;
      }
    }
  }
</style>
