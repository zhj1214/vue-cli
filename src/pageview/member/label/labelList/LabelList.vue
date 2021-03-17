<!--
@desc labelList
-->
<template>
  <div class="table-body">
    <h2 class="h2">
      会员标签
    </h2>
    <div class="table-content">
      <QueryCom
        :prop-expand="propExpand"
        @onExpandFilter="onExpandFilter"
      >
        <div
          slot="query"
          class="clear"
        >
          <div
            class="left"
            style="float: left"
          >
            <Select
              v-model="pageData.timeType"
              class="w100 button-gap"
            >
              <Option value="1">
                创建时间
              </Option>
              <Option value="2">
                编辑时间
              </Option>
            </Select>

            <DatePicker
              type="daterange"
              placeholder="开始时间 → 结束时间"
              split-panels
              class="ml-10 button-gap"
              style="width: 220px"
              @on-change="onChangeDate"
            />
          </div>

          <div
            class="right"
            style="float: right"
          >
            <Select
              v-model="pageData.inputName"
              class="w100 button-gap"
            >
              <Option value="id">
                标签编号
              </Option>
              <Option value="name">
                标签名称
              </Option>
              <Option value="creatorName">
                创建人
              </Option>
            </Select>
            <i-input
              v-model.trim="pageData.inputValue"
              class="w300 input-dropdown-no-left fix-iview-icon"
              :placeholder="searchPlaceholder"
              icon="ios-search"
              style="float: right;"
              clearable
              @on-enter="onSearch"
              @on-click="onSearch"
            />
          </div>
        </div>

        <div slot>
          <div class="search-row">
            标签所属组织：
            <Select
              v-model="pageData.orgIdSearch"
              class="large-select"
              placeholder="请输入标签所属组织名称"
              filterable
              clearable
              :remote-method="getSourceOrg"
            >
              <Option
                v-for="(option, index) in sourceList"
                :key="index"
                class="large-select"
                :value="option.orgId"
              >
                {{ displayBelongOrg(option.name, option.belongOrg) }}
              </Option>
            </Select>
          </div>

          <div style="text-align: right">
            <Button
              type="primary"
              @click="onSearch"
            >
              筛选
            </Button>
            <Button
              class="ml-10"
              @click="onResetFilter"
            >
              重置
            </Button>
          </div>
        </div>
      </QueryCom>
      <div />
      <div class="search-row middle-block-narrow">
        <Button
          v-if="__hasPower('addLabel')"
          type="primary"
          class="button-gap"
          @click="createLabelModalStatus=true"
        >
          新建标签
        </Button>
        <Dropdown
          @on-click="batchAction"
        >
          <Button class="button-gap">
            批量操作
            <Icon
              type="ios-arrow-down"
            />
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem
              v-if="__hasPower('batchDelete')"
              name="delete"
            >
              删除标签
            </DropdownItem>
            <DropdownItem
              v-if="__hasPower('group')"
              name="group"
            >
              分组设置
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Button
          v-if="__hasPower('group')"
          class="button-gap"
          @click="jumpGroup"
        >
          标签分组管理
        </Button>
      </div>

      <div
        v-if="countSelect !== 0"
        class="select-info-block"
      >
        <div>
          <i
            class="icon iconfont iconInfo color-text"
            title="更多"
          />
          <span>当前已选择</span>
          <span class="select-count">{{ countSelect }}</span>
          <span> 项（仅统计该分页的选择项，不支持对跨分页的项目进行批量操作）</span>
        </div>
        <span
          class="action-text"
          @click="clearSelect"
        >清空</span>
      </div>

      <BaseTable
        ref="table"
        class="middle-block-narrow"
        :col="tableCol"
        :list="tableList"
        :page-data="pageData"
        :loading="loading"
        @on-selectTable="onSelectTable"

        @on-pageChange="onPageChange"
        @on-pageSize="onPageSize"
      />
    </div>

    <Modal
      v-model="createLabelModalStatus"
      title="新建标签"
      :mask-closable="false"
      @on-cancel="cancelCreateLabel"
    >
      <div>
        <h4>请选择您需要创建的标签类型</h4>
        <div class="clear rule-manual">
          <div
            style="float: left;"
            :class="labelType===1?'active':''"
            @click="onChooseLabelType(1)"
          >
            <h5>规则标签</h5>
            <p>自定义标签的名称及计算规则，系统根据重算周期定时计算符合规则的人群。</p>
          </div>
          <div
            style="float: right;"
            :class="labelType===2?'active':''"
            @click="onChooseLabelType(2)"
          >
            <h5>手动标签</h5>
            <p>仅需定义标签名称即可生产标签；可在会员信息页面手动为会员打上标签。</p>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button @click="cancelCreateLabel">
          取消
        </Button>
        <Button
          type="primary"
          @click="onCreatedTag"
        >
          确定
        </Button>
      </div>
    </Modal>

    <div v-if="groupSetting">
      <Modal
        v-model="groupSetting"
        title="分组设置"
        :mask-closable="false"
        @on-cancel="cancelCreateLabel"
      >
        <main>
          <div>将选中的标签统一移动至分组：</div>
          <Select
            v-model="updateGroup"
            placeholder="请选择标签分组"
            class="w220 mini-block-narrow"
          >
            <Option
              v-for="item in groupList"
              :key="item.code"
              :value="item.code"
            >
              {{ item.value }}
            </Option>
          </Select>
        </main>
        <div slot="footer">
          <Button @click="cancelSetting">
            取消
          </Button>
          <Button
            type="primary"
            @click="setGroup"
          >
            确定
          </Button>
        </div>
      </Modal>
    </div>


    <ImportMember
      :import-visible="importVisible"
      :is-watch-import="isWatchImport"
      :checked-obj="checkedObj"
      @hideTheImportModal="hideTheImportModal"
    />
  </div>
