/***********************
 * @name JS
 * @author Jo.gel
 * @date 2020/6/10 0010
 ***********************/
import { format } from 'date-fns'
import { _date } from '../../utils/tools'

// 会员表格
import superVipIcon from '@/assets/images/member/super_vip_icon.png'
import defaultAvatar from '@/assets/images/default-avatar.png'

export function memberTableCol() {
  return [
    {
      type: 'selection',
      width: '60px',
    },
    {
      title: '用户昵称/手机号',
      width: '250px',
      render: (h, params) => {
        return h('div', [
          h('img', {
            attrs: {
              src: params.row.headImg || defaultAvatar,
            },
            style: {
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              float: 'left',
            },
          }),
          h(
            'div',
            {
              style: {
                marginLeft: '40px',
              },
            },
            [
              params.row.status === 1
                ? h(
                    'router-link',
                    {
                      props: {
                        to: '/member/manage/details?id=' + params.row.id,
                      },
                      class: 'color-text',
                    },
                    params.row.memberName || params.row.nickName
                  )
                : params.row.memberName || params.row.nickName,
              params.row.sex === 'F' || params.row.sex === 'M'
                ? h('Icon', {
                    props: {
                      type: params.row.sex === 'F' ? 'md-female' : 'md-male',
                      color: params.row.sex === 'F' ? '#FF6B6A' : '#1990FF',
                    },
                    style: {
                      fontSize: '12px',
                      marginLeft: '4px',
                      background: params.row.sex === 'F' ? '#FFDBDB' : '#E7EEFF',
                      borderRadius: '50%',
                      padding: '4px',
                    },
                  })
                : '',
              h('span', { class: 'block color-gray' }, this.$filterPhone(params.row.phone)),
            ]
          ),
        ])
      },
    },
    {
      title: 'ID',
      key: 'id',
    },
    {
      title: '成长值',
      key: 'growthBalance',
      render: (h, params) => {
        return h('span', this.$formatNumber(params.row.growthBalance, '0'))
      },
    },
    {
      title: '积分',
      key: 'pointBalance',
      render: (h, params) => {
        return h('span', this.$formatNumber(params.row.pointBalance, '0'))
      },
    },
    {
      title: '等级',
      key: 'levelId',
      render: (h, params) => {
        return h('div', [
          h('span', Number(params.row.levelId) === -1 ? '-' : params.row.levelId),
          params.row.isFrozen ? h('Icon', { props: { type: 'md-lock', color: '#BBBBC3' } }) : '',
        ])
      },
    },
    {
      title: '付费会员类型',
      key: 'payMember',
      render: (h, params) => {
        return h('div', [
          params.row.memberPayCardsRelationRespList &&
          params.row.memberPayCardsRelationRespList.length
            ? h('div', [
                h(
                  'span',
                  {
                    style: {
                      padding: '0 4px',
                      color: '#756CEA',
                      border: '1px solid #756CEA',
                      borderRadius: '16px',
                    },
                  },
                  '付费会员'
                ),
                h(
                  'div',
                  {
                    style: {
                      lineHeight: '24px',
                      height: '24px',
                    },
                  },
                  [
                    h('span', `共 ${params.row.memberPayCardsRelationRespList.length} 项`),
                    h(
                      'Poptip',
                      {
                        props: {
                          title: '付费会员类型',
                          trigger: 'hover',
                          transfer: true,
                        },
                      },
                      [
                        h('i', {
                          class: 'hover-view icon iconfont iconView',
                        }),
                        h(
                          'div',
                          {
                            slot: 'content',
                            style: {
                              maxHeight: '320px',
                              overflowX: 'auto',
                            },
                          },
                          params.row.memberPayCardsRelationRespList.map((item) => {
                            return h('p', { class: 'clear', style: { marginBottom: '4px' } }, [
                              h('img', {
                                style: {
                                  width: '24px',
                                  height: '24px',
                                  borderRadius: '50%',
                                  float: 'left',
                                },
                                attrs: {
                                  src: item.payCardLogo || superVipIcon,
                                },
                              }),
                              h(
                                'span',
                                {
                                  style: {
                                    display: 'block',
                                    marginLeft: '30px',
                                  },
                                },
                                item.payCardName
                              ),
                            ])
                          })
                        ),
                      ]
                    ),
                  ]
                ),
              ])
            : h(
                'span',
                {
                  style: {
                    padding: '0 4px',
                    color: '#D5D5DB',
                    border: '1px solid #D5D5DB',
                    borderRadius: '16px',
                  },
                },
                '非付费会员'
              ),
        ])
      },
    },
    {
      title: '注册时间',
      key: 'createTime',
      render: this.$renderTime,
    },
    {
      title: '操作',
      render: (h, params) => {
        return h(
          'div',
          params.row.status !== 2
            ? [
                this.pageAction.includes('addMark')
                  ? h(
                      'span',
                      {
                        class: 'span-a mr-10',
                        on: {
                          click: () => {
                            this.actionLabelStatus = true
                            this.memberIds = [params.row.id]
                            this.selectType = 'single'
                            this.selectList = []
                          },
                        },
                      },
                      '打标签'
                    )
                  : '',
                h(
                  'Dropdown',
                  {
                    props: {
                      trigger: 'click',
                      transfer: true,
                    },
                    on: {
                      'on-click': (name) => {
                        this.selectType = 'single'
                        this.selectList = [params.row]
                        this.singleMember = [params.row.id]
                        if (name === 'drop-status') this.openAccountStatusPop()
                      },
                      'on-visible-change': (v) => {
                        if (!v) this.moreIndex = -1
                      },
                    },
                  },
                  [
                    h(
                      'span',
                      {
                        class: 'span-a',
                        on: {
                          click: () => {
                            this.moreIndex = params.index
                          },
                        },
                      },
                      [
                        h('span', '更多'),
                        // iconTreeFold下  iconDropdownUnfold上
                        h('i', {
                          class:
                            'icon iconfont ' +
                            (this.moreIndex === params.index
                              ? 'iconDropdownUnfold'
                              : 'iconTreeFold'),
                        }),
                      ]
                    ),
                    h(
                      'DropdownMenu',
                      {
                        slot: 'list',
                      },
                      [
                        this.pageAction.includes('showTiao')
                          ? h('DropdownItem', { props: { name: 'drop-status' } }, '账户状态调整')
                          : '',
                      ]
                    ),
                  ]
                ),
              ]
            : [h('span', { class: 'color-gray' }, '已注销')]
        )
      },
    },
  ]
}

