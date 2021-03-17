import BelongOrgCell from "@/pageview/base/tableComponent/BelongOrgCell";

// 会员标签-标签与客群-标签分组管理
export function labelTypesCol() {
    return [
        {title: "ID", key: "id"},
        {title: "分组名称", key: "name"},
        {title: "创建人", key: "creatorName"},
        {
            title: "创建组织",
            render: (h, params) => {
                let { belongOrg, belongOrgStr, } = params.row
                return h(BelongOrgCell, {
                    props: {
                        currentOrg: belongOrg,
                        higherOrg: belongOrgStr,
                    }
                })
            }
        },
        {title: "创建时间", key: "createTime", render: this.$renderTime},
        {
            title: "操作", render: (h, params) => {
                let { canBeOperator } = params.row
                let edit = canBeOperator && this.__hasPower('editGroup')
                let deleteGroup = canBeOperator && this.__hasPower('deleteGroup')

                return h('div', [
                    edit ? h('span', {
                        class: "span-a", on: {
                            click: () => {
                                this.onEditLabel(params.row);
                            }
                        }
                    }, '编辑') : "",
                    deleteGroup ? h('span', {
                        class: "span-a ml-10", on: {
                            click: () => {
                                this.$Modal.confirm({
                                    title: '删除分组？',
                                    content: '删除后无法恢复，但该分组下的标签不会被删除，你还要继续吗？',
                                    onOk: () => {
                                        this.deleteLabelType(params.row.id);
                                    }
                                });
                            }
                        }
                    }, '删除') : "",
                ]);
            }
        }
    ];
}