</template>
<script>
import BaseTable from "../../../base/BaseTable";
import ImportMember from "@/pageview/member/label/labelList/ImportMember";
import QueryCom from "@/components/QueryCom";

import {labelListCol} from "./labelListCol";
import mixinsGlobal from "../../../../mixins/mixinsGlobal";
import {log} from "@/utils/tools";
import {displayBelongOrg} from "@/pageview/member/memberTool";

export default {
    name: "LabelList",
    components: {
        BaseTable,
        ImportMember,
        QueryCom,
    },
    mixins: [mixinsGlobal],
    data() {
        return {
            loading: false,
            createLabelModalStatus: false,
            labelType: 1,
            pageData: {
                page: 1,
                size: 10,
                count: 0,
                inputName: "name",

                timeType: "1",
                beginTime: "",
                endTime: "",
                orgIdSearch: '',
                isOpen: '',
            },
            tableList: [],
            labelGroupList: [],
            orgId: localStorage.getItem("orgId"),

            // 会员标签导入
            importVisible: false,
            // true 进程查看 false 导入会员
            isWatchImport: true,
            checkedObj: {},

            batchId: [],
            groupSetting: false,
            updateGroup: '',
            groupList: [],

            sourceList: [],
            propExpand: {
                isExpand: false
            },
        };
    },
    computed: {
        tableCol() {
            return labelListCol.call(this) || [];
        },
        searchPlaceholder() {
            let textList = {
                id: '标签编号',
                name: '标签名称',
                creatorName: '创建人',
            }
            let total = `请输入${textList[this.pageData.inputName]}`
            return total
        },
        countSelect() {
            return this.batchId.length
        },
    },
    created() {
        // this.debugLabel()

        this.getTagTypeList();
        this.orgId = localStorage.getItem('orgId');
        this.pageData.page = Number(this.$route.query.page || 1);
        this.pageData.size = Number(this.$route.query.size || 10);

        this.getLabelGroup()
        this.getSourceOrg()
        this.$nextTick(() => {
            this.getList();
        });
    },
    methods: {
        displayBelongOrg(...p) {
            return displayBelongOrg(...p)
        },
        cancelCreateLabel() {
            this.createLabelModalStatus = false;
            this.labelType = 1;
        },
        onChooseLabelType(type) {
            this.labelType = type;
        },
        filterBaseType(list) {
            const [isAuto] = list;
            this.pageData.labelBaseTypeId = isAuto;
            this.onSearch();
        },
        debugLabel() {
            localStorage.setItem('debugLabel', 'debug')
            this.debugNewLabel()
            // this.debugLabelDetail()
        },
        // 调试新增标签页
        debugNewLabel() {
            this.labelType = 1
            this.$emit('whatComponent', {type: 'LabelEdit', labelType: this.labelType});
        },
        // 调试标签详情
        debugLabelDetail() {
            this.$emit('whatComponent', {type: 'LabelDetail', labelId: 677116})
        },
        onCreatedTag() {
            this.$emit('whatComponent', {type: 'LabelEdit', labelType: this.labelType});
        },
        /**
         * @desc 标签分组
         * */
        filterLabelGroup(list) {
            const [val] = list;
            this.pageData.labelGroupTypeId = val;
            this.onSearch();
        },
        filterPublic(list) {
            log('list', list)
            const [val] = list;
            this.pageData.isOpen = val;
            this.onSearch();
        },
        getList() {
            this.loading = true;
            const pageData = JSON.parse(JSON.stringify(this.pageData));
            if (pageData.inputName === "id") {
                pageData.id = pageData.inputValue;
                delete pageData.name;
                delete pageData.creatorName;
            } else if (pageData.inputName === "name") {
                pageData.name = pageData.inputValue;
                delete pageData.id;
                delete pageData.creatorName;
            } else {
                pageData.creatorName = pageData.inputValue;
                delete pageData.name;
                delete pageData.id;
            }
            delete pageData.inputName;
            this.$ajaxGet('/label-server/label/list', pageData)
                .then(res => {
                    if (res && res.code === 10000) {
                        let resData = res.data.list || []
                        this.renderLabelList(resData)
                        this.pageData.count = res.data.count;
                    }
                    this.loading = false;
                });

            // this.tableList = [
            //     {
            //         "id": "012852",
            //         "name": "手动标签002",
            //         "typeCode": null,
            //         "typeName": "会员身份",
            //         "isOpen": true,
            //         "isHand": true,
            //         "isRule": false,
            //         "orgId": "12895628",
            //         "orgName": "央视视频-产品线001",
            //         "remark": "备注666666",
            //         "count": 50,
            //         "creatorName": "超级管理员",
            //         "createTime": 1593761513000,
            //         "modifyTime": 1593761513000,
            //         "rule": null,
            //         "updatePeriod": null,
            //         "canEdit": true,
            //         "canDelete": true,
            //         canBeOperator: true,
            //
            //         belongOrg: '坑点击',
            //         belongOrgStr: '万象城/大中华区',
            //         calculateTime: 1593761513000,
            //
            //     }
            // ]
        },
        renderLabelList(list) {
            let tempList = list.map(i => {
                let canBeOperator = i.canBeOperator
                return {
                    ...i,
                    _disabled: !canBeOperator,
                }
            })
            this.tableList = tempList
        },
        getTagTypeList() {
            this.$ajaxGet('/label-server/labelType/listSimple', {type: 1})
                .then(res => {
                    if (res && res.code === 10000) {
                        let labelGroupList = (res.data || []).map(item => {
                            return {label: item.value, value: item.code};
                        });
                        labelGroupList.push({label: "未分类", value: 0});
                        this.labelGroupList = labelGroupList;
                    }
                });
        },
        onClickDropdown(name) {
            this.pageData.timeType = name;
        },
        batchAction(name) {
            if (this.batchId.length === 0) {
                this.$Message.error('请勾选标签后才能进行批量操作')
                return
            }
            if (name === 'delete') {
                this.showDeletePop()
            } else if (name === 'group') {
                this.showGroupSetting()
            }
        },
        showDeletePop() {
            this.$Modal.confirm({
                title: '删除标签？',
                content: '<p><span style="color: red">删除标签后无法恢复</span>，调用该标签的功能将均失效，你还要继续吗？</p>',
                onOk: () => {
                    this.onCancelRegister('batch')
                },
                onCancel: () => {
                    this.clearSelect()
                }
            });
        },
        showGroupSetting() {
            this.groupSetting = true
        },
        onChangeDate(date) {
            this.pageData.beginTime = date[0];
            this.pageData.endTime = date[1];
            this.onSearch();
        },
        onSearch() {
            this.pageData.page = 1;
            this.$nextTick(() => {
                this.getList();
            });
        },
        onPageSize(size) {
            log('onPageSize', size)
            this.pageData.size = size;
            this.onSearch();
        },
        onPageChange(val) {
            this.pageData.page = val;
            this.$nextTick(() => {
                this.getList();
            });
        },
        onCancelRegister(type, row) {
            let url = '/label-server/label/delete'
            let data = []
            if (type === 'single') {
                data = [row.id]
            } else if (type === 'batch') {
                data = this.batchId
            }
            this.$ajaxPost(url, data)
                .then(res => {
                    if (res && res.code === 10000) {
                        this.$Message.success(res.message || '操作成功');
                        this.getList()
                        return true;
                    } else {
                        this.$Message.error('操作失败');
                        return false;
                    }
                })
                .then(status => {
                    if (status) this.onSearch();
                });
        },

        // 会员标签导入
        verifyIsCanUpload(id) {
            this.$ajaxGet('/label-server/tagLabel/checkCanBeUpload', {
                labelId: id
            }).then(res => {
                if (res && res.code === 10000) {
                    if (res.data) {
                        this.importVisible = true;
                    } else {
                        this.$Message.warning('标签正在导入中，请稍后再试。');
                    }
                }
            })
                .catch(err => {
                    console.info(err);
                });
        },
        async clickImportData(checkedObj) {
            this.checkedObj = checkedObj;
            this.isWatchImport = false;
            await this.verifyIsCanUpload(checkedObj.id);
        },
        async clickWatchImport(checkedObj) {
            this.checkedObj = checkedObj;
            this.isWatchImport = true;
            await this.verifyIsCanUpload(checkedObj.id);
        },
        hideTheImportModal() {
            this.importVisible = false;
            this.getList();
        },
        onSelectTable(idList) {
            this.batchId = idList.map(i => i.id)
        },
        getLabelGroup() {
            let server = '/label-server'
            let url = server + '/labelType/listSimple'

            this.$ajaxGet(url)
                .then(res => {
                    if (res && res.code === 10000) {
                        let resData = res.data
                        this.groupList = resData || [];
                    }
                })
                .catch(err => {
                    log(err);
                });
        },
        cancelSetting() {
            this.updateGroup = ''
            this.groupSetting = false
            this.clearSelect()
        },
        setGroup() {
            let server = '/label-server'
            let url = server + '/label/updateLabelTypeBatch'
            let data = {
                labelIds: this.batchId,
                labelTypeId: this.updateGroup,
            }
            this.$ajaxPost(url, data)
                .then(res => {
                    if (res && res.code === 10000) {
                        let resData = res.data
                        this.getList()
                        log('getLabelGroup, res', resData)
                    }
                    this.cancelSetting()
                    // this.initBatchAction()
                })
                .catch(err => {
                    log(err);
                });
        },
        initBatchAction() {
            this.batchId = []
            this.dynamicSelectList(false)
        },
        dynamicSelectList(status) {
            this.$refs.table.selectAll(status)
        },
        jumpGroup() {
            let url = '/member/labelLayer/labelGroup'
            window.open(url, '_blank')
        },
        getSourceOrg(query = '') {
            let server = '/user-server'
            let url = server + '/platform/department/pageDepartment'

            let data = {
                searchType: 'name',
                searchContent: query,
            }

            this.$ajaxPost(url, data)
                .then(res => {
                    if (res.code === 10000) {
                        let data = res.data !== undefined ? res.data.list : []
                        this.sourceList = this.sourceList.concat(data)
                        log('this.sourceList', this.sourceList)
                    }
                })
                .catch(err => {
                    log(err);
                });
        },
        onQueryCollect(type) {
            const collectSet = new Set(this.pageData.collectTypeArray);
            if (this.pageData.collectTypeArray.includes(type)) {
                collectSet.delete(type);
            } else collectSet.add(type);
            this.pageData.collectTypeArray = Array.from(collectSet);
        },
        onCloseFilter() {
            this.propExpand.isExpand = false;
        },
        onExpandFilter() {
            this.propExpand.isExpand = !this.propExpand.isExpand;
        },
        onResetFilter() {
            Object.assign(this.pageData, {
                orgIdSearch: '',
            })

            this.onSearch()
        },
        // 清空选中项
        clearSelect() {
            this.batchId = []
            this.pageData.page = 1;
            this.$nextTick(() => {
                this.getList();
            });
        },
    }
};
</script>

