<!--
 * @Description: 组织树封装组件
 * @Author: zhj
 * @Date: 2020-11-18 16:00:00
 * @LastEditors: zhj
 *
 * @Props departmentId {String}  name
 * @Example  基本用法示例
 *  import orgTree from './orgSelect.vue'
 *  <orgSelect slot="left" @select-change="treeChange"></orgSelect>
 -->
<template>
  <div>
    <div
      v-if="!isQuery"
      class="orgList"
    >
      <Select
        v-model="currentValue"
        filterable
        @on-select="selectChange"
        @on-query-change="clear"
      >
        <!-- 滚动框 -->
        <Scroll
          v-if="searchCompanyList.length > 0"
          :on-reach-bottom="handleReachBottom"
          :distance-to-edge="[0, 0]"
        >
          <Option
            v-for="item in searchCompanyList"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </Option>
        </Scroll>
      </Select>
    </div>

    <div
      v-else
      class="dddd"
    >
      <Select
        v-model="searchCurrentValue"
        placeholder="请输入搜索关键字"
        :loading="loading"
        :remote-method="filterableAction"
        filterable
        @on-query-change="searchClear"
        @on-select="selectChangeTwo"
      >
        <Option
          v-for="(item, index) in searchCompanyListArr"
          :key="index"
          :value="item.id"
        >
          {{ item.label }}
        </Option>
      </Select>
    </div>
  </div>
</template>
<script>
export default {
  name: "OrgTree",
  props: {
    obj: Object,
    index: Number,
    orgs: {
      type: Array,
      default: function() {
        return [];
      },
    }, // 选中的级联列表 组织树 ids
    orgId: String,
  },
  data() {
    return {
      isQuery: false,
      loading: false,
      searchCurrentValue: "",
      lastValue: "", // 上一级 选择的组织
      currentValue: "", // 当前选择的组织
      searchCompanyList: [], // 当前列表内容
      searchCompanyListArr: [], // 搜索的结果 当前列表内容
      orgPage: 0, // 页码
      currentIdx: 0, // 当前层级 索引
    };
  },

  created() {
    if (typeof this.orgs != "object") this.orgs = [];
    if (this.orgs.length > 0) {
      this.currentValue = this.orgs[this.orgs.length - 1];
      if (this.orgs.length > 1) {
        this.lastValue = this.orgs[this.orgs.length - 2];
      } else {
        this.lastValue = this.orgs[this.orgs.length - 1];
      }
      if (this.lastValue) this.handleReachBottom(this.lastValue);
    }
  },

  methods: {
    clear(val) {
      console.log(val, "1111111", this.selectOgrSelect);
      if (val == "") {
        this.isQuery = false;
        this.resetData();
        this.handleReachBottom(localStorage.getItem("departmentId"));
      } else if (
        (this.selectOgrSelect && this.selectOgrSelect.label != val) ||
        !this.selectOgrSelect
      ) {
        this.isQuery = true;
        this.filterableAction(val);
      } else {
        this.searchCompanyList.forEach((item) => {
          if (item.title == val) this.currentValue = item.id;
        });
        // console.log("id__", this.currentValue);
      }
    },
    searchClear(val) {
      if (val == "") {
        // console.log("*************");
        this.orgPage += 1;
        let that = this;
        this.$ajaxPost("/user-server/platform/department/pageTree", {
          departmentId: localStorage.getItem("departmentId"),
          isSearch: true,
          size: 20,
          page: this.orgPage,
        }).then((res) => {
          if (res && res.code === 10000) {
            that.searchCompanyListArr = res.data.list.map((item) => {
              return {
                ...item,
                ...{
                  title: item.name,
                  label: item.name,
                  value: item.id,
                  id: item.id,
                },
              };
            });
          }
        });

        // this.isQuery = false;
        // this.currentValue = "";
        // window.scroll(0, 0);
        // this.resetData();
        // this.handleReachBottom(localStorage.getItem("departmentId"));
      }
    },
    filterableAction(query) {
      if (query !== "") {
        let that = this;
        that.loading = true;
        this.$ajaxGet("/user-server/auth/get/org/list", {
          searchType: "name",
          searchContent: query,
          page: 1,
          size: 100,
        }).then((res) => {
          if (res && res.code === 10000) {
            that.searchCompanyListArr = res.data.list.map((item) => {
              return {
                title: item.orgName,
                label: item.orgName,
                value: item.id,
                id: item.id,
              };
            });
            // console.log(
            //   this.searchCompanyListArr,
            //   "searchCompanyListArrsearchCompanyListArr"
            // );
          }
          that.loading = false;
        });
      }
    },
    /**
     * 获取回显的组织信息
     * */
    getorgInfo(id) {
      var that = this;
      if (that.hasOrg) return;
      that.hasOrg = false;
      that.searchCompanyList.forEach((item) => {
        if (item.orgId == id) {
          that.hasOrg = true;
        }
      });
      if (!that.hasOrg) {
        this.$ajaxGet("/user-server/internal/organization/detail", {
          orgId: id,
        }).then((res) => {
          if (res.code == 10000 && res.data) {
            that.searchCompanyList.push({
              ...res.data,
              ...{
                title: res.data.name,
                label: res.data.name,
                value: res.data.id,
                id: res.data.id,
              },
            });
          }
        });
      }
    },
    /**
     * 先择组织
     * */
    selectChange(item) {
      console.log(
        "------selectChange",
        item.value,
        "-------",
        this.currentValue
      );
      this.selectOgrSelect = item;
      var selectitem;
      this.searchCompanyList.forEach((i) => {
        if (i.id == item.value) selectitem = i;
      });
      this.$emit("change", selectitem, this.index);
    },
    selectChangeTwo(item) {
      // console.log("------selectChange", item);
      // this.searchCurrentValue = item.title;
      this.selectOgrSelect1 = item;

      var selectitem;
      this.searchCompanyListArr.forEach((i) => {
        if (i.id == item.value) selectitem = i;
      });
      this.$emit("change", selectitem, this.index);

      // this.$emit("change", item, this.index);
    },

    /**
     * 上拉加载
     * */
    handleReachBottom(id) {
      this.orgPage += 1;
      const { searchCompanyList } = this;
      let that = this;
      this.$ajaxPost("/user-server/platform/department/pageTree", {
        departmentId: id || localStorage.getItem("departmentId"),
        isSearch: true,
        size: 20,
        page: this.orgPage,
      }).then((res) => {
        if (res && res.code === 10000) {
          that.searchCompanyList = searchCompanyList.concat(
            res.data.list.map((item) => {
              return {
                ...item,
                ...{
                  title: item.name,
                  label: item.name,
                  value: item.id,
                  id: item.id,
                },
              };
            })
          );
          if (that.orgId) that.getorgInfo(that.orgId);
        }
      });
    },
    doThis() {
      // this.currentValue = value
    },
    /**
     * 重置数据源
     * */
    resetData() {
      this.orgPage = 0;
      this.hasOrg = false;
      this.searchCompanyList = [];
    },
  },
};
</script>
<style lang="scss">
.orgList {
  .ivu-select-dropdown {
    overflow-y: hidden;
  }
  // .ivu-scroll-container {
  //   height: 99vh !important;
  // }
}
</style>
<style lang="scss" spocd>
.flex-row {
  display: flex;
  align-items: center;
}

.company-select {
  position: relative;
  z-index: 8;
  margin-top: 8px;
  padding-left: 10px;
  div {
    padding: 4px 0;

    &:hover {
      cursor: pointer;
      background: #f3f3f3;
    }
  }
  .company-item {
    display: flex;
    align-items: center;
  }
}
</style>
