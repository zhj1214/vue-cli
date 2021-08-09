// import { log } from "@/utils/tools";

import UpdateTimeCell from '../../../../base/tableComponent/UpdateTimeCell'
import OrderSourceCell from './OrderSourceCell'
import RefundStatusCell from './RefundStatusCell'
import FilterTableColList from '../../../../base/tableComponent/FilterTableColList'

import RefundPriceCell from './RefundPriceCell'

import './orderCol.scss'

export const refundCol = function () {
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
                        let orderStatus = item.value
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
        return h(RefundPriceCell, {
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
                  color: this.refundStatusFlag ? '#756CEA' : '',
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
                      selectList: this.refundStatusList,
                    },
                    on: {
                      select: (item) => {
                        for (let i = 0; i < this.refundStatusList.length; i++) {
                          this.refundStatusList[i].isSelect = false
                        }
                        item.isSelect = true
                        let refundStatus = item.value
                        this.refundStatusFlag = Boolean(refundStatus)

                        this.pageData.page = 1
                        this.searchData = Object.assign(this.searchData, {
                          refundStatus: refundStatus,
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
        let { productInfo } = params.row
        return h(RefundStatusCell, {
          props: {
            item: productInfo,
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
            time: params.row.refundTime,
          },
        })
      },
    },
  ]
}
