import ActionDetailCell from "../ActionDetailCell";
import { actionList } from "./actionList"

export const userTravelCol = function () {
    return [
        {
            title: '时间',
            key: 'insertTime',
            render: this.$renderTime,
            width: 180,
            align: 'center'
        },
        {
            title: '服务对象',
            key: 'operParentType',
            // width: 100,
            align: 'center',
            render: (h, params) => {
                let { operParentType } = params.row
                if (operParentType === undefined) {
                    return h('div', '-')
                }
                let parentList = [{
                    label: '会员信息',
                    value: 1,
                }, {
                    label: '线上商城',
                    value: 2,
                }, ]
                let item = this.$_.find(parentList, { value: operParentType })
                let text = ''
                if (item !== undefined) {
                    text =  item.label
                }

                return h('div', text)
            }
        },
        {
            title: '动作行为',
            key: 'operType',
            align: 'left',
            minWidth: 320,
            render: (h, params) => {
                let { operType, operTitle } = params.row
                return h(ActionDetailCell, {
                        props: {
                            operationType: operType,
                            operationDetail: operTitle,
                            list: actionList,
                        },
                        on: {
                            // 'update-cell': this.updateRank
                        }
                    }

                )
            }
        },
    ]
}
