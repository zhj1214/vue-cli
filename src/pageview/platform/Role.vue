<template>
  <div class="role-page">
    <LeftTreeLayout>
      <orgTree
        slot="left"
        @select-change="treeChange"
        @change="changeOrgTree"
      />
      <!-- <BaseTree
        :treeData="treeData"
        slot="left"
        :isSearch="true"
        :searchPlaceholder="'组织名称检索'"
        style="height: 100%"
        ref="theTree"
        :render="renderContent"
      ></BaseTree> -->
      <div
        slot="right"
        class="content"
      >
        <h3>
          {{ treeItem.title }}
          <!-- <div class="select-role">
            <span style="color: #92929d">展示范围：</span>
                    ? "当前组织角色"
                    : "包含所有级组织角色"
                }}
                <Icon type="ios-arrow-down"></Icon>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem name="1">当前组织角色</DropdownItem>
                <DropdownItem name="2">包含所有级组织角色</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div> -->
        </h3>
        <div class="query clear">
          <Button
            v-if="pageAction.includes('create')"
            type="primary"
            :disabled="isCanCreate"
            @click="onCreateRole"
          >
            新增角色
          </Button>
          <Button
            v-if="pageAction.includes('delete')"
            class="ml-10"
            :disabled="isSelection || isDeleteLoading"
            :loading="isDeleteLoading"
            type="primary"
            ghost
            @click="onDeleteRole"
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
              :class="pageData.isSearch === '2' ? 'tab curTab' : 'tab'"
              @click="tabChange('2')"
            >全量组织</a>
            <a
              :class="pageData.isSearch === '1' ? 'tab curTab' : 'tab'"
              @click="tabChange('1')"
            >当前组织</a>
          </div>
          <i-input
            v-model="pageData.searchContent"
            placeholder="角色名称检索"
            search
            class="w250 fix-iview-icon"
            style="float: right;"
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
                角色名称
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
          :loading="isTableLoading"
          :page-data="pageData"
          @on-selectTable="onSelectTable"
          @on-pageChange="onPageChange"
          @on-pageSize="onPageSize"
        />
      </div>
    </LeftTreeLayout>

    <Modal
      v-model="modalStatus"
      width="600"
      :title="isEditStatus ? '编辑角色' : '新增角色'"
      :mask-closable="false"
      @on-cancel="onCancelModal"
    >
      <Form
        ref="roleForm"
        onsubmit="return false"
        :model="roleData"
        :rules="roleValid"
        :label-width="150"
      >
        <FormItem
          label="角色名称："
          prop="name"
        >
          <i-input
            v-model="roleData.name"
            placeholder="请输入角色名称"
            :maxlength="16"
          />
        </FormItem>
        <FormItem
          label="分配权限："
          prop="powers"
        >
          <Tree
            ref="treeCheck"
            :data="powersTreeEdit"
            :render="renderBlackContent"
          />
        </FormItem>
      </Form>
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
          type="primary"
          :loading="commitLoading"
          :disabled="commitLoading"
          @click="onConfirmModal"
        >
          确定
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import orgTree from '../../components/orgTree/orgTree'
import BaseTable from "../base/BaseTable";
import LeftTreeLayout from "../../layout/LeftTreeLayout";
import { roleTableCol } from "./platformTableCol";
import mixinsPlatform from "../../mixins/mixinsPlatform";
import { mapState, mapActions } from "vuex";
import mixinsGlobal from "../../mixins/mixinsGlobal";