// 会员管理-会员渠道管理
export function channelManagementCol() {
  return [
    {
      title: '机构编号',
      key: 'orgId',
      render: (h, params) => {
        return h('div', params.row.orgId || '-')
      },
    },
    {
      title: '机构名称',
      key: 'orgName',
      render: (h, params) => {
        return h('div', params.row.orgName || '-')
      },
    },
    {
      title: '机构类型',
      key: 'type',
      render: (h, params) => {
        return h('div', this.getCompanyType(params.row.type) || '-')
      },
    },
    {
      title: '注册链接（个）',
      key: 'number',
      render: (h, params) => {
        return h('div', [
          h('span', params.row.number || '-'),
          h('Icon', {
            style: {
              opacity: '0',
              zIndex: '-1',
            },
            class: 'hover-show',
            props: {
              type: 'md-eye',
              color: '#B5B5BE',
            },
            on: {
              click: () => {
                this.showDetailsModal(params.row)
              },
            },
          }),
        ])
      },
    },
    {
      title: '最近编辑时间',
      key: 'modifyTime',
      sortable: true,
      render: this.$renderTime,
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      // minWidth: 100,
      render: (h, params) => {
        return h('div', [
          h(
            'span',
            {
              class: 'span-a mr-10',
              on: {
                click: () => {
                  this.showCompile(params.row)
                },
              },
            },
            this.pageAction.includes('update') ? '编辑' : ''
          ),
          h(
            'Poptip',
            {
              props: {
                confirm: true,
                title: '删除后将无法恢复，确认要继续吗？',
                transfer: true,
              },
              on: {
                'on-ok': () => {
                  this.removeOne(params.row)
                },
              },
            },
            [
              h(
                'span',
                {
                  class: 'block span-a',
                },
                this.pageAction.includes('delete') ? '删除' : ''
              ),
            ]
          ),
        ])
      },
    },
  ]
}

