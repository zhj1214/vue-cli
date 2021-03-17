// import { log } from "@/utils/tools";
// import ConfirmCellBubble from "./ConfirmCellBubble";
import NameIdCell from "./NameIdCell";
import UpdateTimeCell from "./UpdateTimeCell";

export const registerRecordCol = function () {
    return [
        {
            title: '姓名/ID',
            align: 'left',
            render: (h, params) => {
                return h(NameIdCell, {
                    props: {
                        item: params.row
                    }
                })
            }
        },
        {
            title: '注册手机号',
            key: 'phone',
            align: 'center'
        },
        {
            title: '已注册组织',
            key: 'orgName',
            align: 'center'
        },
        {
            title: '实际注册来源',
            key: 'actualRegistrationOrgId',
            align: 'center'
        },

        {
            title: '注册时间',
            key: 'createTime',
            align: 'left',
            render: (h, params) => {
                return h(UpdateTimeCell, {
                    props: {
                        item: params.row
                    }
                })
            }
        },
        {
            title: '渠道',
            key: 'registrationSource',
            align: 'center'
        },
        {
            title: '端口',
            key: 'registrationPortName',
            align: 'center'
        },

    ]
}
