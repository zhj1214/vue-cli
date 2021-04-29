import UpdateTimeCell from '../../../../base/tableComponent/UpdateTimeCell'
import OrderSourceCell from './OrderSourceCell'
import OrderPriceCell from './OrderPriceCell'
import OrderStatusCell from './OrderStatusCell'
import FilterTableColList from '../../../../base/tableComponent/FilterTableColList'

import './orderCol.scss'

export const orderCol = function () {
  return [
    {
      title: '订单编号/来源',
      width: 200,
      align: 'left',
      renderHeader: (h) => {
        return h('div', [
          h('span', '订单编号/来源'),
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
                  color: this.orderFlag ? '#756CEA' : '',
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
                      selectList: this.orderSourceList,
                    },
                    on: {
                      select: (item) => {
                        for (let i = 0; i < this.orderSourceList.length; i++) {
                          this.orderSourceList[i].isSelect = false
                        }
                        item.isSelect = true
                        const orderStatus = item.value
                        this.orderFlag = Boolean(orderStatus)

                        this.pageData.page = 1
                        // this.searchData = Object.assign(this.searchData, {orderStatus: orderStatus})
                        this.$nextTick(() => {
                          this.getList()
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
        return h(OrderSourceCell, {
          props: {
            item: params.row,
          },
        })
      },
    },
    {
      title: '订单价格',
      align: 'right',
      width: 100,
      render: (h, params) => {
        return h(OrderPriceCell, {
          props: {
            item: params.row,
          },
        })
      },
    },
    {
      title: '订单状态',
      key: 'operType',
      align: 'left',
      minWidth: 320,
      renderHeader: (h) => {
        return h('div', [
          h('span', '订单状态'),
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
                  color: this.statusFlag ? '#756CEA' : '',
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
                      selectList: this.orderStatusList,
                    },
                    on: {
                      select: (item) => {
                        for (let i = 0; i < this.orderStatusList.length; i++) {
                          this.orderStatusList[i].isSelect = false
                        }
                        item.isSelect = true
                        const orderStatus = item.value
                        this.statusFlag = Boolean(orderStatus)

                        this.pageData.page = 1
                        this.searchData = Object.assign(this.searchData, {
                          orderStatus: orderStatus,
                        })
                        this.$nextTick(() => {
                          this.getList()
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
        const { orderStatus } = params.row
        return h(OrderStatusCell, {
          props: {
            list: this.orderStatusList,
            item: orderStatus,
          },
          on: {
            // 'update-cell': this.updateRank
          },
        })
      },
    },
    {
      title: '创建时间',
      width: 180,
      align: 'left',
      render: (h, params) => {
        return h(UpdateTimeCell, {
          props: {
            time: params.row.orderCreateTime,
          },
        })
      },
    },
  ]
}