// 会员标签-标签与客群-会员标签-标签详情-标签定义
export function labelCustomCol() {
  return []
}

// 会员标签-标签与客群-会员标签-标签详情-标签人群
export function labelCrowdCol() {
  return [
    {
      title: '会员',
      render: (h, params) => {
        return h('div', [
          h('div', [
            h(
              'router-link',
              {
                props: {
                  to: '/member/manage/details?id=' + params.row.memberId,
                },
                class: 'span-a',
              },
              params.row.memberName
            ),
            params.row.sex === 'M' || params.row.sex === 'F'
              ? h('Icon', {
                  props: {
                    type: params.row.sex === 'F' ? 'md-female' : 'md-male',
                    color: params.row.sex === 'F' ? '#FF6B6A' : '#1990FF',
                  },
                  style: {
                    fontSize: '12px',
                    marginLeft: '4px',
                    background: params.row.sex === 'F' ? '#FFDBDB' : '#E7EEFF',
                    borderRadius: '50%',
                    padding: '4px',
                  },
                })
              : '',
          ]),
          h('div', `ID: ${params.row.memberId}`),
        ])
      },
    },
    { title: '手机号', key: 'phone' },
    // {
    //     title: "付费会员",
    //     render: (h, params) => {
    //         return h("i", {
    //             class: "icon iconfont " + (params.row.isPayMember ? 'iconSuccess' : 'iconError'),
    //             style: {
    //                 color: params.row.isPayMember ? '#3DD598' : '#FC5A5A'
    //             }
    //         });
    //     }
    // },
    {
      title: '等级',
      render: (h, params) => {
        return h('div', [h('span', Number(params.row.levelId) === -1 ? '-' : params.row.levelId)])
      },
    },
    {
      title: '积分',
      render: (h, params) => {
        return h('span', this.$formatNumber(params.row.pointBalance, '0'))
      },
    },
    { title: '注册时间', key: 'registerTime', render: this.$renderTime },
  ]
}

// 用户做没做过
export const actionAttrs = [
  {
    label: '用户行为',
    code: '1-0',
    children: [
      {
        label: '用户做过',
        code: '1',
      },
      {
        label: '用户没做过',
        code: '2',
      },
    ],
  },
  {
    label: '用户属性',
    code: '3-0',
    children: [
      {
        label: '用户属性',
        code: '3',
      },
    ],
  },
]

