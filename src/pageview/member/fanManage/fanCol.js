import FanScreening from '@/pageview/member/fanManage/FanScreening'
import FanInfoCell from '@/pageview/member/fanManage/FanInfoCell'
import BelongOrgCell from '@/pageview/base/tableComponent/BelongOrgCell'
import RemarkCell from '@/pageview/member/fanManage/RemarkCell'

const fanCol = function () {
  return [
    {
      title: '粉丝昵称/ID',
      key: 'headImg',
      minWidth: 120,
      render: (h, params) => {
        return h(FanInfoCell, {
          props: {
            data: params.row,
          },
        })
      },
    },
    {
      title: '关注时间',
      key: 'followTime',
      render: this.$renderTime,
    },
    {
      title: '关注状态',
      key: 'subscribeStatus',
      filters: [
        { label: '已关注', value: '1' },
        { label: '取消关注', value: '-1' },
      ],
      filterMultiple: false,
      filterRemote: this.filterFollowStatus,
    },
    {
      title: '所属地区',
      key: 'address',
      render: (h, params) => {
        return h('div', [
          h(
            'span',
            {
              style: {
                display: 'inline-block',
                width: '140px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              },
              domProps: {
                title: params.row.address,
              },
            },
            params.row.address
          ),
        ])
      },
    },
    {
      title: '关注方式',
      key: 'subscribeScene',
      filters: [
        { label: '公众号搜索', value: 'ADD_SCENE_SEARCH' },
        { label: '公众号迁移', value: 'ADD_SCENE_ACCOUNT_MIGRATION' },
        { label: '名片分享', value: 'ADD_SCENE_PROFILE_CARD' },
        { label: '扫描二维码', value: 'ADD_SCENE_QR_CODE ' },

        { label: '图文页内名称点击', value: 'ADD_SCENE_PROFILE_LINK' },
        { label: '图文页右上角菜单', value: 'ADD_SCENE_PROFILE_ITEM' },
        { label: '支付后关注', value: 'ADD_SCENE_PAID' },
        { label: '微信广告', value: 'ADD_SCENE_WECHAT_ADVERTISEMENT' },

        { label: '图文消息', value: 'ADD_SCENE_PROFILE_ITEM' },
      ],
      filterMultiple: false,
      filterRemote: this.filterFollowMethod,
    },
    {
      title: '来源',
      key: 'orgName',
      renderHeader: (h) => {
        return h('div', [
          h('span', '来源'),
          h(
            'Poptip',
            {
              props: {
                trigger: 'hover',
                placement: 'right-start',
                transfer: true,
              },
              style: {
                maxHeight: '500px',
              },
            },
            [
              h('Icon', {
                props: {
                  type: 'ios-funnel',
                },
              }),
              h(
                'div',
                {
                  slot: 'content',
                },
                [
                  h(FanScreening, {
                    props: {
                      selectLits: this.fwwSourceList,
                    },
                    on: {
                      select: (item) => {
                        for (var i = 0; i < this.fwwSourceList.length; i++) {
                          this.fwwSourceList[i].isSelect = false
                        }
                        item.isSelect = true
                        this.searchData.page = 1
                        this.searchData.source = item.value
                        this.getFanList()
                      },
                    },
                  }),
                ]
              ),
            ]
          ),
        ])
      },
      render: (h, params) => {
        const { orgName, parentOrgName } = params.row
        return h(BelongOrgCell, {
          props: {
            currentOrg: orgName,
            higherOrg: parentOrgName,
          },
        })
      },
    },

    {
      title: '备注',
      key: 'data',
      render: (h, params) => {
        return h(RemarkCell, {
          props: {
            remark: params.row.remark,
          },
        })
      },
    },
    {
      title: '操作',
      key: '',
      align: 'center',
      render: (h, params) => {
        // if (this.index !== params.index) {
        return h('div', [
          this.pageAction.includes('update') &&
            h(
              'a',
              {
                on: {
                  click: () => {
                    console.log(params)
                    this.$set(params.row, 'isInput', true)
                    this.index = params.index
                    this.modal8 = true
                    this.fansRemark = params.row.remark
                    this.fansTabIndex = params.row._index
                  },
                },
              },
              '编辑'
            ),
        ])
      },
    },
  ]
}

export { fanCol }
