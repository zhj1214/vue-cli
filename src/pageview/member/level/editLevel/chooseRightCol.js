import NameIdCell from "./NameIdCell";
import ImgCell from "@/pageview/member/level/editLevel/ImgCell";

export const col = function () {
    return [
        {
            type: "selection",
            width: "60px"
        },
        {
            title: '权益展示名称/ID',
            width: 270,
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
            title: 'Logo',
            width: 270,
            align: 'middle',
            render: (h, params) => {
                return h(ImgCell, {
                    props: {
                        item: params.row
                    }
                })
            }
        },
    ]
}