// 新建标签自定义日期
export function shortcuts() {
  return [
    {
      text: '昨日',
      value() {
        return _date.yesterday()
      },
      onClick: () => {
        this.isStatic = false
        this.$set(this.node, 'timeArea', {
          type: 'enums',
          subType: 'last',
          value: 'day',
          timesText: '昨日',
        })
        this.$set(this.node, 'timesText', '昨日')
      },
    },
    {
      text: '今日',
      value() {
        return _date.today()
      },
      onClick: () => {
        this.isStatic = false
        this.$set(this.node, 'timeArea', {
          type: 'enums',
          subType: 'this',
          value: 'day',
          timesText: '今日',
        })
        this.$set(this.node, 'timesText', '今日')
      },
    },
    {
      text: '上周',
      value() {
        return _date.lastWeek()
      },
      onClick: () => {
        this.isStatic = false
        this.$set(this.node, 'timeArea', {
          type: 'enums',
          subType: 'last',
          value: 'week',
        })
        this.$set(this.node, 'timesText', '上周')
      },
    },
    {
      text: '本周',
      value() {
        return _date.thisWeek()
      },
      onClick: () => {
        this.isStatic = false
        this.$set(this.node, 'timeArea', {
          type: 'enums',
          subType: 'this',
          value: 'week',
        })
        this.$set(this.node, 'timesText', '本周')
      },
    },
    {
      text: '上月',
      value() {
        return _date.lastMonth()
      },
      onClick: () => {
        this.isStatic = false
        this.$set(this.node, 'timeArea', {
          type: 'enums',
          subType: 'last',
          value: 'month',
        })
        this.$set(this.node, 'timesText', '上月')
      },
    },
    {
      text: '本月',
      value() {
        return _date.thisMonth()
      },
      onClick: () => {
        this.isStatic = false
        this.$set(this.node, 'timeArea', {
          type: 'enums',
          subType: 'this',
          value: 'month',
        })
        this.$set(this.node, 'timesText', '本月')
      },
    },
    {
      text: '去年',
      value() {
        return _date.lastYear()
      },
      onClick: () => {
        this.isStatic = false
        this.$set(this.node, 'timeArea', {
          type: 'enums',
          subType: 'last',
          value: 'year',
        })
        this.$set(this.node, 'timesText', '去年')
      },
    },
    {
      text: '本年',
      value() {
        return _date.thisYear()
      },
      onClick: () => {
        this.isStatic = false
        this.$set(this.node, 'timeArea', {
          type: 'enums',
          subType: 'this',
          value: 'year',
        })
        this.$set(this.node, 'timesText', '本年')
      },
    },
    {
      text: '过去7天',
      value() {
        return _date.lastWhatDay(7)
      },
      onClick: () => {
        this.isStatic = false
        this.$set(this.node, 'timeArea', {
          type: 'dynamic',
          value: '7',
        })
        this.$set(this.node, 'timesText', '过去7天')
      },
    },
    {
      text: '过去30天',
      class: 'block',
      value() {
        return _date.lastWhatDay(30)
      },
      onClick: () => {
        this.isStatic = false
        this.$set(this.node, 'timeArea', {
          type: 'dynamic',
          value: '30',
        })
        this.$set(this.node, 'timesText', '过去30天')
      },
    },
  ]
}

// 默认的node对象
export function defaultNode() {
  return {
    actionAttr: '1',
    eventType: 'register_success',
    operator: 'gt',
    value: '',
    valueA: 0,
    valueB: 0,
    numberValue: 1, // int/float 的数字类型
    totalType: ['101'],
    timeArea: {
      type: 'static',
      beginTime: format(new Date(), 'YYYY-MM-DD'),
      endTime: format(new Date(), 'YYYY-MM-DD'),
    },
    attrsRule: {
      logic: 'all',
      children: [],
    },
  }
}

// 默认的labelData
export const defaultLabel = {
  name: '',
  labelGroupTypeId: '',
  remark: '',
  rules: {
    subRules: [{ ...defaultNode() }],
  },
}

// 默认的childrenNode
export const childrenNoe = {
  eventType: 'phone',
  eventTypeName: '手机号',
  operator: 'eq',
  operatorName: '等于',
  value: '', // 时间类型
  numberValue: 0, // int/float 的数字类型
  valueA: 0,
  valueB: 0,
  address: [],
}

// Rule 做没做过枚举
export const actionRuleMap = {
  1: '用户做过',
  2: '用户没做过',
  3: '用户属性',
}

/**
 * 根据入参枚举，算出相应的时间
 * @subType last this
 * @value day week month year
 * @return ["",""]
 * */
