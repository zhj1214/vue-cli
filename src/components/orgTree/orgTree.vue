<!--
 * @Description: 组织树封装组件
 * @Author: zhj
 * @Date: 2020-11-18 16:00:00
 * @LastEditors: zhj1214
 *
 * @Props departmentId {String}  name
 * @Example  基本用法示例
 *  import orgTree from './orgTree.vue'
 *  <orgTree slot="left" @select-change="treeChange"></orgTree>
 -->
<template>
  <div class="view">
    <!-- 面包屑 -->
    <div>
      <div v-if="selecttArr.length < 4" class="breadcrumb flex-row">
        <div
          v-for="(item, index) in selecttArr"
          :key="index"
          class="breadcrumbItem"
          @click="selectBreadcrumb(item, index)"
        >
          {{ item.label }}
          <div style="margin: 0 4px; color: #dcdee2;">
            {{ index + 1 == selecttArr.length ? '' : '/' }}
          </div>
        </div>
      </div>
      <!-- 当超过3级时出现下拉框 -->
      <div v-else style="display: flex;">
        <div class="breadcrumbItem" style="display: flex;" @click="dropdownClick(selecttArr[0].id)">
          <span class="oneLine">{{ selecttArr[0].label }}</span>
          <div style="margin: 0 4px; color: #dcdee2;">
            {{ index + 1 == selecttArr.length ? '' : '/' }}
          </div>
        </div>

        <Dropdown class="DropdownView" @on-click="dropdownClick">
          <a href="javascript:void(0)">
            {{ selecttArr[1].label }}
            <Icon type="ios-arrow-down" />
          </a>
          <DropdownMenu slot="list">
            <DropdownItem
              v-for="item in dropdowList"
              :key="item.label"
              class="oneLine"
              :name="item.id"
            >
              {{ item.label }}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <div class="breadcrumbItem oneLine" style="display: flex;">
          <div style="margin: 0 4px; color: #dcdee2;">
            {{ '/' }}
          </div>
          <span class="oneLine">{{ selecttArr[selecttArr.length - 1].label }}</span>
        </div>
      </div>
    </div>
    <!-- 内容列表 -->
    <div class="list">
      <i-input
        v-model="orgNameSearch"
        placeholder="请输入"
        search
        class="w250 fix-iview-icon"
        icon="ios-search"
        clearable
        @on-enter="onSearchOrg"
        @on-clear="onClraeOrg"
      />
      <!-- 滚动框 -->
      <Scroll :on-reach-bottom="handleReachBottom" :distance-to-edge="[0, 0]">
        <div class="company-select">
          <div
            v-for="item in searchCompanyList"
            :key="item.value"
            :value="item.value"
            class="company-item"
            @click="onChangeOrg(item)"
          >
            <div style="display: flex;">
              <img
                v-if="item.type == 1 || item.type == 2 || item.type == 10"
                style="width: 24px; height: 24px;"
                src="../../assets/images/common-icon/IconShop.png"
              />

              <img
                v-else-if="item.type == 4"
                style="width: 24px; height: 24px;"
                src="../../assets/images/common-icon/IconCompany.png"
              />
              <img
                v-else-if="item.type == 5"
                style="width: 24px; height: 24px;"
                src="../../assets/images/common-icon/icon-company.png"
              />
              <img
                v-else-if="item.type == 3"
                style="width: 24px; height: 24px;"
                src="../../assets/images/common-icon/icon-department.png"
              />
              <img
                v-else
                style="width: 24px; height: 24px;"
                src="../../assets/images/common-icon/IconShop.png"
              />
              <p style="float: left;">
                {{ item.label }}
              </p>
            </div>

            <img
              style="width: 24px; height: 24px; margin-right: 10px;"
              src="../../assets/images/common-icon/IconTo.png"
            />
          </div>
        </div>
      </Scroll>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'OrgTree',
    data() {
      return {
        orgNameSearch: '', // 搜索内容
        searchCompanyList: [], // 当前列表内容
        orgPage: 0, // 页码
        selecttArr: [
          {
            createType: localStorage.getItem('createType'),
            id: localStorage.getItem('departmentId') || 'GROUP',
            title: localStorage.getItem('departmentName'),
            label: localStorage.getItem('departmentName'),
            value: localStorage.getItem('originOrgId'),
          },
        ], // 选中数组
        currentIdx: 0, // 当前层级 索引
      }
    },
    computed: {
      dropdowList() {
        let arr = JSON.parse(JSON.stringify(this.selecttArr))
        arr.length = arr.length - 1
        arr.shift()
        return arr
      },
    },
    watch: {
      searchCompanyList(newVal) {
        if (newVal.length > 0) {
          this.$emit('change', newVal)
        }
      },
    },
    mounted() {
      //   通知table改变
      this.selectChange(this.selecttArr[0])
      this.handleReachBottom()
      var self = this
      this.$eventEmitter.on('orgTreelist', (res) => {
        self.onChangeOrg(res, true)
      })
    },
    methods: {
      /**
       * 搜索
       * */
      onClraeOrg() {
        this.selecttArr = [
          {
            createType: localStorage.getItem('createType'),
            id: 'GROUP',
            title: localStorage.getItem('departmentName'),
            label: localStorage.getItem('departmentName'),
            value: localStorage.getItem('originOrgId'),
          },
        ]
        this.resetData()
        this.onSearchOrgRequest({
          departmentId: 'GROUP',
          page: 1,
          size: 100,
        })
      },
      onSearchOrg() {
        this.resetData()
        let param
        if (this.orgNameSearch.length == 0) {
          this.selecttArr = [
            {
              createType: localStorage.getItem('createType'),
              id: 'GROUP',
              title: localStorage.getItem('departmentName'),
              label: localStorage.getItem('departmentName'),
              value: localStorage.getItem('originOrgId'),
            },
          ]
          param = {
            departmentId: 'GROUP',
            page: 1,
            size: 100,
          }
        } else {
          let id = localStorage.getItem('departmentId')
          param = {
            searchType: 'name',
            departmentId: id,
            searchContent: this.orgNameSearch,
            isSearch: true,
            page: 1,
            size: 100,
          }
          this.onSearchOrgRequest(param)
        }
      },
      onSearchOrgRequest(param) {
        this.$ajaxPost('/user-server/platform/department/pageTree', param).then((res) => {
          if (res && res.code === 10000) {
            this.searchCompanyList = res.data.list.map((item) => {
              return {
                ...item,
                ...{
                  title: item.name,
                  label: item.name,
                  value: item.orgId,
                  id: item.id,
                },
              }
            })
            this.orgPage = 1
          }
        })
      },
      /**
       * 先择 面包屑
       * */
      selectBreadcrumb(item, index) {
        if (index == this.currentIdx) return
        this.orgPage = 0
        this.searchCompanyList = []
        if (index < this.currentIdx) {
          this.selecttArr.splice(index + 1)
        }
        this.currentIdx = index
        //   通知table改变
        this.selectChange(this.selecttArr[index])
        //   请求
        this.handleReachBottom(this.selecttArr[index].id)
      },
      dropdownClick(val) {
        var self = this
        this.selecttArr.forEach((item, index) => {
          if (item.id == val) {
            self.selectBreadcrumb(item, index)
          }
        })
      },
      /**
       * 先择组织
       * */
      onChangeOrg(item, isSub) {
        //   计数器
        if (!isSub) {
          this.currentIdx += 1
          this.selecttArr.splice(this.currentIdx, 0, item)
        }
        this.resetData()
        //   通知table改变
        this.selectChange(item)
        //   请求
        this.handleReachBottom(item.id)
      },
      selectChange(item) {
        this.$emit('select-change', item)
      },
      /**
       * 上拉加载
       * */
      handleReachBottom(id) {
        this.orgPage += 1
        const { searchCompanyList } = this
        let that = this
        this.$ajaxPost('/user-server/platform/department/pageTree', {
          departmentId: id || localStorage.getItem('departmentId'),
          size: 100,
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
                    value: item.orgId,
                    id: item.id,
                  },
                }
              })
            )
          }
        })
      },
      /**
       * 重置数据源
       * */
      resetData() {
        this.orgPage = 0
        this.searchCompanyList = []
      },
    },
  }