export default {
  name: "Role",
  components: {
    orgTree,
    BaseTable,
    LeftTreeLayout
  },
  mixins: [mixinsPlatform, mixinsGlobal],
  data() {
    return {
      tableList: [],
      selection: [],
      dateQuery: [],
      tableCol: roleTableCol.call(this),
      modalStatus: false,
      isEditStatus: false,
      isDeleteLoading: false,
      commitLoading: false,
      isOnlyRead: false,
      isTableLoading: false,
      roleData: {
        departmentId: "",
        name: "",
        powers: [],
      },
      roleValid: {
        name: [
          { required: true, message: "请输入角色名称", trigger: "change" },
        ],
        powers: [
          {
            required: true,
            type: "array",
            message: "请选择分配权限",
            trigger: "change",
          },
        ],
      },
      treeItem: {},
      pageData: {
        page: 1,
        size: 10,
        count: 0,
        searchType: "name",
        searchContent: "",
        beginTime: "",
        endTime: "",
        isSearch: "2", //1 当前false ,2 所有true
      },
    };
  },
  watch: {
    powersTreeEdit(val) {
      this.arrIds = [];
      this.returnIdsRecursion(val);
      this.$nextTick(() => {
        this.$set(this.roleData, "powers", this.arrIds); //回传给formProp表单
      });
    },
  },
  mounted() {
    this.getBlankPowersTree({
      url: "/user-server/auth/department/powersForRole",
      orgId:localStorage.getItem('orgId')
    });
  },
  computed: {
    ...mapState({
      powersTreeEdit(state) {
        return state.platformModule.powerBlankTree || [];
      },
    }),
    isSelection() {
      return !this.selection.length;
    },
    isCanCreate() {
      return this.orgTreeList && this.orgTreeList.length;
    },
  },
  methods: {
    ...mapActions(["getBlankPowersTree", "getRedisplayRoleTree"]),
    changeOrgTree(val){
      this.orgTreeList = val
    },
    tabChange(tab) {
      this.pageData.isSearch = tab;
      this.$nextTick(() => {
        this.getRoleTable();
      });
    },
    onDropdownRole(name) {
      this.pageData.isSearch = name;
      this.onSearch();
    },
    onChangeDate(date) {
      this.pageData.beginTime = date[0];
      this.pageData.endTime = date[1];
      this.onSearch();
    },
    onCreateRole() {
      this.$refs["roleForm"].resetFields();
      this.modalStatus = true;
      this.isEditStatus = false;
      this.getBlankPowersTree({
        url: "/user-server/auth/department/powersForRole",
        orgId:this.treeItem.orgId || localStorage.getItem('orgId'),
      });
    },
    onCancelModal() {
      this.modalStatus = false;
      this.roleData = this.$options.data().roleData;
    },
    onConfirmModal() {
      this.$refs["roleForm"].validate((valid) => {
        if (valid) this.createUpdateRole();
      });
    },
    createUpdateRole() {
      let postData = {};
      let url = "/user-server/platform/role/create";
      if (this.isEditStatus) {
        postData = JSON.parse(JSON.stringify(this.roleData));
        url = "/user-server/platform/role/update";
      } else {
        postData = JSON.parse(JSON.stringify(this.roleData));
        postData.departmentId =
          postData.departmentId ||
          this.treeItem.id ||
          localStorage.getItem("departmentId");
        delete postData.id;
      }
      this.commitLoading = true;
      this.$ajaxPost(url, {
        ...postData,
      }).then((res) => {
        if (res && res.code === 10000) {
          this.$Message.success(res.message || "操作成功");
          this.onSearch();
          this.onCancelModal();
        }
        this.commitLoading = false;
      });
    },

    onSearch() {
      this.pageData.page = 1;
      this.$nextTick(() => {
        this.getRoleTable();
      });
    },
    onSelectTable(selection) {
      this.selection = selection;
    },
    onPageChange(page) {
      this.pageData.page = page;
      this.$nextTick(() => {
        this.getRoleTable();
      });
    },
    onPageSize(size) {
      this.pageData.size = size;
      this.pageData.page = 1;
      this.$nextTick(() => {
        this.getRoleTable();
      });
    },
    onDeleteRole() {
      this.$Modal.confirm({
        title: "确认删除",
        content: "<p>删除后不可恢复，是否确认该操作</p>",
        onOk: () => {
          let ids = this.selection.map((item) => item.id);
          this.deleteRole(ids);
        },
      });
    },
    deleteRole(ids) {
      this.isDeleteLoading = true;
      this.$ajaxPost("/user-server/platform/role/delete", ids).then((res) => {
        if (res && res.code === 10000) {
          this.$Message.success(res.message || "操作成功");
          // 更新左边树 和 右边的表
          this.$eventEmitter.trigger("orgTreelist", {...this.treeItem,...{
            departmentId:
              this.treeItem.id,
            page: 1,
            size: 100,
          }});
          this.onSearch();
          this.$refs.baseTable.$refs["ivu-table"].selectAll(false);
        }
        this.isDeleteLoading = false;
      });
    },
    treeChange(item) {
      const data = JSON.parse(JSON.stringify(item));
      delete data.children;
      this.treeItem = data;
      this.$nextTick(() => {
        this.getRoleTable();
      });
    },
    getRoleTable(id) {
      this.isTableLoading = true;
      this.$ajaxPost("/user-server/platform/role/list", {
        ...this.pageData,
        isSearch: this.pageData.isSearch !== "1",
        departmentId:
          id || this.treeItem.id || localStorage.getItem("departmentId"),
      }).then((res) => {
        if (res && res.code === 10000) {
          this.tableList = res.data.list || [];
          this.pageData.count = res.data.count || 0;
        }
        this.isTableLoading = false;
      });
    },
    renderBlackContent(h, { root, node, data }) {
      return h(
        "span",
        {
          style: {
            display: "inline-block",
            width: "100%",
          },
        },
        [
          h("span", [
            h("Checkbox", {
              props: {
                value: data.hasPower,
                disabled: !!this.isOnlyRead,
              },
              style: {
                marginRight: "8px",
              },
              on: {
                "on-change": (val) => {
                  this.checkBox(val, root, node, data);
                },
              },
            }),
            h("span", data.title),
          ]),
          h("span", {
            style: {
              display: "inline-block",
              float: "right",
              marginRight: "32px",
            },
          }),
        ]
      );
    },
    /**
     * @val boolean
     * @node 当前的节点
     * @data checkbox 模拟tree的操作。
     * @val
     * @root
     * @node
     * @data
     * @1 勾选 一级 平台管理 所有的子孙，menu
     * @2 勾选 二级 组织管理。父级勾选、自己和子孙都勾选，通过parentId来遍历确认勾选
     * @3 勾选 三级 父级勾选、自己和子孙都勾选，通过parentId来遍历确认勾选
     * @4 勾选 四级 修改所有父级
     * */
    checkBox(val, root, node, data) {
      this.checkedFirst(root, data, val);
      this.checkedSecond(root, data, val);
      this.checkedThree(root, data, val);
      this.checkedFour(root, data, val);
      let ids = [];
      for (let items of root) {
        if (items.node.hasPower) {
          ids.push(items.node.id);
        }
      }
      this.$set(this.roleData, "powers", ids);
    },

    // 一级 action
    checkedFirst(root, data, status) {
      let checkAll = (arrayData) => {
        if (!arrayData.length && arrayData.id) {
          arrayData = [arrayData];
        }
        if (Array.isArray(arrayData)) {
          for (let items of arrayData) {
            items.hasPower = status;
            items.selected = status;
            if (items.children && items.children.length) {
              checkAll(items.children);
            }
          }
        }
      };
      checkAll(data);
      checkAll = null;
    },
    // 二级 action
    checkedSecond(root, data, status) {
      const siblingArray = root.filter((item) => {
        if (
          item.node.id !== data.id &&
          item.node.parentId === data.parentId &&
          item.node.hasPower
        ) {
          return true;
        }
      });
      for (let items of root) {
        if (data.parentId === items.node.id) {
          // 不存在同级被勾选则勾选父级
          if (!siblingArray.length) {
            items.node.hasPower = status;
          }
        }
      }
    },
    // 三级 勾选父级的状态，查找父级
    checkedThree(root, data, status) {
      const parentArray = root.filter((item) => item.node.id === data.parentId);
      const siblingArray = root.filter((item) => {
        if (
          item.node.id !== data.id &&
          item.node.parentId === data.parentId &&
          item.node.hasPower
        ) {
          return true;
        }
      });
      const [NodeItem = {}] = parentArray || [];
      const { node = {} } = NodeItem || {};
      const { parentId, id } = node || {};
      // 判断父级的兄弟，有没有被勾选
      const parentSiblingArray = root.filter((item) => {
        if (
          item.node.id !== id &&
          item.node.parentId === parentId &&
          item.node.hasPower
        ) {
          return true;
        }
      });
      root.map((item) => {
        if (parentId && parentId === item.node.id) {
          if (!parentSiblingArray.length && !siblingArray.length) {
            item.node.hasPower = status;
          }
        }
      });
    },

    // 四级 勾选父级状态，查找父级
    checkedFour(root, data, status) {
      // 父级数组
      const parentArray = root.filter((item) => item.node.id === data.parentId);
      // 同胞数组
      const siblingArray = root.filter((item) => {
        if (
          item.node.id !== data.id &&
          item.node.parentId === data.parentId &&
          item.node.hasPower
        ) {
          return true;
        }
      });

      const [parentNode = {}] = parentArray || [];
      const { node } = parentNode || {};
      const { parentId, id } = node || {};
      // 判断父级的兄弟，有没有被勾选
      const parentSiblingArray = root.filter((item) => {
        if (
          item.node.id !== id &&
          item.node.parentId === parentId &&
          item.node.hasPower
        ) {
          return true;
        }
      });

      const grandpaArray = root.filter((item) => {
        if (item.node.id === parentId) {
          return true;
        }
      });

      const [grandPaObj = {}] = grandpaArray || [{}];
      const grandPaNode = grandPaObj.node || {};
      const grandPaParentId = grandPaNode.parentId;
      const grandPaId = grandPaNode.id;
      const grandpaSiblingArray = root.filter((item) => {
        if (
          item.node.id !== grandPaId &&
          item.node.parentId === grandPaParentId &&
          item.node.hasPower
        ) {
          return true;
        }
      });
      root.map((item) => {
        if (grandPaParentId && grandPaParentId === item.node.id) {
          if (
            !parentSiblingArray.length &&
            !siblingArray.length &&
            !grandpaSiblingArray.length
          ) {
            item.node.hasPower = status;
          }
        }
      });
    },
    //递归解析ids
    returnIdsRecursion(arr) {
      if (!arr || !Array.isArray(arr)) {
        return [];
      }
      for (let item of arr) {
        if (item.hasPower) {
          this.arrIds.push(item.id);
        }
        if (item.children && item.children.length) {
          this.returnIdsRecursion(item.children);
        }
      }
      return this.arrIds;
    },
  },
};
</script>

<style scoped lang="scss">
.role-page {
  border-radius: 16px;
  background: #fff;
}

.select-role {
  float: right;
  width: 300px;
  font-weight: normal;
  text-align: right;
  font-size: 14px;
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
