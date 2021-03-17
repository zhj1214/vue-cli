<!--
- 移除注销功能
-->
<template>
  <div class="member-query">
    <div class="search-container">
      <div
        v-if="foldSearch"
        ref="searchBlock"
        class="search-block"
      >
        <div>
          <div class="action-block">
            <Button
              v-if="__hasPower('addMember')"
              class="button-gap w90"
              type="primary"
              @click="openMemberPop"
            >
              新增会员
            </Button>
            <Button
              v-if="__hasPower('addMark')"
              type="primary"
              :disabled="countSelectMember < 1"
              class="mr-10"
              @click="markMember"
            >
              打标签
            </Button>
            <span
              class="more-action"
              @click="showActionList"
            >
              <span>更多</span>
              <i
                class="icon iconfont iconTreeFold"
                title="更多"
              />
            </span>

            <div
              v-if="actionListStatus"
              class="action-list"
            >
              <ul class="parent-action-container">
                <li
                  v-for="(item, index) in memberActions"
                  :key="index"
                  :class="{ 'select-parent-action': selectParentIndex === index }"
                  :value="item.value"
                  class="parent-action"
                  @click="chooseSubAction(item, index)"
                >
                  {{ item.label }}<i
                    class="icon iconfont iconRight"
                    title="向右"
                  />
                </li>
              </ul>
              <ul class="sub-action-container">
                <li
                  v-for="(item, index) in subAction"
                  :key="index"
                  class="sub-action"
                  :class="{ 'not-select-member': selectParentIndex === '' }"
                  @click="operateSelectedMember(item.value)"
                >
                  <span>{{ item.label }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div
            v-if="actionListStatus"
            class="action-background"
            @click="showActionList"
          />

          <div class="search-separate-line" />

          <DatePicker
            type="daterange"
            placement="bottom-end"
            class="component-narrow w260"
            placeholder="开始时间 → 结束时间"
            format="yyyy-MM-dd"
            :value="[searchData.createTimeStart, searchData.createTimeEnd]"
            @on-change="handleTimePiker"
          />
        </div>

        <div>
          <i-input
            v-model="searchData.content"
            search
            class="w240 identity-search button-gap"
            placeholder="姓名/昵称/手机号/身份证/ID"
            @on-search="searchList"
          >
            <i
              slot="suffix"
              class="icon iconfont iconSearch"
              title="更多"
            />
          </i-input>


          <div
            v-if="advancedFilterStatus"
            class="fold-block-active"
            @click="toggleAdvancedFilter"
          >
            <span class="filter-container">
              <i
                class="icon iconfont iconFilter"
                title="筛选"
              />
              <i
                class="icon iconfont iconDropdownUnfold"
                title="更多"
              />
            </span>
          </div>

          <div
            v-else
            class="fold-block-normal"
            @click="toggleAdvancedFilter"
          >
            <i
              class="icon iconfont iconFilter"
              title="筛选"
            />
            <i
              class="icon iconfont iconTreeFold"
              title="更多"
            />
          </div>
        </div>
      </div>

      <div
        v-if="advancedFilterStatus"
        class="advanced-block"
      >
        <div class="filter-row">
          <FilterTag
            :list="genderListFilter"
            :filter-name="'性别'"
            @updateTag="updateGenderFilter"
          />
        </div>

        <div class="filter-row">
          <span>积分值区间：</span>
          <InputNumber
            v-model="searchData.scoreLimitStart"
            class="w110"
            :max="99999"
            :min="0"
            placeholder="最低积分值"
          />
          <span class="input-separator">~</span>
          <InputNumber
            v-model="searchData.scoreLimitEnd"
            :max="99999"
            :min="0"
            class="w110"
            placeholder="最高积分值"
          />

          <span class="filter-narrow">成长值区间：</span>
          <InputNumber
            v-model="searchData.growthLimitStart"
            class="w110"
            :max="99999"
            :min="0"
            placeholder="最低成长值"
          />
          <span class="input-separator">~</span>
          <InputNumber
            v-model="searchData.growthLimitEnd"
            :max="99999"
            :min="0"
            class="w110"
            placeholder="最高成长值"
          />
        </div>


        <div
          v-if="memberLevelList.length !== 0"
          class="filter-row"
        >
          <FilterTag
            :list="memberLevelFilter"
            :filter-name="'会员等级'"
            @updateTag="updateMemberFilter"
          />
        </div>
        <div class="filter-row one-row-flex">
          <span>注册来源：</span>
          <Select
            v-model="searchData.registerOrgId"
            class="w240"
            filterable
            :remote-method="getSourceOrg"
          >
            <Option
              v-for="(option, index) in sourceList"
              :key="index"
              :value="option.orgId"
            >
              {{ option.name }}
            </Option>
          </Select>

          <span class="filter-narrow">已注册组织：</span>
          <BelongOrgCascade @selectOrg="searchOrgId" />
        </div>
        <div class="filter-row">
          <FilterTag
            :list="accountStatusList"
            :filter-name="'账号状态'"
            @updateTag="updateAccountFilter"
          />
        </div>
        <div class="filter-row">
          <FilterTag
            :list="registerChannelList"
            :filter-name="'注册端口'"
            @updateTag="updateRegisterChannel"
          />
        </div>

        <div class="last-row">
          <Button
            class="button-gap w60"
            type="primary"
            @click="filterList"
          >
            筛选
          </Button>
          <Button
            class="button-gap w60"
            type="default"
            @click="toggleAdvancedFilter"
          >
            取消
          </Button>
        </div>
      </div>

      <div
        v-if="advancedFilterStatus"
        class="displayFilterList"
      >
        <div
          v-if="displaySelectedGender.length > 0"
          class="displayListEach"
        >
          <span>性别：</span>
          <span>{{ displaySelectedGender }}</span>
          <i
            class="icon iconfont iconClose"
            title="删除"
            @click="initGenderFilter"
          />
        </div>

        <div
          v-if="displaySelectedLevel.length > 0"
          class="displayListEach"
        >
          <span>会员等级：</span>
          <span>{{ displaySelectedLevel }}</span>
          <i
            class="icon iconfont iconClose"
            title="删除"
            @click="initMemberLevelFilter"
          />
        </div>

        <div
          v-if="displayAccountStatus.length > 0"
          class="displayListEach"
        >
          <span>账号状态：</span>
          <span>{{ displayAccountStatus }}</span>
          <i
            class="icon iconfont iconClose"
            title="删除"
            @click="initAccountFilter"
          />
        </div>

        <div
          v-if="displayRegisterChannel.length > 0"
          class="displayListEach"
        >
          <span>注册端口：</span>
          <span>{{ displayRegisterChannel }}</span>
          <i
            class="icon iconfont iconClose"
            title="删除"
            @click="initRegisterChannel"
          />
        </div>


        <div
          class="reset-btn action-text"
          @click="initSearch"
        >
          重置筛选项
        </div>
      </div>
    </div>

    <div
      v-if="countSelectMember !== 0&&selectType==='all'"
      class="select-info-block"
    >
      <div>
        <i
          class="icon iconfont iconInfo color-text"
          title="更多"
        />
        <span>当前已选择</span>
        <span class="select-count">{{ countSelectMember }}</span>
        <span>项</span>
      </div>
      <span
        class="action-text"
        @click="clearSelect"
      >清空</span>
    </div>

    <div class="card-container">
      <BaseTable
        ref="baseTable"
        :list="list"
        :col="tableCol"
        :page-data="pageData"
        :loading="loading"
        :row-class-name="rowClassName"
        @on-selectTable="onSelectTable"
        @on-pageChange="onPageChange"
        @on-pageSize="onPageSize"
      />
    </div>

    <!--        新增会员-->
    <Modal
      v-model="memberPop"
      title="新增会员"
      width="456"
      :mask-closable="false"
      footer-hide
      @on-visible-change="memberPopVisible"
    >
      <div class="content">
        <Form
          ref="memberInfo"
          :label-width="90"
          :model="memberForm"
          :rules="memberModalValidate"
        >
          <FormItem
            label="手机号："
            prop="phone"
          >
            <Input
              v-model="memberForm.phone"
              class="w280"
              placeholder="请输入会员手机号"
              :maxlength="11"
            />
          </FormItem>
          <FormItem
            label="姓名："
            prop="memberName"
          >
            <Input
              v-model="memberForm.memberName"
              class="w280"
              placeholder="请输入会员姓名"
              :maxlength="10"
            />
          </FormItem>
          <FormItem
            label="性别："
            prop="sex"
          >
            <Select
              v-model="memberForm.sex"
              placeholder="请选择性别"
              class="w280"
            >
              <Option
                v-for="item in simpleGenderList"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </Option>
            </Select>
          </FormItem>
          <FormItem
            label="出生日期："
            prop="birthday"
          >
            <DatePicker
              type="date"
              :value="memberForm.birthday"
              :options="timeOption"
              format="yyyy-MM-dd"
              placeholder="请选择出生日期"
              class="w280"
              @on-change="handleTimePicker"
            />
          </FormItem>
        </Form>
        <div class="view-footer huge-block-narrow">
          <Button
            class="text-narrow"
            @click="cancelAddMember"
          >
            取消
          </Button>
          <Button
            type="primary"
            @click="addMember"
          >
            确定
          </Button>
        </div>
      </div>
    </Modal>
    <!-- 积分调整 -->
    <Modal
      v-model="pointPop"
      title="积分调整"
      width="456"
      footer-hide
      :mask-closable="false"
    >
      <div class="content">
        <Form
          ref="changeLevel"
          :label-width="100"
          :model="pointForm"
          :rules="pointModalValidate"
        >
          <FormItem
            label="积分："
            prop="scoreValue"
          >
            <i-input
              v-model="pointForm.scoreValue"
              maxlength="8"
              placeholder="0"
              @on-keyup="allowInt('scoreValue')"
            >
              <Select
                slot="prepend"
                v-model="pointForm.isAdd"
                style="width: 80px"
                @on-change="choosePointType"
              >
                <Option value="1">
                  增加
                </Option>
                <Option value="-1">
                  减少
                </Option>
              </Select>
            </i-input>
          </FormItem>

          <FormItem
            label="变更类型："
            prop="remark"
          >
            <Cascader
              v-model="tempChangeTypePoint"
              class="w240 big-row-narrow"
              :data="showPointType"
              placeholder="请选择变更类型"
              trigger="hover"
              @on-change="(e) => this.selectActions(e, 'point')"
            />
          </FormItem>
          <FormItem
            label="备注："
            prop="remark"
          >
            <Input
              v-model="pointForm.remark"
              type="textarea"
              maxlength="100"
              show-word-limit
              :rows="4"
              placeholder="请填写备注，不超过 100 字"
            />
          </FormItem>
        </Form>

        <div class="view-footer huge-block-narrow">
          <Button
            class="text-narrow"
            @click="cancelAdjustPoint"
          >
            取消
          </Button>
          <Button
            type="primary"
            @click="adjustPoint"
          >
            确定
          </Button>
        </div>
      </div>
    </Modal>

    <!-- 账户状态调整 -->
    <Modal
      v-model="accountStatusPop"
      title="账户状态调整"
      :mask-closable="false"
      width="456"
      @on-ok="changeAccountStatus"
      @on-cancel="cancelAccountStatus"
    >
      <div class="content">
        <Form :label-width="90">
          <FormItem label="状态调整：">
            <RadioGroup v-model="frozenAction">
              <Radio label="1">
                冻结账户
              </Radio>
              <Radio label="2">
                解冻账户
              </Radio>
            </RadioGroup>
            <div class="frozen-desc">
              账户冻结后，会员将无法登录公众号和小程序；解冻后恢复正常。
            </div>
          </FormItem>
        </Form>
      </div>
    </Modal>

    <!-- 等级调整 -->
    <Modal
      v-model="levelPop"
      footer-hide
      title="等级调整"
      width="456"
      :mask-closable="false"
    >
      <div class="content">
        <Form
          ref="changeLevel"
          :label-width="100"
          :model="levelForm"
          :rules="levelModalValidate"
        >
          <FormItem
            label="等级变更："
            prop="isChangeGrade"
          >
            <RadioGroup v-model="levelForm.isChangeGrade">
              <Radio label="1">
                <span>是</span>
              </Radio>
              <Radio label="2">
                <span>否</span>
              </Radio>
            </RadioGroup>

            <div v-if="levelForm.isChangeGrade === '1'">
              <span class="button-gap">等级变更至</span>
              <Select
                v-model="levelForm.levelId"
                placeholder="请选择等级"
                class="w120"
              >
                <Option
                  v-for="item in memberLevelFilter"
                  :key="item.id"
                  :value="item.value"
                >
                  {{ item.label }}
                </Option>
              </Select>
            </div>
            <div
              v-if="levelForm.isChangeGrade === '1'"
              class="form-remind"
            >
              若操作等级变更，该用户的成长值将更新为所选等级的门槛分值
            </div>
          </FormItem>
          <FormItem
            label="等级冻结："
            prop="isFrozenLevel"
          >
            <RadioGroup v-model="levelForm.isFrozenLevel">
              <Radio label="1">
                <span>是</span>
              </Radio>
              <Radio label="0">
                <span>否</span>
              </Radio>
            </RadioGroup>
            <div class="form-remind">
              冻结后，该用户将永久保留当前等级
            </div>
          </FormItem>
          <FormItem
            label="备注："
            prop="remark"
          >
            <Input
              v-model="levelForm.remark"
              type="textarea"
              maxlength="100"
              show-word-limit
              :rows="4"
              placeholder="请填写备注"
            />
          </FormItem>
        </Form>

        <div class="view-footer huge-block-narrow">
          <Button
            class="text-narrow"
            @click="cancelAdjustLevel"
          >
            取消
          </Button>
          <Button
            type="primary"
            @click="adjustLevel"
          >
            确定
          </Button>
        </div>
      </div>
    </Modal>

    <!-- 成长值调整 -->
    <Modal
      v-model="growthPop"
      title="成长值调整"
      width="456"
      footer-hide
      :mask-closable="false"
    >
      <div class="content">
        <Form
          ref="changeLevel"
          :label-width="100"
          :model="growthForm"
          :rules="growthModalValidate"
        >
          <FormItem
            label="成长值："
            prop="scoreValue"
          >
            <i-input
              v-model="growthForm.scoreValue"
              placeholder="0"
              @on-keyup="allowInt('scoreValue')"
            >
              <Select
                slot="prepend"
                v-model="growthForm.isAdd"
                style="width: 80px"
                @on-change="chooseGrowthType"
              >
                <Option value="1">
                  增加
                </Option>
                <Option value="-1">
                  减少
                </Option>
              </Select>
            </i-input>
          </FormItem>
          <FormItem
            label="变更类型："
            prop="remark"
          >
            <Cascader
              v-model="tempGrowthType"
              class="w240 big-row-narrow"
              :data="showGrowthType"
              placeholder="请选择变更类型"
              trigger="hover"
              @on-change="(e) => this.selectActions(e, 'growth')"
            />
          </FormItem>
          <FormItem
            label="备注："
            prop="remark"
          >
            <Input
              v-model="growthForm.remark"
              type="textarea"
              maxlength="100"
              show-word-limit
              :rows="4"
              placeholder="请填写备注，不超过 100 字"
            />
          </FormItem>
        </Form>

        <div class="view-footer huge-block-narrow">
          <Button
            class="text-narrow"
            @click="cancelAdjustGrowth"
          >
            取消
          </Button>
          <Button
            type="primary"
            @click="adjustGrowth"
          >
            确定
          </Button>
        </div>
      </div>
    </Modal>

    <!-- 给会员打标签 -->
    <Modal
      v-model="actionLabelStatus"
      title="加标签"
      :mask-closable="false"
      @on-cancel="onCancelSubmit"
    >
      <Form
        v-if="actionLabelStatus"
        ref="labelForm"
        onsubmit="return false"
        :model="labelForm"
        :rules="labelRules"
        :label-width="150"
      >
        <FormItem
          label="添加标签"
          prop="labelIds"
        >
          <Select
            v-model="labelForm.labelIds"
            multiple
            filterable
            remote
            :remote-method="getLabelList"
            @on-change="limitLabel"
          >
            <Option
              v-for="item in labelList"
              :key="item.id"
              :value="item.id"
            >
              {{ item.name }}
            </Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="onCancelSubmit">
          取消
        </Button>
        <Button
          type="primary"
          :disabled="isSubmitLoading"
          :loading="isSubmitLoading"
          @click="onSubmitLabel"
        >
          确定
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import FilterTag from "./FilterTag";
import {formatNumber, log, createCascadeFormat, createRangeTime,} from "@/utils/tools";
import BaseTable from "../../base/BaseTable";
import {memberTableCol} from './memberTableCol';

import mixinsGlobal from "../../../mixins/mixinsGlobal";
import BelongOrgCascade from "@/components/BelongOrgCascade";

export default {
    name: "QueryMember",
    components: {
        FilterTag,
        BaseTable,
        BelongOrgCascade,
    },
    mixins: [mixinsGlobal],
    props: {},
    data() {
        return {
            actionLabelStatus: false,
            isSubmitLoading: false,
            labelForm: {
                labelIds: []
            },
            labelRules: {
                labelIds: [{required: true, type: "array", message: "请选择标签", trigger: "change"}],
            },
            labelList: [],
            timeOption: {
                disabledDate(date) {
                    // 禁用过去的时间
                    return date && date.valueOf() > Date.now() - 86400000;
                }
            },
            foldSearch: true,
            // new feature
            moreIndex: -1,

            searchData: {
                createTimeStart: '',
                createTimeEnd: '',
                content: '',

                scoreLimitStart: null,
                scoreLimitEnd: null,
                growthLimitStart: null,
                growthLimitEnd: null,

                levelIds: [],
                registrationSource: [],
                sex: [],
                orgId: '777777',

                status: '',
                isFrozen: '',
                isFrozenLevel: '',
                registerOrgId: '',

                actualRegistrationOrgId: [],
            },
            tempActualOrg: [],
            tempRegister: [],

            pageData: {
                page: 1,
                size: 10,
                count: 0,
            },

            list: [],
            tableCol: memberTableCol.call(this),
            loading: false,
            selectList: [],
            genderList: [
                {
                    value: '',
                    label: '全部'
                },
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

            abnormalStatus: [],
            abnormalList: [
                // {
                // 	value: 'cancel',
                // 	label: '账户注销',
                // },
                {
                    value: 'frozen',
                    label: '账户冻结',
                },
                {
                    value: 'level',
                    label: '等级冻结',
                },
            ],

            registerList: [
                {
                    value: '1',
                    label: '公众号注册'
                },
                {
                    value: '2',
                    label: '小程序注册'
                },
                {
                    value: '3',
                    label: '运营注册'
                },
                {
                    value: '4',
                    label: '人工导入'
                },
            ],

            currentActionMember: '',
            currentStatusType: '',
            accountStatusPop: false,
            frozenAction: '1',

            memberPop: false,
            memberForm: {
                phone: '',
                memberName: '',
                sex: '',
                birthday: '',
            },
            memberModalValidate: {
                phone: [
                    {
                        required: true,
                        message: "请输入手机号",
                        trigger: 'blur',

                        type: 'string'
                    },
                    {
                        len: 11,
                        trigger: 'blur',
                        message: "手机号为 11 位",
                    }
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
            actionListStatus: false,

            selectParentIndex: '',
            batchActionType: '',
            subAction: [
                {
                    value: 'select',
                    label: '对选中的人调整',
                }
            ],
            memberIds: [],
            singleMember: '',
            // 选择卡片的类型： all 所有 single 操作当前卡片
            selectType: 'all',
            clearAll: false,

            // 高级筛选
            advancedFilterStatus: false,
            genderListFilter: [{
                label: '全部',
                value: '',
                selected: true,
                isAll: false,
            }, {
                label: '男',
                value: 'M',
                selected: false,
                isAll: false,
            }, {
                label: '女',
                value: 'F',
                selected: false,
                isAll: false,
            }, {
                label: '不详',
                value: 'N',
                selected: false,
                isAll: false,
            },],
            displaySelectedGender: '',

            memberLevelList: [],
            memberLevelFilter: [],
            displaySelectedLevel: '',

            accountStatusList: [{
                label: '账号冻结',
                value: 'accountFrozen',
                selected: false,
                isAll: false,
            }, {
                label: '等级冻结',
                value: 'levelFrozen',
                selected: false,
                isAll: false,
            },
                {
                    label: '已注销',
                    value: 'logout',
                    selected: false,
                    isAll: false,
                },
            ],
            displayAccountStatus: '',

            registerChannelList: [{
                label: '全部',
                value: '',
                selected: true,
                isAll: false,
            },
                // {
                // 	label: '公众号',
                // 	value: 1,
                // 	selected: false,
                // 	isAll: false,
                // },
                {
                    label: '小程序',
                    value: 2,
                    selected: false,
                    isAll: false,
                },
                {
                    label: '后台（人工创建）',
                    value: 3,
                    selected: false,
                    isAll: false,
                },
                // {
                // 	label: '人工导入',
                // 	value: 4,
                // 	selected: false,
                // 	isAll: false,
                // },
            ],
            displayRegisterChannel: '',

            // 等级调整弹窗
            levelPop: false,
            levelForm: {
                orgId: '',
                isChangeGrade: '2',
                levelId: '',
                isFrozenLevel: '0',
                remark: '',
                memberIds: [],
            },
            tempChangeLevel: '',
            // 等级模式是否启用
            levelEnable: false,


            levelModalValidate: {
                isChangeGrade: [
                    {
                        required: true,
                        message: "请选择是否变更等级",
                        trigger: 'blur',
                        type: 'string'
                    }
                ],
                isFrozenLevel: [
                    {
                        required: true,
                        message: "请选择是否冻结等级",
                        trigger: 'blur',
                        type: 'string'
                    }
                ],
                remark: [
                    {
                        required: true,
                        message: "请填写备注",
                        trigger: 'blur',
                        type: 'string'
                    }
                ],
            },

            growthPop: false,
            growthForm: {
                memberIds: '',
                isAdd: '1',
                scoreValue: '',
                remark: '',
            },
            tempGrowthType: [],

            growthModalValidate: {
                scoreValue: [
                    {
                        required: true,
                        message: "请选择填写成长值",
                        trigger: 'blur',
                        type: 'string'
                    }
                ],
                remark: [
                    {
                        required: true,
                        message: "请填写备注",
                        trigger: 'blur',
                        type: 'string'
                    }
                ],
            },
            pointPop: false,
            pointForm: {
                memberIds: '',
                isAdd: '1',
                scoreValue: '',
                remark: '',

                scoreChangeType: '',
            },
            tempChangeTypePoint: [],

            pointModalValidate: {
                scoreValue: [
                    {
                        required: true,
                        message: "请选择填写积分",
                        trigger: 'blur',
                        type: 'string'
                    }
                ],
                remark: [
                    {
                        required: true,
                        message: "请填写备注",
                        trigger: 'blur',
                        type: 'string'
                    }
                ],
            },

            registerOrgList: [
                {
                    value: 'New York',
                    label: 'New York'
                },
                {
                    value: 'London',
                    label: 'London'
                },
                {
                    value: 'Sydney',
                    label: 'Sydney'
                },
                {
                    value: 'Ottawa',
                    label: 'Ottawa'
                },
                {
                    value: 'Paris',
                    label: 'Paris'
                },
                {
                    value: 'Canberra',
                    label: 'Canberra'
                }
            ],

            existOrgTree: [{
                value: 'beijing',
                label: '北京',
                children: [
                    {
                        value: 'gugong',
                        label: '故宫'
                    },
                    {
                        value: 'tiantan',
                        label: '天坛'
                    },
                    {
                        value: 'wangfujing',
                        label: '王府井'
                    }
                ]
            },],

            pointChangeType: [],
            showPointType: [],
            growthChangeType: [],
            showGrowthType: [],

            // 注册来源 option
            sourceList: [],
        };
    },
    computed: {
        countSelectMember() {
            return this.memberIds.length;
        },
        memberActions() {
            let a = [
                {
                    value: 'point',
                    label: '积分调整',
                },
                {
                    value: 'growth',
                    label: '成长值调整',
                },
                {
                    value: 'level',
                    label: '等级调整',
                },
                {
                    value: 'cancel',
                    label: '账户注销',
                },
                {
                    value: 'status',
                    label: '账户状态调整',
                },
            ]

            let rightMatch = {
                point: this.__hasPower('pointAdjust'),
                growth: this.__hasPower('growthAdjust'),
                level: this.__hasPower('levelAdjust'),
                cancel: this.__hasPower('cancelAccount'),
                status: this.__hasPower('accountStatus'),
            }
            let b = this.removeRightAction(a, rightMatch)
            return b
        },
    },
    created() {
        this.initData();
        this.chooseTimeRange('threeMonth')
        // this.debugAdvanced()
        this.getLevelStatus();

        this.getMemberLevel();
        this.getList();
        this.getLabelList();

        this.getChangeTypeList()
        this.getOrgList()
        this.getSourceOrg()
    },
    methods: {
        initData() {
            let orgId = localStorage.orgId
            this.searchData.orgId = orgId || '777777'
        },
        // 调试高级筛选
        debugAdvanced() {
            this.advancedFilterStatus = true
        },
        markMember() {
            this.actionLabelStatus = true;
        },
        getLabelList(name = "") {
            this.$ajaxGet("/label-server/label/handLabelList", {name})
                .then(res => {
                    if (res && res.code === 10000) {
                        this.labelList = res.data || [];
                    }
                });
        },
        formatChangeType(list) {
            // let name = {
            //     point: '积分',
            //     growth: '成长值',
            // }
            // let base = [{
            //     value: '1',
            //     label: name[type] + '增加',
            //     children: [],
            // }, {
            //     value: '2',
            //     label: name[type] + '减少',
            //     children: [],
            // }, ]
            // for (let i = 0; i < base.length; i++) {
            //     let b = base[i]
            //     let key = b.value
            //     b.children = list.filter(item => item.value.startsWith(key))
            //         .map(item => {
            //             return {
            //                 value: item.value,
            //                 label: item.code,
            //             }
            //         })
            // }
            //
            // return base
            //
            return list.map(item => {
                return {
                    value: item.value,
                    label: item.code,
                }
            })
        },
        getChangeTypeList() {
            this.$ajaxGet("/points-server/api/score/detail/changeType")
                .then(res => {
                    if (res && res.code === 10000) {
                        log('res.data', res.data)
                        let point = this.formatChangeType(res.data)
                        this.pointChangeType = point
                        this.showPointType = this.filterChangeType(this.pointChangeType)

                        let growth = this.formatChangeType(res.data)
                        this.growthChangeType = growth
                        this.showGrowthType = this.filterChangeType(this.growthChangeType, 'growth')
                    }
                });
        },
        choosePointType() {
            this.showPointType = this.filterChangeType(this.pointChangeType)
            log('showPointType', this.showPointType)
        },
        chooseGrowthType() {
            this.showGrowthType = this.filterChangeType(this.growthChangeType, 'growth')
            log('showPointType', this.showPointType)
        },
        filterChangeType(list, type = 'point') {
            let key = this.pointForm.isAdd === '1' ? '1' : '2'
            if (type === 'growth') {
                key = this.growthForm.isAdd === '1' ? '1' : '2'
            }
            return list.filter(item => item.value.startsWith(key))
        },
        selectActions(value, type) {
            let emptyValue = value.length === 0
            if (emptyValue) {
                value = ['', '']
            }
            let subType = value[0]

            if (type === 'point') {
                Object.assign(this.pointForm, {
                    scoreChangeType: subType,
                })
            } else if (type === 'growth') {
                Object.assign(this.growthForm, {
                    scoreChangeType: subType,
                })
            }
        },
        onCancelSubmit() {
            this.actionLabelStatus = false;
            this.labelForm.labelIds = [];
        },
        onSubmitLabel() {
            this.$refs["labelForm"].validate(valid => {
                if (valid) {
                    this.isSubmitLoading = true;
                    this.$ajaxPost("/label-server/label/tag2Member", {
                        labelIds: this.labelForm.labelIds,
                        memberIds: this.memberIds
                    })
                        .then(res => {
                            if (res && res.code === 10000) {
                                this.searchList();
                                this.onCancelSubmit();
                            }
                            this.isSubmitLoading = false;
                        });
                }
            });
        },
        createSelectedFilter(list) {
            let tempList = [];
            let result = '';
            if (list.length > 0) {

                list.forEach((item) => {
                    if (item.selected && (item.value !== '')) {
                        tempList.push(item.value);
                    }
                });
                result = tempList.length > 0 ? tempList : '';
            }

            return result;
        },
        isSelectTag(list, type) {
            let flag = this.$_.find(list, {
                value: type,
                selected: true,
            });

            return flag !== undefined;
        },
        formatData() {
            let {page, size} = this.pageData;
            let data = {
                page,
                size,
                ...this.searchData,
            };
            data.levelIds = this.createSelectedFilter(this.memberLevelFilter);
            data.registrationSource = this.createSelectedFilter(this.registerChannelList);

            let frozenAccount = this.isSelectTag(this.accountStatusList, 'accountFrozen');
            if (frozenAccount) {
                data.isFrozen = 1;
            }

            let logoutAccount = this.isSelectTag(this.accountStatusList, 'logout');
            if (logoutAccount) {
                data.status = 2;
            }

            let levelFrozen = this.isSelectTag(this.accountStatusList, 'levelFrozen');
            if (levelFrozen) {
                data.isFrozenLevel = 1;
            }
            log('this.tempRegister', this.tempRegister)
            if (this.tempRegister.length === 0) {
                data.actualRegistrationOrgId = ''
            } else {
                data.actualRegistrationOrgId = this.tempRegister.slice(-1)[0]
            }

            return data;
        },
        searchList() {
            this.pageData.page = 1;
            this.getList();
        },
        getList() {
            let data = this.formatData();
            this.loading = true;
            this.list = []
            this.$ajaxPost("/member-server/member/info/list", data)
                .then(res => {
                    if (res && res.code === 10000) {
                        let resData = res.data;
                        this.list = (resData.list || []).map(item => {
                            return {...item, _disabled: item.status === 2};
                        });
                        this.pageData.count = resData.total || 0;
                        this.memberIds = [];
                    }
                    this.loading = false;
                })
                .catch(err => {
                    log(err);
                });
        },
        selectMember(member) {
            this.selectType = 'all';
            let current = this.selectList;
            current.push(member);
            this.selectList = this.$_.uniqBy(current, 'id');
            this.updateMemberIds();
        },
        updateMemberIds() {
            let list = [];
            this.selectList.forEach((item) => {
                list.push(item.id);
            });
            this.memberIds = list;
        },
        unselectMember(member) {
            let id = member.id;
            let list = this.selectList;
            this.$_.remove(list, (item) => {
                return item.id === id;
            });
            this.selectList = list;
            this.updateMemberIds();
        },
        onPageChange(page) {
            this.memberIds = [];
            this.selectList = [];
            this.pageData.page = page;
            this.$nextTick(() => {
                this.getList();
            });
        },
        rowClassName(row) {
            if (row.status === 2) return "logout-row";
            else if (row.isFrozen) return "lock-row";
            return '';
        },
        onSelectTable(selection) {
            this.selectType = 'all';
            this.selectList = selection;
            this.memberIds = selection.map(item => item.id);
        },
        onPageSize(size) {
            this.pageData.size = size;
            this.$nextTick(() => {
                this.getList();
            });
        },
        handleTimePiker(val) {
            let startDate = val[0];
            let endDate = val[1];
            if (startDate) {
                startDate = startDate + " 00:00:00";
                endDate = endDate + " 23:59:59";
            }

            Object.assign(this.searchData, {
                createTimeStart: startDate,
                createTimeEnd: endDate,
            });
            this.getList();
        },
        changeMemberInfo(type, memberInfo) {
            this.currentActionMember = memberInfo;
            this.selectType = 'single';
            this.singleMember = [memberInfo.id];
            // this.memberIds.push(memberInfo.id)

            let handlers = {
                point: this.openPointPop,
                growth: this.openGrowthPop,
                level: () => {
                    if (this.levelEnable) {
                        this.openLevelPop();
                    } else {
                        this.$Message.error('等级模式已停用，不能调整等级');
                    }
                },

                // 状态调整
                status: this.openAccountStatusPop,
                // 注销
                cancel: this.openCancelPop,
                logout: this.openLogoutPop,
                detail: this.openDetailPage,
            };
            let fn = handlers[type];
            if (fn) {
                fn();
            }
        },
        openDetailPage() {
            this.jumpMemberDetail();
        },
        openAccountStatusPop() {
            this.currentStatusType = 3;
            this.accountStatusPop = true;
        },
        openLogoutPop() {
            this.$Modal.confirm({
                title: '账户登出',
                content: '<p>账户登出将使所选用户在手机端重新登录，您是否确认账户登出？</p>',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                    this.currentStatusType = 2;
                    this.sendAccountRequest();
                }
            });
        },
        openCancelPop() {
            this.$Modal.confirm({
                title: '账户注销',
                content: '<p>注销后账户将永久删除，用户无法再次登录，您是否确认注销？</p>',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                    this.currentStatusType = 1;
                    this.sendAccountRequest();
                }
            });
        },
        sendAccountRequest() {
            let server = '/member-server';
            let url = server + '/member/info/status';
            let frozen = this.frozenAction === '1';

            if (this.currentStatusType !== 3) {
                frozen = '';
            }

            let data = {
                memberIds: this.memberIds,
                statusType: this.currentStatusType,
                is_frozen: frozen,
            };
            if (this.selectType === 'single') {
                data.memberIds = this.singleMember;
            }
            this.$ajaxPost(url, data)
                .then(res => {
                    this.cancelAccountStatus();
                    if (res && res.code === 10000) {
                        this.$Message.success(res.message);
                        this.getList();
                    }
                })
                .catch(err => {
                    log(err);
                });
        },
        changeAccountStatus() {
            this.sendAccountRequest();
        },
        cancelAccountStatus() {
            this.currentActionMember = '';
            this.currentStatusType = '';

            this.frozenAction = '1';
            this.initActionList();
        },
        initActionList() {
            this.actionListStatus = false;
            this.selectParentIndex = '';
            this.batchActionType = '';

            if (this.memberIds.length > 0) {
                this.clearSelect();
            }
        },
        chooseSubAction(item, index) {
            this.batchActionType = item.value;
            this.selectParentIndex = index;

            // 关闭等级模式时不显示弹窗
            let isLevelItem = item.value === 'level';
            if (isLevelItem && !this.levelEnable) {
                this.$Message.error('等级模式已停用，不能调整等级');
            }
        },
        createOptionalUser() {
            let tempList = [];
            this.list.forEach((item) => {
                if (item.status !== 2) {
                    tempList.push(item.id);
                }
            });

            this.memberIds = tempList;
        },
        operateSelectedMember(type) {
            if (type === 'filter') {
                this.createOptionalUser();
            } else {
                let notSelectUser = this.memberIds.length === 0;
                if (notSelectUser) {
                    this.$Message.error('请选择用户');
                    this.initActionList();
                    return;
                }
            }

            let handlers = {
                point: () => {
                    this.openPointPop();
                },
                growth: () => {
                    this.openGrowthPop();
                },
                cancel: () => {
                    this.currentStatusType = 1;
                    this.openCancelPop();
                },
                status: () => {
                    this.currentStatusType = 3;
                    this.openAccountStatusPop();
                },
                logout: () => {
                    this.currentStatusType = 2;
                    this.openLogoutPop();
                },
                level: () => {
                    if (this.levelEnable) {
                        this.openLevelPop();
                    }
                }
            };

            let fn = handlers[this.batchActionType];
            fn();
        },
        showActionList() {
            let isOpen = this.actionListStatus;
            if (isOpen) {
                this.selectParentIndex = '';
                this.batchActionType = '';
            }
            this.actionListStatus = !this.actionListStatus;
        },
        openPointPop() {
            this.pointPop = true;
        },
        // 清空已选中
        clearSelect() {
            this.clearAll = true;
            this.memberIds = [];
            this.selectList = [];
            this.pageData.page = 1;
            this.$nextTick(() => {
                this.getList();
            });
        },
        initSearch() {
            let orgId = this.searchData.orgId;
            this.searchData = {
                createTimeStart: '',
                createTimeEnd: '',
                content: '',

                scoreLimitStart: null,
                scoreLimitEnd: null,
                growthLimitStart: null,
                growthLimitEnd: null,

                levelIds: [],
                registrationSource: [],
                sex: [],
                orgId: orgId,

                status: '',
                isFrozen: '',
                isFrozenLevel: '',
            };

            this.pageData = {
                page: 1,
                size: 10,
                count: 0,
            };

            this.abnormalStatus = '';

            this.$nextTick(() => {
                this.initGenderFilter();
                this.initMemberLevelFilter();
                this.initAccountFilter();
                this.initRegisterChannel();
                this.getList();
            });
        },
        filterList() {
            this.pageData.page = 1;
            this.getList();
        },
        updateGenderFilter(updateList) {
            this.genderListFilter = updateList;
            let previewList = this.createPreviewText(updateList);
            const sexMap = {"男": "M", "女": "F", "不详": "N"};
            this.searchData.sex = previewList.map(item => sexMap[item]);
            this.displaySelectedGender = previewList.join('；');
        },
        createPreviewText(updateList) {
            let tempList = [];
            updateList.forEach((item) => {
                if (item.selected && item.value !== '') {
                    tempList.push(item.label);
                }
            });
            return tempList;
        },
        updateMemberFilter(updateList) {
            this.memberLevelFilter = updateList;
            let previewList = this.createPreviewText(updateList);
            this.displaySelectedLevel = previewList.join('；');
        },
        createLevelName(levelId) {
            return `${levelId.slice(0, 2).toUpperCase()} ${levelId.slice(2)}`;
        },
        createLevelFilter() {
            let tempList = [];
            this.memberLevelList.forEach((item) => {
                let {levelId} = item;

                let formatName = this.createLevelName(levelId);
                let formatItem = {
                    label: formatName,
                    value: levelId,
                    selected: false,
                    isAll: false,
                };
                tempList.push(formatItem);
            });

            this.memberLevelFilter = tempList;
        },
        getMemberLevel() {
            let server = '/grade-server';
            let url = server + '/api/level/list';
            let data = {
                orgId: this.searchData.orgId
            };
            this.list = [];
            this.$ajaxGet(url, data)
                .then(res => {
                    if (res && res.code === 10000) {
                        let resData = res.data;
                        this.memberLevelList = resData || [];
                        this.createLevelFilter();
                    }
                })
                .catch(err => {
                    log(err);
                });
        },
        getLevelStatus() {
            let server = '/grade-server';
            let url = server + '/api/grade/isEnable';
            let data = {
                orgId: this.searchData.orgId
            };
            this.list = [];
            this.$ajaxGet(url, data)
                .then(res => {
                    if (res && res.code === 10000) {
                        let resData = res.data;
                        // 1停用 2启用
                        this.levelEnable = resData === 2;
                    }
                })
                .catch(err => {
                    log(err);
                });
        },
        updateAccountFilter(updateList) {
            this.accountStatusList = updateList;
            let previewList = this.createPreviewText(updateList);
            this.displayAccountStatus = previewList.join('；');
        },
        updateRegisterChannel(updateList) {
            this.registerChannelList = updateList;
            let previewList = this.createPreviewText(updateList);
            this.displayRegisterChannel = previewList.join('；');
        },
        toggleAdvancedFilter() {
            let currentStatus = this.advancedFilterStatus;
            this.advancedFilterStatus = !currentStatus;
        },
        initSelectFilter(list) {
            let tempList = this.$_.clone(list);
            tempList.map((item) => {
                if (item.value === '') {
                    item.selected = true;
                    item.isAll = true;
                } else {
                    item.selected = false;
                }
            });
            return tempList;
        },
        initGenderFilter() {
            let list = this.initSelectFilter(this.genderListFilter);
            this.genderListFilter = list;
            this.displaySelectedGender = '';
        },
        initMemberLevelFilter() {
            let list = this.initSelectFilter(this.memberLevelFilter);
            this.memberLevelFilter = list;
            this.displaySelectedLevel = '';
        },
        initAccountFilter() {
            let list = this.initSelectFilter(this.accountStatusList);
            this.accountStatusList = list;
            this.displayAccountStatus = '';
        },
        initRegisterChannel() {
            let list = this.initSelectFilter(this.registerChannelList);
            this.registerChannelList = list;
            this.displayRegisterChannel = '';
        },
        openLevelPop() {
            this.levelPop = true;
        },
        closeLevelPop() {
            this.levelPop = false;
        },
        validateLevelForm() {
            let {isChangeGrade, isFrozenLevel, remark, levelId} = this.levelForm;

            if (isChangeGrade === '') {
                this.$Message.error('操作失败，您还未选择等级变更！');
                return true;
            }

            if ((levelId === '') && (isChangeGrade === '1')) {
                this.$Message.error('操作失败，您还未选择变更等级！');
                return true;
            }

            if (isFrozenLevel === '') {
                this.$Message.error('操作失败，您还未选择等级冻结！');
                return true;
            }

            if (remark === '') {
                this.$Message.error('操作失败，您还未填写备注！');
                return true;
            }

            return false;
        },
        adjustLevel() {
            let server = '/member-server';
            let url = server + '/member/info/grade/edit';

            let notPass = this.validateLevelForm();
            if (notPass) {
                return;
            }

            this.closeLevelPop();
            let data = {
                ...this.levelForm,
                orgId: this.searchData.orgId,
                memberIds: this.memberIds
            };
            // 在列表中调整单个会员
            if (this.selectType === 'single') {
                data.memberIds = this.singleMember;
            }
            let {isChangeGrade, isFrozenLevel} = this.levelForm;
            data.isChangeGrade = isChangeGrade === '1';
            data.isFrozenLevel = isFrozenLevel === '1';

            this.$ajaxPost(url, data)
                .then(res => {
                    this.initLevelForm();
                    this.initActionList();
                    if (res && res.code === 10000) {
                        this.$Message.success(res.message);
                        this.getList();
                    }
                })
                .catch(err => {
                    log(err);
                });
        },
        cancelAdjustLevel() {
            this.initLevelForm();
            this.closeLevelPop();
        },
        initLevelForm() {
            this.levelForm = {
                isChangeGrade: '2',
                level: '',
                isFrozenLevel: '0',
                remark: '',
            };
        },
        jumpMemberDetail() {
            let memberId = this.currentActionMember.id;
            this.$router.push({
                path: "/member/manage/details",
                query: {
                    id: memberId,
                }
            });
        },
        initialGrowthForm() {
            this.growthForm = {
                memberIds: '',
                isAdd: '1',
                scoreValue: '',
                remark: '',
            }
            this.tempGrowthType = []
        },
        validateGrowth() {
            let {scoreValue, remark} = this.growthForm;

            if (scoreValue === '') {
                this.$Message.error('操作失败，您还未填写成长值！');
                return true;
            }

            if (remark === '') {
                this.$Message.error('操作失败，您还未填写备注！');
                return true;
            }

            return false;
        },
        adjustGrowth() {
            let server = '/member-server';
            let url = server + '/member/info/growth/edit';

            let data = {
                ...this.growthForm,
                orgId: this.searchData.orgId,
                memberIds: this.memberIds
            };
            if (this.selectType === 'single') {
                data.memberIds = this.singleMember;
            }


            let notPass = this.validateGrowth();
            if (notPass) {
                return;
            }

            this.growthPop = false;
            this.$ajaxPost(url, data)
                .then(res => {
                    this.initialGrowthForm();
                    this.initActionList();
                    if (res && res.code === 10000) {
                        this.$Message.success(res.message);
                        this.getList();
                        this.memberIds = [];
                    }
                })
                .catch(err => {
                    log(err);
                });
        },

        cancelAdjustGrowth() {
            this.growthPop = false;
            this.initialGrowthForm();
        },
        allowInt(key) {
            let currentValue = this.growthForm[key];
            let temp;
            if (currentValue.length === 1) {
                temp = currentValue.replace(/[^1-9]/g, '');
            } else {
                temp = currentValue.replace(/\D/g, '');
            }

            let big = Number(temp) >= Math.pow(10, 7);
            if (big) {
                temp = Math.pow(10, 7) - 1;
            }

            this.growthForm[key] = formatNumber(String(temp), 0);
        },
        openGrowthPop() {
            this.growthPop = true;
        },
        cancelAdjustPoint() {
            this.pointPop = false;
            this.initialGrowthForm();
        },
        validatePoint() {
            let {scoreValue, remark} = this.pointForm;
            if (scoreValue === '') {
                this.$Message.error('操作失败，您还未填写积分！');
                return true;
            } else if (Number(scoreValue).toString() === 'NaN') {
                this.$Message.error('操作失败，积分数值非数字！');
                return true;
            }

            if (remark === '') {
                this.$Message.error('操作失败，您还未填写备注！');
                return true;
            }

            return false;
        },
        initialPointForm() {
            this.pointForm = {
                memberIds: '',
                isAdd: '1',
                scoreValue: '',
                remark: '',
            };
            this.tempChangeTypePoint = []
        },
        adjustPoint() {
            let server = '/member-server';
            let url = server + '/member/info/points/edit';

            let data = {
                ...this.pointForm,
                orgId: this.searchData.orgId,
                memberIds: this.memberIds,
            };
            if (this.selectType === 'single') {
                data.memberIds = this.singleMember;
            }

            let notPass = this.validatePoint();
            if (notPass) {
                return;
            }
            this.pointPop = false;
            this.$ajaxPost(url, data)
                .then(res => {
                    if (res && res.code === 10000) {

                        this.$Message.success(res.message);
                        this.initialPointForm();
                        this.memberIds = [];
                        this.initActionList();
                        this.getList();
                    }
                });
        },
        addMember() {
            let server = '/member-server'
            let url = server + '/member/info/add'

            let data = {
                orgId: this.searchData.orgId,
                ...this.memberForm,
            }

            this.$ajaxPost(url, data)
                .then(res => {
                    this.initMemberForm()
                    if (res && res.code === 10000) {
                        this.memberPop = false
                        this.$Message.success(res.message)
                        this.getList()
                    }
                })
                .catch(err => {
                    log(err);
                });
        },
        initMemberForm() {
            this.memberForm = {
                phone: '',
                memberName: '',
                sex: '',
                birthday: '',
            }
        },
        cancelAddMember() {
            this.initMemberForm()
            this.closeMemberPop()
        },
        memberPopVisible(status) {
            if (!status) {
                this.$refs.memberInfo.resetFields()
            }
        },
        openMemberPop() {
            this.memberPop = true
        },
        closeMemberPop() {
            this.memberPop = false
        },
        handleTimePicker(val) {
            this.memberForm.birthday = val
        },
        getSourceOrg(query = '') {
            let server = '/user-server'
            let url = server + '/platform/department/pageDepartment'

            let data = {
                searchType: 'name',
                searchContent: query,
            }

            this.$ajaxPost(url, data)
                .then(res => {
                    if (res.code === 10000) {
                        this.sourceList = res.data !== undefined ? res.data.list : []
                    }

                })
                .catch(err => {
                    log(err);
                });
        },
        getOrgList() {
            let server = '/user-server'
            let url = server + '/platform/department/entityTree'

            let data = {
                departmentId: localStorage.departmentId,
            }

            this.$ajaxGet(url, data)
                .then(res => {
                    if (res.code === 10000) {
                        this.existOrgTree = createCascadeFormat(res.data, 'title', 'orgId')
                    }

                })
                .catch(err => {
                    log(err);
                });
        },
        chooseRegisterOrg(value) {
            this.tempRegister = value
            this.getList()
        },
        searchOrgId(org) {
            let updateOrg = org === '' ? [] : [org]
            this.tempRegister = updateOrg
            this.getList()
        },
        limitLabel(l) {
            if (l.length > 20) {
                l.pop()
                this.$Message.error('一次最多只能加 20 个标签！')
            }
            this.levelForm.labelIds = l
        },
        removeRightAction(list, right) {
            let tempList = []
            for (let i = 0; i < list.length; i++) {
                let action = list[i]
                let rightKey = action.value
                let hasRight = right[rightKey]

                if (hasRight) {
                    tempList.push(action)
                }
            }
            return tempList
        },
        // 根据选择时间间隔，设置 DatePicker
        chooseTimeRange(val) {
            let pack = createRangeTime(val)
            let [startTime, endTime] = pack
            if (val === 'custom') {
                startTime = ''
                endTime = ''
            }

            Object.assign(this.searchData, {
                createTimeStart: startTime,
                createTimeEnd: endTime,
            })
        },
    }
};
</script>

<style lang="scss" scoped>
.member-query {
    background: #fff;
    border-radius: 16px;
}

.row-narrow {
    margin-top: 20px;
}


.search-container {
    padding: 24px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.04);
    border-radius: 16px;
}

.search-block {
    display: flex;
    justify-content: space-between;
}

.action-block {
    position: relative;
    display: inline-block;


    .iconfont {
        font-size: 24px;
        vertical-align: middle;
    }
}

.mark-btn {
    display: inline-block;
    vertical-align: middle;
    background: white;
    border-radius: 4px;

    border: 1px solid #dcdee2;
    height: 32px;
    line-height: 32px;
    padding: 0 4px 0 16px;
    cursor: pointer;

    &:hover {
        border: 1px solid #756CEA;
        color: #756CEA;
    }

    &:hover > .iconTreeFold {
        cursor: pointer;
        color: #756CEA;
    }
}


.search-separate-line {
    display: inline-block;
    height: 20px;
    border-right: 1px solid rgba(226, 226, 234, 1);
    margin: -6px 8px;
}

.button-gap {
    margin-right: 8px;
}

.search-label {
    display: inline-block;
    width: 70px;
    text-align: right;
}

.filter-btn {
    display: flex;
    justify-content: flex-end;
}

.identity-search {
    position: relative;
    z-index: 4;

    .iconSearch {
        color: #BBB8BB;
        font-size: 24px;
    }
}

.fold-block-normal {
    display: inline-block;
    cursor: pointer;
    line-height: 32px;
    width: 56px;
    height: 32px;

    text-align: center;
    vertical-align: middle;

    background: rgba(250, 250, 251, 1);
    border-radius: 8px;
    border: 1px solid rgba(226, 226, 234, 1);

    .iconfont {
        vertical-align: middle;

        color: #929496;
    }
}

.fold-block-active {
    display: inline-block;
    z-index: 2;
    position: relative;
    cursor: pointer;
    background: #FAFAFB;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    border: 1px solid #e2e2ea;
    border-bottom: none;
    width: 56px;
    height: 41px;
    margin-bottom: -22px;
    padding-bottom: 10px;

    .iconfont {
        vertical-align: middle;
        color: #756CEA;
    }

    &:before {
        position: absolute;
        bottom: 0px;
        content: '';
        display: inline-block;
        width: 20px;
        left: -20px;
        background: white;
        height: 22px;
        border-right: 1px solid #e2e2ea;
        border-bottom: 1px solid #e2e2ea;
        border-bottom-right-radius: 12px 12px;
        z-index: 2;
    }

    &:after {
        position: absolute;
        bottom: 0;
        content: '';
        display: inline-block;
        width: 20px;
        left: -10px;
        background: #FAFAFB;
        height: 20px;
        /*border-radius:         10px;*/
        z-index: 1;
    }
}


.filter-container {
    display: inline-block;
    position: absolute;
    line-height: 32px;
    vertical-align: middle;
    padding: 7px 4px;
    top: -8px;
}


.advanced-block {
    margin-top: 8px;
    border-radius: 8px;
    border-top-right-radius: unset;
    border: 1px solid rgba(226, 226, 234, 1);
    background: #FAFAFB;
    padding: 0 24px;
}

.filter-row {
    padding: 20px 0;
    border-bottom: dashed 1px #E2E2EA;
}

.filter-narrow {
    margin-left: 40px;
}

.one-row-flex {
    display: flex;
    justify-content: flex-start;
}

.last-row {
    margin: 20px 0;
    width: 100%;
    display: flex;
    justify-content: flex-end;
}

.displayFilterList {
    height: 70px;
    position: relative;
    display: flex;
    justify-content: flex-start;
    margin-top: 8px;
    background: #FAFAFB;

    border-radius: 8px;

    border: 1px solid rgba(226, 226, 234, 1);
    padding: 20px 24px;

    & > .displayListEach {
        margin-right: 8px;
    }
}

.displayListEach {
    display: inline-block;
    background: rgba(255, 255, 255, 1);
    border-radius: 11px;
    border: 1px solid rgba(226, 226, 234, 1);

    padding-left: 12px;
    line-height: 24px;
    /*height: 26px;*/

    & > span {
        vertical-align: middle;
        font-size: 12px;
        font-weight: 300;
        color: #979497;
        line-height: 24px;
    }

    .iconfont {
        cursor: pointer;
        color: #979497;
        vertical-align: middle;
    }
}

.reset-btn {
    position: absolute;
    right: 24px;
    display: inline-block;
    font-size: 14px;
    font-family: SFUIDisplay-Light, SFUIDisplay;
    color: #756CEA;
    line-height: 26px;
}

.action-list {
    display: flex;
    position: absolute;
    z-index: 2;
    width: 296px;
    left: 84px;

    top: 50px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 8px 0px rgba(181, 181, 190, 0.24);
    border-radius: 8px;
}

.parent-action-container {
    width: 148px;
    border-right: 1px solid rgba(226, 226, 234, 1);
    list-style-type: none;
}

.parent-action {
    cursor: pointer;
    font-size: 14px;
    font-weight: 300;
    color: rgba(68, 68, 79, 1);

    line-height: 24px;
    padding: 6px 6px 6px 16px;
    display: flex;
    justify-content: space-between;

    &:hover {
        background: rgba(250, 250, 251, 1);
    }
}

.sub-action-container {
    list-style-type: none;
}

.select-parent-action {
    color: #756CEA;
    background: #E9E8FF;
}

.sub-action {
    width: 148px;
    padding: 6px 16px;
    cursor: pointer;

    &:hover {
        background: rgba(250, 250, 251, 1);
    }
}

.not-select-member {
    color: rgba(213, 213, 220, 1);
}

.more-action {
    display: inline-block;
    vertical-align: middle;
    background: white;
    border-radius: 4px;

    border: 1px solid #dcdee2;
    height: 32px;
    line-height: 32px;
    padding: 0 4px 0 16px;
    cursor: pointer;

    &:hover {
        border: 1px solid #756CEA;
        color: #756CEA;
    }

    &:hover > .iconTreeFold {
        cursor: pointer;
        color: #756CEA;
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

.card-container {
    margin-top: 24px;
    padding: 24px;
}

.big-block-narrow {
    margin-bottom: 24px;
}

.input-separator {
    padding: 0 12px;
}

.select-info-block {
    display: flex;
    justify-content: space-between;
    margin: 24px;
    background: #E9E8FF;

    border-radius: 4px;
    border: 1px solid #756CEA;

    padding: 12px 16px;
    color: rgba(23, 23, 37, 1);
    line-height: 24px;
    vertical-align: middle;

    .iconInfo {
        vertical-align: middle;
        margin-right: 4px;
    }
}

.frozen-desc {
    font-size: 12px;
    font-weight: 300;
    color: rgba(146, 146, 157, 1);
    line-height: 22px;
    word-break: break-all
}

.color-text {
    color: #756CEA;
}

.select-count {
    color: #756CEA;
    padding: 4px;
}

.form-remind {
    margin-top: 4px;
    font-size: 12px;
    font-weight: 300;
    color: rgba(146, 146, 157, 1);
    line-height: 22px;
}

.view-footer {
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid #e8eaec;
    padding: 12px;

    .text-narrow {
        margin-right: 16px;
    }
}


.huge-block-narrow {
    margin-top: 40px;
}
</style>
