<!------------------------
 *@name Vue.js
 *@author Jo.gel
 *@date 2020年3月9日14:11:38
 -------------------------->
<template>
  <div class="organization-page clear">
    <LeftTreeLayout>
      <orgTree
        slot="left"
        @select-change="treeChange"
      />
      <!-- <BaseTree
        :treeData="treeData"
        slot="left"
        :isSearch="true"
        :searchPlaceholder="'组织名称检索'"
        style="height: 100%"
        ref="theTree"
        :render="renderContent"
      >
      </BaseTree> -->

      <div
        slot="right"
        class="content"
      >
        <h3>{{ treeItem.title }}</h3>

        <div class="show-table">
          <div class="query clear">
            <Button
              v-if="pageAction.includes('create')"
              type="primary"
              @click="onCreateOrg"
            >
              新增机构
            </Button>
            <Button
              v-if="pageAction.includes('delete')"
              class="ml-10"
              :disabled="isSelection"
              type="primary"
              ghost
              @click="onDeleteOrg"
            >
              批量删除
            </Button>
            <div
              style="
                                display: inline-block;
                                width: 192px;
                                height: 32px;
                                margin-left: 12px;
                                background: #f1f1f5;
                                border-radius: 16px;
                            "
            >
              <a
                :class="
                  pageData.isSearch === '2'
                    ? 'tab curTab'
                    : 'tab'
                "
                @click="tabChange('2')"
              >全量组织</a>
              <a
                :class="
                  pageData.isSearch === '1'
                    ? 'tab curTab'
                    : 'tab'
                "
                @click="tabChange('1')"
              >当前组织</a>
            </div>
            <i-input
              v-model="pageData.searchContent"
              placeholder=""
              search
              class="w250 fix-iview-icon"
              style="float: right"
              icon="ios-search"
              @on-enter="onSearch"
              @on-click="onSearch"
            >
              <Select
                slot="prepend"
                v-model="pageData.searchType"
                style="width: 110px"
              >
                <Option value="name">
                  组织名称
                </Option>
                <Option value="createName">
                  创建人姓名
                </Option>
                <Option value="createPhone">
                  创建人账号
                </Option>
              </Select>
            </i-input>
          </div>
          <div
            v-show="selection.length"
            class="delete-alert clear"
          >
            <Icon
              color="#756CEA"
              type="ios-alert-outline"
            />
            当前已选择 {{ selection.length }}项
            <span
              class="pointer is-active"
              style="float: right"
              @click="onClearSelect"
            >清空</span>
          </div>
          <BaseTable
            ref="baseTable"
            :list="tableList"
            :col="tableCol"
            :page-data="pageData"
            @on-selectTable="onSelectTable"
            @on-pageChange="onPageChange"
            @on-pageSize="onPageSize"
          />
        </div>

        <!-- <div class="no-table" v-else>
          <img
            src="../../assets/images/tenant/icon-no-org.png"
            alt=""
            style="width: 180px; height: 180px"
          />
          <p class="p-text">当前商户版本的层级，已达到组织的最大层级</p>
          <p class="p-text">如有升级商户版本需求请联系客服</p>
        </div> -->
      </div>
    </LeftTreeLayout>

    <Modal
      v-model="modalStatus"
      width="600"
      :title="isEditStatus ? '编辑组织' : '新增组织'"
      :mask-closable="false"
      @on-cancel="onCancelModal"
    >
      <div class="ivu-modal-body">
        <Form
          ref="formData"
          onsubmit="return false"
          :model="formPropsData"
          :label-width="150"
          :rules="validateOrganization"
        >
          <FormItem
            v-if="!isEditStatus"
            label="组织类型："
            prop="type"
          >
            <Select v-model="formPropsData.type">
              <Option
                v-for="item in ableTypeList"
                :key="item.code"
                :value="item.code"
              >
                {{ item.value }}
              </Option>
            </Select>
          </FormItem>
          <FormItem
            v-if="isEditStatus"
            label="组织类型："
          >
            <span>{{ typeMap[formPropsData.type] }}</span>
          </FormItem>
          <FormItem
            label="组织名称："
            prop="name"
          >
            <i-input
              v-model="formPropsData.name"
              show-word-limit
              placeholder="请输入组织名称"
              :maxlength="16"
            />
          </FormItem>
          <FormItem
            v-if="
              formPropsData.type !== '3' &&
                formPropsData.type !== '4'
            "
            label="组织地址："
            prop="addressList"
          >
            <Cascader
              v-model="formPropsData.addressList"
              placeholder="请选择省 / 市 / 区"
              :data="cascadeCitys"
            />
          </FormItem>
          <FormItem
            v-if="
              formPropsData.type !== '3' &&
                formPropsData.type !== '4'
            "
            prop="address.addressDetail"
          >
            <div class="address-detail clear">
              <i-input
                v-model="formPropsData.address.addressDetail"
                :maxlength="50"
                style="width: 280px; float: left"
                placeholder="请填写详细地址"
                @on-change="onSearchMap"
              />
              <Button
                style="float: right"
                @click="onReSearch"
              >
                搜索地图
              </Button>
            </div>
            <div class="address-map">
              <BMap
                ref="bMap"
                :geo-location="provinceCityArea"
                :address="formPropsData.address.addressDetail"
                map-height="300px"
                map-width="386px"
                @getPointAddress="getPointAddress"
                @reportError="getMapError"
              />
            </div>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button
          size="large"
          style="margin-right: 10px"
          @click="onCancelModal"
        >
          取消
        </Button>
        <Button
          size="large"
          :disabled="disabledLoading"
          type="primary"
          @click="onConfirm"
        >
          确定
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
// import BaseTree from "../base/BaseTree";
import BaseTable from "../base/BaseTable";
import LeftTreeLayout from "../../layout/LeftTreeLayout";
import mixinsPlatform from "../../mixins/mixinsPlatform";
import { organizationTableCol } from "./platformTableCol";
import BMap from "../../components/BMap";
import mixinsGlobal from "../../mixins/mixinsGlobal";
import { mapGetters } from "vuex";
import orgTree from "../../components/orgTree/orgTree";

