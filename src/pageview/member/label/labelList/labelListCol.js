import PublicCell from '@/pageview/member/label/labelList/PublicCell'
import BelongOrgCell from '@/pageview/base/tableComponent/BelongOrgCell'
// import OperateCell from "@/pageview/member/label/labelList/OperateCell";
import TagsListBtnBox from '@/pageview/member/label/labelList/TagsListBtnBox'
import UpdateTimeCell from '@/pageview/base/tableComponent/UpdateTimeCell'

// 会员标签-标签与客群-标签列表
export function labelListCol() {
  return [
    {
      type: 'selection',
      width: '60px',
      fixed: 'left',
    },
    {
      title: '标签名称/编号',
      key: 'name',
      fixed: 'left',
      width: 140,
      render: (h, params) => {
        return h('div', [
          h(
            'span',
            {
              class: this.__hasPower('viewLabel') ? 'span-a' : '',
              style: { display: 'block' },
              on: {
                click: () => {
                  let right = this.__hasPower('viewLabel')
                  if (!right) {
                    return
                  }
                  this.$emit('whatComponent', { type: 'LabelDetail', labelId: params.row.id })
                },
              },
            },
            params.row.name
          ),
          h('p', { class: 'p-text' }, params.row.id),
        ])
      },
    },
    {
      title: '标签类型',
      minWidth: 180,
      filters: [
        { label: '规则标签', value: 1 },
        { label: '手动标签', value: 2 },
        // {label: '模型标签', value: 3}
      ],
      filterMultiple: false,
      filterRemote: this.filterBaseType,
      render: (h, params) => {
        return h('span', params.row.labelBaseTypeName)
      },
    },
    {
      title: '标签分组',
      minWidth: 180,
      filters: this.labelGroupList,
      filterMultiple: false,
      filterRemote: this.filterLabelGroup,
      render: (h, params) => h('span', params.row.labelGroupTypeName || '-'),
    },
    {
      title: '标签人数',
      minWidth: 180,
      key: 'count',
      render: (h, params) => {
        return h('span', this.$formatNumber(params.row.count || 0, 0))
      },
    },
    {
      title: '是否公开',
      minWidth: 140,
      filters: [
        { label: '公开', value: true },
        { label: ' 私有', value: false },
      ],
      filterMultiple: false,
      filterRemote: this.filterPublic,
      render: (h, params) => {
        let { isOpen, id, canBeOperator } = params.row
        return h(PublicCell, {
          props: {
            status: isOpen,
            id: id,
            operate: canBeOperator,
          },
          on: {
            updateList: this.onSearch,
          },
        })
      },
    },
    {
      title: '操作人/创建时间',
      minWidth: 180,
      render: (h, params) => {
        return h('div', [
          h('p', params.row.creatorName),
          h('p', { class: 'p-text' }, this.$format(params.row.createTime)),
        ])
      },
    },
    {
      title: '所属组织',
      minWidth: 180,
      render: (h, params) => {
        let { belongOrg, belongOrgStr } = params.row
        return h(BelongOrgCell, {
          props: {
            currentOrg: belongOrg,
            higherOrg: belongOrgStr,
          },
        })
      },
    },
    {
      title: '编辑时间',
      minWidth: 140,
      key: 'calculateTime',
      render: (h, params) => {
        let { modifyTime } = params.row
        return h(UpdateTimeCell, {
          props: {
            time: modifyTime,
          },
        })
      },
    },
    // {
    //     title: '操作',
    //     width: 140,
    //     render: (h, params) => {
    //         let showDelete = true || params.row.canBeOperator &&
    //             (this.pageAction || []).includes('delete')
    //         return h('div', [
    //             showDelete ? h('span',
    //                 {
    //                     class: "span-a",
    //                     on: {
    //                         click: () => {
    //
    //                         },
    //                     }
    //                 }, "删除") : '',
    //         ]);
    //     }
    // },
    {
      title: '操作',
      width: 140,
      fixed: 'right',
      render: (h, params) => {
        let w = this
        let deleteLabel = params.row.canOperate && (this.pageActions || []).includes('batchDelete')
        return h(TagsListBtnBox, {
          props: {
            rowData: params.row,
            isShowDeleteBtn: deleteLabel,

            deleteFunc: () => {
              w.onCancelRegister('single', params.row)
            },
            importDataFunc: () => {
              w.clickImportData(params.row)
            },
            watchImportFunc: () => {
              w.clickWatchImport(params.row)
            },
          },
        })
      },
    },
  ]
}
