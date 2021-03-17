import UserInfoCell from "@/pageview/member/query/UserInfoCell";

// import superVipIcon from "@/assets/images/member/super_vip_icon.png";
import OperateCell from "@/pageview/member/query/OperateCell";

export function memberTableCol() {
    return [
        {
            type: "selection",
            width: "60px"
        },
        {
            title: "用户昵称/ID",
            width: "240px",
            render: (h, params) => {
                return h(UserInfoCell, {
                    props: {
                        data: params.row,
                    }
                });
            }
        },
        {
            title: "手机号",
            width: "140px",
            key: "sensitivePhone",
        },
        {
            title: "成长值",
            key: "growthBalance",
            render: (h, params) => {
                return h("span", this.$formatNumber(params.row.growthBalance, "0"));
            }
        },
        {
            title: "积分",
            key: "pointBalance",
            render: (h, params) => {
                return h("span", this.$formatNumber(params.row.pointBalance, "0"));
            }
        },
        {
            title: "等级",
            key: "levelId",
            render: (h, params) => {
                return h("div", [
                    h("span", Number(params.row.levelId) === -1 ? "-" : params.row.levelId),
                    params.row.isFrozenLevel ? h("Icon", {props: {type: "md-lock", color: "#BBBBC3"}}) : ""
                ]);
            }
        },
        {
            title: "注册来源",
            key: "orgName",
        },
        {
            title: "注册时间",
            key: "createTime",
            render: this.$renderTime,
        },
        {
            title: "操作",
            width: '160px',
            align: 'center',
            render: (h, params) => {
                return h(OperateCell, {
                    props: {
                        data: params.row,
                        memberActions: this.memberActions,
                    },
                    on: {
                        'addMark': () => {
                            this.actionLabelStatus = true;
                            this.memberIds = [params.row.id];
                            this.selectType = "single";
                            this.selectList = [];
                        },
                        'clickDrop': (name) => {
                            this.selectType = "single";
                            // this.selectList = [params.row];
                            this.singleMember = [params.row.id];
                            this.changeMemberInfo(name, params.row)
                        },
                    }
                });
            }
        },
    ];
}