export default {
    name: "Organization",
    components: {
        // BaseTree,
        BaseTable,
        BMap,
        LeftTreeLayout,
        orgTree,
    },
    mixins: [mixinsPlatform, mixinsGlobal],
    data() {
        const checkAddress = (rule, value, callback) => {
            if (!this.formPropsData.addressList) callback("请选择组织地址");
            else if (
                this.formPropsData.addressList &&
                !this.formPropsData.addressList.length
            ) {
                callback("请选择组织地址");
            } else callback();
        };
        return {
            disabledLoading: false,
            isEditStatus: false,
            modalStatus: false,
            isMapAreaOut: false,
            mapErrorMessage: "",
            typeList: [
                {
                    code: "4",
                    value: "区域",
                },
                {
                    code: "5",
                    value: "商场",
                },
                {
                    code: "10",
                    value: "店铺",
                },
                {
                    code: "3",
                    value: "部门",
                },
            ],
            typeMap: {
                3: "部门",
                4: "区域",
                5: "商场",
                10: "店铺",
            },
            formPropsData: {
                name: "",
                type: "0",
                parentId: "",
                addressList: [],
                address: {
                    addressDetail: "",
                },
            },
            validateOrganization: {
                type: [
                    {
                        required: true,
                        message: "请选择组织类型",
                        trigger: "change",
                    },
                ],
                name: [
                    {
                        required: true,
                        message: "请输入组织名称",
                        trigger: "change",
                    },
                ],
                addressList: [
                    {
                        required: true,
                        validator: checkAddress,
                        trigger: "change",
                    },
                ],
                "address.addressDetail": [
                    {
                        required: true,
                        message: "请填写详细地址",
                        trigger: "change",
                    },
                ],
            },
            pageData: {
                page: 1,
                size: 10,
                count: 0,
                name: "",
                searchType: "name",
                searchContent: "",
                isSearch: "2", //1 当前false ,2 所有true
                type: "",
                source: "",
            },
            treeItem: {},
            tableList: [],
            tableCol: organizationTableCol.call(this),
            selection: [],
        };
    },
    computed: {
        ...mapGetters(["cascadeCitys"]),
        provinceCityArea() {
            return this.formPropsData.addressList.join("");
        },
        isShowCreateButton() {
            return !this.treeItem.nodeKey || Number(this.treeItem.level) < 3;
        },
        disabledCompany() {
            // type=1 商户、2门店、3部门
            return (
                Number(this.treeItem.type) !== 1 ||
                this.treeItem.nodeKey > 1 ||
                this.treeItem.storeType === "Personal"
            );
        },
        isSelection() {
            return !this.selection.length;
        },
        ableTypeList() {
            if (this.treeItem.createType == 1) {
                return [
                    {
                        code: "3",
                        value: "部门",
                    },
                ];
            } else if (this.treeItem.createType == 2) {
                return [
                    {
                        code: "10",
                        value: "店铺",
                    },
                    {
                        code: "3",
                        value: "部门",
                    },
                ];
            } else if (this.treeItem.createType == 3) {
                return [
                    {
                        code: "4",
                        value: "区域",
                    },
                    {
                        code: "5",
                        value: "商场",
                    },
                    {
                        code: "3",
                        value: "部门",
                    },
                ];
            } else {
                return [];
            }
        },
    },
    methods: {
        tabChange(tab) {
            this.pageData.isSearch = tab;
            this.$nextTick(() => {
                this.getOrganizationTable();
            });
        },
        onSearchMap() {
            this.formPropsData.address.lng = null;
            this.formPropsData.address.lat = null;
        },
        onReSearch() {
            this.$refs["bMap"].drawWithAddress();
        },
        getPointAddress(address, point) {
            this.formPropsData.address.addressDetail = address;
            const { lng, lat } = point;
            this.formPropsData.address.lng = lng;
            this.formPropsData.address.lat = lat;
            this.mapErrorMessage = "";
        },
        /**
         * @desc 选取地图出区域错误回调
         * @pointObj {point:[],message:""}
         * */
        getMapError(pointObj) {
            const { message } = pointObj;
            this.mapErrorMessage = message;
        },
        onSearch() {
            this.pageData.page = 1;
            this.$nextTick(() => {
                this.getOrganizationTable();
            });
        },
        onCreateOrg() {
            this.isEditStatus = false;
            this.modalStatus = true;
            this.$refs["formData"].resetFields();
            this.formPropsData.type =
                this.treeItem.createType === 3
                    ? "4"
                    : this.treeItem.createType === 2
                    ? "10"
                    : "3";
            this.formPropsData.address = {
                addressDetail: "",
            };
        },
        onDeleteOrg() {
            this.$Modal.confirm({
                title: "确认删除",
                content: "<p>删除后不可恢复，是否确认该操作</p>",
                onOk: () => {
                    let ids = this.selection.map((item) => item.id);
                    this.deleteOrg(ids);
                },
            });
        },
        deleteOrg(ids) {
            this.$ajaxPost("/user-server/platform/department/delete", ids).then(
                (res) => {
                    if (res && res.code === 10000) {
                        this.$Message.success(res.message || "操作成功");
                        // 更新左边树 和 右边的表
                        this.$eventEmitter.trigger("orgTreelist", {
                            ...this.treeItem,
                            ...{
                                departmentId: this.treeItem.id,
                                page: 1,
                                size: 100,
                            },
                        });
                        this.onSearch();
                        this.$refs.baseTable.$refs["ivu-table"].selectAll(
                            false
                        );
                    }
                }
            );
        },
        onCancelModal() {
            this.modalStatus = false;
        },
        onConfirm() {
            this.$refs["formData"].validate((valid) => {
                if (valid) this.createOrg();
            });
        },
        createOrg() {
            if (
                (this.mapErrorMessage || !this.formPropsData.address.lng) &&
                this.formPropsData.type === "2"
            ) {
                this.$Message.error(
                    this.mapErrorMessage || "请重新选择搜索定位"
                );
                return;
            }
            const { addressList, ...other } = this.formPropsData;
            const createData = { ...other };
            createData.address.province = addressList[0] ? addressList[0] : "";
            createData.address.city = addressList[1] ? addressList[1] : "";
            createData.address.area = addressList[2] ? addressList[2] : "";
            createData.parentId =
                createData.parentId ||
                this.treeItem.id ||
                localStorage.getItem("departmentId");
            let url = "/user-server/platform/department/create";
            if (this.isEditStatus) {
                url = "/user-server/platform/department/update";
            }
            this.$ajaxPost(url, createData).then((res) => {
                if (res && res.code === 10000) {
                    this.$Message.success(res.message || "操作成功");
                    this.formPropsData = this.$options.data().formPropsData; // 重置表单
                    // 更新左边树 和 右边的表
                    this.$eventEmitter.trigger("orgTreelist", {
                        ...this.treeItem,
                        ...{
                            departmentId: this.treeItem.id,
                            page: 1,
                            size: 100,
                        },
                    });
                    this.modalStatus = false;
                }
            });
        },
        filterOrgType(list) {
            const [type] = list;
            this.pageData.page = 1;
            this.pageData.type = type;
            this.$nextTick(() => {
                this.getOrganizationTable();
            });
        },
        filterSource(list) {
            console.log(list);
            const [source] = list;
            this.pageData.page = 1;
            this.pageData.source = source;
            this.$nextTick(() => {
                this.getOrganizationTable();
            });
        },
        onSelectTable(selection) {
            this.selection = selection;
        },
        onPageChange(page) {
            this.pageData.page = page;
            this.$nextTick(() => {
                this.getOrganizationTable();
            });
        },
        onPageSize(size) {
            this.pageData.size = size;
            this.pageData.page = 1;
            this.$nextTick(() => {
                this.getOrganizationTable();
            });
        },
        getOrganizationDetail(id) {
            this.$ajaxGet("/user-server/platform/department/detail", {
                id,
            }).then((res) => {
                if (res && res.code === 10000) {
                    const { id, type, name, address = {} } = res.data || {};
                    const addressList = [
                        address && address.province,
                        address && address.city,
                        address && address.area,
                    ].filter((item) => item);
                    this.formPropsData = {
                        id,
                        name,
                        type: String(type),
                        addressList,
                        address: address || {},
                    };
                }
            });
        },
        getOrganizationTable(id) {
            this.$ajaxPost("/user-server/platform/department/list", {
                ...this.pageData,
                isSearch: this.pageData.isSearch !== "1",
                departmentId:
                    id ||
                    this.treeItem.id ||
                    localStorage.getItem("departmentId"),
            }).then((res) => {
                if (res && res.code === 10000) {
                    this.tableList = res.data.list || [];
                    this.pageData.count = res.data.count || 0;
                }
            });
        },
        treeChange(item) {
            const data = JSON.parse(JSON.stringify(item));
            delete data.children;
            this.treeItem = data;
            this.$nextTick(() => {
                this.getOrganizationTable();
            });
        },
    },
};
</script>

<style scoped lang="scss">
.organization-page {
    border-radius: 16px;
    background: #fff;
}

.no-table {
    text-align: center;
    padding: 24px;
}

.address-detail {
    position: relative;
}

.address-map {
    margin-top: 24px;
    background: #ddd;
}
.tab {
    display: inline-block;
    width: 96px;
    height: 32px;
    border-radius: 16px;
    font-size: 14px;
    color: #44444f;
    line-height: 32px;
    text-align: center;
}
.curTab {
    background: #756cea;
    color: #fff;
}
</style>