<style scoped lang="scss">
.rule-manual {
    margin-top: 24px;

    div {
        position: relative;
        cursor: pointer;
        border: 1px solid #E2E2E9;
        border-radius: 8px;
        padding: 8px 24px;
        width: 48%;
        overflow: hidden;

        h5 {
            margin-bottom: 5px;
        }

        p {
            font-size: 12px;
            color: #92929D;
        }
    }

    div.active {
        border: 1px solid #756CEA;

        &:before {
            position: absolute;
            display: block;
            content: "";
            background: url("../../../../assets/images/coupon/coupon_okIcon.png") no-repeat;
            color: #fff;
            right: -4px;
            top: -2px;
            width: 24px;
            height: 24px;
            z-index: 22;
        }

        &:after {
            display: block;
            content: "";
            color: #fff;
            right: 0;
            top: 0;
            width: 0;
            height: 0;
            border-color: #756CEA transparent;
            border-width: 32px 0 0 32px;
            border-style: solid;
            position: absolute;
        }

        h5 {
            color: #756CEA;
        }
    }
}

.table-content {
    //min-width: 1300px;
    border-radius: 16px;
    background: #fff;
    padding: 24px;
}

.query-row {
    margin-bottom: 20px;

    .dropdown {
        float: left;
        line-height: 32px;
        padding: 0 8px;
        border: 1px solid #E2E2E9;
        border-radius: 8px;
        cursor: pointer;
    }

    .dropdown-right {
        margin-left: 24px;
        line-height: 30px;
        padding: 0 8px;
        border: 1px solid #E2E2E9;
        border-right: 1px solid #fff;
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
        cursor: pointer;
    }

    .dropdown-input-group {
        float: right;
    }
}

.search-row {
    border-bottom: 1px dotted #E2E2EA;
    padding: 8px 0;
    margin: 12px 0;
}

.select-info-block {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    background: #E9E8FF;

    border-radius: 4px;
    border: 1px solid rgba(117, 108, 234, 1);

    padding-left: 16px;
    padding-right: 16px;
    line-height: 48px;
    color: rgba(23, 23, 37, 1);

    .iconInfo {
        margin-right: 4px;
    }

    span {
        line-height: 26px;
    }
}

.color-text {
    color: rgba(117, 108, 234, 1);
}

.select-count {
    color: rgba(117, 108, 234, 1);
    padding: 4px;
}

.large-select {
    width: 410px !important;
}
</style>
