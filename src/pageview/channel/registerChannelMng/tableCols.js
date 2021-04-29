import { renderTime } from '@/utils/tools'
import { ENUM_TYPE } from './common'

export function baseTableCol() {
  return [
    {
      title: '机构名称/编号',
      key: 'orgName',
      render: (h, params) => {
        return h('div', [
          h('a', {
            // DOM property
            domProps: {
              innerHTML: params.row.orgName || '--',
            },
            style: {
              'margin-right': '10px',
            },
            on: {
              click: () => {
                this.showDetailModal(params.row)
              },
            },
          }),
          h('br'),
          h('span', {
            domProps: {
              innerHTML: params.row.orgId || '--',
            },
          }),
        ])
      },
    },
    {
      title: '机构类型',
      key: 'type',
      render: (h, params) => {
        return h('div', [
          h('span', {
            domProps: {
              innerHTML: params.row.type ? ENUM_TYPE[params.row.type] : '--',
            },
          }),
        ])
      },
    },
    { title: '注册二维码(个)', key: 'number' },
    {
      title: '注册渠道所属方',
      key: 'affiliationOrganizationName',
    },
    { title: '创建时间', key: 'createTime', render: renderTime },
    {
      title: '操作',
      key: 'operate',
      render: (h, params) => {
        return h('div', [
          this.pageAction.includes('update')
            ? h('a', {
                // DOM property
                domProps: {
                  innerHTML: '编辑',
                },
                style: {
                  'margin-right': '10px',
                },
                on: {
                  click: () => {
                    this.showUpdateModal(params.row)
                  },
                },
              })
            : '',
          this.pageAction.includes('delete')
            ? h('a', {
                domProps: {
                  innerHTML: '删除',
                },
                style: {
                  'margin-right': '10px',
                },
                on: {
                  click: () => {
                    this.showDeleteModal(params.row)
                  },
                },
              })
            : '',
        ])
      },
    },
  ]
}