</script>
<style lang="scss">
  .DropdownView {
    .ivu-dropdown {
      width: inherit;
    }

    .ivu-dropdown-rel {
      display: flex;

      a {
        display: -webkit-box;
        // min-width: 60px;
        height: fit-content;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }

      i {
        position: absolute;
        top: 2px;
        right: -6px;
      }
    }
  }

  .list {
    .ivu-scroll-container {
      height: 99vh !important;
    }

    .inputView {
      .ivu-input {
        padding: 8px 10px 8px 40px; /* 设置input内边距 */
        background-color: red;
        background-image: url('/src/assets/images/IconSearch.png'); /* 设置小图标 */
        background-position: 5px 4px; /* 小图标在input的位置 */
        background-repeat: no-repeat; /* 背景小图标不重复 */
        background-size: 25px 25px; /* 小图标的大小 */
      }
    }
  }
</style>
<style lang="scss" spocd>
  .oneLine {
    display: -webkit-box;
    height: fit-content;
    min-width: 60px;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }

  .flex-row {
    overflow: auto;
  }

  .breadcrumb {
    display: flex;
    width: 256px;
    white-space: nowrap;
    align-items: center;

    .breadcrumbItem {
      display: flex;
      flex-wrap: nowrap;
    }
  }

  .list {
    height: 99vh;
    margin: 20px 0;

    .company-select {
      position: relative;
      z-index: 8;
      padding-left: 10px;
      margin-top: 8px;

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
        justify-content: space-between;
      }
    }
  }
</style>
