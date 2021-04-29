import { findListLabel } from '@/utils/tools'
import UpdateTimeCell from './UpdateTimeCell'
import LevelChangeCell from './LevelChangeCell'
import ChangeReasonBubble from './ChangeReasonBubble'

import { reasonList } from './reasonList'
import FilterTableColList from '../../../../base/tableComponent/FilterTableColList'
import './identityCol.scss'

export const identityRecordCol = function () {
  return [
    {
      title: '变更时间',
      key: 'createTime',
      width: 180,
      align: 'left',
      render: (h, params) => {
        return h(UpdateTimeCell, {
          props: {
            item: params.row,
          },
        })
      },
    },

    {
      title: '等级变更',
      key: 'createTime',
      align: 'left',
      width: 200,
      renderHeader: (h) => {
        return h('div', [
          h('span', '等级变更'),
          h(
            'Poptip',
            {
              class: 'icon-space',
              props: {
                trigger: 'hover',
                placement: 'bottom',
                transfer: true,
                padding: '0',
              },
            },
            [
              h('Icon', {
                props: {
                  type: 'ios-funnel',
                  color: this.levelFilterFlag ? '#756CEA' : '',
                },
              }),
              h(
                'div',
                {
                  slot: 'content',
                },
                [
                  h(FilterTableColList, {
                    props: {
                      selectList: this.filterLevelList,
                    },
                    on: {
                      select: (item) => {
                        for (let i = 0; i < this.filterLevelList.length; i++) {
                          this.filterLevelList[i].isSelect = false
                        }
                        item.isSelect = true
                        const level = item.value
                        this.levelFilterFlag = Boolean(level)

                        this.pageData.page = 1
                        this.searchData = Object.assign(this.searchData, {
                          levelChangeType: level,
                        })
                        this.$nextTick(() => {
                          this.getIdentityList()
                        })
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
        return h(LevelChangeCell, {
          props: {
            item: params.row,
          },
        })
      },
    },

    {
      title: '变更原因',
      key: 'createTime',
      align: 'left',
      renderHeader: (h) => {
        return h('div', [
          h('span', '变更原因'),
          h(
            'Poptip',
            {
              class: 'icon-space',
              props: {
                trigger: 'hover',
                placement: 'bottom',
                transfer: true,
                padding: '0',
              },
            },
            [
              h('Icon', {
                props: {
                  type: 'ios-funnel',
                  color: this.changeReasonFlag ? '#756CEA' : '',
                },
              }),
              h(
                'div',
                {
                  slot: 'content',
                },
                [
                  h(FilterTableColList, {
                    props: {
                      selectList: this.reasonList,
                    },
                    on: {
                      select: (item) => {
                        for (let i = 0; i < this.reasonList.length; i++) {
                          this.reasonList[i].isSelect = false
                        }
                        item.isSelect = true
                        const levelChangeReasons = item.value
                        this.changeReasonFlag = Boolean(levelChangeReasons)

                        this.pageData.page = 1
                        this.searchData = Object.assign(this.searchData, {
                          levelChangeReasons: levelChangeReasons,
                        })
                        this.$nextTick(() => {
                          this.getIdentityList()
                        })
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
        const { levelChangeReason } = params.row
        const reason = findListLabel(reasonList, levelChangeReason)
        return h('div', reason)
      },
    },
    {
      title: '操作',
      width: 180,
      align: 'left',
      render: (h, params) => {
        return h(ChangeReasonBubble, {
          props: {
            item: params.row,
          },
        })
      },
    },
  ]
}