export function computedEnums(subType, value) {
  switch (value) {
    case 'day':
      if (subType === 'last') {
        return _date.yesterday()
      } else {
        return _date.today()
      }
    case 'week':
      if (subType === 'last') {
        return _date.lastWeek()
      } else {
        return _date.thisWeek()
      }

    case 'month':
      if (subType === 'last') {
        return _date.lastMonth()
      } else {
        return _date.thisMonth()
      }

    case 'year':
      if (subType === 'last') {
        return _date.lastYear()
      } else {
        return _date.thisYear()
      }
    default:
      return ['', '']
  }
}

export const sourceCodeMap = {
  1: '公众号',
  2: '小程序',
  3: '运营注册',
  4: '人工导入',
  10: 'PC端',
  11: 'APP端',
  12: '盒子端',
}

// 会员中心-标签与客群-客群-创建客群-标签人群 （与前面有些类似）
export function labelLayerPeopleCol() {
  return [
    {
      title: '用户昵称/ID',
      render: (h, params) => {
        return h('div', [
          h('div', [
            h(
              'router-link',
              {
                props: {
                  to: '/member/manage/details?id=' + params.row.memberId,
                },
                attrs: {
                  target: '_blank',
                },
                class: 'span-a',
              },
              params.row.memberName || params.row.nickName
            ),
            params.row.sex === 'F' || params.row.sex === 'M'
              ? h('Icon', {
                  props: {
                    type: params.row.sex === 'F' ? 'md-female' : 'md-male',
                    color: params.row.sex === 'F' ? '#FF6B6A' : '#1990FF',
                  },
                  style: {
                    fontSize: '12px',
                    marginLeft: '4px',
                    background: params.row.sex === 'F' ? '#FFDBDB' : '#E7EEFF',
                    borderRadius: '50%',
                    padding: '4px',
                  },
                })
              : '',
          ]),
          h('div', `ID: ${params.row.memberId}`),
        ])
      },
    },
    { title: '手机号', key: 'phone' },
    {
      title: '成长值',
      render: (h, params) => {
        return h('span', this.$formatNumber(params.row.growthBalance || 0, 0))
      },
    },
    {
      title: '积分',
      render: (h, params) => {
        return h('span', this.$formatNumber(params.row.pointBalance || 0, 0))
      },
    },
    {
      title: '等级',
      render: (h, params) => {
        return h('div', [h('span', Number(params.row.levelId) === -1 ? '-' : params.row.levelId)])
      },
    },

    { title: '注册时间', key: 'registerTime', render: this.$renderTime },
  ]
}

export function labelCol() {
  return [
    { title: '', type: 'selection', width: 80 },
    {
      title: '标签名称/编号1111111',
      render: (h, params) => {
        return h('div', [h('p', params.row.name), h('p', { class: 'p-text' }, params.row.id)])
      },
    },
    {
      title: '标签分组',
      key: 'labelGroupTypeName',
      filters: this.labelGroupList,
      filterMultiple: false,
      filterRemote: this.filterLabelGroup,
      render: (h, params) => {
        return h('span', params.row.labelGroupTypeName || '-')
      },
    },
    {
      title: '标签类型',
      key: 'labelBaseTypeName',
      filters: [
        { label: '规则标签', value: 1 },
        { label: '手动标签', value: 2 },
        { label: '模型标签', value: 3 },
      ],
      filterMultiple: false,
      filterRemote: this.filterBaseType,
    },
  ]
}

// 词云颜色
export const cloudColors = [
  '#FF9966',
  '#6666CC',
  '#CC9966',
  '#00CCFF',
  '#FF9900',
  '#FF6699',
  '#108EE9',
  '#009999',
  '#CC6633',
  '#FF9999',
  '#0099CC',
  '#CC9933',
  '#006699',
  '#CC66FF',
  '#6699FF',
  '#CC9999',
  '#FFCCCC',
  '#666666',
  '#990033',
  '#990099',
]
